
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

interface HikvisionToken {
  accessToken: string;
  expireTime: number;
  areaDomain: string;
}

// Create Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string;
const supabase = createClient(supabaseUrl, supabaseKey);

// Generic function for making API requests to Hikvision
async function makeRequest(url: string, method: string, headers: any, body?: any) {
  try {
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API request failed: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error making API request:', error);
    throw error;
  }
}

// Get token from Hikvision API
async function getToken(apiUrl: string, appKey: string, secretKey: string): Promise<HikvisionToken> {
  try {
    const url = `${apiUrl}/api/hpcgw/v1/token/get`;
    const response = await makeRequest(url, 'POST', {}, {
      appKey,
      secretKey
    });
    
    if (response.code !== '0' || !response.data) {
      throw new Error(`Failed to get token: ${response.msg || 'Unknown error'}`);
    }
    
    return response.data;
  } catch (error) {
    console.error('Error getting token:', error);
    throw error;
  }
}

// Get sites from Hikvision API
async function getSites(apiUrl: string, token: string) {
  try {
    const url = `${apiUrl}/api/hpcgw/v1/site/search`;
    const response = await makeRequest(url, 'POST', {
      Authorization: `Bearer ${token}`
    }, {
      pageNo: 1,
      pageSize: 100
    });
    
    if (response.code !== '0') {
      throw new Error(`Failed to get sites: ${response.msg || 'Unknown error'}`);
    }
    
    return response.data?.list || [];
  } catch (error) {
    console.error('Error getting sites:', error);
    throw error;
  }
}

// Check if device exists
async function checkDeviceExists(apiUrl: string, token: string, siteId: string, deviceId: string) {
  try {
    const url = `${apiUrl}/api/hpcgw/v1/device/list`;
    const response = await makeRequest(url, 'POST', {
      Authorization: `Bearer ${token}`
    }, {
      pageNo: 1,
      pageSize: 100,
      siteId
    });
    
    if (response.code !== '0') {
      throw new Error(`Failed to check device: ${response.msg || 'Unknown error'}`);
    }
    
    const devices = response.data?.list || [];
    const device = devices.find((d: any) => d.serialNumber === deviceId || d.deviceId === deviceId);
    
    return { 
      exists: !!device,
      deviceDetails: device
    };
  } catch (error) {
    console.error('Error checking device:', error);
    throw error;
  }
}

// Test device connection
async function testDevice(apiUrl: string, token: string, deviceId: string, siteId: string) {
  try {
    // First check if device exists
    const { exists, deviceDetails } = await checkDeviceExists(apiUrl, token, siteId, deviceId);
    
    if (!exists) {
      return { status: 'unknown', message: 'Device not found in Hikvision system' };
    }
    
    // Return status from device details
    return { 
      status: deviceDetails.status === 'online' ? 'online' : 'offline',
      device: deviceDetails
    };
  } catch (error) {
    console.error('Error testing device:', error);
    throw error;
  }
}

serve(async (req) => {
  try {
    // Parse request
    const { action, ...params } = await req.json();
    
    if (!action) {
      return new Response(
        JSON.stringify({ success: false, message: 'Action is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Handle different actions
    if (action === 'get-token') {
      const { apiUrl, appKey, secretKey } = params;
      
      if (!apiUrl || !appKey || !secretKey) {
        return new Response(
          JSON.stringify({ success: false, message: 'API URL, App Key and Secret Key are required' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
      
      try {
        const token = await getToken(apiUrl, appKey, secretKey);
        
        // Get available sites
        const sites = await getSites(apiUrl, token.accessToken);
        
        // Add sites to token data
        const tokenData = {
          ...token,
          availableSites: sites.map((site: any) => ({
            siteId: site.id,
            siteName: site.name
          })),
          // If there's only one site, use it as the default
          siteId: sites.length === 1 ? sites[0].id : undefined
        };
        
        return new Response(
          JSON.stringify({ 
            success: true, 
            token: tokenData
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      } catch (error) {
        return new Response(
          JSON.stringify({ success: false, message: error.message }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }
    
    if (action === 'check-device-exists') {
      const { token, siteId, deviceId } = params;
      
      if (!token || !siteId || !deviceId) {
        return new Response(
          JSON.stringify({ success: false, message: 'Token, Site ID and Device ID are required' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
      
      try {
        // Get API URL from settings using branch ID
        const { data: settings } = await supabase
          .from('hikvision_api_settings')
          .select('api_url')
          .eq('branch_id', params.branchId)
          .single();
          
        if (!settings?.api_url) {
          throw new Error('API URL not found in settings');
        }
        
        const result = await checkDeviceExists(settings.api_url, token, siteId, deviceId);
        
        return new Response(
          JSON.stringify({ 
            success: true, 
            exists: result.exists,
            device: result.deviceDetails
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      } catch (error) {
        return new Response(
          JSON.stringify({ success: false, message: error.message }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }
    
    if (action === 'test-device') {
      const { token, deviceId, siteId } = params;
      
      if (!token || !deviceId) {
        return new Response(
          JSON.stringify({ success: false, message: 'Token and Device ID are required' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
      
      try {
        // Get API URL from settings using branch ID
        const { data: settings } = await supabase
          .from('hikvision_api_settings')
          .select('api_url')
          .eq('branch_id', params.branchId)
          .single();
          
        if (!settings?.api_url) {
          throw new Error('API URL not found in settings');
        }
        
        const result = await testDevice(settings.api_url, token, deviceId, siteId);
        
        return new Response(
          JSON.stringify({ 
            success: true, 
            status: result.status,
            device: result.device
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      } catch (error) {
        return new Response(
          JSON.stringify({ success: false, message: error.message }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }
    
    // If we get here, the action is not supported
    return new Response(
      JSON.stringify({ success: false, message: `Action "${action}" not supported` }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
