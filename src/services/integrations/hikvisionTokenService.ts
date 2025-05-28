
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Type definitions for Hikvision integration
export interface HikvisionSite {
  id: string;
  name: string;
  description?: string;
  status?: 'success' | 'failed' | 'in_progress' | 'not_started';
  lastSync?: string;
  deviceCount?: number;
  syncStatus?: 'success' | 'failed' | 'in_progress' | 'not_started';
  errorMessage?: string;
  devices?: HikvisionDevice[];
}

export interface HikvisionDevice {
  id: string;
  name: string;
  ipAddress: string;
  port?: number;
  model?: string;
  serialNumber?: string;
  status?: 'online' | 'offline' | 'unknown';
  lastSeen?: string;
  type?: 'nvr' | 'ipc' | 'dvr' | 'other';
  capabilities?: string[];
  additionalInfo?: Record<string, unknown>;
}

interface HikvisionTokenResponse {
  accessToken: string;
  expiresIn: number;
  tokenType: string;
  refreshToken?: string;
  scope?: string;
  areaDomain?: string;
}

export interface TokenData {
  id?: string;
  branch_id: string;
  access_token: string;
  expire_time: string;
  refresh_token?: string | null;
  token_type?: string | null;
  scope?: string | null;
  area_domain?: string | null;
  expires_in?: number | null;
  available_sites?: any[] | null;
  created_at?: string;
  updated_at?: string | null;
}

/**
 * Enhanced Hikvision Token Service that stores tokens in the database
 * instead of just memory cache
 */
class HikvisionTokenManager {
  /**
   * Ensures the hikvision_tokens table exists with the correct schema
   */
  private async ensureDatabaseSchema(): Promise<void> {
    try {
      console.log('Verifying database schema...');
      
      // Check if table exists
      const { data: tableExists, error: checkError } = await supabase.rpc('table_exists', { 
        table_name: 'hikvision_tokens' 
      }).single();
      
      if (checkError || !tableExists) {
        console.log('Creating hikvision_tokens table...');
        
        // Create the table using a raw SQL query
        const { error: createError } = await supabase.rpc('exec_sql', {
          sql: `
            CREATE TABLE IF NOT EXISTS public.hikvision_tokens (
              id UUID NOT NULL DEFAULT gen_random_uuid(),
              branch_id UUID NOT NULL,
              access_token TEXT NOT NULL,
              expire_time TIMESTAMPTZ NOT NULL,
              area_domain TEXT NULL,
              created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
              refresh_token TEXT NULL,
              token_type TEXT NULL,
              expires_in BIGINT NULL,
              scope TEXT NULL,
              updated_at TIMESTAMPTZ NULL DEFAULT NOW(),
              available_sites JSONB NULL DEFAULT '[]'::JSONB,
              CONSTRAINT hikvision_tokens_pkey PRIMARY KEY (id),
              CONSTRAINT hikvision_tokens_branch_id_key UNIQUE (branch_id)
            );
            
            CREATE INDEX IF NOT EXISTS idx_hikvision_tokens_branch_id 
              ON public.hikvision_tokens USING BTREE (branch_id);
              
            CREATE INDEX IF NOT EXISTS idx_hikvision_tokens_expire_time 
              ON public.hikvision_tokens USING BTREE (expire_time);
              
            CREATE INDEX IF NOT EXISTS idx_hikvision_tokens_access_token 
              ON public.hikvision_tokens USING BTREE (access_token);
              
            CREATE INDEX IF NOT EXISTS idx_hikvision_tokens_refresh_token 
              ON public.hikvision_tokens USING BTREE (refresh_token);
              
            CREATE INDEX IF NOT EXISTS idx_hikvision_tokens_branch_expire 
              ON public.hikvision_tokens USING BTREE (branch_id, expire_time);
              
            CREATE INDEX IF NOT EXISTS idx_hikvision_tokens_branch_access 
              ON public.hikvision_tokens USING BTREE (branch_id, access_token);
              
            CREATE INDEX IF NOT EXISTS idx_hikvision_tokens_branch_refresh 
              ON public.hikvision_tokens USING BTREE (branch_id, refresh_token);
              
            CREATE INDEX IF NOT EXISTS idx_hikvision_tokens_available_sites 
              ON public.hikvision_tokens USING GIN (available_sites);
              
            CREATE INDEX IF NOT EXISTS idx_hikvision_tokens_updated_at 
              ON public.hikvision_tokens USING BTREE (updated_at);
              
            CREATE OR REPLACE FUNCTION update_updated_at_column()
            RETURNS TRIGGER AS $$
            BEGIN
              NEW.updated_at = NOW();
              RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
            
            DROP TRIGGER IF EXISTS update_hikvision_tokens_updated_at ON hikvision_tokens;
            CREATE TRIGGER update_hikvision_tokens_updated_at
            BEFORE UPDATE ON hikvision_tokens
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
          `
        });
        
        if (createError) {
          console.error('Error creating table:', createError);
          throw new Error(`Failed to create hikvision_tokens table: ${createError.message}`);
        }
        
        console.log('Successfully created hikvision_tokens table');
      } else {
        console.log('hikvision_tokens table exists');
      }
    } catch (error) {
      console.error('Error ensuring database schema:', error);
      // Don't crash the app, just log the error
    }
  }
  private requestQueue: Map<string, Promise<string>> = new Map();

