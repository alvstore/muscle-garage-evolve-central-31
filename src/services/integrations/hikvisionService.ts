
import { supabase } from '@/integrations/supabase/client';
import { getHikvisionErrorMessage } from '@/utils/hikvisionErrorCodes';
import type { HikvisionPerson, HikvisionDevice } from '@/types/settings/hikvision-types';

interface HikvisionServiceResponse {
  success: boolean;
  data?: any;
  error?: string;
  errorCode?: string;
}

class HikvisionService {
  async registerMember(person: HikvisionPerson, branchId: string): Promise<HikvisionServiceResponse> {
    try {
      console.log('[HikvisionService] Registering member:', person.name);

      // 1. Add person to Hikvision
      const addPersonResponse = await supabase.functions.invoke('hikvision-proxy', {
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

      if (addPersonResponse.error || !addPersonResponse.data.success) {
        const errorMsg = addPersonResponse.data?.error || 'Failed to add person to Hikvision';
        console.error('[HikvisionService] Add person failed:', errorMsg);
        return { success: false, error: errorMsg };
      }

      const personId = addPersonResponse.data.data.personId;
      console.log('[HikvisionService] Person added with ID:', personId);

      // 2. Store person in database
      const { error: dbError } = await supabase
        .from('hikvision_persons')
        .upsert({
          person_id: personId,
          member_id: person.memberId,
          name: person.name,
          gender: person.gender,
          card_no: person.cardNo,
          phone: person.phone,
          email: person.email,
          status: person.status,
          face_data: person.faceData,
          finger_print_data: person.fingerPrintData,
          branch_id: branchId,
          sync_status: 'success',
          last_sync: new Date().toISOString()
        }, {
          onConflict: 'person_id'
        });

      if (dbError) {
        console.error('[HikvisionService] Database error:', dbError);
        return { success: false, error: 'Failed to store person data' };
      }

      // 3. Synchronize to devices
      const syncResponse = await this.synchronizePerson(personId, branchId);
      if (!syncResponse.success) {
        console.warn('[HikvisionService] Sync warning:', syncResponse.error);
        // Don't fail the whole operation for sync issues
      }

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
      const syncResponse = await supabase.functions.invoke('hikvision-proxy', {
        body: {
          branchId,
          endpoint: '/api/hpcgw/v1/person/synchronize',
          method: 'POST',
          data: {
            personId: personId
          }
        }
      });

      if (syncResponse.error || !syncResponse.data.success) {
        return { success: false, error: syncResponse.data?.error || 'Synchronization failed' };
      }

      return { success: true, data: syncResponse.data.data };

    } catch (error) {
      console.error('[HikvisionService] Sync error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Sync failed' };
    }
  }

  async configureAccess(personId: string, deviceSerialNo: string, doorList: number[], validStartTime: string, validEndTime: string, branchId: string): Promise<HikvisionServiceResponse> {
    try {
      const accessResponse = await supabase.functions.invoke('hikvision-proxy', {
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

      if (accessResponse.error || !accessResponse.data.success) {
        return { success: false, error: accessResponse.data?.error || 'Access configuration failed' };
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

      return { success: true, data: accessResponse.data.data };

    } catch (error) {
      console.error('[HikvisionService] Access config error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Access configuration failed' };
    }
  }

  async addDevice(device: Partial<HikvisionDevice>, branchId: string): Promise<HikvisionServiceResponse> {
    try {
      // Add device to Hikvision platform
      const addDeviceResponse = await supabase.functions.invoke('hikvision-proxy', {
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

      if (addDeviceResponse.error || !addDeviceResponse.data.success) {
        return { success: false, error: addDeviceResponse.data?.error || 'Failed to add device' };
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

      return { success: true, data: addDeviceResponse.data.data };

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
}

export const hikvisionService = new HikvisionService();
