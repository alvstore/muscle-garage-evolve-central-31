
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface HikvisionTokenResponse {
  accessToken: string;
  expiresIn: number;
  tokenType: string;
  refreshToken?: string;
  scope?: string;
  areaDomain?: string;
}

interface TokenData {
  access_token: string;
  expire_time: string;
  refresh_token?: string;
  token_type?: string;
  scope?: string;
  area_domain?: string;
  expires_in?: number;
}

/**
 * Enhanced Hikvision Token Service that stores tokens in the database
 * instead of just memory cache
 */
class HikvisionTokenManager {
  private requestQueue: Map<string, Promise<string>> = new Map();

  /**
   * Get a valid access token for the Hikvision API
   * @param branchId The ID of the branch to get the token for
   * @returns A promise that resolves to the access token
   */
  async getToken(branchId: string): Promise<string> {
    try {
      // Check if there's already a token request in progress for this branch
      const existingRequest = this.requestQueue.get(branchId);
      if (existingRequest) {
        console.log('Token request already in progress for branch:', branchId);
        return await existingRequest;
      }

      // Check for existing valid token in database
      const existingToken = await this.getValidTokenFromDB(branchId);
      if (existingToken) {
        console.log('Using existing valid token from database');
        return existingToken.access_token;
      }

      // Create new token request
      const tokenRequest = this.requestNewToken(branchId);
      this.requestQueue.set(branchId, tokenRequest);

      try {
        const token = await tokenRequest;
        return token;
      } finally {
        // Remove from queue when done
        this.requestQueue.delete(branchId);
      }
    } catch (error) {
      console.error('Error getting Hikvision token:', error);
      this.requestQueue.delete(branchId);
      throw error;
    }
  }

  /**
   * Get a valid token from the database
   */
  private async getValidTokenFromDB(branchId: string): Promise<TokenData | null> {
    try {
      const { data: tokens, error } = await supabase
        .from('hikvision_tokens')
        .select('*')
        .eq('branch_id', branchId)
        .gt('expire_time', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error fetching token from database:', error);
        return null;
      }

      return tokens && tokens.length > 0 ? tokens[0] : null;
    } catch (error) {
      console.error('Error checking database for valid token:', error);
      return null;
    }
  }

