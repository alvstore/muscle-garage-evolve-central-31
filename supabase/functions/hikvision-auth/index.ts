
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TokenRequest {
  apiUrl: string;
  appKey: string;
  appSecret: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { apiUrl, appKey, appSecret }: TokenRequest = await req.json();

    if (!apiUrl || !appKey || !appSecret) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Missing required parameters: apiUrl, appKey, appSecret' 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Request token from Hikvision API
    const tokenUrl = `${apiUrl}/api/hpcgw/v1/token/get`;
    
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        appKey,
        secretKey: appSecret
      }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error('Hikvision token request failed:', responseData);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Token request failed',
          errorCode: responseData.errorCode,
          details: responseData
        }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check for Hikvision-specific errors
    if (responseData.errorCode && responseData.errorCode !== '0') {
      console.error('Hikvision API error:', responseData);
      return new Response(
        JSON.stringify({ 
          success: false, 
          errorCode: responseData.errorCode,
          error: responseData.errorMsg || 'Hikvision API error'
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Success response
    return new Response(
      JSON.stringify({ 
        success: true,
        token: {
          accessToken: responseData.accessToken,
          expiresIn: responseData.expiresIn || 604800, // 7 days default
          tokenType: responseData.tokenType || 'Bearer',
          scope: responseData.scope,
          refreshToken: responseData.refreshToken
        }
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in hikvision-auth function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Internal server error',
        details: error.message
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
