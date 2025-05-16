
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

// Interface for the request body
interface HikvisionRequest {
  action: string;
  apiUrl: string;
  accessToken?: string;
  appKey?: string;
  secretKey?: string;
  deviceId?: string;
  memberData?: any;
  personData?: any;
  doorList?: number[];
  validStartTime?: string;
  validEndTime?: string;
  branchId?: string;
  siteName?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 204, 
      headers: corsHeaders 
    });
  }

  try {
    // Parse request body
    const requestData: HikvisionRequest = await req.json();
    const { 
      action, 
      apiUrl, 
      accessToken, 
      appKey, 
      secretKey, 
      deviceId, 
      memberData,
      personData,
      doorList,
      validStartTime,
      validEndTime,
      branchId,
      siteName 
    } = requestData;

    console.log(`Processing ${action} request from ${req.headers.get('origin')}`);
    
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Handle different actions
    switch (action) {
      case 'token':
        return await handleTokenRequest(apiUrl, appKey, secretKey, corsHeaders);
        
      case 'test-device':
        return await handleDeviceTest(apiUrl, accessToken, deviceId, corsHeaders);
        
      case 'register-person':
        return await registerPerson(
          apiUrl, 
          accessToken, 
          personData || memberData, 
          branchId,
          corsHeaders,
          supabase
        );
        
      case 'assign-privileges':
        return await assignAccessPrivileges(
          apiUrl, 
          accessToken, 
          deviceId, 
          personData?.personId || requestData.personId, 
          doorList, 
          validStartTime, 
          validEndTime,
          corsHeaders
        );

      case 'site-add':
        return await createSite(apiUrl, accessToken, siteName || 'Muscle Garage', corsHeaders);
        
      case 'site-search':
        return await searchSites(apiUrl, accessToken, siteName, corsHeaders);
        
      default:
        return new Response(
          JSON.stringify({ success: false, error: `Unknown action: ${action}` }),
          { 
            status: 400, 
            headers: { 
              'Content-Type': 'application/json',
              ...corsHeaders 
            } 
          }
        );
    }
  } catch (error) {
    console.error('Error handling request:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Unknown error occurred' 
      }),
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    );
  }
});

// Function to get a token
async function handleTokenRequest(apiUrl: string, appKey?: string, secretKey?: string, corsHeaders: any = {}) {
  if (!apiUrl || !appKey || !secretKey) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Missing required parameters: apiUrl, appKey, or secretKey' 
      }),
      { 
        status: 400, 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    );
  }

  try {
    console.log(`Requesting token from: ${apiUrl}/api/hpcgw/v1/token/get`);
    console.log(`Using appKey: ${appKey.substring(0, 5)}...`);
    
    const requestBody = JSON.stringify({
      appKey,
      secretKey
    });
    
    console.log(`Request body length: ${requestBody.length}`);
    
    const response = await fetch(`${apiUrl}/api/hpcgw/v1/token/get`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: requestBody
    });

    console.log(`Token response status: ${response.status}`);
    
    const responseText = await response.text();
    console.log(`Token response: ${responseText.substring(0, 100)}...`);
    
    let responseData;
    try {
      responseData = JSON.parse(responseText);
      console.error('Error in token response:', responseData);
    } catch (e) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid JSON response from API',
          responseText 
        }),
        { 
          status: 500, 
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders 
          } 
        }
      );
    }

    // Return the token response
    return new Response(
      JSON.stringify(responseData),
      { 
        status: 200, 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    );
  } catch (error) {
    console.error('Error getting token:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: `Error getting token: ${error.message}` 
      }),
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    );
  }
}

