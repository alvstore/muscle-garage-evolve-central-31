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
        const tokenResult = await getToken(apiUrl || '', appKey, secretKey, corsHeaders, supabase);
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
        const testResult = await testDevice(settings, deviceId, supabase);
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
        const accessResult = await assignAccessPrivileges(deviceId, personData.id, doorNumbers);
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
        const { siteName = '', siteId = '' } = req.query as { siteName?: string; siteId?: string };
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
  corsHeaders: Record<string, string>,
  supabase: any
): Promise<Response> {
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
    const { accessToken, refreshToken, tokenType, expireTime, areaDomain } = responseData.data as HikvisionTokenData;
    
    // Convert expireTime to ISO string
    const expireTimestamp = new Date(expireTime).toISOString();

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
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'access_token'
      });

    if (upsertError) {
      console.error('Error storing token:', upsertError);
      throw new Error('Failed to store token in database');
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: {
          accessToken,
          tokenType,
          expireTime: expireTimestamp,
          areaDomain
        } 
      }),
      { 
        status: 200, 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    );
  } catch (error) {
    console.error('Token request error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to get token';
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
}

// Function to test device connectivity
async function testDevice(
  settings: { api_url: string; branch_id: string; device_id?: string },
  deviceId: string,
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
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    if (tokenError || !tokenData?.access_token) {
      return {
        success: false,
        error: 'No valid access token found. Please authenticate first.'
      };
    }

    // Test device connectivity
    const response = await fetch(
      `${settings.api_url}/api/hpcgw/v1/device/status?deviceId=${deviceId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.msg || 'Failed to test device');
    }

    // Update device status in the database
    const { error: updateError } = await supabase
      .from('access_doors')
      .update({ 
        is_online: true,
        last_online: new Date().toISOString()
      })
      .eq('id', deviceId);

    if (updateError) {
      console.error('Error updating device status:', updateError);
      throw new Error('Failed to update device status');
    }

    return {
      success: true,
      data: {
        ...responseData,
        doorName: 'device.door_name',
        isOnline: true
      }
    };
  } catch (error) {
    console.error('Device test error:', error);
    
    // Update device status as offline in case of error
    if (deviceId) {
      await supabase
        .from('access_doors')
        .update({ 
          is_online: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', deviceId);
    }
    
    return {
      success: false,
      error: error.message || 'Device test failed',
      deviceId
    };
  }
}

// Function to register a person in Hikvision
async function registerPerson(
  settings: { api_url: string; branch_id: string },
  personData: PersonData,
  branchId: string,
  supabase: any
): Promise<any> {
  if (!personData) {
    throw new Error('personData is required');
  }
  
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  };
  try {
    if (!settings?.api_url) {
      throw new Error('Hikvision API URL not configured');
    }

    // Get the latest token
    const { data: tokenData, error: tokenError } = await supabase
      .from('hikvision_tokens')
      .select('*')
      .single();

    if (tokenError || !tokenData?.access_token) {
      throw new Error('No valid access token found. Please authenticate first.');
    }

    // Prepare the request body for person registration
    let member = { ...personData };
    if (personData.id) {
      const { data: memberData, error: memberError } = await supabase
        .from('members')
        .select('*')
        .eq('id', personData.id)
        .single();

      if (memberError || !memberData) {
        throw new Error(`Member not found: ${memberError?.message || personData.id}`);
      }
      member = { ...memberData, ...personData };
    }

    const requestBody = {
      personInfo: {
        personId: member.id || `person_${Date.now()}`,
        personName: member.name,
        gender: member.gender === 'male' ? 1 : member.gender === 'female' ? 2 : 0,
        orgIndexCode: 'root',
        phoneNo: member.phone || '',
        email: member.email || ''
      }
    };

    // Call Hikvision API to register person
    const response = await fetch(
      `${settings.api_url}/api/hpcgw/v1/persons`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${tokenData.access_token}`
        },
        body: JSON.stringify(requestBody)
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      const errorCode = errorData.code || errorData.errorCode;
      if (errorCode) {
        const hikError = getHikvisionError(errorCode);
        const error = new Error(hikError.message);
        (error as any).status = hikError.status || 400;
        throw error;
      }
      throw new Error(errorData.msg || 'Failed to register person');
    }

    const responseData = await response.json();
    const hikvisionPersonId = responseData.data?.personId;

    if (!hikvisionPersonId) {
      throw new Error('Failed to get person ID from Hikvision API');
    }

    // Save the Hikvision person ID to our database if we have a member ID
    if (member.id) {
      const { error: updateError } = await supabase
        .from('members')
        .update({ 
          hikvision_person_id: hikvisionPersonId,
          updated_at: new Date().toISOString()
        })
        .eq('id', member.id);

      if (updateError) {
        console.error('Error updating member with Hikvision ID:', updateError);
        throw new Error('Failed to update member with Hikvision ID');
      }
    }

    // Save the person ID to the database
    const { error: dbError } = await supabase
      .from('hikvision_persons')
      .upsert(
        {
          person_id: hikvisionPersonId,
          person_code: hikvisionPersonId,
          name: member.name,
          email: member.email || null,
          phone: member.phone || null,
          branch_id: branchId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        { onConflict: 'person_id' }
      );

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error('Failed to save person to database');
    }

    return {
      success: true,
      data: {
        personId: hikvisionPersonId,
        name: member.name,
        email: member.email || '',
        phone: member.phone || ''
      }
    };
  } catch (error) {
    console.error('Error registering person:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to register person';
    return {
      success: false,
      error: errorMessage
    };
  }
}