  /**
   * Get a valid access token for the Hikvision API
   * @param branchId The ID of the branch to get the token for
   * @returns A promise that resolves to the access token
   */
  async getToken(branchId: string): Promise<string> {
    try {
      // First, ensure the database schema is set up correctly
      await this.ensureDatabaseSchema();
      
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
  /**
   * Get a valid token using the Edge Function
   */
  private async getValidTokenFromDB(branchId: string): Promise<TokenData | null> {
    console.log('Fetching token via Edge Function for branch:', branchId);
    
    try {
      const { data, error } = await supabase.functions.invoke('hikvision-proxy', {
        body: { 
          action: 'getToken',
          branchId
        }
      });

      if (error) {
        console.error('Error fetching token from Edge Function:', error);
        return null;
      }

      if (!data?.success) {
        console.error('Failed to get token:', data?.error);
        return null;
      }

      return data.data as TokenData;
    } catch (error) {
      console.error('Error in getValidTokenFromDB:', error);
      return null;
    }
  }

  /**
   * Request a new token from the Hikvision API and store it in the database
   */
  /**
   * Request a new token using the Edge Function
   */
  private async requestNewToken(branchId: string): Promise<string> {
    console.log('Requesting new token via Edge Function for branch:', branchId);
    
    try {
      const { data, error } = await supabase.functions.invoke('hikvision-proxy', {
        body: { 
          action: 'getToken',
          branchId,
          forceNew: true // Force new token generation
        }
      });

      if (error) {
        console.error('Error requesting new token:', error);
        throw new Error('Failed to get new token');
      }

      if (!data?.success) {
        console.error('Failed to get new token:', data?.error);
        throw new Error(data?.error || 'Failed to get new token');
      }

      if (!data.data?.access_token) {
        throw new Error('No access token received from Hikvision API');
      }

      // Log the token data before storage
      console.log('Preparing token data for storage:', {
        branchId,
        accessTokenLength: data.data.access_token?.length,
        hasRefreshToken: !!data.data.refresh_token,
        areaDomain: data.data.area_domain,
        expiresIn: data.data.expires_in
      });

      // Prepare token data for storage
      const tokenData: TokenData = {
        branch_id: branchId,
        access_token: data.data.access_token,
        expire_time: data.data.expire_time || new Date(Date.now() + (data.data.expires_in || 3600) * 1000).toISOString(),
        refresh_token: data.data.refresh_token || null,
        token_type: data.data.token_type || 'Bearer',
        scope: data.data.scope || null,
        area_domain: data.data.area_domain || null,
        expires_in: data.data.expires_in || null,
        available_sites: data.data.available_sites || []
      };
      
      console.log('Token data prepared for storage:', JSON.stringify({
        ...tokenData,
        access_token: tokenData.access_token ? '***REDACTED***' : 'MISSING',
        refresh_token: tokenData.refresh_token ? '***REDACTED***' : 'MISSING'
      }, null, 2));

      console.log('Storing token in database...');
      await this.storeTokenInDB(branchId, tokenData);
      
      // Verify the token was stored
      const { data: storedToken } = await supabase
        .from('hikvision_tokens')
        .select('id, expire_time')
        .eq('branch_id', branchId)
        .single();

      if (!storedToken) {
        console.warn('Token storage verification failed - no token found after insert');
      } else {
        console.log('Token storage verified:', {
          tokenId: storedToken.id,
          expiresAt: storedToken.expire_time
        });
      }

      return tokenData.access_token;
    } catch (error) {
      console.error('Error requesting new token:', error);
      toast.error('Failed to authenticate with Hikvision API');
      throw error;
    }
  }

  /**
   * Stores a token in the database with proper error handling and logging
   * @param branchId The branch ID to store the token for
   * @param tokenData The token data to store
   */
  private async storeTokenInDB(branchId: string, tokenData: TokenData): Promise<void> {
    const startTime = Date.now();
    const logPrefix = `[storeTokenInDB:${branchId}]`;
    
    try {
      console.log(`${logPrefix} Starting token storage process`);
      
      // Validate input
      if (!branchId) {
        throw new Error('Branch ID is required');
      }
      
      if (!tokenData?.access_token) {
        throw new Error('Access token is required');
      }
      
      // Ensure the database schema is up to date
      await this.ensureDatabaseSchema();
      
      // Prepare token data with all required fields
      const now = new Date().toISOString();
      const tokenRecord = {
        branch_id: branchId,
        access_token: tokenData.access_token,
        expire_time: tokenData.expire_time || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        refresh_token: tokenData.refresh_token || null,
        token_type: tokenData.token_type || 'Bearer',
        expires_in: tokenData.expires_in || 604800, // 7 days in seconds
        scope: tokenData.scope || null,
        area_domain: tokenData.area_domain || null,
        available_sites: tokenData.available_sites || [],
        created_at: now,
        updated_at: now
      };

      console.log(`${logPrefix} Prepared token record`, {
        tokenLength: tokenRecord.access_token?.length,
        expiresAt: tokenRecord.expire_time,
        hasRefreshToken: !!tokenRecord.refresh_token,
        hasAreaDomain: !!tokenRecord.area_domain,
        availableSites: tokenRecord.available_sites?.length || 0
      });

      // Start a transaction to ensure data consistency
      const { data: transactionData, error: transactionError } = await supabase.rpc('with_transaction', {
        sql: `
          -- Delete any existing tokens for this branch
          DELETE FROM hikvision_tokens 
          WHERE branch_id = '${branchId.replace(/'/g, "''")}';
          
          -- Insert the new token
          INSERT INTO hikvision_tokens (
            branch_id, 
            access_token, 
            expire_time, 
            refresh_token, 
            token_type, 
            expires_in, 
            scope, 
            area_domain, 
            available_sites,
            created_at, 
            updated_at
          ) VALUES (
            '${branchId.replace(/'/g, "''")}', 
            '${tokenRecord.access_token.replace(/'/g, "''")}', 
            '${tokenRecord.expire_time}', 
            ${tokenRecord.refresh_token ? `'${tokenRecord.refresh_token.replace(/'/g, "''")}'` : 'NULL'}, 
            '${tokenRecord.token_type}', 
            ${tokenRecord.expires_in}, 
            ${tokenRecord.scope ? `'${tokenRecord.scope.replace(/'/g, "''")}'` : 'NULL'}, 
            ${tokenRecord.area_domain ? `'${tokenRecord.area_domain.replace(/'/g, "''")}'` : 'NULL'}, 
            '${JSON.stringify(tokenRecord.available_sites || [])}',
            '${tokenRecord.created_at}', 
            '${tokenRecord.updated_at}'
          )
          RETURNING id, created_at, expire_time;
        `
      });

      if (transactionError) {
        console.error(`${logPrefix} Database transaction failed:`, transactionError);
        throw new Error(`Database operation failed: ${transactionError.message}`);
      }

      // Verify the token was inserted
      const insertedToken = Array.isArray(transactionData) ? transactionData[0] : transactionData;
      if (!insertedToken?.id) {
        throw new Error('Failed to verify token insertion: No ID returned from database');
      }

      console.log(`${logPrefix} Token successfully stored in database`, {
        tokenId: insertedToken.id,
        expiresAt: insertedToken.expire_time,
        duration: `${Date.now() - startTime}ms`
      });

    } catch (error) {
      console.error(`${logPrefix} Error storing token:`, {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        branchId,
        tokenData: tokenData ? {
          accessTokenLength: tokenData.access_token?.length,
          hasRefreshToken: !!tokenData.refresh_token,
          hasAreaDomain: !!tokenData.area_domain,
          expiresIn: tokenData.expires_in
        } : 'No token data',
        duration: `${Date.now() - startTime}ms`
      });
      
      // Re-throw with more context
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to store token in database: ${errorMessage}`);
    }
  }

