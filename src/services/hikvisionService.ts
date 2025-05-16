
import axios from 'axios';
import { supabase } from './supabaseClient';

export interface HikvisionDevice {
  serialNumber: string;
  name: string;
  model?: string;
  isOnline: boolean;
  doorCount?: number;
  id?: string;
}

export interface HikvisionDoor {
  doorId: string;
  doorName: string;
  deviceSerialNo: string;
}

export interface HikvisionPerson {
  personId: string;
  name: string;
  gender?: string;
  cardNo?: string;
  phone?: string;
  email?: string;
  personType?: number;
  picture?: string;
}

export interface HikvisionAccessPrivilege {
  personId: string;
  deviceSerialNo: string;
  doorList: number[];
  validStartTime: string;
  validEndTime: string;
}

export interface HikvisionApiSettings {
  id?: string;
  app_key: string;
  app_secret: string;
  api_url: string;
  branch_id: string;
  is_active: boolean;
  devices?: HikvisionDevice[];
}

class HikvisionService {
  private async getToken(settings: HikvisionApiSettings): Promise<string> {
    try {
      // Check if we have a token in Supabase
      const { data: tokenData } = await supabase
        .from('hikvision_tokens')
        .select('*')
        .eq('branch_id', settings.branch_id)
        .single();

      if (tokenData && tokenData.expire_time > Date.now()) {
        return tokenData.access_token;
      }

      // Token doesn't exist or expired, get a new one
      const response = await axios.post(
        `${settings.api_url}/api/hpcgw/v1/token/get`,
        {
          appKey: settings.app_key,
          secretKey: settings.app_secret,
        }
      );

      if (response.data && response.data.code === "0" && response.data.data) {
        const { accessToken, expireTime } = response.data.data;

        // Save token to database
        await supabase.from('hikvision_tokens').upsert({
          branch_id: settings.branch_id,
          access_token: accessToken,
          expire_time: expireTime,
          created_at: new Date().toISOString(),
        });

        return accessToken;
      } else {
        throw new Error(`Failed to get token: ${response.data?.msg || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error getting Hikvision token:', error);
      throw error;
    }
  }

  private async makeApiCall(settings: HikvisionApiSettings, endpoint: string, data: any = {}): Promise<any> {
    try {
      const token = await this.getToken(settings);
      
      const response = await axios.post(`${settings.api_url}${endpoint}`, data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.data && response.data.code === "0") {
        return response.data.data;
      } else {
        throw new Error(`API Error: ${response.data?.msg || 'Unknown error'}`);
      }
    } catch (error) {
      console.error(`Error making API call to ${endpoint}:`, error);
      throw error;
    }
  }

  async getSettings(branchId?: string): Promise<HikvisionApiSettings | null> {
    try {
      const { data, error } = await supabase
        .from('hikvision_api_settings')
        .select('*')
        .eq('branch_id', branchId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No record found
          return null;
        }
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error fetching Hikvision settings:', error);
      throw error;
    }
  }

  async saveSettings(settings: HikvisionApiSettings): Promise<HikvisionApiSettings> {
    try {
      const { data, error } = await supabase
        .from('hikvision_api_settings')
        .upsert(settings)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error saving Hikvision settings:', error);
      throw error;
    }
  }

  async testConnection(settings: HikvisionApiSettings): Promise<boolean> {
    try {
      await this.getToken(settings);
      return true;
    } catch (error) {
      console.error('Hikvision connection test failed:', error);
      return false;
    }
  }

  async getSites(settings: HikvisionApiSettings): Promise<any[]> {
    try {
      const data = await this.makeApiCall(settings, '/api/hpcgw/v1/site/search', {});
      return data.siteList || [];
    } catch (error) {
      console.error('Error fetching Hikvision sites:', error);
      throw error;
    }
  }

  async getDevices(settings: HikvisionApiSettings, siteId?: string): Promise<HikvisionDevice[]> {
    try {
      const data = await this.makeApiCall(settings, '/api/hpcgw/v1/device/list', {
        siteIds: siteId ? [siteId] : undefined
      });
      
      return data.devices?.map((device: any) => ({
        serialNumber: device.deviceSerial,
        name: device.deviceName,
        model: device.deviceModel,
        isOnline: device.online === 1,
        doorCount: device.doorNum
      })) || [];
    } catch (error) {
      console.error('Error fetching Hikvision devices:', error);
      throw error;
    }
  }

  async addDevice(settings: HikvisionApiSettings, device: { deviceName: string, deviceSerial: string, siteId: string }): Promise<any> {
    try {
      const data = await this.makeApiCall(settings, '/api/hpcgw/v2/device/add', device);
      return data;
    } catch (error) {
      console.error('Error adding Hikvision device:', error);
      throw error;
    }
  }

  async addPerson(settings: HikvisionApiSettings, person: HikvisionPerson): Promise<string> {
    try {
      const data = await this.makeApiCall(settings, '/api/hpcgw/v1/person/add', person);
      return data.personId;
    } catch (error) {
      console.error('Error adding person to Hikvision:', error);
      throw error;
    }
  }

  async updatePerson(settings: HikvisionApiSettings, person: HikvisionPerson): Promise<boolean> {
    try {
      await this.makeApiCall(settings, '/api/hpcgw/v1/person/update', person);
      return true;
    } catch (error) {
      console.error('Error updating person in Hikvision:', error);
      throw error;
    }
  }

  async deletePerson(settings: HikvisionApiSettings, personId: string): Promise<boolean> {
    try {
      await this.makeApiCall(settings, '/api/hpcgw/v1/person/delete', { personId });
      return true;
    } catch (error) {
      console.error('Error deleting person from Hikvision:', error);
      throw error;
    }
  }

  async syncPersonToDevices(settings: HikvisionApiSettings, personId: string, deviceSerialList: string[]): Promise<any> {
    try {
      const data = await this.makeApiCall(settings, '/api/hpcgw/v1/person/synchronize', {
        personId,
        deviceSerialList
      });
      return data;
    } catch (error) {
      console.error('Error syncing person to devices:', error);
      throw error;
    }
  }

  async configureAccess(settings: HikvisionApiSettings, privilege: HikvisionAccessPrivilege): Promise<boolean> {
    try {
      await this.makeApiCall(settings, '/api/hpcgw/v1/acs/privilege/config', privilege);
      return true;
    } catch (error) {
      console.error('Error configuring access privileges:', error);
      throw error;
    }
  }

  async removeAccess(settings: HikvisionApiSettings, personId: string, deviceSerialNo: string): Promise<boolean> {
    try {
      await this.makeApiCall(settings, '/api/hpcgw/v1/acs/privilege/delete', {
        personId,
        deviceSerialNo
      });
      return true;
    } catch (error) {
      console.error('Error removing access privileges:', error);
      throw error;
    }
  }

  async getAccessStatus(settings: HikvisionApiSettings, personId: string, deviceSerialNo: string): Promise<any> {
    try {
      const data = await this.makeApiCall(settings, '/api/hpcgw/v1/acs/privilege/status', {
        personId,
        deviceSerialNo
      });
      return data;
    } catch (error) {
      console.error('Error getting access status:', error);
      throw error;
    }
  }

  async subscribeToEvents(settings: HikvisionApiSettings, webhookUrl: string): Promise<any> {
    try {
      const data = await this.makeApiCall(settings, '/api/hpcgw/v1/mq/subscribe', {
        host: webhookUrl,
        events: ["ACS"]
      });
      return data;
    } catch (error) {
      console.error('Error subscribing to events:', error);
      throw error;
    }
  }

  async getDoors(settings: HikvisionApiSettings, deviceSerial: string): Promise<HikvisionDoor[]> {
    try {
      const data = await this.makeApiCall(settings, '/api/hpcgw/v1/door/list', {
        deviceSerialList: [deviceSerial]
      });
      
      return data.doorList?.map((door: any) => ({
        doorId: door.doorId,
        doorName: door.doorName,
        deviceSerialNo: door.deviceSerial
      })) || [];
    } catch (error) {
      console.error('Error fetching doors:', error);
      throw error;
    }
  }
}

export const hikvisionService = new HikvisionService();
