import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { action, apiUrl, appKey, secretKey, deviceId, accessToken, ip, port, username, password } = await req.json()
    
    // Create a Supabase client with the Auth context of the user that called the function
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )
    
    // Get user data to verify permissions
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      })
    }
    
    // Handle different actions
    switch (action) {
      case 'token': {
        // Get token from Hikvision API
        const response = await fetch(`${apiUrl}/api/hpcgw/v1/token/get`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ appKey, secretKey }),
        })
        
        const data = await response.json()
        console.log('Hikvision token response:', data)
        
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: response.status,
        })
      }
      
      case 'test-device': {
        // Test device connection using Hikvision API
        const response = await fetch(`${apiUrl}/api/hpcgw/v1/device/status`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ deviceId }),
        })
        
        const data = await response.json()
        console.log('Hikvision device test response:', data)
        
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: response.status,
        })
      }
      
      case 'test-local-device': {
        // Test local device connection using ISAPI
        const response = await fetch(`http://${ip}:${port}/ISAPI/System/deviceInfo`, {
          method: 'GET',
          headers: {
            'Authorization': 'Basic ' + btoa(`${username}:${password}`),
          },
        })
        
        const success = response.status === 200
        return new Response(JSON.stringify({ 
          success, 
          message: success ? 'Device connection successful' : 'Failed to connect to device' 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        })
      }
      
      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        })
    }
  } catch (error) {
    console.error('Error processing request:', error)
    
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})