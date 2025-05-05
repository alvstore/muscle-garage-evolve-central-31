
import { HikvisionDevice } from '@/types/hikvision';

// Interface for the device status
export interface HikvisionDeviceStatus {
  online: boolean;
  lastOnlineTime?: string;
  ipAddress?: string;
}

// Interface for the Hikvision API credentials
export interface HikvisionCredentials {
  apiUrl: string;
  clientId: string;  // Changed from appKey
  clientSecret: string;  // Changed from secretKey
}

// Interface for the device object with status
export interface HikvisionDeviceWithStatus extends HikvisionDevice {
  status?: 'online' | 'offline' | 'unknown';
  deviceSerial: string;
  deviceCode?: string;
  deviceName: string;
  userName?: string;
  channelNos?: string;
  isVideoSupported?: boolean;
}

// Response for API operations
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

// Service class for Hikvision Partner API interactions
class HikvisionPartnerService {
  /**
   * Get stored API credentials
   */
  async getCredentials(): Promise<HikvisionCredentials | null> {
    // In a real app, this would get from secure storage or API
    const credentials = localStorage.getItem('hikvision_credentials');
    return credentials ? JSON.parse(credentials) : null;
  }

  /**
   * Save API credentials
   */
  async saveCredentials(appKey: string, secretKey: string): Promise<ApiResponse> {
    // In a real app, this would store securely or through an API
    localStorage.setItem('hikvision_credentials', JSON.stringify({ appKey, secretKey }));
    return { success: true };
  }

  /**
   * Test the API connection
   */
  async testConnection(): Promise<ApiResponse> {
    // Mock implementation - in a real app this would make an API call
    const credentials = await this.getCredentials();
    if (!credentials) {
      return { success: false, message: 'API credentials not configured' };
    }
    
    // Simulate successful connection
    return { success: true };
  }

  /**
   * List all registered devices
   */
  /**
   * List all registered devices
   */
  async listDevices(): Promise<HikvisionDeviceWithStatus[]> {
    try {
      const credentials = await this.getCredentials();
      if (!credentials) {
        throw new Error('No credentials found');
      }
      
      const authResult = await this.authenticate(credentials);
      if (!authResult) {
        throw new Error('Authentication failed');
      }
      
      const response = await fetch(`${credentials.apiUrl}/api/hpcgw/v1/device/list`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authResult.accessToken}`
        },
        body: JSON.stringify({
          pageNo: 1,
          pageSize: 100
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to list devices: ${JSON.stringify(errorData)}`);
      }
      
      const data = await response.json();
      
