
import { supabase } from '@/integrations/supabase/client';
import axios from 'axios';
import { toast } from '@/hooks/use-toast';

// Table to store tokens
const HIKVISION_TOKENS_TABLE = 'hikvision_tokens';

interface TokenResponse {
  code?: string;
  errorCode?: string;
  msg?: string;
  data?: {
    accessToken: string;
    expireTime: number;
    areaDomain: string;
  };
}

/**
 * Get a valid Hikvision access token
 * Tokens are valid for 7 days, so we'll check if we have a valid one in the database
 * If not, we'll request a new one
 */
export const getHikvisionToken = async (branchId: string): Promise<string | null> => {
  try {
    // First, check if we have a valid token in the database
    const { data: tokenData, error: tokenError } = await supabase
      .from(HIKVISION_TOKENS_TABLE)
      .select('*')
      .eq('branch_id', branchId)
      .maybeSingle();
    
    // If we have a token and it's not expired, return it
    if (tokenData && !tokenError) {
      const now = Date.now();
      if (tokenData.expire_time > now) {
        console.log('Using existing Hikvision token, expires in:', 
          Math.round((tokenData.expire_time - now) / (1000 * 60 * 60 * 24)), 'days');
        return tokenData.access_token;
      }
      console.log('Hikvision token expired, requesting new one');
    }
    
    // Get API settings
    const { data: apiSettings, error: settingsError } = await supabase
      .from('hikvision_api_settings')
      .select('*')
      .eq('branch_id', branchId)
      .eq('is_active', true)
      .maybeSingle();
    
    if (settingsError || !apiSettings) {
      console.error('Error fetching Hikvision API settings:', settingsError || 'No active settings found');
      return null;
    }
    
    // Request a new token
    const tokenUrl = `${apiSettings.api_url}/api/hpcgw/v1/token/get`;
    const requestData = {
      appKey: apiSettings.app_key,
      secretKey: apiSettings.app_secret
    };
    
    console.log('Requesting new Hikvision token from:', tokenUrl);
    
    try {
      // Try using the edge function first
      console.log('Attempting to use edge function for token request');
      const { data: edgeData, error: edgeError } = await supabase.functions.invoke('hikvision-proxy', {
        body: {
          action: 'token',
          apiUrl: apiSettings.api_url,
          appKey: apiSettings.app_key,
          secretKey: apiSettings.app_secret
        }
      });
      
      if (edgeError) {
        console.error('Edge function error:', edgeError);
        throw new Error(`Edge function error: ${edgeError.message}`);
      }
      
      console.log('Edge function response:', edgeData);
      
      // Check if we received HTML instead of JSON
      if (edgeData && edgeData.responseText && typeof edgeData.responseText === 'string' && 
          edgeData.responseText.includes('<!DOCTYPE html>')) {
        throw new Error('Received HTML instead of JSON from API. Check the API URL and credentials.');
      }
      
      if (edgeData && (edgeData.code === '0' || edgeData.errorCode === '0') && edgeData.data) {
        return handleTokenResponse(edgeData, branchId);
      }
      
      // If edge function doesn't work, try direct API call
      console.log('Edge function returned invalid response, trying direct API call');
    } catch (edgeErr) {
      console.warn('Edge function failed:', edgeErr);
      console.log('Falling back to direct API call');
    }
    
    // Direct API call as fallback
    try {
      const response = await axios.post<TokenResponse>(tokenUrl, requestData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 10000 // 10 seconds timeout
      });
      
      // Check content type to make sure we got JSON
      const contentType = response.headers['content-type'];
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Received non-JSON response:', response.data);
        toast.error('API returned an invalid response format. Please check the API URL.');
        return null;
      }
      
      console.log('Token direct API response:', response.data);
      return handleTokenResponse(response.data, branchId);
    } catch (axiosError: any) {
      console.error('Direct API call failed:', axiosError.message);
      if (axiosError.response) {
        console.error('Response data:', axiosError.response.data);
        console.error('Response status:', axiosError.response.status);
        
        // Check if the response might be HTML
        if (typeof axiosError.response.data === 'string' && 
            axiosError.response.data.includes('<!DOCTYPE html>')) {
          toast.error('Received HTML instead of JSON from API. Check the API URL and credentials.');
        }
      }
      return null;
    }
  } catch (error: any) {
    console.error('Error in getHikvisionToken:', error);
    toast.error(`Error getting token: ${error.message}`);
    return null;
  }
};

/**
 * Process the token response and save it to the database
 */
async function handleTokenResponse(responseData: TokenResponse, branchId: string): Promise<string | null> {
  try {
    if ((responseData.code !== '0' && responseData.errorCode !== '0') || !responseData.data) {
      console.error('Error getting Hikvision token:', responseData);
      toast.error(`API error: ${responseData.msg || 'Unknown error'}`);
      return null;
    }
    
    const { accessToken, expireTime, areaDomain } = responseData.data;
    
    // Save the token to the database
    const { error: saveError } = await supabase
      .from(HIKVISION_TOKENS_TABLE)
      .upsert({
        branch_id: branchId,
        access_token: accessToken,
        expire_time: expireTime,
        area_domain: areaDomain,
        created_at: new Date().toISOString()
      }, {
        onConflict: 'branch_id'
      });
    
    if (saveError) {
      console.error('Error saving Hikvision token:', saveError);
    }
    
    return accessToken;
  } catch (error: any) {
    console.error('Error handling token response:', error);
    toast.error(`Error processing token: ${error.message}`);
    return null;
  }
}

/**
 * Check if the Hikvision token table exists, and create it if it doesn't
 */
export const ensureHikvisionTokenTable = async (): Promise<boolean> => {
  try {
    // Check if the table exists
    const { error: checkError } = await supabase
      .from('hikvision_tokens')
      .select('count(*)')
      .limit(1);
    
    if (checkError && checkError.code === '42P01') {
      // Table doesn't exist, create it
      const { error: createError } = await supabase.rpc('create_hikvision_token_table');
      
      if (createError) {
        console.error('Error creating hikvision_tokens table:', createError);
        return false;
      }
      
      return true;
    }
    
    return !checkError;
  } catch (error) {
    console.error('Error in ensureHikvisionTokenTable:', error);
    return false;
  }
};