  /**
   * Request a new token from the Hikvision API and store it in the database
   */
  private async requestNewToken(branchId: string): Promise<string> {
    try {
      console.log('Requesting new token for branch:', branchId);

      // Get Hikvision settings from the database
      const { data: settings, error: settingsError } = await supabase
        .from('hikvision_api_settings')
        .select('*')
        .eq('branch_id', branchId)
        .eq('is_active', true)
        .single();

      if (settingsError || !settings) {
        const errorMsg = 'Hikvision integration not configured for this branch';
        console.error(errorMsg, settingsError);
        throw new Error(errorMsg);
      }

      const { api_url: baseUrl, app_key: appKey, app_secret: appSecret } = settings;

      if (!appKey || !appSecret) {
        throw new Error('Missing Hikvision API credentials');
      }

      // Make request to Hikvision API
      const tokenUrl = baseUrl.endsWith('/') 
        ? `${baseUrl}api/hpcgw/v1/token/get` 
        : `${baseUrl}/api/hpcgw/v1/token/get`;

      console.log('Making token request to:', tokenUrl);

      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          appKey,
          secretKey: appSecret
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Token request failed:', response.status, errorText);
        throw new Error(`Token request failed: ${response.status} ${response.statusText}`);
      }

      const data: HikvisionTokenResponse = await response.json();
      console.log('Token response received:', { 
        hasAccessToken: !!data.accessToken, 
        expiresIn: data.expiresIn,
        tokenType: data.tokenType 
      });

      if (!data.accessToken) {
        throw new Error('No access token received from Hikvision API');
      }

      // Calculate expiration time (subtract 5 minutes for safety)
      const expiresInMs = (data.expiresIn - 300) * 1000;
      const expireTime = new Date(Date.now() + expiresInMs).toISOString();

      // Store token in database
      await this.storeTokenInDB(branchId, {
        access_token: data.accessToken,
        expire_time: expireTime,
        refresh_token: data.refreshToken,
        token_type: data.tokenType || 'Bearer',
        scope: data.scope,
        area_domain: data.areaDomain,
        expires_in: data.expiresIn
      });

      console.log('Token stored successfully, expires at:', expireTime);
      return data.accessToken;

    } catch (error) {
      console.error('Error requesting new token:', error);
      toast.error('Failed to authenticate with Hikvision API');
      throw error;
    }
  }

  /**
   * Store token in the database
   */
  private async storeTokenInDB(branchId: string, tokenData: TokenData): Promise<void> {
    try {
      // First, invalidate any existing tokens for this branch
      await supabase
        .from('hikvision_tokens')
        .delete()
        .eq('branch_id', branchId);

      // Insert new token
      const { error } = await supabase
        .from('hikvision_tokens')
        .insert({
          branch_id: branchId,
          access_token: tokenData.access_token,
          expire_time: tokenData.expire_time,
          refresh_token: tokenData.refresh_token,
          token_type: tokenData.token_type,
          scope: tokenData.scope,
          area_domain: tokenData.area_domain,
          expires_in: tokenData.expires_in,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error storing token in database:', error);
        throw new Error('Failed to store token in database');
      }
    } catch (error) {
      console.error('Error in storeTokenInDB:', error);
      throw error;
    }
  }

  /**
   * Clear token for a specific branch (force refresh)
   */
  async clearToken(branchId: string): Promise<void> {
    try {
      console.log('Clearing token for branch:', branchId);
      
      // Remove from request queue
      this.requestQueue.delete(branchId);

      // Remove from database
      const { error } = await supabase
        .from('hikvision_tokens')
        .delete()
        .eq('branch_id', branchId);

      if (error) {
        console.error('Error clearing token from database:', error);
      }
    } catch (error) {
      console.error('Error clearing token:', error);
    }
  }

  /**
   * Refresh token for a specific branch
   */
  async refreshToken(branchId: string): Promise<string> {
    console.log('Refreshing token for branch:', branchId);
    await this.clearToken(branchId);
    return await this.getToken(branchId);
  }

  /**
   * Clean up expired tokens from the database
   * This should be called periodically (e.g., daily via cron job)
   */
  async cleanupExpiredTokens(): Promise<void> {
    try {
      console.log('Cleaning up expired tokens...');
      
      const { data, error } = await supabase
        .from('hikvision_tokens')
        .delete()
        .lt('expire_time', new Date().toISOString())
        .select('branch_id');

      if (error) {
        console.error('Error cleaning up expired tokens:', error);
        return;
      }

      if (data && data.length > 0) {
        console.log(`Cleaned up ${data.length} expired tokens for branches:`, 
          data.map(t => t.branch_id));
      } else {
        console.log('No expired tokens found to clean up');
      }
    } catch (error) {
      console.error('Error in cleanupExpiredTokens:', error);
    }
  }

  /**
   * Get token status for a branch
   */
  async getTokenStatus(branchId: string): Promise<{
    hasToken: boolean;
    isValid: boolean;
    expiresAt?: string;
    expiresIn?: number;
  }> {
    try {
      const tokenData = await this.getValidTokenFromDB(branchId);
      
      if (!tokenData) {
        return { hasToken: false, isValid: false };
      }

      const expiresAt = new Date(tokenData.expire_time);
      const now = new Date();
      const expiresIn = Math.floor((expiresAt.getTime() - now.getTime()) / 1000);

      return {
        hasToken: true,
        isValid: expiresIn > 0,
        expiresAt: tokenData.expire_time,
        expiresIn: Math.max(0, expiresIn)
      };
    } catch (error) {
      console.error('Error getting token status:', error);
      return { hasToken: false, isValid: false };
    }
  }
}

// Export singleton instance
export const hikvisionTokenManager = new HikvisionTokenManager();

/**
 * Legacy function for backward compatibility
 * @deprecated Use hikvisionTokenManager.getToken() instead
 */
export const getHikvisionToken = async (branchId: string): Promise<string> => {
  return hikvisionTokenManager.getToken(branchId);
};

/**
 * Legacy function for backward compatibility
 * @deprecated Use hikvisionTokenManager.clearToken() instead
 */
export const clearHikvisionToken = (branchId: string): void => {
  hikvisionTokenManager.clearToken(branchId);
};