// Function to test device connectivity
async function handleDeviceTest(apiUrl: string, accessToken?: string, deviceId?: string, corsHeaders: any = {}) {
  if (!apiUrl || !accessToken || !deviceId) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Missing required parameters: apiUrl, accessToken, or deviceId' 
      }),
      { 
        status: 400, 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    );
  }

  try {
    // Use device list API to check connection
    const response = await fetch(`${apiUrl}/api/hpcgw/v1/device/list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        deviceId
      })
    });
    
    const responseData = await response.json();
    
    if (responseData.code === '0' || responseData.errorCode === '0') {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Device connection successful',
          data: responseData.data
        }),
        { 
          status: 200, 
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders 
          } 
        }
      );
    } else {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: `API error: ${responseData.msg || 'Unknown error'}`,
          code: responseData.code || responseData.errorCode,
          data: responseData 
        }),
        { 
          status: 200,  // Return 200 even for API errors to prevent edge function errors
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders 
          } 
        }
      );
    }
  } catch (error) {
    console.error('Error testing device:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: `Error testing device: ${error.message}` 
      }),
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    );
  }
}

// Function to register a person in Hikvision
async function registerPerson(
  apiUrl: string, 
  accessToken?: string, 
  personData?: any, 
  branchId?: string,
  corsHeaders: any = {},
  supabase?: any
) {
  if (!apiUrl || !accessToken || !personData) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Missing required parameters: apiUrl, accessToken, or personData' 
      }),
      { 
        status: 400, 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    );
  }

  try {
    // Prepare the request body for person registration
    const requestBody = {
      name: personData.name,
      gender: personData.gender === 'female' ? '2' : personData.gender === 'male' ? '1' : '0',
      cardNo: personData.id || personData.cardNo || '',
      phone: personData.phone || '',
      email: personData.email || '',
      personType: personData.personType || 1,
      pictures: personData.profile_picture ? [personData.profile_picture] : []
    };
    
    // Add person to Hikvision
    const response = await fetch(`${apiUrl}/api/hpcgw/v1/person/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(requestBody)
    });
    
    const responseData = await response.json();
    
    if (responseData.code === '0' || responseData.errorCode === '0') {
      const personId = responseData.data?.personId;
      
      // If supabase client is provided and personId exists, save the credential
      if (supabase && personId && branchId && personData.id) {
        try {
          // Save the credential to member_access_credentials table
          await supabase
            .from('member_access_credentials')
            .insert({
              member_id: personData.id,
              credential_type: 'hikvision',
              credential_value: personId,
              is_active: true,
              issued_at: new Date().toISOString()
            });
          
          // Log success to hikvision_sync_logs
          await supabase
            .from('hikvision_sync_logs')
            .insert({
              branch_id: branchId,
              event_type: 'sync',
              status: 'success',
              message: `Member ${personData.name} registered successfully`,
              entity_type: 'member',
              entity_id: personData.id,
              entity_name: personData.name
            });
        } catch (dbError) {
          console.error('Error saving credential to database:', dbError);
          // Continue execution even if database save fails
        }
      }
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Person registered successfully',
          personId
        }),
        { 
          status: 200, 
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders 
          } 
        }
      );
    } else {
      // Log error if supabase client is provided
      if (supabase && branchId && personData.id) {
        try {
          await supabase
            .from('hikvision_sync_logs')
            .insert({
              branch_id: branchId,
              event_type: 'error',
              status: 'error',
              message: `Failed to register ${personData.name}: ${responseData.msg || 'Unknown error'}`,
              details: JSON.stringify(responseData),
              entity_type: 'member',
              entity_id: personData.id,
              entity_name: personData.name
            });
        } catch (logError) {
          console.error('Error logging to hikvision_sync_logs:', logError);
        }
      }
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: `API error: ${responseData.msg || 'Unknown error'}`,
          code: responseData.code || responseData.errorCode,
          data: responseData 
        }),
        { 
          status: 200,  // Return 200 even for API errors to prevent edge function errors
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders 
          } 
        }
      );
    }
  } catch (error) {
    console.error('Error registering person:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: `Error registering person: ${error.message}` 
      }),
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    );
  }
}

