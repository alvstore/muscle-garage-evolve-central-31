
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TokenRequest {
  branchId: string;
  forceRefresh?: boolean;
}

interface HikvisionTokenResponse {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  tokenType: string;
  scope?: string;
  areaDomain?: string;
  availableSites?: any[];
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

    const { branchId, forceRefresh = false }: TokenRequest = await req.json();

    console.log(`[Hikvision Auth] Processing request for branch: ${branchId}, forceRefresh: ${forceRefresh}`);

    if (!branchId) {
      return new Response(
        JSON.stringify({ error: 'Branch ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get API settings for the branch
    const { data: settings, error: settingsError } = await supabase
      .from('hikvision_api_settings')
      .select('*')
      .eq('branch_id', branchId)
      .eq('is_active', true)
      .maybeSingle();

    if (settingsError) {
      console.error('[Hikvision Auth] Error fetching settings:', settingsError);
      return new Response(
        JSON.stringify({ error: `Database error: ${settingsError.message}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!settings) {
      console.error('[Hikvision Auth] No API settings found for branch:', branchId);
      return new Response(
        JSON.stringify({ error: 'Hikvision API settings not configured for this branch. Please configure the settings first.' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check for existing valid token (unless force refresh)
    if (!forceRefresh) {
      const { data: existingToken } = await supabase
        .from('hikvision_tokens')
        .select('*')
        .eq('branch_id', branchId)
        .gte('expire_time', new Date().toISOString())
        .maybeSingle();

      if (existingToken) {
        console.log('[Hikvision Auth] Using existing valid token');
        return new Response(
          JSON.stringify({
            success: true,
            token: existingToken.access_token,
            expiresAt: existingToken.expire_time,
            areaDomain: existingToken.area_domain
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Request new token from Hikvision API
    console.log('[Hikvision Auth] Requesting new token from Hikvision API');
    
    const tokenResponse = await fetch(`${settings.api_url}/api/hpcgw/v1/token/get`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        appKey: settings.app_key,
        secretKey: settings.app_secret
      })
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok || tokenData.errorCode !== '0') {
      console.error('[Hikvision Auth] Token request failed:', tokenData);
      return new Response(
        JSON.stringify({ 
          error: `Hikvision API error: ${tokenData.errorMsg || 'Authentication failed'}`,
          errorCode: tokenData.errorCode,
          details: 'Please check your API credentials and try again.'
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token: HikvisionTokenResponse = tokenData.data;
    const expirationTime = new Date(Date.now() + (token.expiresIn * 1000));

    // Store token in database
    const { error: tokenError } = await supabase
      .from('hikvision_tokens')
      .upsert({
        branch_id: branchId,
        access_token: token.accessToken,
        refresh_token: token.refreshToken,
        expires_in: token.expiresIn,
        expire_time: expirationTime.toISOString(),
        token_type: token.tokenType,
        scope: token.scope,
        area_domain: token.areaDomain,
        available_sites: token.availableSites || [],
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'branch_id'
      });

    if (tokenError) {
      console.error('[Hikvision Auth] Failed to store token:', tokenError);
      return new Response(
        JSON.stringify({ error: 'Failed to store authentication token' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('[Hikvision Auth] Successfully obtained and stored new token');

    return new Response(
      JSON.stringify({
        success: true,
        token: token.accessToken,
        expiresAt: expirationTime.toISOString(),
        areaDomain: token.areaDomain,
        availableSites: token.availableSites
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[Hikvision Auth] Unexpected error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
