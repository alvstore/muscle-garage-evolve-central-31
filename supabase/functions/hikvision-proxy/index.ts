
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ProxyRequest {
  branchId: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: any;
  requiresAuth?: boolean;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { branchId, endpoint, method, data, requiresAuth = true }: ProxyRequest = await req.json();

    console.log(`[Hikvision Proxy] ${method} ${endpoint} for branch: ${branchId}`);

    // Get API settings
    const { data: settings, error: settingsError } = await supabase
      .from('hikvision_api_settings')
      .select('*')
      .eq('branch_id', branchId)
      .eq('is_active', true)
      .single();

    if (settingsError || !settings) {
      return new Response(
        JSON.stringify({ error: 'Hikvision API settings not configured' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    // Add authentication if required
    if (requiresAuth) {
      // Get valid token
      const { data: tokenData } = await supabase
        .from('hikvision_tokens')
        .select('*')
        .eq('branch_id', branchId)
        .gte('expire_time', new Date().toISOString())
        .single();

      if (!tokenData) {
        // Try to refresh token
        const authResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/hikvision-auth`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`
          },
          body: JSON.stringify({ branchId, forceRefresh: true })
        });

        const authResult = await authResponse.json();
        if (!authResult.success) {
          return new Response(
            JSON.stringify({ error: 'Failed to authenticate with Hikvision API' }),
            { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        headers['Authorization'] = `Bearer ${authResult.token}`;
      } else {
        headers['Authorization'] = `Bearer ${tokenData.access_token}`;
      }
    }

    // Make API call to Hikvision
    const apiUrl = `${settings.api_url}${endpoint}`;
    console.log(`[Hikvision Proxy] Calling: ${apiUrl}`);

    const response = await fetch(apiUrl, {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined
    });

    const responseData = await response.json();

    // Log the response for debugging
    console.log(`[Hikvision Proxy] Response:`, {
      status: response.status,
      errorCode: responseData.errorCode,
      errorMsg: responseData.errorMsg
    });

    // Handle Hikvision API errors
    if (responseData.errorCode && responseData.errorCode !== '0') {
      return new Response(
        JSON.stringify({
          error: responseData.errorMsg || 'Hikvision API error',
          errorCode: responseData.errorCode,
          subStatus: responseData.subStatus
        }),
        { 
          status: response.ok ? 400 : response.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: responseData.data || responseData
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[Hikvision Proxy] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
