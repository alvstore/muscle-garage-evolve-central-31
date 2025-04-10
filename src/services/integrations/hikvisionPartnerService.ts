
import { HikvisionDevice } from '@/types/hikvision';

// Interface for the device status
export interface HikvisionDeviceStatus {
  online: boolean;
  lastOnlineTime?: string;
  ipAddress?: string;
}

// Interface for the Hikvision API credentials
export interface HikvisionCredentials {
  appKey: string;
  secretKey: string;
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
  async listDevices(): Promise<HikvisionDeviceWithStatus[]> {
    // Mock implementation - in a real app this would make an API call
    const mockDevices: HikvisionDeviceWithStatus[] = [
      {
        deviceId: '1',
        deviceSerial: 'DS-7608NI-E2/8P-12345',
        deviceName: 'Main Entrance NVR',
        status: 'online',
        deviceType: 'NVR',
        channelNos: '1,2,3,4',
        userName: 'admin',
        isVideoSupported: true
      },
      {
        deviceId: '2',
        deviceSerial: 'DS-2CD2185FWD-I-67890',
        deviceName: 'Gym Area Camera',
        status: 'offline',
        deviceType: 'IPC',
        channelNos: '1',
        userName: 'admin',
        isVideoSupported: true
      }
    ];
    
    return mockDevices;
  }

  /**
   * Add a new device
   */
  async addDevice(deviceData: any): Promise<ApiResponse> {
    // Mock implementation - in a real app this would make an API call
    console.log('Adding device:', deviceData);
    return { success: true };
  }

  /**
   * Delete a device
   */
  async deleteDevice(deviceSerial: string): Promise<ApiResponse> {
    // Mock implementation - in a real app this would make an API call
    console.log('Deleting device:', deviceSerial);
    return { success: true };
  }

  /**
   * Get device status
   */
  async getDeviceStatus(deviceSerial: string): Promise<HikvisionDeviceWithStatus | null> {
    // Mock implementation - in a real app this would make an API call
    const devices = await this.listDevices();
    return devices.find(d => d.deviceSerial === deviceSerial) || null;
  }
}

export const hikvisionPartnerService = new HikvisionPartnerService();
