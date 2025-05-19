
// @deno-types="https://deno.land/x/supabase_js@v2.2.1/mod.d.ts"
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Add type extensions for Error object
declare global {
  interface Error {
    status?: number;
  }
}

// Hikvision error codes mapping
interface HikvisionError {
  message: string;
  status: number;
}

const HIKVISION_ERRORS: Record<string, HikvisionError> = {
  // Device errors
  'EVZ20002': { message: 'Device does not exist', status: 404 },
  'EVZ20007': { message: 'The device is offline', status: 503 },
  'EVZ0012': { message: 'Adding device failed', status: 400 },
  'EVZ20014': { message: 'Incorrect device serial number', status: 400 },
  '0x400019F1': { message: 'The maximum number of devices reached', status: 429 },
  
  // Database errors
  '0x30000010': { message: 'Database search failed', status: 500 },
  '0x30001000': { message: 'HBP Exception', status: 500 },
  
  // Time function errors
  '0x00300001': { message: 'Time synchronization failed', status: 500 },
  '0x00300002': { message: 'Invalid NTP server address', status: 400 },
  '0x00300003': { message: 'Incorrect time format', status: 400 },
  
  // Network errors
  '0x00400001': { message: 'Parsing domain name failed', status: 400 },
  '0x00400004': { message: 'IP addresses of devices conflicted', status: 409 },
  '0x00400006': { message: 'Uploading failed', status: 500 },
  
  // Device function errors
  '0x01400003': { message: 'Certificates mismatched', status: 403 },
  '0x01400004': { message: 'Device is not activated', status: 401 },
  '0x01400006': { message: 'IP address is banned', status: 403 },
  
  // Face management errors
  '0x4000109C': { message: 'The library name already exists', status: 409 },
  '0x4000109D': { message: 'No record found', status: 404 },
  
  // Security control errors
  '0x40008000': { message: 'Arming failed', status: 500 },
  '0x40008001': { message: 'Disarming failed', status: 500 },
  '0x40008007': { message: 'Registering timed out', status: 504 },
  
  // Rate limiting
  'EVZ10029': { message: 'API calling frequency exceeded limit', status: 429 },
};

// Helper function to get error details from Hikvision error code
function getHikvisionError(errorCode: string): HikvisionError {
  const defaultError: HikvisionError = { 
    message: `Hikvision error: ${errorCode}`, 
    status: 400 
  };
  return HIKVISION_ERRORS[errorCode] || defaultError;
}

// Define environment variables
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

// Define interfaces for request and response types
interface HikvisionRequest {
  action: string;
  apiUrl?: string;
  accessToken?: string;
  appKey?: string;
  secretKey?: string;
  deviceId?: string;
  memberData?: PersonData;
  personData?: PersonData;
  doorList?: (string | number)[];
  validStartTime?: string;
  validEndTime?: string;
  branchId?: string;
  siteName?: string;
  siteId?: string;
}

interface PersonData {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  faceData?: string;
  personId?: string;
  gender?: 'male' | 'female' | 'other';
}

interface HikvisionTokenData {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expireTime: string;
  areaDomain: string;
}

