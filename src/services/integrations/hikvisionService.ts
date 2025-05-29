import { supabase } from '@/integrations/supabase/client';
import { getHikvisionErrorMessage } from '@/utils/hikvisionErrorCodes';
import type { HikvisionPerson, HikvisionDevice } from '@/types/settings/hikvision-types';

interface HikvisionServiceResponse {
  success: boolean;
  data?: any;
  error?: string;
  errorCode?: string;
  message?: string;
}

interface SyncLog {
  id: string;
  timestamp: string;
  action: string;
  status: 'success' | 'failed' | 'pending';
  message: string;
  details?: any;
}

class HikvisionService {
  async testConnection(branchId: string): Promise<HikvisionServiceResponse> {
    try {
      console.log('[HikvisionService] Testing connection for branch:', branchId);

      const { data: response, error } = await supabase.functions.invoke('hikvision-auth', {
        body: { branchId, forceRefresh: true }
      });

      if (error) {
        console.error('[HikvisionService] Connection test failed:', error);
        return { 
          success: false, 
          error: error.message || 'Failed to connect to Hikvision API'
        };
      }

      if (response?.success) {
        return { 
          success: true, 
          message: 'Successfully connected to Hikvision API',
          data: response
        };
      } else {
        return { 
          success: false, 
          error: response?.error || 'Connection test failed'
        };
      }
    } catch (error) {
      console.error('[HikvisionService] Connection test error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Connection test failed'
      };
    }
  }

  async syncDevices(branchId: string): Promise<HikvisionServiceResponse> {
    try {
      console.log('[HikvisionService] Syncing devices for branch:', branchId);

      const { data: response, error } = await supabase.functions.invoke('hikvision-proxy', {
        body: {
          branchId,
          endpoint: '/api/hpcgw/v1/device/list',
          method: 'POST',
          data: {}
        }
      });

      if (error) {
        console.error('[HikvisionService] Device sync failed:', error);
        return { 
          success: false, 
          error: error.message || 'Failed to sync devices'
        };
      }

      if (response?.success) {
        return { 
          success: true, 
          message: 'Devices synchronized successfully',
          data: response.data
        };
      } else {
        return { 
          success: false, 
          error: response?.error || 'Device sync failed'
        };
      }
    } catch (error) {
      console.error('[HikvisionService] Device sync error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Device sync failed'
      };
    }
  }

