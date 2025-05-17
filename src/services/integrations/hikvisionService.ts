
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { getHikvisionToken } from './hikvisionTokenService';
import { getHikvisionErrorMessage } from '@/utils/hikvisionErrorCodes';
import { toast } from '@/components/ui/use-toast';

// Types for Hikvision events
export interface HikvisionEvent {
  event_id: string;
  event_type: 'entry' | 'exit' | 'denied';
  event_time: string;
  person_id?: string;
  person_name?: string;
  door_id?: string;
  door_name?: string;
  device_id?: string;
  device_name?: string;
  card_no?: string;
  face_id?: string;
  processed?: boolean;
}

// Device registration status
export interface DeviceRegistrationStatus {
  deviceId: string;
  deviceName: string;
  status: 'success' | 'failed' | 'pending';
  message?: string;
  timestamp: string;
}

class HikvisionService {
  /**
   * Test connection to Hikvision API
   */
  async testConnection(branchId: string): Promise<{ 
    success: boolean; 
    message: string;
    errorCode?: string; 
  }> {
    try {
      // Get API settings
      const { data: settings, error: settingsError } = await supabase
        .from('hikvision_api_settings')
        .select('*')
        .eq('branch_id', branchId)
        .eq('is_active', true)
        .maybeSingle();
      
      if (settingsError || !settings) {
        console.error('Error fetching Hikvision API settings:', settingsError);
        return { 
          success: false, 
          message: `API settings not found: ${settingsError?.message || 'Not configured'}`
        };
      }
      
      // Get token
      const accessToken = await getHikvisionToken(branchId);
      if (!accessToken) {
        return { 
          success: false, 
          message: 'Failed to get access token'
        };
      }
      
      // Test device connection if any devices are configured
      if (settings.devices && settings.devices.length > 0) {
        const deviceId = settings.devices[0].id || settings.devices[0].deviceId || settings.devices[0].serialNumber;
        
        // Call edge function to test device
        const { data: response, error } = await supabase.functions.invoke('hikvision-proxy', {
          body: {
            action: 'test-device',
            apiUrl: settings.api_url,
            accessToken,
            deviceId,
            branchId
          }
        });
        
        if (error) {
          console.error('Error testing Hikvision device:', error);
          return { 
            success: false, 
            message: `Edge function error: ${error.message}`
          };
        }
        
        if (response.code !== '0') {
          const errorMessage = getHikvisionErrorMessage(response.code) || response.msg || 'Unknown error';
          return {
            success: false,
            message: `Device error: ${errorMessage}`,
            errorCode: response.code
          };
        }
        
        return {
          success: true,
          message: 'Connection successful'
        };
      }
      
      // If no devices, just return success for the token
      return {
        success: true,
        message: 'API connection successful (no devices configured)'
      };
    } catch (error: any) {
      console.error('Error testing Hikvision connection:', error);
      return {
        success: false,
        message: `Error: ${error.message}`
      };
    }
  }
  
  /**
   * Register a member in Hikvision devices
   */
  async registerMember(
    memberId: string, 
    branchId: string
  ): Promise<{
    success: boolean;
    message: string;
    personId?: string;
  }> {
    try {
      // Get member data
      const { data: member, error: memberError } = await supabase
        .from('members')
        .select('*')
        .eq('id', memberId)
        .single();
      
      if (memberError || !member) {
        console.error('Member not found:', memberError);
        return {
          success: false,
          message: `Member not found: ${memberError?.message || 'Unknown error'}`
        };
      }
      
      // Get Hikvision API settings
      const { data: settings, error: settingsError } = await supabase
        .from('hikvision_api_settings')
        .select('*')
        .eq('branch_id', branchId)
        .eq('is_active', true)
        .maybeSingle();
      
      if (settingsError || !settings) {
        console.error('Error fetching Hikvision API settings:', settingsError);
        return {
          success: false,
          message: `API settings not found: ${settingsError?.message || 'Not configured'}`
        };
      }
      
      // Get token
      const accessToken = await getHikvisionToken(branchId);
      if (!accessToken) {
        return {
          success: false,
          message: 'Failed to get access token'
        };
      }
      
      // Check if we have any devices to register to
      if (!settings.devices || settings.devices.length === 0) {
        return {
          success: false,
          message: 'No devices configured'
        };
      }
      
      // Use the first device by default
      const deviceId = settings.devices[0].id || settings.devices[0].deviceId || settings.devices[0].serialNumber;
      
      // Prepare member data for registration
      const memberData = {
        id: member.id,
        name: member.name,
        gender: member.gender || 'unknown',
        phone: member.phone || '',
        email: member.email || '',
        profile_picture: member.profile_picture
      };
      
      // Call edge function to register the member
      const { data: response, error } = await supabase.functions.invoke('hikvision-proxy', {
        body: {
          action: 'register-person',
          apiUrl: settings.api_url,
          accessToken,
          deviceId,
          memberData,
          branchId
        }
      });
      
      console.log('Hikvision registration response:', response);
      
      if (error) {
        console.error('Edge function error:', error);
        return {
          success: false,
          message: `Edge function error: ${error.message}`
        };
      }
      
      if (!response.success) {
        return {
          success: false,
          message: response.message || response.error || 'Unknown error'
        };
      }
      
      return {
        success: true,
        message: 'Successfully registered with Hikvision device',
        personId: response.personId
      };
    } catch (error: any) {
      console.error('Error registering member with Hikvision:', error);
      return {
        success: false,
        message: `Error: ${error.message}`
      };
    }
  }
  