interface AccessDoor {
  id: string;
  name?: string;
  door_number?: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 204, 
      headers: corsHeaders 
    });
  }

  try {
    // Parse the request body
    const requestData: HikvisionRequest = await req.json();
    
    // Extract common parameters
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
      siteName,
      siteId
    } = requestData;
    
    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Prepare settings object
    const settings = {
      api_url: apiUrl || '',
      branch_id: branchId || '',
      device_id: deviceId
    };
    
    // Route the request based on the action
    switch (action) {
      case 'getToken': {
        if (!appKey || !secretKey) {
          throw new Error('appKey and secretKey are required for getToken action');
        }
        const tokenResult = await getToken(apiUrl || '', appKey, secretKey, branchId || '');
        return new Response(JSON.stringify(tokenResult), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });
      }
        
      case 'testDevice': {
        if (!deviceId) {
          throw new Error('deviceId is required for testDevice action');
        }
        const testResult = await testDevice(settings);
        return new Response(JSON.stringify(testResult), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });
      }
        
      case 'registerPerson': {
        if (!personData) {
          throw new Error('personData is required for registerPerson action');
        }
        if (!branchId) {
          throw new Error('branchId is required for registerPerson action');
        }
        const registerResult = await registerPerson(settings, personData, branchId, supabase);
        return new Response(JSON.stringify(registerResult), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });
      }
        
      case 'assignAccessPrivileges': {
        if (!personData?.id || !doorList?.length) {
          throw new Error('personData.id and doorList are required for assignAccessPrivileges action');
        }
        if (!deviceId) {
          throw new Error('deviceId is required for assignAccessPrivileges action');
        }
        // Convert doorList to array of numbers
        const doorNumbers = doorList.map(door => typeof door === 'string' ? parseInt(door, 10) : door);
        const accessResult = await assignAccessPrivileges(
          deviceId, 
          personData.id, 
          doorNumbers,
          validStartTime,
          validEndTime
        );
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: 'Access privileges assigned successfully',
            data: accessResult
          }),
          { 
            status: 200, 
            headers: { 
              'Content-Type': 'application/json',
              ...corsHeaders 
            } 
          }
        );
      }
        
      case 'createSite': {
        if (!siteName) {
          throw new Error('siteName is required for createSite action');
        }
        if (!branchId) {
          throw new Error('branchId is required for createSite action');
        }
        const siteResult = await createSite(siteName, branchId);
        return new Response(
          JSON.stringify({
            success: true,
            message: 'Site created successfully',
            data: siteResult
          }),
          {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders
            }
          }
        );
      }
        
      case 'searchSites': {
        const { siteName = '', siteId = '' } = requestData;
        const searchResult = await searchSites(settings, siteName, siteId, supabase);
        return new Response(JSON.stringify(searchResult), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });
      }
        
      default:
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Invalid action' 
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
  } catch (error) {
    console.error('Error handling request:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage
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

// Function to get and store a token
async function getToken(
  apiUrl: string,
  appKey: string,
  secretKey: string,
  branchId: string
): Promise<{ success: boolean, data?: any, error?: string }> {
  try {
    console.log(`Requesting token from: ${apiUrl}/api/hpcgw/v1/token/get`);
    const response = await fetch(`${apiUrl}/api/hpcgw/v1/token/get`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ appKey, secretKey })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.msg || 'Failed to get token');
    }

    const responseData = await response.json();
    
    if (responseData.code !== '0') {
      return {
        success: false,
        error: responseData.msg || 'Failed to get token'
      };
    }
    
    const { accessToken, refreshToken, tokenType, expireTime, areaDomain } = responseData.data as HikvisionTokenData;
    
    // Convert expireTime to ISO string
    const expireTimestamp = new Date(expireTime).toISOString();

    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Store or update the token in the database
    const { error: upsertError } = await supabase
      .from('hikvision_tokens')
      .upsert({
        access_token: accessToken,
        refresh_token: refreshToken,
        token_type: tokenType,
        expires_in: Math.floor((new Date(expireTime).getTime() - Date.now()) / 1000),
        expire_time: expireTimestamp,
        area_domain: areaDomain,
        branch_id: branchId,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'branch_id'
      });

    if (upsertError) {
      console.error('Error storing token:', upsertError);
      throw new Error('Failed to store token in database');
    }

    return {
      success: true,
      data: {
        accessToken,
        tokenType,
        expireTime: expireTimestamp,
        areaDomain
      }
    };
  } catch (error) {
    console.error('Token request error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to get token';
    return {
      success: false,
      error: errorMessage
    };
  }
}

