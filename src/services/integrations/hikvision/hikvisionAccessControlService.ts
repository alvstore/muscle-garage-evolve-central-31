import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import crypto from 'crypto';
import axios from 'axios';
import { HikvisionDevice } from '@/types/hikvision';

// Types for access control
export interface AccessZone {
  id: string;
  name: string;
  description?: string;
  branch_id: string;
}

export interface AccessDoor {
  id: string;
  door_name: string;
  door_number?: string;
  hikvision_door_id: string;
  zone_id: string;
  branch_id: string;
  device_id: string;
  is_active: boolean;
}

export interface MembershipAccessPermission {
  id: string;
  membership_id: string;
  zone_id: string;
  access_type: 'allowed' | 'denied' | 'scheduled';
  schedule_start_time?: string;
  schedule_end_time?: string;
  schedule_days?: string[];
}

export interface MemberAccessOverride {
  id: string;
  member_id: string;
  zone_id: string;
  access_type: 'allowed' | 'denied' | 'scheduled';
  reason?: string;
  valid_from: string;
  valid_until?: string;
  schedule_start_time?: string;
  schedule_end_time?: string;
  schedule_days?: string[];
}

export interface MemberAccessCredential {
  id: string;
  member_id: string;
  credential_type: 'card' | 'face' | 'fingerprint' | 'pin';
  credential_value: string;
  is_active: boolean;
  issued_at: string;
  expires_at?: string;
}

export interface HikvisionApiSettings {
  id: string;
  branch_id: string;
  api_url: string;
  app_key: string;
  app_secret: string;
  devices: HikvisionDevice[];
  is_active: boolean;
}

export interface AccessEvent {
  event_id: string;
  member_id?: string;
  door_id?: string;
  event_time: string;
  event_type: 'entry' | 'exit' | 'denied';
  credential_type?: string;
  credential_value?: string;
  hikvision_event_id?: string;
}

class HikvisionAccessControlService {
  // Cache for access tokens with improved structure
  private tokenCache: Map<string, { token: string, expires: number }> = new Map();
  private refreshQueue: Set<string> = new Set();
  private refreshThreshold = 24 * 60 * 60 * 1000; // 24 hours
  
  /**
   * Get API settings for a branch
   */
  async getApiSettings(branchId: string): Promise<HikvisionApiSettings | null> {
    try {
      const { data, error } = await supabase
        .from('hikvision_api_settings')
        .select('*')
        .eq('branch_id', branchId)
        .eq('is_active', true)
        .single();
        
      if (error || !data) {
        console.error('Error fetching Hikvision API settings:', error);
        return null;
      }
      
      return data as HikvisionApiSettings;
    } catch (error) {
      console.error('Error in getApiSettings:', error);
      return null;
    }
  }
  
  /**
   * Authenticate with Hikvision API
   */
  async authenticate(branchId: string): Promise<string | null> {
    try {
      // Check cache first
      const cacheKey = `branch_${branchId}`;
      const cachedToken = this.tokenCache.get(cacheKey);
      
      // Valid token that's not near expiry
      if (cachedToken && cachedToken.expires > Date.now() + this.refreshThreshold) {
        return cachedToken.token;
      }
      
      // Valid token but near expiry - return it but queue a background refresh
      if (cachedToken && cachedToken.expires > Date.now()) {
        if (!this.refreshQueue.has(cacheKey)) {
          this.refreshQueue.add(cacheKey);
          this.refreshTokenInBackground(branchId).finally(() => {
            this.refreshQueue.delete(cacheKey);
          });
        }
        return cachedToken.token;
      }
      
      // No valid token - get a new one
      return this.refreshToken(branchId);
    } catch (error) {
      console.error('Error in authenticate:', error);
      return null;
    }
  }
  