  /**
   * Get events from a specific time
   */
  async getEvents(startTime?: string): Promise<HikvisionEvent[]> {
    try {
      // Query conditions
      const queryBuilder = supabase
        .from('hikvision_event')
        .select('*')
        .order('event_time', { ascending: false })
        .limit(50);
      
      // Add time filter if provided
      if (startTime) {
        queryBuilder.gte('event_time', startTime);
      }
      
      const { data, error } = await queryBuilder;
      
      if (error) {
        console.error('Error fetching Hikvision events:', error);
        return [];
      }
      
      return data as HikvisionEvent[];
    } catch (error) {
      console.error('Error in getEvents:', error);
      return [];
    }
  }
  
  /**
   * Process attendance from events
   */
  async processAttendance(events: HikvisionEvent[]): Promise<number> {
    try {
      let processedCount = 0;
      
      for (const event of events) {
        if (event.processed) continue;
        
        // Get member by person_id or card_no
        const { data: member } = await supabase
          .from('members')
          .select('id, name')
          .or(`access_control_id.eq.${event.person_id},id.eq.${event.person_id}`)
          .maybeSingle();
        
        if (!member) {
          console.log('Member not found for event:', event);
          continue;
        }
        
        // Create attendance record
        const attendanceRecord = {
          member_id: member.id,
          check_in_time: event.event_type === 'entry' ? event.event_time : null,
          check_out_time: event.event_type === 'exit' ? event.event_time : null,
          source: 'access_control',
          device_id: event.device_id,
          created_at: new Date().toISOString()
        };
        
        // If it's an exit event, try to find and update the most recent entry
        if (event.event_type === 'exit') {
          const { data: recentEntry } = await supabase
            .from('attendance')
            .select('id, check_in_time')
            .eq('member_id', member.id)
            .is('check_out_time', null)
            .order('check_in_time', { ascending: false })
            .limit(1)
            .maybeSingle();
          
          if (recentEntry) {
            // Update the existing entry with check-out time
            await supabase
              .from('attendance')
              .update({ check_out_time: event.event_time })
              .eq('id', recentEntry.id);
            
            processedCount++;
            continue;
          }
        }
        
        // Insert new attendance record for entry events
        if (event.event_type === 'entry') {
          await supabase
            .from('attendance')
            .insert(attendanceRecord);
          
          processedCount++;
        }
        
        // Mark the event as processed
        await supabase
          .from('hikvision_event')
          .update({ processed: true })
          .eq('event_id', event.event_id);
      }
      
      return processedCount;
    } catch (error) {
      console.error('Error processing attendance:', error);
      return 0;
    }
  }
  
  /**
   * Simulate an access control event (for testing)
   */
  async simulateEvent(
    memberId: string, 
    eventType: 'entry' | 'exit' | 'denied' = 'entry'
  ): Promise<HikvisionEvent | null> {
    try {
      // Get member data
      const { data: member, error: memberError } = await supabase
        .from('members')
        .select('id, name, access_control_id, branch_id')
        .eq('id', memberId)
        .single();
      
      if (memberError || !member) {
        console.error('Member not found:', memberError);
        toast({
          title: "Error",
          description: "Member not found",
          variant: "destructive",
        });
        return null;
      }
      
      // Generate an event
      const event: HikvisionEvent = {
        event_id: `simulated-${uuidv4()}`,
        event_type: eventType,
        event_time: new Date().toISOString(),
        person_id: member.access_control_id || member.id,
        person_name: member.name,
        door_id: 'door-1',
        door_name: 'Main Entrance',
        device_id: 'device-simulator',
        device_name: 'Simulator Device',
        processed: false
      };
      
      // Save to database
      const { data, error } = await supabase
        .from('hikvision_event')
        .insert(event)
        .select()
        .single();
      
      if (error) {
        console.error('Error simulating event:', error);
        toast({
          title: "Error",
          description: "Failed to simulate event",
          variant: "destructive",
        });
        return null;
      }
      
      toast({
        title: "Success",
        description: `Simulated ${eventType} event for ${member.name}`,
      });
      
      return data as HikvisionEvent;
    } catch (error) {
      console.error('Error in simulateEvent:', error);
      toast({
        title: "Error",
        description: `Failed to simulate event: ${error.message}`,
        variant: "destructive",
      });
      return null;
    }
  }
}

export const hikvisionService = new HikvisionService();
