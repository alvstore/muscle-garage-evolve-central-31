
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.22.0";

// CORS headers for browser compatibility
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

// Helper function to add CORS headers to all responses
const addCorsHeaders = (response: Response): Response => {
  const newHeaders = new Headers(response.headers);
  
  // Add CORS headers
  Object.entries(corsHeaders).forEach(([key, value]) => {
    newHeaders.set(key, value);
  });
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders
  });
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
  
  // Log request details for debugging
  console.log(`Processing ${req.method} request to ${req.url}`);
  console.log('Request headers:', Object.fromEntries(req.headers.entries()));

  try {
    const requestBody = await req.json();
    console.log('Hikvision Edge Function received body:', requestBody);
    const { action, apiUrl, appKey, secretKey, token, deviceId, personData, branchId, siteId, siteName, ipAddress, port, username, password, isTestConnection } = requestBody;
    
    // Route the request based on the action
    switch (action) {
      case 'token':
        return await getToken(apiUrl, appKey, secretKey, req);
      
      case 'get-token':
        return await getToken(apiUrl, appKey, secretKey, req);
      
      case 'test-device': 
        return await testDevice(apiUrl, token, deviceId, siteId);
      
      case 'ensure-site-exists':
        return await ensureSiteExists(apiUrl, token, branchId, siteName);
      
      case 'check-device-exists':
        // Using function declaration from below
        return await checkDeviceExists(apiUrl, token, siteId, deviceId);
      
      case 'create-site':
        return await createSite(apiUrl, token, siteName);
      
      case 'test-isup-device':
        // Using function declaration from below
        return await testIsupDevice(ipAddress, port, username, password);
      
      case 'register-person':
        // Using function declaration from below
        return await registerPerson(apiUrl, token, personData);
      
      case 'assign-privileges':
        // Using function declaration from below
        return await assignPrivileges(apiUrl, token, personData?.personId, deviceId);
      
      default:
        return addCorsHeaders(new Response(
          JSON.stringify({ success: false, message: 'Invalid action' }),
          { headers: { 'Content-Type': 'application/json' }, status: 400 }
        ));
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return addCorsHeaders(new Response(
      JSON.stringify({ success: false, message: error.message }),
      { headers: { 'Content-Type': 'application/json' }, status: 500 }
    ));
  }
});