  /**
   * Gets the available sites for a branch
   * @param branchId The branch ID
   * @param forceRefresh Force refresh from API
   * @returns Array of available sites
   */
  async getAvailableSites(branchId: string, forceRefresh = false): Promise<HikvisionSite[]> {
    try {
      // Get token to ensure we have the latest available_sites
      const token = await this.getToken(branchId);
      if (!token) {
        throw new Error('No valid token available');
      }

      // Get the latest token data with sites
      const { data: tokenData, error } = await supabase
        .from('hikvision_tokens')
        .select('available_sites')
        .eq('branch_id', branchId)
        .single();

      if (error || !tokenData) {
        throw error || new Error('Failed to fetch token data');
      }

      return tokenData.available_sites || [];
    } catch (error) {
      console.error('Error getting available sites:', error);
      return [];
    }
  }

  /**
   * Syncs devices for a specific site
   * @param branchId The branch ID
   * @param siteId The site ID to sync devices for
   */
  async syncSiteDevices(branchId: string, siteId: string): Promise<void> {
    try {
      const token = await this.getToken(branchId);
      if (!token) {
        throw new Error('No valid token available');
      }

      // Update site status
      await this.updateSiteStatus(branchId, siteId, 'in_progress');

      // Call Hikvision API to get devices
      // This would be implemented based on Hikvision's device discovery API
      const devices = await this.fetchDevicesFromHikvision(token, siteId);
      
      // Update site with devices
      await this.updateSiteDevices(branchId, siteId, devices);
      
      // Update site status
      await this.updateSiteStatus(branchId, siteId, 'success');
    } catch (error) {
      console.error(`Error syncing devices for site ${siteId}:`, error);
      await this.updateSiteStatus(
        branchId, 
        siteId, 
        'failed', 
        error instanceof Error ? error.message : 'Unknown error'
      );
      throw error;
    }
  }

