
import { supabase } from '@/integrations/supabase/client';
import { getHikvisionErrorMessage } from '@/utils/hikvisionErrorCodes';

interface HikvisionTokenResponse {
  accessToken: string;
  expiresIn: number;
  tokenType: string;
  scope?: string;
  refreshToken?: string;
}

interface TokenCacheEntry {
  token: string;
  expiresAt: number;
  branchId: string;
}

class HikvisionTokenManager {
  private static instance: HikvisionTokenManager;
  private tokenCache = new Map<string, TokenCacheEntry>();

  static getInstance(): HikvisionTokenManager {
    if (!HikvisionTokenManager.instance) {
      HikvisionTokenManager.instance = new HikvisionTokenManager();
    }
    return HikvisionTokenManager.instance;
  }

  async getToken(branchId: string): Promise<string> {
    // Check cache first
    const cached = this.tokenCache.get(branchId);
    if (cached && cached.expiresAt > Date.now() + 300000) { // 5 min buffer
      return cached.token;
    }

    try {
      // Get settings from database
      const { data: settings, error } = await supabase
        .from('hikvision_api_settings')
        .select('*')
        .eq('branch_id', branchId)
        .eq('is_active', true)
        .single();

      if (error || !settings) {
        throw new Error(`Hikvision settings not found for branch: ${branchId}`);
      }

      // Request new token
      const tokenResponse = await this.requestToken(settings);
      
      // Cache the token
      this.tokenCache.set(branchId, {
        token: tokenResponse.accessToken,
        expiresAt: Date.now() + (tokenResponse.expiresIn * 1000) - 300000, // 5 min buffer
        branchId
      });

      // Store in database for persistence
      await this.storeTokenInDB(branchId, tokenResponse);

      return tokenResponse.accessToken;
    } catch (error) {
      console.error('Error getting Hikvision token:', error);
      throw error;
    }
  }

  private async requestToken(settings: any): Promise<HikvisionTokenResponse> {
    const { data, error } = await supabase.functions.invoke('hikvision-auth', {
      body: {
        apiUrl: settings.api_url,
        appKey: settings.app_key,
        appSecret: settings.app_secret
      }
    });

    if (error) {
      throw new Error(`Token request failed: ${error.message}`);
    }

    if (!data.success) {
      const errorMsg = data.errorCode ? 
        getHikvisionErrorMessage(data.errorCode) : 
        data.error || 'Unknown error';
      throw new Error(`Hikvision API error: ${errorMsg}`);
    }

    return data.token;
  }

  private async storeTokenInDB(branchId: string, tokenData: HikvisionTokenResponse): Promise<void> {
    const expiresAt = new Date(Date.now() + (tokenData.expiresIn * 1000));
    
    await supabase
      .from('hikvision_tokens')
      .upsert({
        branch_id: branchId,
        access_token: tokenData.accessToken,
        expires_in: tokenData.expiresIn,
        expire_time: expiresAt.toISOString(),
        token_type: tokenData.tokenType,
        scope: tokenData.scope,
        refresh_token: tokenData.refreshToken,
        updated_at: new Date().toISOString()
      });
  }

  clearCache(branchId?: string): void {
    if (branchId) {
      this.tokenCache.delete(branchId);
    } else {
      this.tokenCache.clear();
    }
  }

  async refreshToken(branchId: string): Promise<string> {
    this.clearCache(branchId);
    return this.getToken(branchId);
  }
}

export const hikvisionTokenManager = HikvisionTokenManager.getInstance();