  async registerMember(person: HikvisionPerson, branchId: string): Promise<HikvisionServiceResponse> {
    try {
      console.log('[HikvisionService] Registering member:', person.name);

      const { data: addResponse, error: addError } = await supabase.functions.invoke('hikvision-proxy', {
        body: {
          branchId,
          endpoint: '/api/hpcgw/v1/person/add',
          method: 'POST',
          data: {
            name: person.name,
            gender: person.gender,
            cardNo: person.cardNo,
            phone: person.phone,
            email: person.email,
            personType: 1,
            pictures: person.faceData || []
          }
        }
      });

      if (addError || !addResponse?.success) {
        const errorMsg = addResponse?.error || addError?.message || 'Failed to add person to Hikvision';
        console.error('[HikvisionService] Add person failed:', errorMsg);
        return { success: false, error: errorMsg };
      }

      const personId = addResponse.data.personId;
      console.log('[HikvisionService] Person added with ID:', personId);

      return { 
        success: true, 
        data: { personId },
        message: 'Member successfully registered with access control system' 
      };

    } catch (error) {
      console.error('[HikvisionService] Registration error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }

  async synchronizePerson(personId: string, branchId: string): Promise<HikvisionServiceResponse> {
    try {
      const { data: syncResponse, error: syncError } = await supabase.functions.invoke('hikvision-proxy', {
        body: {
          branchId,
          endpoint: '/api/hpcgw/v1/person/synchronize',
          method: 'POST',
          data: { personId }
        }
      });

      if (syncError || !syncResponse?.success) {
        return { success: false, error: syncResponse?.error || 'Synchronization failed' };
      }

      return { success: true, data: syncResponse.data };

    } catch (error) {
      console.error('[HikvisionService] Sync error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Sync failed' };
    }
  }

  async configureAccess(personId: string, deviceSerialNo: string, doorList: number[], validStartTime: string, validEndTime: string, branchId: string): Promise<HikvisionServiceResponse> {
    try {
      const { data: accessResponse, error: accessError } = await supabase.functions.invoke('hikvision-proxy', {
        body: {
          branchId,
          endpoint: '/api/hpcgw/v1/acs/privilege/config',
          method: 'POST',
          data: {
            personId,
            deviceSerialNo,
            doorList,
            validStartTime,
            validEndTime
          }
        }
      });

      if (accessError || !accessResponse?.success) {
        return { success: false, error: accessResponse?.error || 'Access configuration failed' };
      }

      // Store access privilege in database
      for (const doorNumber of doorList) {
        const { error: dbError } = await supabase
          .from('hikvision_access_privileges')
          .upsert({
            person_id: personId,
            door_id: `${deviceSerialNo}-${doorNumber}`,
            privilege: 1,
            valid_start_time: validStartTime,
            valid_end_time: validEndTime,
            status: 'active',
            sync_status: 'success',
            last_sync: new Date().toISOString()
          }, {
            onConflict: 'person_id,door_id'
          });

        if (dbError) {
          console.error('[HikvisionService] Access privilege DB error:', dbError);
        }
      }

      return { success: true, data: accessResponse.data };

    } catch (error) {
      console.error('[HikvisionService] Access config error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Access configuration failed' };
    }
  }

  async addDevice(device: Partial<HikvisionDevice>, branchId: string): Promise<HikvisionServiceResponse> {
    try {
      const { data: addResponse, error: addError } = await supabase.functions.invoke('hikvision-proxy', {
        body: {
          branchId,
          endpoint: '/api/hpcgw/v2/device/add',
          method: 'POST',
          data: {
            deviceId: device.deviceId,
            name: device.name,
            deviceType: device.deviceType,
            ipAddress: device.ipAddress,
            port: device.port,
            username: device.username,
            password: device.password
          }
        }
      });

      if (addError || !addResponse?.success) {
        return { success: false, error: addResponse?.error || 'Failed to add device' };
      }

      // Store device in database
      const { error: dbError } = await supabase
        .from('hikvision_devices')
        .insert({
          device_id: device.deviceId!,
          name: device.name!,
          device_type: device.deviceType,
          ip_address: device.ipAddress,
          port: device.port,
          username: device.username,
          password: device.password,
          branch_id: branchId,
          status: 'active',
          last_sync: new Date().toISOString()
        });

      if (dbError) {
        console.error('[HikvisionService] Device DB error:', dbError);
        return { success: false, error: 'Failed to store device data' };
      }

      return { success: true, data: addResponse.data };

    } catch (error) {
      console.error('[HikvisionService] Add device error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Failed to add device' };
    }
  }

  async fetchEvents(branchId: string): Promise<HikvisionServiceResponse> {
    try {
      const { data, error } = await supabase.functions.invoke('hikvision-events', {
        body: {
          branchId,
          action: 'fetch'
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };

    } catch (error) {
      console.error('[HikvisionService] Fetch events error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch events' };
    }
  }

  async processEvents(branchId: string): Promise<HikvisionServiceResponse> {
    try {
      const { data, error } = await supabase.functions.invoke('hikvision-events', {
        body: {
          branchId,
          action: 'process'
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };

    } catch (error) {
      console.error('[HikvisionService] Process events error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Failed to process events' };
    }
  }

  async getSyncLogs(branchId: string): Promise<SyncLog[]> {
    try {
      // Simplified sync logs - just get recent events
      const { data: eventLogs } = await supabase
        .from('hikvision_events')
        .select('event_id, event_type, processed, created_at')
        .order('created_at', { ascending: false })
        .limit(20);

      const logs: SyncLog[] = [];

      eventLogs?.forEach(log => {
        logs.push({
          id: `event-${log.event_id}`,
          timestamp: log.created_at || new Date().toISOString(),
          action: `Event: ${log.event_type}`,
          status: log.processed ? 'success' : 'pending',
          message: `Event ${log.event_id} - ${log.event_type}`
        });
      });

      return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    } catch (error) {
      console.error('[HikvisionService] Error getting sync logs:', error);
      return [];
    }
  }
}

export const hikvisionService = new HikvisionService();
