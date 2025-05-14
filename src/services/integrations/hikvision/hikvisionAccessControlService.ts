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
  // Cache for access tokens
  private tokenCache: Map<string, { token: string, expires: number }> = new Map();
  
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
      
      if (cachedToken && cachedToken.expires > Date.now()) {
        return cachedToken.token;
      }
      
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
      
      const response = await axios.post(
        `${settings.api_url}/oauth/token`,
        {
          grantType: 'client_credentials'
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Ca-Key': settings.app_key,
            'X-Ca-Timestamp': timestamp.toString(),
            'X-Ca-Nonce': nonce,
            'X-Ca-Signature': signature,
            'X-Ca-Signature-Headers': 'X-Ca-Key,X-Ca-Timestamp,X-Ca-Nonce'
          }
        }
      );
      
      if (response.data && response.data.code === '0' && response.data.data) {
        const { accessToken, expireTime } = response.data.data;
        
        // Cache the token
        this.tokenCache.set(cacheKey, {
          token: accessToken,
          expires: Date.now() + (expireTime * 1000) - 60000 // Expire 1 minute early
        });
        
        return accessToken;
      }
      
      throw new Error(`Authentication failed: ${response.data?.msg || 'Unknown error'}`);
    } catch (error) {
      console.error('Error authenticating with Hikvision API:', error);
      return null;
    }
  }
  
  /**
   * Make an authenticated API call to Hikvision
   */
  async apiCall(branchId: string, endpoint: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', data?: any): Promise<any> {
    try {
      const token = await this.authenticate(branchId);
      if (!token) {
        throw new Error('Failed to authenticate');
      }
      
      const settings = await this.getApiSettings(branchId);
      if (!settings) {
        throw new Error('API settings not found');
      }
      
      const url = `${settings.api_url}${endpoint}`;
      
      const response = await axios({
        method,
        url,
        data,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error(`Error in ${method} ${endpoint}:`, error);
      throw error;
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
   * Process Hikvision events and update attendance
   */
  async processEvents(branchId: string): Promise<number> {
    try {
      // Get unprocessed events
      const { data: events, error: eventsError } = await supabase
        .from('hikvision_event')
        .select('*')
        .eq('processed', false)
        .limit(100);
        
      if (eventsError) {
        console.error('Error fetching Hikvision events:', eventsError);
        return 0;
      }
      
      if (!events || events.length === 0) {
        return 0;
      }
      
      let processedCount = 0;
      
      for (const event of events) {
        // Skip events without person_id
        if (!event.person_id) {
          await supabase
            .from('hikvision_event')
            .update({ processed: true })
            .eq('id', event.id);
          continue;
        }
        
        // Find the door in our database
        const { data: door, error: doorError } = await supabase
          .from('access_doors')
          .select('id')
          .eq('hikvision_door_id', event.door_id)
          .eq('branch_id', branchId)
          .single();
          
        if (doorError) {
          console.error('Error finding door:', doorError);
          continue;
        }
        
        // Create access log entry
        const accessEvent: AccessEvent = {
          event_id: `hik_${event.event_id}`,
          member_id: event.person_id,
          door_id: door?.id,
          event_time: event.event_time,
          event_type: event.event_type === 'entry' ? 'entry' : 
                      event.event_type === 'exit' ? 'exit' : 'denied',
          credential_type: event.face_id ? 'face' : event.card_no ? 'card' : undefined,
          credential_value: event.face_id || event.card_no || undefined,
          hikvision_event_id: event.event_id
        };
        
        // Insert access log
        const { error: logError } = await supabase
          .from('access_logs')
          .insert(accessEvent);
          
        if (logError) {
          console.error('Error inserting access log:', logError);
          continue;
        }
        
        // If entry event, create attendance record
        if (event.event_type === 'entry') {
          const { error: attendanceError } = await supabase
            .from('member_attendance')
            .insert({
              member_id: event.person_id,
              branch_id: branchId,
              check_in_time: event.event_time,
              check_in_method: 'access_control',
              status: 'checked_in'
            });
            
          if (attendanceError) {
            console.error('Error inserting attendance record:', attendanceError);
          }
        }
        
        // If exit event, update attendance record
        if (event.event_type === 'exit') {
          const { error: attendanceUpdateError } = await supabase
            .from('member_attendance')
            .update({
              check_out_time: event.event_time,
              status: 'checked_out'
            })
            .eq('member_id', event.person_id)
            .eq('branch_id', branchId)
            .eq('status', 'checked_in')
            .is('check_out_time', null)
            .order('check_in_time', { ascending: false })
            .limit(1);
            
          if (attendanceUpdateError) {
            console.error('Error updating attendance record:', attendanceUpdateError);
          }
        }
        
        // Mark event as processed
        await supabase
          .from('hikvision_event')
          .update({ processed: true })
          .eq('id', event.id);
          
        processedCount++;
      }
      
      return processedCount;
    } catch (error) {
      console.error('Error in processEvents:', error);
      return 0;
    }
  }
}

export const hikvisionAccessControlService = new HikvisionAccessControlService();
export default hikvisionAccessControlService;