// Helper function to assign access privileges
interface AccessPrivilegeResult {
  success: boolean;
  message?: string;
  error?: string;
  data?: any;
}

async function assignAccessPrivileges(
  deviceId: string, 
  personId: string, 
  doorList: number[]
): Promise<AccessPrivilegeResult> {
  const supabase = createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );
  
  const settings = {
    api_url: process.env.HIKVISION_API_URL || 'https://api.hikvision.com'
  };
  try {
    // Get the latest token
    const { data: tokenData, error: tokenError } = await supabase
      .from('hikvision_tokens')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    if (tokenError || !tokenData?.access_token) {
      throw new Error('No valid access token found');
    }

    const response = await fetch(
      `${settings.api_url}/api/hpcgw/v1/accessControl/doors/privilege`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenData.access_token}`
        },
        body: JSON.stringify({
          doorIndexCodes: doorList,
          personIds: [personId]
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      const errorCode = errorData.code || errorData.errorCode;
      if (errorCode) {
        const hikError = getHikvisionError(errorCode);
        const error = new Error(hikError.message);
        (error as any).status = hikError.status || 400;
        throw error;
      }
      throw new Error(errorData.msg || 'Failed to assign access privileges');
    }

    return await response.json();
  } catch (error) {
    console.error('Error assigning access privileges:', error);
    throw error;
  }
}

// Helper function to create a site
interface SiteCreationResult {
  success: boolean;
  message?: string;
  error?: string;
  data?: any;
}

async function createSite(
  siteName: string, 
  branchId: string
): Promise<SiteCreationResult> {
  const supabase = createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );
  
  const settings = {
    api_url: process.env.HIKVISION_API_URL || 'https://api.hikvision.com'
  };
  try {
    // Get the latest token
    const { data: tokenData, error: tokenError } = await supabase
      .from('hikvision_tokens')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    if (tokenError || !tokenData?.access_token) {
      throw new Error('No valid access token found');
    }

    const response = await fetch(
      `${settings.api_url}/api/hpcgw/v1/sites`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenData.access_token}`
        },
        body: JSON.stringify({
          siteName,
          branchId,
          description: `Site for ${siteName}`
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      const errorCode = errorData.code || errorData.errorCode;
      if (errorCode) {
        const hikError = getHikvisionError(errorCode);
        const error = new Error(hikError.message);
        (error as any).status = hikError.status || 400;
        throw error;
      }
      throw new Error(errorData.msg || 'Failed to create site');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating site:', error);
    throw error;
  }
}

// Function to search sites
async function searchSites(
  settings: { api_url: string; },
  siteName: string,
  siteId: string,
  supabase: any
): Promise<any> {
  try {
    // Get the latest token
    const { data: tokenData, error: tokenError } = await supabase
      .from('hikvision_tokens')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    if (tokenError || !tokenData?.access_token) {
      return {
        success: false,
        error: 'No valid access token found. Please authenticate first.'
      };
    }

    // Search sites in Hikvision
    const response = await fetch(`${settings.api_url}/api/hpcgw/v1/site/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenData.access_token}`
      },
      body: JSON.stringify({
        name: siteName || ''
      })
    });
    
    const responseData = await response.json();
    
    if (responseData.code === '0' || responseData.errorCode === '0') {
      return {
        success: true, 
        message: 'Sites retrieved successfully',
        sites: responseData.data?.sites || []
      };
    } else {
      return {
        success: false, 
        message: `API error: ${responseData.msg || 'Unknown error'}`,
        code: responseData.code || responseData.errorCode,
        data: responseData 
      };
    }
  } catch (error) {
    console.error('Error searching sites:', error);
    return {
      success: false, 
      error: `Error searching sites: ${error.message}` 
    };
  }
}

// Rest of the code remains the same
