
import { 
  HikvisionDevice, 
  HikvisionDeviceWithStatus, 
  HikvisionCredentials, 
  HikvisionPartner 
} from '@/types/hikvision';

// Re-export for usage in other files
export type { HikvisionDeviceWithStatus };

class HikvisionPartnerService {
  // Get all devices
  async getAllDevices(): Promise<HikvisionDeviceWithStatus[]> {
    console.log('Getting all devices');
    
    // Mock data
    return [
      {
        id: 'device1',
        name: 'Main Entrance Controller',
        serialNumber: 'DS-K2804',
        firmwareVersion: '1.4.2',
        model: 'DS-K2804',
        ipAddress: '192.168.1.100',
        port: 80,
        status: 'online',
        deviceType: 'access',
        location: 'Main Entrance',
        healthStatus: 'healthy',
        lastSeen: new Date().toISOString(),
        deviceId: 'device1', 
        type: 'access',
        deviceSerial: 'DS-K2804',
        deviceName: 'Main Entrance Controller',
        deviceCode: 'D001',
        userName: 'admin',
        channelNos: '1',
        isVideoSupported: true
      },
      {
        id: 'device2',
        name: 'Staff Entrance Controller',
        serialNumber: 'DS-K2801',
        firmwareVersion: '1.4.0',
        model: 'DS-K2801',
        ipAddress: '192.168.1.101',
        port: 80,
        status: 'online',
        deviceType: 'access',
        location: 'Staff Entrance',
        healthStatus: 'warning',
        lastSeen: new Date(Date.now() - 86400000).toISOString(),
        deviceId: 'device2',
        type: 'access',
        deviceSerial: 'DS-K2801',
        deviceName: 'Staff Entrance Controller',
        deviceCode: 'D002',
        userName: 'admin',
        channelNos: '1',
        isVideoSupported: true
      },
    ];
  }

  // List devices (alias for getAllDevices for compatibility)
  async listDevices(): Promise<HikvisionDeviceWithStatus[]> {
    return this.getAllDevices();
  }

  // Get device by ID
  async getDeviceById(deviceId: string): Promise<HikvisionDeviceWithStatus> {
    console.log('Getting device by ID:', deviceId);
    
    // Mock data
    return {
      id: deviceId,
      name: 'Main Entrance Controller',
      serialNumber: 'DS-K2804',
      firmwareVersion: '1.4.2',
      model: 'DS-K2804',
      ipAddress: '192.168.1.100',
      port: 80,
      status: 'online',
      deviceType: 'access',
      location: 'Main Entrance',
      healthStatus: 'healthy',
      lastSeen: new Date().toISOString(),
      deviceId: deviceId,
      type: 'access',
      deviceSerial: 'DS-K2804',
      deviceName: 'Main Entrance Controller',
      deviceCode: 'D001',
      userName: 'admin',
      channelNos: '1',
      isVideoSupported: true
    };
  }

  // Add a device
  async addDevice(device: Partial<HikvisionDeviceWithStatus>): Promise<{ success: boolean; message: string; device: HikvisionDeviceWithStatus }> {
    console.log('Adding device:', device);
    
    // Mock response
    return {
      success: true,
      message: 'Device added successfully',
      device: {
        id: `device-${Date.now()}`,
        name: device.name || 'New Device',
        serialNumber: device.serialNumber || 'UNKNOWN',
        firmwareVersion: device.firmwareVersion || '1.0.0',
        model: device.model || 'UNKNOWN',
        ipAddress: device.ipAddress || '0.0.0.0',
        port: device.port || 80,
        status: 'offline',
        deviceType: device.deviceType || 'access',
        location: device.location || 'Unknown',
        healthStatus: 'warning',
        lastSeen: new Date().toISOString(),
        deviceId: `device-${Date.now()}`,
        type: device.type || 'access',
        deviceSerial: device.deviceSerial || `dev-${Date.now()}`,
        deviceName: device.deviceName || 'New Device',
        deviceCode: device.deviceCode || '',
        userName: device.userName || 'admin',
        channelNos: device.channelNos || '1',
        isVideoSupported: device.isVideoSupported || false
      }
    };
  }

  // Update a device
  async updateDevice(deviceId: string, updates: Partial<HikvisionDeviceWithStatus>): Promise<{ success: boolean; message: string }> {
    console.log('Updating device:', deviceId, 'with:', updates);
    
    // Mock response
    return {
      success: true,
      message: 'Device updated successfully'
    };
  }

  // Delete a device
  async deleteDevice(deviceId: string): Promise<{ success: boolean; message: string }> {
    console.log('Deleting device:', deviceId);
    
    // Mock response
    return {
      success: true,
      message: 'Device deleted successfully'
    };
  }

  // Get device status
  async getDeviceStatus(deviceId: string): Promise<{ status: string; lastSeen: string; healthStatus: 'healthy' | 'warning' | 'error' }> {
    console.log('Getting status for device:', deviceId);
    
    // Mock response
    return {
      status: 'online',
      lastSeen: new Date().toISOString(),
      healthStatus: 'healthy'
    };
  }

  // Get all partners
  async getAllPartners(): Promise<HikvisionPartner[]> {
    console.log('Getting all partners');
    
    // Mock data
    return [
      {
        id: 'partner1',
        name: 'Main Office',
        apiKey: 'api_key_1',
        apiSecret: 'api_secret_1',
        baseUrl: 'https://hikvision1.example.com',
        status: 'active',
        createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'partner2',
        name: 'Branch Office',
        apiKey: 'api_key_2',
        apiSecret: 'api_secret_2',
        baseUrl: 'https://hikvision2.example.com',
        status: 'inactive',
        createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
        updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
      }
    ];
  }

  // Add a partner
  async addPartner(partner: Partial<HikvisionPartner>): Promise<{ success: boolean; message: string; partner: HikvisionPartner }> {
    console.log('Adding partner:', partner);
    
    // Mock response
    return {
      success: true,
      message: 'Partner added successfully',
      partner: {
        id: `partner-${Date.now()}`,
        name: partner.name || 'New Partner',
        apiKey: partner.apiKey || 'generated_api_key',
        apiSecret: partner.apiSecret || 'generated_api_secret',
        baseUrl: partner.baseUrl || 'https://example.com',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };
  }

  // Delete a partner
  async deletePartner(partnerId: string): Promise<{ success: boolean; message: string }> {
    console.log('Deleting partner:', partnerId);
    
    // Mock response
    return {
      success: true,
      message: 'Partner deleted successfully'
    };
  }

  // Additional methods needed by components
  async getCredentials(): Promise<HikvisionCredentials> {
    console.log('Getting credentials');
    return {
      username: 'admin',
      password: '',
      apiKey: '',
      apiSecret: '',
      baseUrl: 'https://hikvision.example.com',
      isValid: false,
      appKey: '',
      secretKey: ''
    };
  }

  async saveCredentials(apiKey: string, secretKey?: string): Promise<void> {
    console.log('Saving credentials:', apiKey, secretKey);
  }

  async testConnection(): Promise<{ success: boolean; message?: string }> {
    console.log('Testing connection');
    return { success: true, message: 'Connection successful' };
  }
}

export const hikvisionPartnerService = new HikvisionPartnerService();