// Function to test device connectivity
async function testDevice(
  settings: { api_url: string; branch_id: string; device_id?: string }
): Promise<any> {
  try {
    if (!settings?.api_url) {
      throw new Error('Hikvision API URL not configured');
    }

    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Get the latest token
    const { data: tokenData, error: tokenError } = await supabase
      .from('hikvision_tokens')
      .select('*')
      .eq('branch_id', settings.branch_id)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    if (tokenError || !tokenData?.access_token) {
      return {
        success: false,
        error: 'No valid access token found. Please authenticate first.'
      };
    }

    // Test device connectivity by checking its status
    const response = await fetch(
      `${settings.api_url}/api/hpcgw/v1/device/status?deviceId=${settings.device_id}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const responseData = await response.json();

    if (responseData.code !== '0') {
      const error = getHikvisionError(responseData.code);
      return {
        success: false,
        error: error.message,
        errorCode: responseData.code
      };
    }

    return {
      success: true,
      message: 'Device is online and working',
      data: responseData.data
    };
  } catch (error) {
    console.error('Error testing device:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error testing device'
    };
  }
}

// Function to register a person
async function registerPerson(
  settings: { api_url: string; branch_id: string; device_id?: string },
  personData: PersonData,
  branchId: string,
  supabase: any
): Promise<any> {
  try {
    if (!settings?.api_url) {
      throw new Error('Hikvision API URL not configured');
    }

    if (!personData.name) {
      throw new Error('Person name is required');
    }

    // Get the latest token
    const { data: tokenData, error: tokenError } = await supabase
      .from('hikvision_tokens')
      .select('*')
      .eq('branch_id', branchId)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    if (tokenError || !tokenData?.access_token) {
      return {
        success: false,
        error: 'No valid access token found. Please authenticate first.'
      };
    }

    // Format the request payload according to Hikvision API
    const payload = {
      name: personData.name,
      gender: personData.gender || 'unknown',
      personType: 1, // 1 = normal person
      phone: personData.phone || '',
      email: personData.email || '',
      pictures: personData.faceData ? [personData.faceData] : []
    };

    // Register the person via Hikvision API
    const response = await fetch(
      `${settings.api_url}/api/hpcgw/v1/person/add`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      }
    );

    const responseData = await response.json();

    if (responseData.code !== '0') {
      const error = getHikvisionError(responseData.code);
      return {
        success: false,
        message: error.message,
        errorCode: responseData.code
      };
    }

    // Get the person ID from the response
    const personId = responseData.data.personId;

    // Store the mapping in our database
    const { error: dbError } = await supabase
      .from('hikvision_persons')
      .upsert({
        person_id: personId,
        member_id: personData.id,
        name: personData.name,
        gender: personData.gender,
        phone: personData.phone,
        email: personData.email,
        status: 'active',
        branch_id: branchId,
        sync_status: 'success',
        last_sync: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'member_id'
      });

    if (dbError) {
      console.error('Error storing person mapping:', dbError);
    }

    // Return success
    return {
      success: true,
      message: 'Person registered successfully',
      personId
    };
  } catch (error) {
    console.error('Error registering person:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error registering person'
    };
  }
}

// Function to assign access privileges
async function assignAccessPrivileges(
  deviceId: string,
  personId: string,
  doorList: number[],
  validStartTime?: string,
  validEndTime?: string
): Promise<any> {
  try {
    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Get the device details
    const { data: deviceData, error: deviceError } = await supabase
      .from('hikvision_devices')
      .select('branch_id')
      .eq('device_id', deviceId)
      .single();

    if (deviceError || !deviceData) {
      throw new Error('Device not found');
    }

    // Get the branch ID
    const branchId = deviceData.branch_id;

    // Get the latest token
    const { data: tokenData, error: tokenError } = await supabase
      .from('hikvision_tokens')
      .select('*')
      .eq('branch_id', branchId)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    if (tokenError || !tokenData?.access_token) {
      return {
        success: false,
        error: 'No valid access token found. Please authenticate first.'
      };
    }

    // Get the API URL
    const { data: settings, error: settingsError } = await supabase
      .from('hikvision_api_settings')
      .select('api_url')
      .eq('branch_id', branchId)
      .single();

    if (settingsError || !settings?.api_url) {
      throw new Error('Hikvision API settings not found');
    }

    const apiUrl = settings.api_url;

    // Format the request payload according to Hikvision API
    const payload: any = {
      personId: personId,
      deviceSerialNo: deviceId,
      doorList: doorList
    };

    // Add optional validity period if provided
    if (validStartTime) {
      payload.validStartTime = validStartTime;
    }
    
    if (validEndTime) {
      payload.validEndTime = validEndTime;
    }

    // Make the API call
    const response = await fetch(
      `${apiUrl}/api/hpcgw/v1/acs/privilege/config`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      }
    );

    const responseData = await response.json();

    if (responseData.code !== '0') {
      const error = getHikvisionError(responseData.code);
      return {
        success: false,
        message: error.message,
        errorCode: responseData.code
      };
    }

    // Store the access privilege in our database
    for (const doorId of doorList) {
      const { error: dbError } = await supabase
        .from('hikvision_access_privileges')
        .upsert({
          person_id: personId,
          door_id: doorId.toString(),
          privilege: 1,
          schedule: 0,
          valid_start_time: validStartTime,
          valid_end_time: validEndTime,
          status: 'active',
          sync_status: 'success',
          last_sync: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'person_id,door_id'
        });

      if (dbError) {
        console.error('Error storing access privilege:', dbError);
      }
    }

    // Return success
    return {
      success: true,
      message: 'Access privileges assigned successfully'
    };
  } catch (error) {
    console.error('Error assigning access privileges:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error assigning access privileges'
    };
  }
}

// Function to create a site
async function createSite(
  siteName: string,
  branchId: string
): Promise<any> {
  try {
    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Get the latest token
    const { data: tokenData, error: tokenError } = await supabase
      .from('hikvision_tokens')
      .select('*')
      .eq('branch_id', branchId)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    if (tokenError || !tokenData?.access_token) {
      return {
        success: false,
        error: 'No valid access token found. Please authenticate first.'
      };
    }

    // Get the API URL
    const { data: settings, error: settingsError } = await supabase
      .from('hikvision_api_settings')
      .select('api_url')
      .eq('branch_id', branchId)
      .single();

    if (settingsError || !settings?.api_url) {
      throw new Error('Hikvision API settings not found');
    }

    const apiUrl = settings.api_url;

    // Format the request payload according to Hikvision API
    const payload = {
      siteName,
      remark: `Site for branch ${branchId}`
    };

    // Make the API call
    const response = await fetch(
      `${apiUrl}/api/hpcgw/v1/site/add`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      }
    );

    const responseData = await response.json();

    if (responseData.code !== '0') {
      const error = getHikvisionError(responseData.code);
      return {
        success: false,
        message: error.message,
        errorCode: responseData.code
      };
    }

    // Get the site ID from the response
    const siteId = responseData.data?.siteId;

    // Update the settings with the site ID
    const { error: updateError } = await supabase
      .from('hikvision_api_settings')
      .update({
        site_id: siteId,
        site_name: siteName,
        updated_at: new Date().toISOString()
      })
      .eq('branch_id', branchId);

    if (updateError) {
      console.error('Error updating site ID:', updateError);
    }

    // Return success
    return {
      success: true,
      siteId,
      siteName
    };
  } catch (error) {
    console.error('Error creating site:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error creating site'
    };
  }
}

// Function to search sites
async function searchSites(
  settings: { api_url: string; branch_id: string },
  siteName: string,
  siteId: string,
  supabase: any
): Promise<any> {
  try {
    if (!settings?.api_url) {
      throw new Error('Hikvision API URL not configured');
    }

    // Get the latest token
    const { data: tokenData, error: tokenError } = await supabase
      .from('hikvision_tokens')
      .select('*')
      .eq('branch_id', settings.branch_id)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    if (tokenError || !tokenData?.access_token) {
      return {
        success: false,
        error: 'No valid access token found. Please authenticate first.'
      };
    }

    // Format the request payload according to Hikvision API
    const payload: any = {};
    
    if (siteName) {
      payload.siteName = siteName;
    }
    
    if (siteId) {
      payload.siteId = siteId;
    }

    // Make the API call
    const response = await fetch(
      `${settings.api_url}/api/hpcgw/v1/site/search`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      }
    );

    const responseData = await response.json();

    if (responseData.code !== '0') {
      const error = getHikvisionError(responseData.code);
      return {
        success: false,
        message: error.message,
        errorCode: responseData.code
      };
    }

    // Return the sites
    return {
      success: true,
      sites: responseData.data?.list || []
    };
  } catch (error) {
    console.error('Error searching sites:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error searching sites'
    };
  }
}