// Function to assign access privileges to a person
async function assignAccessPrivileges(
  apiUrl: string, 
  accessToken?: string, 
  deviceId?: string,
  personId?: string,
  doorList: number[] = [1],
  validStartTime?: string,
  validEndTime?: string,
  corsHeaders: any = {}
) {
  if (!apiUrl || !accessToken || !deviceId || !personId) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Missing required parameters: apiUrl, accessToken, deviceId, or personId' 
      }),
      { 
        status: 400, 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    );
  }

  try {
    // Set default start and end times if not provided
    const now = new Date();
    const oneYearLater = new Date();
    oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
    
    const start = validStartTime || now.toISOString().split('T')[0] + 'T00:00:00Z';
    const end = validEndTime || oneYearLater.toISOString().split('T')[0] + 'T23:59:59Z';
    
    // Prepare the request body
    const requestBody = {
      personId,
      deviceSerialNo: deviceId,
      doorList,
      validStartTime: start,
      validEndTime: end
    };
    
    // Call the access privilege config API
    const response = await fetch(`${apiUrl}/api/hpcgw/v1/acs/privilege/config`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(requestBody)
    });
    
    const responseData = await response.json();
    
    if (responseData.code === '0' || responseData.errorCode === '0') {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Access privileges assigned successfully',
          data: responseData.data
        }),
        { 
          status: 200, 
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders 
          } 
        }
      );
    } else {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: `API error: ${responseData.msg || 'Unknown error'}`,
          code: responseData.code || responseData.errorCode,
          data: responseData 
        }),
        { 
          status: 200,  // Return 200 even for API errors
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders 
          } 
        }
      );
    }
  } catch (error) {
    console.error('Error assigning access privileges:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: `Error assigning access privileges: ${error.message}` 
      }),
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    );
  }
}

// Function to create a site
async function createSite(apiUrl: string, accessToken?: string, siteName: string = 'Muscle Garage', corsHeaders: any = {}) {
  if (!apiUrl || !accessToken) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Missing required parameters: apiUrl or accessToken' 
      }),
      { 
        status: 400, 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    );
  }

  try {
    // Create site in Hikvision
    const response = await fetch(`${apiUrl}/api/hpcgw/v1/site/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        name: siteName
      })
    });
    
    const responseData = await response.json();
    
    if (responseData.code === '0' || responseData.errorCode === '0') {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Site created successfully',
          siteId: responseData.data?.id
        }),
        { 
          status: 200, 
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders 
          } 
        }
      );
    } else {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: `API error: ${responseData.msg || 'Unknown error'}`,
          code: responseData.code || responseData.errorCode,
          data: responseData 
        }),
        { 
          status: 200,  // Return 200 even for API errors
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders 
          } 
        }
      );
    }
  } catch (error) {
    console.error('Error creating site:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: `Error creating site: ${error.message}` 
      }),
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    );
  }
}

// Function to search sites
async function searchSites(apiUrl: string, accessToken?: string, siteName?: string, corsHeaders: any = {}) {
  if (!apiUrl || !accessToken) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Missing required parameters: apiUrl or accessToken' 
      }),
      { 
        status: 400, 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    );
  }

  try {
    // Search sites in Hikvision
    const response = await fetch(`${apiUrl}/api/hpcgw/v1/site/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        name: siteName || ''
      })
    });
    
    const responseData = await response.json();
    
    if (responseData.code === '0' || responseData.errorCode === '0') {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Sites retrieved successfully',
          sites: responseData.data?.sites || []
        }),
        { 
          status: 200, 
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders 
          } 
        }
      );
    } else {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: `API error: ${responseData.msg || 'Unknown error'}`,
          code: responseData.code || responseData.errorCode,
          data: responseData 
        }),
        { 
          status: 200,  // Return 200 even for API errors
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders 
          } 
        }
      );
    }
  } catch (error) {
    console.error('Error searching sites:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: `Error searching sites: ${error.message}` 
      }),
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    );
  }
}
