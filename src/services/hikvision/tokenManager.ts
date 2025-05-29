
import { supabase } from '@/integrations/supabase/client';

interface TokenResponse {
  success: boolean;
  token?: string;
  expiresAt?: string;
  areaDomain?: string;
  availableSites?: any[];
  error?: string;
}

class HikvisionTokenManager {
  private requestQueue = new Map<string, Promise<string>>();

  async getValidToken(branchId: string): Promise<string> {
    try {
      // Check if there's already a token request in progress
      const existingRequest = this.requestQueue.get(branchId);
      if (existingRequest) {
        console.log('[TokenManager] Using existing request for branch:', branchId);
        return await existingRequest;
      }

      // Check for existing valid token in database
      const { data: tokenData } = await supabase
        .from('hikvision_tokens')
        .select('access_token, expire_time, area_domain')
        .eq('branch_id', branchId)
        .gte('expire_time', new Date().toISOString())
        .single();

      if (tokenData) {
        console.log('[TokenManager] Using existing valid token for branch:', branchId);
        return tokenData.access_token;
      }

      // Create new token request
      const tokenRequest = this.refreshToken(branchId, true);
      this.requestQueue.set(branchId, tokenRequest);

      try {
        const response = await tokenRequest;
        return response.token!;
      } finally {
        this.requestQueue.delete(branchId);
      }

    } catch (error) {
      console.error('[TokenManager] Error getting token:', error);
      this.requestQueue.delete(branchId);
      throw error;
    }
  }

  async refreshToken(branchId: string, forceRefresh = false): Promise<TokenResponse> {
    console.log('[TokenManager] Refreshing token for branch:', branchId);

    try {
      const { data, error } = await supabase.functions.invoke('hikvision-auth', {
        body: { branchId, forceRefresh }
      });

      if (error) {
        console.error('[TokenManager] Edge function error:', error);
        throw new Error(`Failed to get token: ${error.message}`);
      }

      if (!data.success) {
        console.error('[TokenManager] Token request failed:', data.error);
        throw new Error(data.error || 'Failed to authenticate with Hikvision');
      }

      console.log('[TokenManager] Successfully refreshed token for branch:', branchId);
      return data;

    } catch (error) {
      console.error('[TokenManager] Error refreshing token:', error);
      throw error;
    }
  }

  async clearToken(branchId: string): Promise<void> {
    try {
      await supabase
        .from('hikvision_tokens')
        .delete()
        .eq('branch_id', branchId);
      
      console.log('[TokenManager] Cleared token for branch:', branchId);
    } catch (error) {
      console.error('[TokenManager] Error clearing token:', error);
    }
  }

  async getAreaDomain(branchId: string): Promise<string | undefined> {
    try {
      const { data } = await supabase
        .from('hikvision_tokens')
        .select('area_domain')
        .eq('branch_id', branchId)
        .gte('expire_time', new Date().toISOString())
        .single();

      return data?.area_domain;
    } catch (error) {
      console.error('[TokenManager] Error getting area domain:', error);
      return undefined;
    }
  }

  async getTokenStatus(branchId: string): Promise<{
    hasToken: boolean;
    isValid: boolean;
    expiresAt?: string;
    expiresIn?: number;
  }> {
    try {
      const { data } = await supabase
        .from('hikvision_tokens')
        .select('expire_time')
        .eq('branch_id', branchId)
        .single();

      if (!data) {
        return { hasToken: false, isValid: false };
      }

      const expireTime = new Date(data.expire_time);
      const now = new Date();
      const expiresInMs = expireTime.getTime() - now.getTime();

      return {
        hasToken: true,
        isValid: expiresInMs > 0,
        expiresAt: data.expire_time,
        expiresIn: Math.floor(expiresInMs / 1000)
      };
    } catch (error) {
      console.error('[TokenManager] Error getting token status:', error);
      return { hasToken: false, isValid: false };
    }
  }

  async cleanupExpiredTokens(): Promise<void> {
    try {
      const { error } = await supabase
        .from('hikvision_tokens')
        .delete()
        .lt('expire_time', new Date().toISOString());

      if (error) {
        console.error('[TokenManager] Error cleaning up tokens:', error);
      } else {
        console.log('[TokenManager] Cleaned up expired tokens');
      }
    } catch (error) {
      console.error('[TokenManager] Error in cleanup:', error);
    }
  }
}

export const hikvisionTokenManager = new HikvisionTokenManager();
