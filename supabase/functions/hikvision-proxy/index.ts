// @deno-types="https://deno.land/x/supabase_js@v2.2.1/mod.d.ts"
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Define types for environment variables
declare const process: {
  env: {
    SUPABASE_URL: string;
    SUPABASE_SERVICE_ROLE_KEY: string;
    HIKVISION_APP_KEY?: string;
    HIKVISION_SECRET_KEY?: string;
    NODE_ENV?: 'development' | 'production';
  };
};

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
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

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

// Hikvision token data interface - consolidated

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

  console.log('Request received:', {
    method: req.method,
    url: req.url,
    headers: Object.fromEntries(req.headers.entries())
  });

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
      branchId = 'default', // Optional, with default value
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
        const tokenResponse = await getToken(
          requestData.apiUrl || '',
          requestData.appKey || '',
          requestData.secretKey || '',
          requestData.branchId || 'default',
          supabase
        );
        return new Response(JSON.stringify(tokenResponse), {
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
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    console.error('Error details:', {
      message: errorMessage,
      stack: errorStack,
      error: JSON.stringify(error, Object.getOwnPropertyNames(error))
    });

    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? errorStack : undefined
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
interface TokenResponse<T = HikvisionTokenData> {
  success: boolean;
  data?: T;
  error?: string;
  errorCode?: string;
  details?: unknown;
}

// Interface for token data from Hikvision API response
interface HikvisionTokenResponseData {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  expire_time?: string;
  scope?: string;
  area_domain?: string;
}

// Convert Hikvision API response to our token data format
function convertToTokenData(apiData: HikvisionTokenResponseData, branchId: string): HikvisionTokenData {
  return {
    accessToken: apiData.access_token,
    refreshToken: apiData.refresh_token,
    tokenType: apiData.token_type,
    expiresIn: apiData.expires_in,
    expireTime: apiData.expire_time || new Date(Date.now() + apiData.expires_in * 1000).toISOString(),
    scope: apiData.scope,
    areaDomain: apiData.area_domain,
    branchId: branchId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

// Consolidated token data interface
interface HikvisionTokenData {
  // Token fields from Hikvision API (camelCase for consistency)
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  expireTime?: string;
  scope?: string;
  areaDomain?: string;
  
  // Additional fields for our application
  siteId?: string;
  siteName?: string;
  branchId?: string;
  createdAt?: string;
  updatedAt?: string;
  
  // Allow additional properties with index signature
  [key: string]: unknown;
}

// Hikvision API token response data type
interface HikvisionTokenResponseData extends Omit<HikvisionTokenData, 'site_id' | 'site_name' | 'branch_id' | 'created_at' | 'updated_at'> {
  // This interface inherits all token fields from HikvisionTokenData
  // but excludes the additional fields we've added for our application
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  expire_time?: string;
  scope?: string;
  area_domain?: string;
}

// Hikvision API token response type
interface HikvisionTokenResponse {
  code: string;
  msg: string;
  data: HikvisionTokenResponseData;
}

// Our standardized response type
interface TokenResponse<T = HikvisionTokenData> {
  success: boolean;
  data?: T;
  error?: string;
  errorCode?: string;
  details?: unknown;
}

interface HikvisionSuccessResponse {
  code: string;
  msg: string;
  data: HikvisionTokenData;
  [key: string]: unknown;
}

interface HikvisionErrorResponse {
  code: string;
  msg: string;
  data?: unknown;
}

async function getToken(
  apiUrl: string,
  appKey: string,
  secretKey: string,
  branchId: string = 'default',
  supabase: any
): Promise<TokenResponse> {
  try {
    // Remove the line below as it's already passed as a parameter
    // const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const logContext = { branchId, appKey: `${appKey.substring(0, 4)}...` };

    // Check if we have a valid token in the database
    const { data: existingToken, error: tokenError } = await supabase
      .from('hikvision_tokens')
      .select('*')
      .eq('branch_id', branchId)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    // If we have a valid token that's not expired, return it
    if (existingToken?.access_token && existingToken?.expire_time) {
      const expiryDate = new Date(existingToken.expire_time);
      const now = new Date();
      
      // If token expires in more than 5 minutes, it's still valid
      if (expiryDate > new Date(now.getTime() + 5 * 60 * 1000)) {
        return {
          success: true,
          data: {
            ...existingToken,
            expires_in: Math.floor((expiryDate.getTime() - now.getTime()) / 1000)
          }
        };
      }
    }

    // If we get here, we need to get a new token
    const response = await fetch(`${apiUrl}/api/hpcgw/v1/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${appKey}:${secretKey}`)}`
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials'
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }

    const responseData = await response.json() as HikvisionTokenResponse;
    
    if (responseData.code !== '0' || !responseData.data) {
      const error = getHikvisionError(responseData.code);
      return {
        success: false,
        error: error.message,
        errorCode: responseData.code
      };
    }

    const tokenData = responseData.data;
    const now = new Date();
    const expireTime = tokenData.expire_time || new Date(now.getTime() + (tokenData.expires_in * 1000)).toISOString();

    // Store the token in the database
    const { error: upsertError } = await supabase
      .from('hikvision_tokens')
      .upsert({
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        token_type: tokenData.token_type,
        expires_in: tokenData.expires_in,
        expire_time: expireTime,
        scope: tokenData.scope,
        area_domain: tokenData.area_domain,
        branch_id: branchId,
        updated_at: now.toISOString(),
        created_at: existingToken?.created_at || now.toISOString()
      }, {
        onConflict: 'branch_id'
      });

    if (upsertError) {
      console.error('Error storing token:', upsertError);
      // We still return the token even if storing fails
    }

    // Convert token data to our standardized format
    const tokenResponse: HikvisionTokenData = {
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      tokenType: tokenData.token_type,
      expiresIn: tokenData.expires_in,
      expireTime: tokenData.expire_time || new Date(now.getTime() + (tokenData.expires_in * 1000)).toISOString(),
      scope: tokenData.scope,
      areaDomain: tokenData.area_domain,
      siteId: 'default-site',
      siteName: 'Default Site',
      branchId: branchId,
      createdAt: existingToken?.created_at || now.toISOString(),
      updatedAt: now.toISOString()
    };

    return {
      success: true,
      data: tokenResponse
    };
  } catch (error) {
    console.error('Token request error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to get token';
    return {
      success: false,
      error: errorMessage,
      errorCode: 'TOKEN_FETCH_ERROR',
      details: process.env.NODE_ENV === 'development' ? {
        error: errorMessage,
        stack: error instanceof Error ? error.stack : undefined
      } : undefined
    };
  }
}

// ... (rest of the code remains the same)

// Function to create site
async function createSite(
  settings: { api_url: string; branch_id: string },
  siteName: string,
  siteId: string,
  supabase: any
): Promise<{
  success: boolean;
  siteId?: string;
  siteName?: string;
  error?: string;
}> {
  try {
    // ... (rest of the code remains the same)

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
): Promise<{
  success: boolean;
  sites?: any[];
  error?: string;
  errorCode?: string;
}> {
  try {
    if (!settings?.api_url) {
      throw new Error('Hikvision API URL not configured');
    }

    // Get the latest token
    const { data: latestToken, error: tokenError } = await supabase
      .from('hikvision_tokens')
      .select('*')
      .eq('branch_id', settings.branch_id)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    if (tokenError || !latestToken?.access_token) {
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
          'Authorization': `Bearer ${latestToken.access_token}`,
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
        error: error.message,
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

// New function to subscribe to events
interface SubscribeToEventsResponse {
  success: boolean;
  subscriptionId?: string;
  error?: string;
  errorCode?: string;
}

async function subscribeToEvents(
  settings: { api_url: string; branch_id: string },
  branchId: string,
  supabase: any
): Promise<SubscribeToEventsResponse> {
  try {
    // Get token
    const { data: latestToken, error: tokenError } = await supabase
      .from('hikvision_tokens')
      .select('*')
      .eq('branch_id', branchId)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    if (tokenError || !latestToken?.access_token) {
      return {
        success: false,
        error: 'No valid access token found. Please authenticate first.'
      };
    }

    // Subscribe to events
    const response = await fetch(
      `${settings.api_url}/api/hpcgw/v1/mq/subscribe`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${latestToken.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          topics: ['acs.event.door']
        })
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
    
    // Store subscription info
    const { error: dbError } = await supabase
      .from('hikvision_subscriptions')
      .upsert({
        branch_id: branchId,
        subscription_id: responseData.data.subscriptionId,
        topics: ['acs.event.door'],
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'branch_id'
      });
      
    if (dbError) {
      console.error('Error storing subscription:', dbError);
    }
    
    return {
      success: true,
      subscriptionId: responseData.data.subscriptionId
    };
  } catch (error) {
    console.error('Error subscribing to events:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error subscribing to events'
    };
  }
}

// Function to handle webhook events
async function handleWebhookEvent(
  req: Request,
  supabase: any
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const webhookData = await req.json();
    
    // Validate webhook data
    if (!webhookData.eventType || !webhookData.eventTime) {
      return {
        success: false,
        error: 'Invalid webhook data: missing eventType or eventTime'
      };
    }
    
    // Store the event
    const { error } = await supabase
      .from('hikvision_events')
      .insert({
        event_type: webhookData.eventType,
        event_time: webhookData.eventTime,
        door_id: webhookData.doorId,
        door_name: webhookData.doorName,
        person_id: webhookData.personId,
        person_name: webhookData.personName,
        device_id: webhookData.deviceId,
        device_name: webhookData.deviceName,
        branch_id: webhookData.branchId || 'unknown',
        status: webhookData.status || 'success',
        raw_data: webhookData
      });
      
    if (error) {
      console.error('Database error:', error);
      throw new Error(`Failed to store event: ${error.message}`);
    }
    
    return {
      success: true,
      message: 'Event processed successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error handling webhook:', error);
    return {
      success: false,
      error: `Error handling webhook: ${errorMessage}`
    };
  }
}