  /**
   * Refresh token in background without blocking the current request
   */
  private async refreshTokenInBackground(branchId: string): Promise<void> {
    try {
      await this.refreshToken(branchId);
      console.log(`Background token refresh completed for branch ${branchId}`);
    } catch (error) {
      console.error(`Background token refresh failed for branch ${branchId}:`, error);
    }
  }
  
  /**
   * Get a fresh token from the API
   */
  private async refreshToken(branchId: string): Promise<string | null> {
    try {
      const settings = await this.getApiSettings(branchId);
      if (!settings) {
        throw new Error('API settings not found for branch');
      }
      
      const timestamp = Math.floor(Date.now() / 1000);
      const nonce = crypto.randomBytes(16).toString('hex');
      
      // Create signature according to Hikvision Partner Pro OpenAPI
      const signString = `${settings.app_key}${timestamp}${nonce}`;
      const signature = crypto
        .createHmac('sha256', settings.app_secret)
        .update(signString)
        .digest('hex');
      
      console.log(`Refreshing token for branch ${branchId}`);
      
      const response = await axios.post(
        `${settings.api_url}/api/hpcgw/v1/token/get`,
        {
          appKey: settings.app_key,
          secretKey: settings.app_secret
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Ca-Key': settings.app_key,
            'X-Ca-Timestamp': timestamp.toString(),
            'X-Ca-Nonce': nonce,
            'X-Ca-Signature': signature,
            'X-Ca-Signature-Headers': 'X-Ca-Key,X-Ca-Timestamp,X-Ca-Nonce'
          },
          timeout: 10000 // 10 second timeout
        }
      );
      
      if (response.data && response.data.accessToken) {
        const token = response.data.accessToken;
        const expiresIn = response.data.expiresIn || 604800; // Default to 7 days if not specified
        
        const cacheKey = `branch_${branchId}`;
        // Store in cache with expiry time
        this.tokenCache.set(cacheKey, {
          token,
          expires: Date.now() + (expiresIn * 1000)
        });
        
        // Also store in database for persistence across restarts
        await supabase
          .from('hikvision_tokens')
          .upsert({
            branch_id: branchId,
            access_token: token,
            expire_time: Date.now() + (expiresIn * 1000),
            created_at: new Date().toISOString()
          }, {
            onConflict: 'branch_id'
          });
        
        console.log(`Successfully refreshed token for branch ${branchId}, expires in ${expiresIn} seconds`);
        return token;
      }
      
      throw new Error('Failed to obtain access token');
    } catch (error) {
      console.error('Error refreshing token:', error);
      
      // Clear token cache for this branch in case of authentication error
      const cacheKey = `branch_${branchId}`;
      this.tokenCache.delete(cacheKey);
      
      // Provide more detailed error message
      if (axios.isAxiosError(error)) {
        this.logAuthenticationError(error, branchId);
      }
      
      return null;
    }
  }
  
  /**
   * Log detailed authentication errors
   */
  private logAuthenticationError(error: any, branchId: string): void {
    const statusCode = error.response?.status;
    const responseData = error.response?.data;
    
    console.error(`Hikvision API authentication error: Status ${statusCode}`, responseData);
    
    // Log to database for monitoring
    supabase.from('hikvision_sync_log').insert({
      id: crypto.randomUUID(),
      branch_id: branchId,
      event_type: 'error',
      message: 'Authentication failed',
      details: `Status: ${statusCode}, Message: ${JSON.stringify(responseData)}`,
      status: 'error',
      created_at: new Date().toISOString()
    }).then(() => {}).catch(err => console.error('Error logging auth failure:', err));
  }
  
  /**
   * Make an authenticated API call to Hikvision
   */
  async apiCall(branchId: string, endpoint: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', data?: any): Promise<any> {
    const maxRetries = 3;
    let attempt = 0;
    let lastError: any = null;
    
    while (attempt < maxRetries) {
      try {
        const token = await this.authenticate(branchId);
        if (!token) {
          throw new Error('Failed to authenticate with Hikvision API');
        }
        
        const settings = await this.getApiSettings(branchId);
        if (!settings) {
          throw new Error('API settings not found');
        }
        
        const url = `${settings.api_url}${endpoint}`;
        
        console.log(`Making Hikvision API call: ${method} ${endpoint} (Attempt ${attempt + 1}/${maxRetries})`);
        
        const response = await axios({
          method,
          url,
          data,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          timeout: 30000 // 30 seconds timeout
        });
        
        // Log API response for debugging
        console.log(`Hikvision API ${method} ${endpoint} response:`, {
          status: response.status,
          success: response.data?.success || false,
          message: response.data?.message || null
        });
        
        // Handle common error codes
        if (response.data && response.data.code !== '0' && response.data.code !== 0) {
          const errorCode = response.data.code;
          const errorMessage = response.data.message || response.data.msg || 'Unknown API error';
          
          // Log the error for monitoring
          await this.logApiError(branchId, endpoint, method, errorCode, errorMessage, attempt);
          
          switch(errorCode) {
            case 'TOKEN_EXPIRED':
              // Clear token cache and retry
              if (attempt < maxRetries - 1) {
                console.log('Token expired, clearing cache and retrying...');
                this.tokenCache.delete(`branch_${branchId}`);
                attempt++;
                continue;
              }
              throw new Error(`Token expired: ${errorMessage}`);
              
            case 'PERSON_NOT_FOUND':
              throw new Error(`Member not found in Hikvision system: ${errorMessage}`);
              
            case 'DEVICE_OFFLINE':
              throw new Error(`Hikvision device is offline: ${errorMessage}`);
              
            default:
              throw new Error(`Hikvision API error (${errorCode}): ${errorMessage}`);
          }
        }
        
        return response.data;
      } catch (error) {
        lastError = error;
        attempt++;
        
        // Detailed error logging with context
        console.error(`Hikvision API error (${method} ${endpoint}) - Attempt ${attempt}/${maxRetries}:`, {
          branchId,
          errorType: error.name,
          message: error.message,
          status: error.response?.status,
          data: error.response?.data
        });
        
        // Determine if we should retry
        const shouldRetry = this.shouldRetryError(error, attempt, maxRetries);
        if (!shouldRetry) break;
        
        // Exponential backoff
        const delay = this.calculateBackoff(attempt);
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    // If we've exhausted all retries, throw the last error
    throw this.enhanceError(lastError, endpoint, method, branchId);
  }
  
  /**
   * Determine if an error should trigger a retry
   */
  private shouldRetryError(error: any, attempt: number, maxRetries: number): boolean {
    // Don't retry if we've reached the max
    if (attempt >= maxRetries) return false;
    
    // Always retry on network errors
    if (error.code === 'ECONNABORTED' || error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT') {
      return true;
    }
    
    // Retry on rate limits
    if (axios.isAxiosError(error) && error.response?.status === 429) {
      return true;
    }
    
    // Retry on authentication errors (might be fixed with a new token)
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return true;
    }
    
    // Retry on server errors
    if (axios.isAxiosError(error) && error.response?.status >= 500) {
      return true;
    }
    
    return false;
  }
  
  /**
   * Calculate backoff time for retries
   */
  private calculateBackoff(attempt: number): number {
    // Exponential backoff with jitter
    const baseDelay = 1000; // 1 second
    const maxDelay = 30000; // 30 seconds
    
    // Calculate exponential backoff: 2^attempt * baseDelay
    const expBackoff = Math.min(maxDelay, Math.pow(2, attempt) * baseDelay);
    
    // Add jitter (±20%)
    const jitter = expBackoff * 0.2 * (Math.random() * 2 - 1);
    
    return Math.floor(expBackoff + jitter);
  }
  
  /**
   * Enhance error with more context
   */
  private enhanceError(error: any, endpoint: string, method: string, branchId: string): Error {
    // Create a more informative error message
    let message = `Hikvision API error (${method} ${endpoint}): `;
    
    if (axios.isAxiosError(error)) {
      if (error.response) {
        message += `Status ${error.response.status} - ${error.response.data?.message || error.message}`;
      } else if (error.request) {
        message += `No response received - ${error.message}`;
      } else {
        message += `Request setup failed - ${error.message}`;
      }
    } else {
      message += error.message || 'Unknown error';
    }
    
    // Log the enhanced error
    this.logApiError(branchId, endpoint, method, 'ENHANCED_ERROR', message, -1);
    
    return new Error(message);
  }
  
  /**
   * Log API errors to the database
   */
  private async logApiError(branchId: string, endpoint: string, method: string, errorCode: string, errorMessage: string, attempt: number): Promise<void> {
    try {
      await supabase.from('hikvision_sync_log').insert({
        id: crypto.randomUUID(),
        branch_id: branchId,
        event_type: 'error',
        message: `API Error: ${method} ${endpoint}`,
        details: `Code: ${errorCode}, Message: ${errorMessage}, Attempt: ${attempt + 1}`,
        status: 'error',
        created_at: new Date().toISOString()
      });
    } catch (err) {
      console.error('Failed to log API error:', err);
    }
  }
  
  /**
   * Get all access zones for a branch
   */
  async getAccessZones(branchId: string): Promise<AccessZone[]> {
    try {
      const { data, error } = await supabase
        .from('access_zones')
        .select('*')
        .eq('branch_id', branchId);
        
      if (error) {
        console.error('Error fetching access zones:', error);
        return [];
      }
      
      return data as AccessZone[];
    } catch (error) {
      console.error('Error in getAccessZones:', error);
      return [];
    }
  }
  
  /**
   * Get all access doors for a branch
   */
  async getAccessDoors(branchId: string): Promise<AccessDoor[]> {
    try {
      const { data, error } = await supabase
        .from('access_doors')
        .select('*')
        .eq('branch_id', branchId);
        
      if (error) {
        console.error('Error fetching access doors:', error);
        return [];
      }
      
      return data as AccessDoor[];
    } catch (error) {
      console.error('Error in getAccessDoors:', error);
      return [];
    }
  }
  
  /**
   * Get membership access permissions
   */
  async getMembershipAccessPermissions(membershipId: string): Promise<MembershipAccessPermission[]> {
    try {
      const { data, error } = await supabase
        .from('membership_access_permissions')
        .select('*')
        .eq('membership_id', membershipId);
        
      if (error) {
        console.error('Error fetching membership access permissions:', error);
        return [];
      }
      
      return data as MembershipAccessPermission[];
    } catch (error) {
      console.error('Error in getMembershipAccessPermissions:', error);
      return [];
    }
  }
  
  /**
   * Get member access overrides
   */
  async getMemberAccessOverrides(memberId: string): Promise<MemberAccessOverride[]> {
    try {
      const { data, error } = await supabase
        .from('member_access_overrides')
        .select('*')
        .eq('member_id', memberId)
        .gte('valid_until', new Date().toISOString());
        
      if (error) {
        console.error('Error fetching member access overrides:', error);
        return [];
      }
      
      return data as MemberAccessOverride[];
    } catch (error) {
      console.error('Error in getMemberAccessOverrides:', error);
      return [];
    }
  }
  
  /**
   * Check if a member has access to a zone
   */
  async checkMemberZoneAccess(memberId: string, zoneId: string): Promise<boolean> {
    try {
      // First check for overrides
      const { data: overrides, error: overrideError } = await supabase
        .from('member_access_overrides')
        .select('*')
        .eq('member_id', memberId)
        .eq('zone_id', zoneId)
        .gte('valid_until', new Date().toISOString())
        .single();
        
      if (overrides && !overrideError) {
        // If there's an explicit override, use that
        if (overrides.access_type === 'allowed') return true;
        if (overrides.access_type === 'denied') return false;
        if (overrides.access_type === 'scheduled') {
          // Check if current time is within schedule
          return this.isWithinSchedule(
            overrides.schedule_start_time,
            overrides.schedule_end_time,
            overrides.schedule_days
          );
        }
      }
      
      // If no overrides, check membership permissions
      const { data: membership, error: membershipError } = await supabase
        .from('member_memberships')
        .select('membership_id, status')
        .eq('member_id', memberId)
        .eq('status', 'active')
        .single();
        
      if (membershipError || !membership) {
        console.error('Error fetching member membership:', membershipError);
        return false;
      }
      
      const { data: permissions, error: permissionsError } = await supabase
        .from('membership_access_permissions')
        .select('*')
        .eq('membership_id', membership.membership_id)
        .eq('zone_id', zoneId)
        .single();
        
      if (permissionsError || !permissions) {
        console.error('Error fetching membership permissions:', permissionsError);
        return false;
      }
      
      if (permissions.access_type === 'allowed') return true;
      if (permissions.access_type === 'denied') return false;
      if (permissions.access_type === 'scheduled') {
        // Check if current time is within schedule
        return this.isWithinSchedule(
          permissions.schedule_start_time,
          permissions.schedule_end_time,
          permissions.schedule_days
        );
      }
      
      return false;
    } catch (error) {
      console.error('Error in checkMemberZoneAccess:', error);
      return false;
    }
  }
  
  /**
   * Check if current time is within schedule
   */
  private isWithinSchedule(
    startTime?: string,
    endTime?: string,
    days?: string[]
  ): boolean {
    if (!startTime || !endTime || !days || days.length === 0) {
      return false;
    }
    
    const now = new Date();
    // Get day of week in lowercase
    const weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const currentDay = weekdays[now.getDay()];
    
    // Check if today is in the allowed days
    if (!days.includes(currentDay)) {
      return false;
    }
    
    // Parse time strings (assuming format like "14:30:00")
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    // Convert to minutes for easier comparison
    const currentTimeInMinutes = currentHour * 60 + currentMinute;
    const startTimeInMinutes = startHour * 60 + startMinute;
    const endTimeInMinutes = endHour * 60 + endMinute;
    
    return currentTimeInMinutes >= startTimeInMinutes && currentTimeInMinutes <= endTimeInMinutes;
  }
  
  /**
   * Sync member access to Hikvision
   */
  async syncMemberAccess(memberId: string, branchId: string): Promise<boolean> {
    try {
      // Get member details
      const { data: member, error: memberError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email')
        .eq('id', memberId)
        .single();
        
      if (memberError || !member) {
        console.error('Error fetching member:', memberError);
        return false;
      }
      
      // Get member's active membership
      const { data: membership, error: membershipError } = await supabase
        .from('member_memberships')
        .select('membership_id, start_date, end_date')
        .eq('member_id', memberId)
        .eq('status', 'active')
        .single();
        
      if (membershipError || !membership) {
        console.error('Error fetching member membership:', membershipError);
        return false;
      }
      
      // Get access zones for the branch
      const zones = await this.getAccessZones(branchId);
      
      // Get doors for each zone
      const accessibleDoorIds: string[] = [];
      
      for (const zone of zones) {
        const hasAccess = await this.checkMemberZoneAccess(memberId, zone.id);
        
        if (hasAccess) {
          // Get doors for this zone
          const { data: doors, error: doorsError } = await supabase
            .from('access_doors')
            .select('hikvision_door_id')
            .eq('zone_id', zone.id)
            .eq('branch_id', branchId)
            .eq('is_active', true);
            
          if (!doorsError && doors && doors.length > 0) {
            accessibleDoorIds.push(...doors.map(d => d.hikvision_door_id));
          }
        }
      }
      
      // If no doors are accessible, return
      if (accessibleDoorIds.length === 0) {
        console.log(`No accessible doors for member ${memberId}`);
        return true;
      }
      
      // Get member credentials
      const { data: credentials, error: credentialsError } = await supabase
        .from('member_access_credentials')
        .select('*')
        .eq('member_id', memberId)
        .eq('is_active', true);
        
      if (credentialsError) {
        console.error('Error fetching member credentials:', credentialsError);
        return false;
      }
      
      // Register person in Hikvision if they have credentials
      if (credentials && credentials.length > 0) {
        // Create or update person in Hikvision
        const personData = {
          personId: memberId,
          personName: `${member.first_name} ${member.last_name}`,
          gender: 'unknown',
          orgIndexCode: branchId,
          phoneNo: '',
          email: member.email || '',
          faces: credentials
            .filter(c => c.credential_type === 'face')
            .map(c => ({ faceData: c.credential_value })),
          cards: credentials
            .filter(c => c.credential_type === 'card')
            .map(c => ({ cardNo: c.credential_value }))
        };
        
        // Call Hikvision API to add/update person
        const personResponse = await this.apiCall(
          branchId,
          '/api/resource/v1/person/single/add',
          'POST',
          personData
        );
        
        if (personResponse.code !== '0') {
          console.error('Error adding person to Hikvision:', personResponse.msg);
          return false;
        }
        
        // Configure access privileges
        const accessConfig = {
          personId: memberId,
          doorIndexCodes: accessibleDoorIds,
          startTime: membership.start_date,
          endTime: membership.end_date
        };
        
        const accessResponse = await this.apiCall(
          branchId,
          '/api/acs/v1/door/permission/configuration',
          'POST',
          accessConfig
        );
        
        if (accessResponse.code !== '0') {
          console.error('Error configuring access privileges:', accessResponse.msg);
          return false;
        }
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error in syncMemberAccess:', error);
      return false;
    }
  }
  
  /**
   * Register a card for a member
   */
  async registerCard(memberId: string, branchId: string, cardNumber: string): Promise<boolean> {
    try {
      // Get member details
      const { data: member, error: memberError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .eq('id', memberId)
        .single();

      if (memberError || !member) {
        throw new Error('Member not found');
      }

      // Get Hikvision person ID for this member
      const { data: hikvisionMap, error: mapError } = await supabase
        .from('hikvision_map')
        .select('person_id')
        .eq('member_id', memberId)
        .single();

      let personId = hikvisionMap?.person_id;

      // If person doesn't exist in Hikvision, create them
      if (!personId) {
        // Create person in Hikvision
        const fullName = `${member.first_name} ${member.last_name}`.trim();
        const createPersonResponse = await this.apiCall(branchId, '/api/hpcgw/v1/person/add', 'POST', {
          name: fullName,
          gender: 'unknown',
          cardNo: cardNumber,
          personType: 1 // Regular member
        });

        if (!createPersonResponse || !createPersonResponse.personId) {
          throw new Error('Failed to create person in Hikvision');
        }

        personId = createPersonResponse.personId;

        // Store the mapping
        await supabase.from('hikvision_map').insert({
          member_id: memberId,
          person_id: personId,
          branch_id: branchId
        });
      } else {
        // Update existing person with new card
        await this.apiCall(branchId, '/api/hpcgw/v1/person/update', 'POST', {
          personId,
          cardNo: cardNumber
        });
      }

      // Store the credential in our database
      await supabase.from('member_access_credentials').insert({
        member_id: memberId,
        credential_type: 'card',
        credential_value: cardNumber,
        is_active: true,
        issued_at: new Date().toISOString()
      });

      // Sync the person to devices
      await this.apiCall(branchId, '/api/hpcgw/v1/person/synchronize', 'POST', {
        personId
      });

      return true;
    } catch (error) {
      console.error('Error registering card:', error);
      return false;
    }
  }

  /**
   * Process Hikvision events and update attendance
   */
  async processEvents(branchId: string): Promise<number> {
    try {
      // Get API settings
      const settings = await this.getApiSettings(branchId);
      if (!settings) {
        throw new Error('API settings not found');
      }
      
      // Get unprocessed events from database
      const { data: events, error } = await supabase
        .from('hikvision_event')
        .select('*')
        .eq('processed', false)
        .eq('branch_id', branchId)
        .order('event_time', { ascending: true })
        .limit(100);
      
      if (error) throw error;
      if (!events || events.length === 0) return 0;
      
      // Process events in batches for better performance
      const batchSize = 20;
      let processedCount = 0;
      
      for (let i = 0; i < events.length; i += batchSize) {
        const batch = events.slice(i, i + batchSize);
        const eventIds = batch.map(e => e.id);
        
        // Process each event in the batch
        for (const event of batch) {
          try {
            // Skip events without a person ID
            if (!event.person_id) continue;
            
            // Find the member associated with this person ID
            const { data: hikvisionMap } = await supabase
              .from('hikvision_map')
              .select('member_id')
              .eq('person_id', event.person_id)
              .single();
            
            if (!hikvisionMap) {
              console.log(`No member mapping found for person ID: ${event.person_id}`);
              continue;
            }
            
            const memberId = hikvisionMap.member_id;
            
            // Get member details for logging
            const { data: member } = await supabase
              .from('profiles')
              .select('first_name, last_name, role')
              .eq('id', memberId)
              .single();
              
            const memberName = member ? `${member.first_name} ${member.last_name}` : 'Unknown Member';
            const memberRole = member?.role || 'member';
            
            // Handle entry/exit events
            if (event.event_type === 'entry') {
              // Check if there's an open attendance record
              const { data: existingAttendance } = await supabase
                .from('attendance')
                .select('id, check_in')
                .eq('member_id', memberId)
                .eq('branch_id', branchId)
                .is('check_out', null)
                .order('check_in', { ascending: false })
                .single();
              
              if (!existingAttendance) {
                // Create new attendance record
                const { data: newAttendance, error: insertError } = await supabase.from('attendance').insert({
                  member_id: memberId,
                  branch_id: branchId,
                  check_in: event.event_time,
                  source: 'access_control',
                  device_id: event.device_id,
                  door_id: event.door_id,
                  member_role: memberRole
                }).select('id').single();
                
                if (insertError) {
                  console.error('Error creating attendance record:', insertError);
                } else {
                  console.log(`Created attendance record for ${memberName} (${memberRole}) at ${event.event_time}`);
                  
                  // Log the entry in hikvision_sync_log
                  await supabase.from('hikvision_sync_log').insert({
                    id: crypto.randomUUID(),
                    branch_id: branchId,
                    event_type: 'info',
                    message: `${memberName} checked in`,
                    details: `Entry recorded at ${new Date(event.event_time).toLocaleTimeString()} via door ${event.door_name || event.door_id}`,
                    status: 'success',
                    entity_type: 'attendance',
                    entity_id: newAttendance?.id,
                    entity_name: memberName,
                    created_at: new Date().toISOString()
                  });
                }
              } else {
                // Check if this is a duplicate entry within 5 minutes
                const existingTime = new Date(existingAttendance.check_in).getTime();
                const eventTime = new Date(event.event_time).getTime();
                const timeDiff = Math.abs(eventTime - existingTime) / (1000 * 60); // difference in minutes
                
                if (timeDiff > 5) {
                  // Close the existing record and create a new one (unusual case - missed exit)
                  await supabase
                    .from('attendance')
                    .update({ 
                      check_out: new Date(eventTime - (60 * 1000)).toISOString(), // 1 minute before new check-in
                      notes: 'Auto-closed by system - missed exit event'
                    })
                    .eq('id', existingAttendance.id);
                    
                  // Create new attendance record
                  const { data: newAttendance, error: insertError } = await supabase.from('attendance').insert({
                    member_id: memberId,
                    branch_id: branchId,
                    check_in: event.event_time,
                    source: 'access_control',
                    device_id: event.device_id,
                    door_id: event.door_id,
                    member_role: memberRole
                  }).select('id').single();
                  
                  if (!insertError && newAttendance) {
                    console.log(`Created new attendance record for ${memberName} after auto-closing previous session`);
                    
                    // Log the entry in hikvision_sync_log
                    await supabase.from('hikvision_sync_log').insert({
                      id: crypto.randomUUID(),
                      branch_id: branchId,
                      event_type: 'warning',
                      message: `${memberName} checked in (previous session auto-closed)`,
                      details: `New entry recorded at ${new Date(event.event_time).toLocaleTimeString()} via door ${event.door_name || event.door_id}`,
                      status: 'warning',
                      entity_type: 'attendance',
                      entity_id: newAttendance.id,
                      entity_name: memberName,
                      created_at: new Date().toISOString()
                    });
                  }
                }
              }
            } else if (event.event_type === 'exit') {
              // Find the latest open attendance record
              const { data: openAttendance } = await supabase
                .from('attendance')
                .select('id, check_in')
                .eq('member_id', memberId)
                .eq('branch_id', branchId)
                .is('check_out', null)
                .order('check_in', { ascending: false })
                .single();
              
              if (openAttendance) {
                // Calculate session duration
                const checkInTime = new Date(openAttendance.check_in).getTime();
                const checkOutTime = new Date(event.event_time).getTime();
                const durationMinutes = Math.round((checkOutTime - checkInTime) / (1000 * 60));
                
                // Update with check-out time
                await supabase
                  .from('attendance')
                  .update({ 
                    check_out: event.event_time,
                    duration_minutes: durationMinutes
                  })
                  .eq('id', openAttendance.id);
                  
                console.log(`Updated attendance record for ${memberName} with check-out at ${event.event_time}`);
                
                // Log the exit in hikvision_sync_log
                await supabase.from('hikvision_sync_log').insert({
                  id: crypto.randomUUID(),
                  branch_id: branchId,
                  event_type: 'info',
                  message: `${memberName} checked out`,
                  details: `Exit recorded at ${new Date(event.event_time).toLocaleTimeString()} via door ${event.door_name || event.door_id}. Session duration: ${durationMinutes} minutes`,
                  status: 'success',
                  entity_type: 'attendance',
                  entity_id: openAttendance.id,
                  entity_name: memberName,
                  created_at: new Date().toISOString()
                });
              } else {
                console.log(`Exit event for ${memberName} but no open attendance record found`);
                
                // Log the anomaly
                await supabase.from('hikvision_sync_log').insert({
                  id: crypto.randomUUID(),
                  branch_id: branchId,
                  event_type: 'warning',
                  message: `${memberName} exit without check-in`,
                  details: `Exit recorded at ${new Date(event.event_time).toLocaleTimeString()} via door ${event.door_name || event.door_id}, but no matching check-in record found`,
                  status: 'warning',
                  entity_type: 'attendance',
                  entity_name: memberName,
                  created_at: new Date().toISOString()
                });
              }
            }
          } catch (eventError) {
            console.error('Error processing event:', eventError);
            // Continue with next event
          }
        }
        
        // Mark all events in batch as processed
        const { error: updateError } = await supabase
          .from('hikvision_event')
          .update({ processed: true, processed_at: new Date().toISOString() })
          .in('id', eventIds);
        
        if (!updateError) {
          processedCount += batch.length;
        }
      }
      
      return processedCount;
    } catch (error) {
      console.error('Error processing events:', error);
      return 0;
    }
  }
}

export const hikvisionAccessControlService = new HikvisionAccessControlService();
export default hikvisionAccessControlService;
