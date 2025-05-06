
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
  username?: string;  // For backwards compatibility
  password?: string;  // For backwards compatibility
  appKey?: string;    // For backwards compatibility
  secretKey?: string; // For backwards compatibility
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

// Add missing interfaces
interface AuthResult {
  accessToken: string;
  expiresIn: number;
  refreshToken?: string;
}

interface PersonData {
  personName: string;
  organization: string;
  credentialType: string;
  credentialNo: string;
}

interface DeviceAccessConfig {
  deviceSerial: string;
  doorIndexCode: string;
  startTime: string;
  endTime: string;
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
   * Authenticate with the Hikvision API
   */
  async authenticate(credentials?: HikvisionCredentials): Promise<AuthResult | null> {
    try {
      const creds = credentials || await this.getCredentials();
      if (!creds) {
        throw new Error('No credentials found');
      }
      
      // Mock implementation - in production this would make a real API call
      return {
        accessToken: 'mock-token-' + Date.now(),
        expiresIn: 3600
      };
    } catch (error) {
      console.error('Authentication error:', error);
      return null;
    }
  }

  /**
   * Get the area domain for API requests
   */
  async getAreaDomain(): Promise<string> {
    const credentials = await this.getCredentials();
    return credentials?.apiUrl || '';
  }

  /**
   * Add a person to the system
   */
  async addPerson(personData: PersonData): Promise<ApiResponse<{ personId: string }>> {
    try {
      // Mock implementation
      return {
        success: true,
        data: {
          personId: 'person-' + Date.now()
        }
      };
    } catch (error) {
      console.error('Error adding person:', error);
      return {
        success: false,
        message: error.message || 'Failed to add person'
      };
    }
  }

  /**
   * Configure access privileges
   */
  async configureAccessPrivileges(personId: string, deviceList: DeviceAccessConfig[]): Promise<ApiResponse> {
    try {
      // Mock implementation
      return { success: true };
    } catch (error) {
      console.error('Error configuring access privileges:', error);
      return {
        success: false,
        message: error.message || 'Failed to configure access privileges'
      };
    }
  }

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
      
      // Mock implementation - would be replaced with real API call
      return [
        {
          deviceId: 'device1',
          deviceSerial: 'HK-001',
          deviceName: 'Main Entrance',
          status: 'online',
          deviceType: 'ACS',
          userName: 'admin',
          isVideoSupported: false
        },
        {
          deviceId: 'device2',
          deviceSerial: 'HK-002',
          deviceName: 'Swimming Pool',
          status: 'offline',
          deviceType: 'ACS',
          userName: 'admin',
          isVideoSupported: true
        }
      ];
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
      
      // Mock implementation
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
      
      // Mock implementation
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
      
      // Mock implementation
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
      // Fix: Replace 'api' with fetch
      await fetch(`/api/members/${member.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          access_control_id: personId
        })
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
