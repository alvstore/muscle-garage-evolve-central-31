
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.22.0";

// CORS headers for browser compatibility
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

// Create a Supabase client
const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    const { action, apiUrl, appKey, secretKey, accessToken, deviceId, personData, branchId } = await req.json();
    
    // Route the request based on the action
    switch (action) {
      case 'token':
        return await getToken(apiUrl, appKey, secretKey);
      
      case 'test-device': 
        return await testDevice(apiUrl, accessToken, deviceId, branchId);
      
      case 'register-person':
        return await registerPerson(apiUrl, accessToken, personData);
      
      case 'assign-privileges':
        return await assignPrivileges(apiUrl, accessToken, personData?.personId, deviceId);
      
      default:
        return new Response(
          JSON.stringify({ success: false, message: 'Invalid action' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

// Function to get a Hikvision token
async function getToken(apiUrl: string, appKey: string, secretKey: string) {
  try {
    // Form the token URL using the provided API URL
    const tokenUrl = `${apiUrl}/api/hpcgw/v1/token/get`;
    
    console.log('Requesting token from:', tokenUrl);
    
    // Make the token request
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        appKey,
        secretKey,
      }),
    });
    
    // Check if the response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('Non-JSON response received:', text);
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Invalid response format (not JSON)',
          responseText: text.substring(0, 500) // Return part of the response for debugging
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    const data = await response.json();
    
    console.log('Token response:', data);
    
    // Store token in database if successful
    if (data.code === '0' && data.data?.accessToken) {
      // Return the successful response
      return new Response(
        JSON.stringify(data),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error('Error getting token:', error);
    
    return new Response(
      JSON.stringify({ success: false, message: `Error getting token: ${error.message}` }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
}

// Function to test device connectivity
async function testDevice(apiUrl: string, accessToken: string, deviceId: string, branchId: string) {
  try {
    if (!accessToken) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Access token not found. Please test API connection first.' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    // Example: Get device status
    const url = `${apiUrl}/api/hpcgw/v1/device/status`;
    
    console.log(`Testing device with ID: ${deviceId}`);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        deviceId: deviceId
      })
    });
    
    const data = await response.json();
    
    console.log('Device test response:', data);
    
    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error testing device:', error);
    
    return new Response(
      JSON.stringify({ success: false, message: `Error testing device: ${error.message}` }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
}

// Function to register a person
async function registerPerson(apiUrl: string, accessToken: string, personData: any) {
  try {
    if (!accessToken) {
      return new Response(
        JSON.stringify({ success: false, message: 'Access token not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    const url = `${apiUrl}/api/hpcgw/v1/person/add`;
    
    console.log('Registering person with data:', personData);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(personData)
    });
    
    const data = await response.json();
    
    console.log('Person registration response:', data);
    
    if (data.code === '0' && data.data?.personId) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Person registered successfully',
          personId: data.data.personId
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: data.msg || 'Failed to register person',
        errorCode: data.code
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  } catch (error) {
    console.error('Error registering person:', error);
    
    return new Response(
      JSON.stringify({ success: false, message: `Error registering person: ${error.message}` }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
}

// Function to assign access privileges
async function assignPrivileges(apiUrl: string, accessToken: string, personId: string, deviceId: string) {
  try {
    if (!accessToken) {
      return new Response(
        JSON.stringify({ success: false, message: 'Access token not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    if (!personId || !deviceId) {
      return new Response(
        JSON.stringify({ success: false, message: 'Person ID or device ID missing' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    const url = `${apiUrl}/api/hpcgw/v1/acs/privilege/config`;
    
    // Calculate validity dates (1 year by default)
    const now = new Date();
    const oneYearLater = new Date();
    oneYearLater.setFullYear(now.getFullYear() + 1);
    
    const requestBody = {
      personId: personId,
      deviceSerialNo: deviceId,
      doorList: [1], // Assuming 1 is the main door
      validStartTime: now.toISOString().split('.')[0] + "Z",
      validEndTime: oneYearLater.toISOString().split('.')[0] + "Z"
    };
    
    console.log('Assigning privileges:', requestBody);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(requestBody)
    });
    
    const data = await response.json();
    
    console.log('Privilege assignment response:', data);
    
    if (data.code === '0') {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Privileges assigned successfully'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: data.msg || 'Failed to assign privileges',
        errorCode: data.code
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  } catch (error) {
    console.error('Error assigning privileges:', error);
    
    return new Response(
      JSON.stringify({ success: false, message: `Error assigning privileges: ${error.message}` }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
}