// Function to get a Hikvision token
async function getToken(apiUrl: string, appKey: string, secretKey: string, request?: Request) {
  try {
    // Validate input parameters
    if (!appKey || !secretKey) {
      console.error('Missing required parameters for token request:', { 
        hasAppKey: !!appKey, 
        hasSecretKey: !!secretKey,
        appKeyType: typeof appKey,
        secretKeyType: typeof secretKey
      });
      
      // For testing purposes, if this is a test connection, return a more specific error
      const requestData = request ? await request.clone().json() : null;
      const isTestConnection = requestData?.isTestConnection === true;
      
      if (isTestConnection) {
        return addCorsHeaders(new Response(
          JSON.stringify({ 
            success: false, 
            message: 'Missing required parameters for test connection',
            debug: { hasAppKey: !!appKey, hasSecretKey: !!secretKey }
          }),
          { headers: { 'Content-Type': 'application/json' }, status: 400 }
        ));
      }
      
      return addCorsHeaders(new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Missing required parameters: appKey and secretKey are required',
          debug: { hasAppKey: !!appKey, hasSecretKey: !!secretKey }
        }),
        { headers: { 'Content-Type': 'application/json' }, status: 400 }
      ));
    }
    
    // Form the token URL using the provided API URL
    const tokenUrl = `${apiUrl || 'https://api.hik-partner.com'}/api/hpcgw/v1/token/get`;
    
    console.log('Requesting token from:', tokenUrl);
    console.log('Using appKey:', appKey.substring(0, 5) + '...');
    
    // Prepare request body
    const requestBody = JSON.stringify({
      appKey,
      secretKey,
    });
    
    console.log('Request body length:', requestBody.length);
    
    // Make the token request
    let response;
    try {
      response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: requestBody,
      });
    } catch (fetchError) {
      console.error('Fetch error during token request:', fetchError);
      return addCorsHeaders(new Response(
        JSON.stringify({
          success: false,
          message: `Error getting token: ${fetchError.message}`,
          debug: { error: fetchError.toString() }
        }),
        { headers: { 'Content-Type': 'application/json' }, status: 500 }
      ));
    }
    
    // Log response status
    console.log('Token response status:', response.status);
    
    // Check if the response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('Non-JSON response received:', text);
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Invalid response format (not JSON)',
          responseText: text.substring(0, 500), // Return part of the response for debugging
          status: response.status,
          headers: Object.fromEntries(response.headers.entries())
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    let data;
    try {
      data = await response.json();
    } catch (jsonError) {
      console.error('Error parsing JSON response:', jsonError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: `Error parsing JSON response: ${jsonError.message}`,
          status: response.status
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }
    
    console.log('Token response:', JSON.stringify(data).substring(0, 200) + '...');
    
    // Check for error response
    if (data.code !== '0' || !data.data?.accessToken) {
      console.error('Error in token response:', data);
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: data.msg || 'Failed to get token',
          errorCode: data.code,
          rawResponse: data
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    // Store token in database if successful
    console.log('Successfully obtained token, expiry:', data.data.expireTime);
    
    let branchId;
    let availableSites: Array<{siteId: string, siteName: string}> = [];
    
    try {
        // Try to get branchId from the request body
        if (request) {
          const requestData = await request.clone().json();
          branchId = requestData.branchId;
        }
      } catch (e) {
        console.error('Error parsing request body:', e);
      }
      
      if (branchId) {
        try {
          // Get available sites for this token
          const siteListUrl = `${apiUrl || 'https://api.hik-partner.com'}/api/hpcgw/v1/site/search`;
          const siteResponse = await fetch(siteListUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${data.data.accessToken}`
            },
            body: JSON.stringify({
              pageNo: 1,
              pageSize: 100
            })
          });
          
          const siteData = await siteResponse.json();
          
          if (siteData.code === '0' && siteData.data?.list) {
            availableSites = siteData.data.list.map((site: any) => ({
              siteId: site.siteId,
              siteName: site.siteName
            }));
          }
          
          // Get the default site ID (first site in the list or empty string)
          const defaultSiteId = availableSites.length > 0 ? availableSites[0].siteId : '';
          
          // Store token, site_id, and available sites in the database
          const { error: tokenError } = await supabaseClient
            .from('hikvision_tokens')
            .upsert({
              branch_id: branchId,
              access_token: data.data.accessToken,
              expire_time: data.data.expireTime,
              area_domain: data.data.areaDomain,
              site_id: defaultSiteId,
              available_sites: availableSites,
              created_at: new Date().toISOString()
            }, {
              onConflict: 'branch_id'
            });
          
          if (tokenError) {
            console.error('Error storing token in database:', tokenError);
          }
        } catch (siteError) {
          console.error('Error fetching sites:', siteError);
        }
      }
      
    // Add available sites to the response
    const responseData = {
      ...data,
      availableSites
    };
    
    // Return the successful response
    return addCorsHeaders(new Response(
      JSON.stringify(responseData),
      { headers: { 'Content-Type': 'application/json' } }
    ));
  } catch (error) {
    console.error('Error getting token:', error);
    
    return addCorsHeaders(new Response(
      JSON.stringify({
        success: false,
        message: `Error getting token: ${error.message}`,
        debug: { error: error.toString() }
      }),
      { headers: { 'Content-Type': 'application/json' }, status: 500 }
    ));
  }
}

// Function to test device connectivity
async function testDevice(apiUrl: string, accessToken: string, deviceId: string, siteId: string) {
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
    
    // Get device status using the Hikvision API
    const url = `${apiUrl || 'https://api.hik-partner.com'}/api/hpcgw/v1/device/status`;
    
    console.log(`Testing device with ID: ${deviceId}`);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        deviceIds: [deviceId]
      })
    });
    
    const data = await response.json();
    
    console.log('Device test response:', data);
    
    // Check if the device is online
    if (data.code === '0' && data.data) {
      const deviceStatus = data.data.find((d: any) => d.deviceId === deviceId);
      
      if (deviceStatus) {
        return new Response(
          JSON.stringify({ 
            success: true, 
            status: deviceStatus.status, // 'online' or 'offline'
            message: deviceStatus.status === 'online' ? 'Device is online' : 'Device is offline'
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }
    
    // If we couldn't determine the status
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: data.msg || 'Could not determine device status',
        rawResponse: data
      }),
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

// Function to ensure a site exists for the branch
async function ensureSiteExists(apiUrl: string, accessToken: string, branchId: string, siteName?: string) {
  try {
    if (!accessToken) {
      return new Response(
        JSON.stringify({ success: false, message: 'Access token not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    // First check if we already have a site ID stored in the token table
    const { data: tokenData, error: tokenError } = await supabaseClient
      .from('hikvision_tokens')
      .select('site_id')
      .eq('branch_id', branchId)
      .single();
    
    if (!tokenError && tokenData?.site_id) {
      return new Response(
        JSON.stringify({ success: true, siteId: tokenData.site_id }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Get branch name for site creation from branches table
    const { data: branchData, error: branchError } = await supabaseClient
      .from('branches')
      .select('name')
      .eq('id', branchId)
      .single();
    
    let branchName = '';
    if (branchError) {
      console.error('Error fetching branch name:', branchError);
      // Continue with default site name
    } else {
      branchName = branchData?.name || '';
    }
    
    // Create a site with the branch name
    const siteNameToUse = siteName || branchName || `Branch ${branchId}`;
    console.log(`Creating site with name: ${siteNameToUse}`);
    
    // Create a site
    const siteResponse = await createSite(apiUrl, accessToken, siteNameToUse);
    const siteData = await siteResponse.json();
    
    if (!siteData.success || !siteData.siteId) {
      return new Response(
        JSON.stringify({ success: false, message: siteData.message || 'Failed to create site' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }
    
    // Save the site ID to the token table
    const { error: updateError } = await supabaseClient
      .from('hikvision_tokens')
      .update({ site_id: siteData.siteId })
      .eq('branch_id', branchId);
    
    if (updateError) {
      console.error('Error saving site ID to token table:', updateError);
      // We still return success since the site was created
    }
    
    return new Response(
      JSON.stringify({ success: true, siteId: siteData.siteId }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in ensureSiteExists:', error);
    return new Response(
      JSON.stringify({ success: false, message: `Error ensuring site exists: ${error.message}` }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
}

// Function to create a site
async function createSite(apiUrl: string, accessToken: string, siteName: string) {
  try {
    if (!accessToken) {
      return new Response(
        JSON.stringify({ success: false, message: 'Access token not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    const url = `${apiUrl || 'https://api.hik-partner.com'}/api/hpcgw/v1/site/add`;
    
    console.log(`Creating site with name: ${siteName}`);
    
    console.log(`Making request to ${url} with token ${accessToken.substring(0, 10)}...`);
    
    let response;
    try {
      response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          siteName: siteName
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`HTTP error: ${response.status} - ${errorText}`);
        return new Response(
          JSON.stringify({ 
            success: false, 
            message: `HTTP error: ${response.status}`,
            details: errorText
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: response.status }
        );
      }
      
      const data = await response.json();
      
      console.log('Site creation response:', data);
    
      if (data && data.code === '0' && data.data?.siteId) {
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: 'Site created successfully',
            siteId: data.data.siteId
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Check specifically for token expiration error
      if (data.code === 'LAP500004') {
        return new Response(
          JSON.stringify({ 
            success: false, 
            message: 'Token expired or invalid',
            errorCode: 'TOKEN_EXPIRED',
            rawResponse: data
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
        );
      }
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: data.msg || 'Failed to create site',
          errorCode: data.code,
          rawResponse: data
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (error) {
      console.error('Error in fetch operation:', error);
      return new Response(
        JSON.stringify({ success: false, message: `Error in fetch operation: ${error.message}` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }
  } catch (error) {
    console.error('Error creating site:', error);
    return new Response(
      JSON.stringify({ success: false, message: `Error creating site: ${error.message}` }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
}

// Function to check if a device exists in a site
async function checkDeviceExists(apiUrl: string, accessToken: string, siteId: string, deviceId: string) {
  try {
    if (!accessToken) {
      return new Response(
        JSON.stringify({ success: false, message: 'Access token not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    const url = `${apiUrl || 'https://api.hik-partner.com'}/api/hpcgw/v1/device/list`;
    
    console.log(`Checking if device ${deviceId} exists in site ${siteId}`);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        siteId: siteId,
        pageNo: 1,
        pageSize: 100
      })
    });
    
    const data = await response.json();
    
    console.log('Device list response:', data);
    
    if (data.code === '0' && data.data?.list) {
      // Check if the device exists in the list
      const deviceExists = data.data.list.some((device: any) => device.deviceId === deviceId);
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          exists: deviceExists,
          message: deviceExists ? 'Device exists in site' : 'Device does not exist in site'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: data.msg || 'Failed to check if device exists',
        rawResponse: data
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error checking if device exists:', error);
    return new Response(
      JSON.stringify({ success: false, message: `Error checking if device exists: ${error.message}` }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
}

// Function to test ISUP device connectivity
async function testIsupDevice(ipAddress: string, port: string, username: string, password: string) {
  try {
    if (!ipAddress || !username || !password) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Missing required parameters (IP address, username, password)' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    console.log(`Testing ISUP device at ${ipAddress}:${port}`);
    
    // In a real implementation, you would use the ISUP protocol to test the connection
    // For now, we'll simulate a successful connection
    
    // Simulate a ping test to check if the device is reachable
    try {
      // Use a proxy service to avoid CORS issues
      const pingUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(`http://${ipAddress}:${port}`)}`;
      
      const pingResponse = await fetch(pingUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (pingResponse.ok) {
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: 'ISUP device is reachable'
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } else {
        return new Response(
          JSON.stringify({ 
            success: false, 
            message: 'ISUP device is not reachable'
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } catch (pingError) {
      console.error('Error pinging device:', pingError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: `Error pinging device: ${pingError.message}`
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error testing ISUP device:', error);
    return new Response(
      JSON.stringify({ success: false, message: `Error testing ISUP device: ${error.message}` }),
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