  private async fetchDevicesFromHikvision(token: string, siteId: string): Promise<HikvisionDevice[]> {
    try {
      // This is a placeholder implementation - replace with actual Hikvision API call
      // Example:
      // const response = await fetch(`${this.apiBaseUrl}/api/resource/v2/sites/${siteId}/devices`, {
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //     'Content-Type': 'application/json'
      //   }
      // });
      // if (!response.ok) throw new Error(`Failed to fetch devices: ${response.statusText}`);
      // return await response.json();
      
      // For now, return empty array
      return [];
    } catch (error) {
      console.error(`Error fetching devices for site ${siteId}:`, error);
      throw new Error(`Failed to fetch devices: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async updateSiteStatus(
    branchId: string, 
    siteId: string, 
    status: 'success' | 'failed' | 'in_progress',
    errorMessage?: string
  ): Promise<void> {
    if (!branchId || !siteId) {
      throw new Error('Branch ID and Site ID are required');
    }
    
    const now = new Date().toISOString();
    
    try {
      const { data: tokenData } = await supabase
        .from('hikvision_tokens')
        .select('available_sites')
        .eq('branch_id', branchId)
        .single();

      if (!tokenData) return;

      const sites: HikvisionSite[] = tokenData.available_sites || [];
      const siteIndex = sites.findIndex(s => s.id === siteId);
      
      if (siteIndex >= 0) {
        const updatedSite: HikvisionSite = {
          ...sites[siteIndex],
          status,
          lastSync: now,
          syncStatus: status,
          ...(errorMessage && { errorMessage })
        };

        await supabase
          .from('hikvision_tokens')
          .update({ 
            available_sites: sites.map((s, i) => i === siteIndex ? updatedSite : s),
            updated_at: now
          })
          .eq('branch_id', branchId);
      }
    } catch (error) {
      console.error('Error updating site status:', error);
      throw error;
    }
  }

  private async updateSiteDevices(
    branchId: string,
    siteId: string,
    devices: HikvisionDevice[]
  ): Promise<void> {
    if (!branchId || !siteId) {
      throw new Error('Branch ID and Site ID are required');
    }
    
    const now = new Date().toISOString();
    
    try {
      const { data: tokenData } = await supabase
        .from('hikvision_tokens')
        .select('available_sites')
        .eq('branch_id', branchId)
        .single();

      if (!tokenData) return;

      const sites: HikvisionSite[] = tokenData.available_sites || [];
      const siteIndex = sites.findIndex(s => s.id === siteId);
      
      if (siteIndex >= 0) {
        sites[siteIndex] = {
          ...sites[siteIndex],
          devices,
          deviceCount: devices.length,
          status: 'success',
          lastSync: now,
          syncStatus: 'success'
        };

        await supabase
          .from('hikvision_tokens')
          .update({ 
            available_sites: sites,
            updated_at: now
          })
          .eq('branch_id', branchId);
      }
    } catch (error) {
      console.error(`Error updating devices for site ${siteId}:`, error);
      throw error;
    }
    try {
      const { data: tokenData } = await supabase
        .from('hikvision_tokens')
        .select('available_sites')
        .eq('branch_id', branchId)
        .single();

      if (!tokenData) return;

      const sites: HikvisionSite[] = tokenData.available_sites || [];
      const siteIndex = sites.findIndex(s => s.id === siteId);
      
      if (siteIndex !== -1) {
        const updatedSite: HikvisionSite = {
          ...sites[siteIndex],
          devices,
          lastSync: new Date().toISOString(),
          syncStatus: 'success'
        };

        await supabase
          .from('hikvision_tokens')
          .update({ 
            available_sites: sites.map((s, i) => i === siteIndex ? updatedSite : s),
            updated_at: new Date().toISOString()
          })
          .eq('branch_id', branchId);
      }
    } catch (error) {
      console.error('Error updating site devices:', error);
      throw error;
    }
  }

  /**
   * Verifies the token storage and database connection
   * @param branchId The branch ID to verify
   * @returns Object with verification results
   */
  async verifyTokenStorage(branchId: string): Promise<{
    databaseConnection: boolean;
    tableExists: boolean;
    hasValidToken: boolean;
    tokenExpiry?: string;
    error?: string;
  }> {
    try {
      console.log('Verifying token storage...');
      
      // 1. Check database connection
      const { data: connectionCheck, error: connError } = await supabase
        .rpc('version')
        .single()
        .then(() => ({ data: true, error: null }))
        .catch((err) => ({ data: false, error: err }));
      
      if (connError || !connectionCheck) {
        return {
          databaseConnection: false,
          tableExists: false,
          hasValidToken: false,
          error: 'Database connection failed: ' + (connError?.message || 'Unknown error')
        };
      }
      
      // 2. Check if table exists
      const { data: tableExists, error: tableError } = await supabase
        .rpc('table_exists', { table_name: 'hikvision_tokens' })
        .single()
        .then(({ data, error }) => ({
          data: data as boolean,
          error: error as Error | null
        }));
      
      if (tableError) {
        return {
          databaseConnection: true,
          tableExists: false,
          hasValidToken: false,
          error: 'Table check failed: ' + tableError.message
        };
      }
      
      if (!tableExists) {
        return {
          databaseConnection: true,
          tableExists: false,
          hasValidToken: false,
          error: 'Table hikvision_tokens does not exist'
        };
      }
      
      // 3. Check for valid token
      const token = await this.getValidTokenFromDB(branchId);
      
      return {
        databaseConnection: true,
        tableExists: true,
        hasValidToken: !!token,
        tokenExpiry: token?.expire_time
      };
      
    } catch (error) {
      console.error('Error verifying token storage:', error);
      return {
        databaseConnection: false,
        tableExists: false,
        hasValidToken: false,
        error: error instanceof Error ? error.message : 'Unknown error during verification',
      };
    }
  }

  async refreshToken(branchId: string): Promise<string> {
    console.log('Refreshing token for branch:', branchId);
    await this.clearToken(branchId);
    return await this.getToken(branchId);
  }

  /**
   * Clean up expired tokens from the database
   */
  /**
   * Clean up expired tokens using the Edge Function
   */
  async cleanupExpiredTokens(): Promise<void> {
    try {
      console.log('Requesting token cleanup via Edge Function');
      
      const { data, error } = await supabase.functions.invoke('hikvision-proxy', {
        body: { 
          action: 'cleanupTokens',
          timestamp: new Date().toISOString()
        }
      });

      if (error) {
        console.error('Error cleaning up tokens:', error);
        return;
      }

      if (data?.cleanedUpCount > 0) {
        console.log(`Cleaned up ${data.cleanedUpCount} expired tokens`);
      }
    } catch (error) {
      console.error('Error in cleanupExpiredTokens:', error);
    }
  }

  /**
   * Get token status for a branch
   * @param branchId The branch ID to check
   * @returns Token status information
   */
  /**
   * Get token status using the Edge Function
   */
  async getTokenStatus(branchId: string): Promise<{
    hasToken: boolean;
    isValid: boolean;
    expiresAt?: string;
    expiresIn?: number;
  }> {
    try {
      const token = await this.getValidTokenFromDB(branchId);

      if (!token) {
        return {
          hasToken: false,
          isValid: false,
        };
      }

      const expireTime = new Date(token.expire_time);
      const now = new Date();
      const expiresInMs = expireTime.getTime() - now.getTime();

      return {
        hasToken: true,
        isValid: expiresInMs > 0,
        expiresAt: token.expire_time,
        expiresIn: Math.floor(expiresInMs / 1000), // Convert to seconds
      };
    } catch (error) {
      console.error('Error getting token status:', error);
      return {
        hasToken: false,
        isValid: false,
      };
    }
  }

  /**
   * Clear the token for a specific branch
   * @param branchId The branch ID to clear the token for
   */
  /**
   * Clear token for a specific branch using the Edge Function
   */
  async clearToken(branchId: string): Promise<void> {
    try {
      console.log(`Requesting token clearance via Edge Function for branch: ${branchId}`);
      
      const { error } = await supabase.functions.invoke('hikvision-proxy', {
        body: { 
          action: 'clearToken',
          branchId
        }
      });

      if (error) {
        console.error('Error clearing token:', error);
        throw error;
      }
      
      console.log(`Successfully cleared token for branch ${branchId}`);
    } catch (error) {
      console.error('Error in clearToken:', error);
      throw error;
    }
  }

  // ... (rest of the class remains the same)
}

// Export singleton instance
export const hikvisionTokenManager = new HikvisionTokenManager();

// TokenData is already exported in the interface definition above

/**
 * Legacy function for backward compatibility
 * @deprecated Use hikvisionTokenManager.getToken() instead
 */
export async function getHikvisionToken(branchId: string): Promise<string> {
  return hikvisionTokenManager.getToken(branchId);
}

/**
 * Legacy function for backward compatibility
 * @deprecated Use hikvisionTokenManager.clearToken() instead
 */
export function clearHikvisionToken(branchId: string): void {
  hikvisionTokenManager.clearToken(branchId).catch(console.error);
}

/**
 * Verify the token storage and database connection
 * @param branchId The branch ID to verify
 * @returns Verification results
 */
export async function verifyHikvisionTokenStorage(branchId: string) {
  return hikvisionTokenManager.verifyTokenStorage(branchId);
};
