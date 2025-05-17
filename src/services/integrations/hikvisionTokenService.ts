import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface HikvisionTokenResponse {
  accessToken: string;
  expiresIn: number;
  tokenType: string;
}

const tokenCache: Record<string, { token: string; expiresAt: number }> = {};

/**
 * Get an access token for the Hikvision API
 * @param branchId The ID of the branch to get the token for
 * @returns A promise that resolves to the access token
 */
export const getHikvisionToken = async (branchId: string): Promise<string> => {
  try {
    // Check if we have a valid cached token
    const cachedToken = tokenCache[branchId];
    if (cachedToken && cachedToken.expiresAt > Date.now()) {
      return cachedToken.token;
    }

    // Get Hikvision settings from the database
    const { data: settings, error } = await supabase
      .from('branch_integrations')
      .select('config')
      .eq('branch_id', branchId)
      .eq('provider', 'hikvision')
      .single();

    if (error || !settings) {
      throw new Error('Hikvision integration not configured for this branch');
    }

    const { baseUrl, username, password } = settings.config as {
      baseUrl: string;
      username: string;
      password: string;
    };

    // Make a request to the Hikvision API to get an access token
    const response = await fetch(`${baseUrl}/api/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'password',
        username,
        password,
        client_id: 'hikvision',
        client_secret: 'hikvision_secret',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get Hikvision token');
    }

    const data: HikvisionTokenResponse = await response.json();

    // Cache the token with an expiration time (5 minutes before actual expiration)
    tokenCache[branchId] = {
      token: data.accessToken,
      expiresAt: Date.now() + (data.expiresIn - 300) * 1000, // Convert to milliseconds
    };

    return data.accessToken;
  } catch (error) {
    console.error('Error getting Hikvision token:', error);
    toast.error('Failed to authenticate with Hikvision');
    throw error;
  }
};

/**
 * Clear the cached token for a branch
 * @param branchId The ID of the branch to clear the token for
 */
export const clearHikvisionToken = (branchId: string): void => {
  delete tokenCache[branchId];
};