      // Transform the API response to match our HikvisionDeviceWithStatus interface
      return data.devices.map((device: any) => ({
        deviceId: device.deviceId,
        deviceSerial: device.deviceSerial || device.serialNumber,
        deviceName: device.deviceName,
        status: device.online ? 'online' : 'offline',
        deviceType: device.deviceType,
        userName: device.userName,
        isVideoSupported: device.isVideoSupported || false
      }));
    } catch (error) {
      console.error('Failed to list devices:', error);
      return [];
    }
  }

  /**
   * Add a new device
   */
  async addDevice(deviceData: any): Promise<ApiResponse> {
    try {
      const credentials = await this.getCredentials();
      if (!credentials) {
        throw new Error('No credentials found');
      }
      
      const authResult = await this.authenticate(credentials);
      if (!authResult) {
        throw new Error('Authentication failed');
      }
      
      const response = await fetch(`${credentials.apiUrl}/api/hpcgw/v1/device/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authResult.accessToken}`
        },
        body: JSON.stringify({
          deviceSerial: deviceData.deviceSerial,
          deviceName: deviceData.deviceName,
          deviceType: deviceData.deviceType || 'ACS',
          userName: deviceData.userName || 'admin',
          password: deviceData.password
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to add device: ${JSON.stringify(errorData)}`);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Failed to add device:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Update device information
   */
  async updateDevice(deviceData: any): Promise<ApiResponse> {
    try {
      const authResult = await this.authenticate();
      if (!authResult) {
        throw new Error('Authentication failed');
      }
      
      const areaDomain = await this.getAreaDomain();
      
      const response = await fetch(`${areaDomain}/api/hpcgw/v1/device/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authResult.accessToken}`
        },
        body: JSON.stringify({
          deviceSerial: deviceData.deviceSerial,
          deviceName: deviceData.deviceName
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to update device: ${JSON.stringify(errorData)}`);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Failed to update device:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Delete a device
   */
  async deleteDevice(deviceSerial: string): Promise<ApiResponse> {
    try {
      const authResult = await this.authenticate();
      if (!authResult) {
        throw new Error('Authentication failed');
      }
      
      const areaDomain = await this.getAreaDomain();
      
      const response = await fetch(`${areaDomain}/api/hpcgw/v1/device/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authResult.accessToken}`
        },
        body: JSON.stringify({
          deviceSerial: deviceSerial
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to delete device: ${JSON.stringify(errorData)}`);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Failed to delete device:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Get device status
   */
  async getDeviceStatus(deviceSerial: string): Promise<HikvisionDeviceWithStatus | null> {
    // Mock implementation - in a real app this would make an API call
    const devices = await this.listDevices();
    return devices.find(d => d.deviceSerial === deviceSerial) || null;
  }

  /**
   * Register a member with the access control system
   */
  async registerMember(member: any, accessPlan: string): Promise<ApiResponse> {
    try {
      // 1. Add the person to Hikvision
      const personResult = await this.addPerson({
        personName: member.name,
        organization: member.branch?.name || 'Default',
        credentialType: 'card',
        credentialNo: member.access_card_number || ''
      });
      
      if (!personResult.success) {
        throw new Error(`Failed to add person: ${personResult.message}`);
      }
      
      const personId = personResult.data?.personId;
      if (!personId) {
        throw new Error('Person ID not returned from API');
      }
      
      // 2. Determine which devices to grant access to based on the plan
      const devices = await this.getDevicesForPlan(accessPlan);
      
      if (devices.length === 0) {
        throw new Error('No devices found for the access plan');
      }
      
      // 3. Configure access privileges
      const now = new Date();
      const endDate = new Date(member.membership_end_date || '');
      const validEndDate = isNaN(endDate.getTime()) ? 
        new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000) : // Default to 1 year
        endDate;
      
      const deviceList = devices.map(device => ({
        deviceSerial: device.deviceSerial,
        doorIndexCode: '1', // Default door index
        startTime: now.toISOString(),
        endTime: validEndDate.toISOString()
      }));
      
      const privilegeResult = await this.configureAccessPrivileges(personId, deviceList);
      
      if (!privilegeResult.success) {
        throw new Error(`Failed to configure access privileges: ${privilegeResult.message}`);
      }
      
      // 4. Update the member record with the access control ID
      await api.patch(`/members/${member.id}`, {
        access_control_id: personId
      });
      
      return { success: true };
    } catch (error) {
      console.error('Failed to register member with access control:', error);
      return { success: false, message: error.message };
    }
  }
  
  /**
   * Get devices for a specific access plan
   */
  async getDevicesForPlan(accessPlan: string): Promise<HikvisionDeviceWithStatus[]> {
    // Get all devices
    const allDevices = await this.listDevices();
    
    // Filter based on the access plan
    switch (accessPlan) {
      case 'gym_only':
        return allDevices.filter(d => !d.deviceName.toLowerCase().includes('swimming'));
      case 'swimming_only':
        return allDevices.filter(d => d.deviceName.toLowerCase().includes('swimming'));
      case 'full_access':
        return allDevices;
      default:
        return [];
    }
  }
}

export const hikvisionPartnerService = new HikvisionPartnerService();
