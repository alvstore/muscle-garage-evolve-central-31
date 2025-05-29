
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
  private tokenCache = new Map<string, { token: string; expiresAt: Date; areaDomain?: string }>();

  async getValidToken(branchId: string): Promise<string> {
    // Check cache first
    const cached = this.tokenCache.get(branchId);
    if (cached && cached.expiresAt > new Date()) {
      console.log('[TokenManager] Using cached token for branch:', branchId);
      return cached.token;
    }

    // Get token from edge function
    const tokenResponse = await this.refreshToken(branchId);
    return tokenResponse.token!;
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

      // Update cache
      this.tokenCache.set(branchId, {
        token: data.token,
        expiresAt: new Date(data.expiresAt),
        areaDomain: data.areaDomain
      });

      console.log('[TokenManager] Successfully refreshed token for branch:', branchId);
      return data;

    } catch (error) {
      console.error('[TokenManager] Error refreshing token:', error);
      throw error;
    }
  }

  async clearToken(branchId: string): Promise<void> {
    this.tokenCache.delete(branchId);
    
    // Also clear from database
    try {
      await supabase
        .from('hikvision_tokens')
        .delete()
        .eq('branch_id', branchId);
    } catch (error) {
      console.error('[TokenManager] Error clearing token from database:', error);
    }
  }

  async getAreaDomain(branchId: string): Promise<string | undefined> {
    const cached = this.tokenCache.get(branchId);
    if (cached) {
      return cached.areaDomain;
    }

    // Try to get from database
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
}

export const hikvisionTokenManager = new HikvisionTokenManager();
