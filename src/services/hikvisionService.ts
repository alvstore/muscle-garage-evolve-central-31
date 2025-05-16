
import { HikvisionSettings, HikvisionDevice, HikvisionDoor, TokenData } from '@/types/access-control';

export interface HikvisionApiSettings {
  id?: string;
  app_key: string;
  app_secret: string;
  api_url: string;
  is_active: boolean;
  branch_id: string;
  devices: HikvisionDevice[];
  created_at?: string;
  updated_at?: string;
}

export interface HikvisionApiResponse {
  code: string;
  msg: string;
  data?: any;
}

export interface TokenResponse {
  success: boolean;
  message?: string;
  token?: TokenData;
}

export interface HikvisionSite {
  id: string;
  name: string;
  description?: string;
}

export { HikvisionDevice, HikvisionDoor } from '@/types/access-control';

// Service functions
export const hikvisionService = {
  // Authentication
  getToken: async (credentials: { app_key: string, app_secret: string, api_url: string }): Promise<TokenResponse> => {
    // Mocked implementation
    console.log('Getting token with credentials:', credentials);
    return {
      success: true,
      message: 'Token retrieved successfully',
      token: {
        accessToken: 'mocked-token-' + Date.now(),
        expiresIn: 3600,
        areaDomain: 'global'
      }
    };
  },
  
  // Device management
  fetchDevices: async (settings: HikvisionApiSettings): Promise<HikvisionDevice[]> => {
    // Mocked implementation
    console.log('Fetching devices with settings:', settings);
    return [
      {
        serialNumber: 'DS-K1T671M20210428',
        name: 'Main Entrance',
        deviceName: 'Face Recognition Terminal',
        deviceType: 'DS-K1T671M',
        isOnline: true,
        doorCount: 1,
        doors: [
          { doorNo: 1, doorName: 'Main Door', doorStatus: 'online' }
        ]
      },
      {
        serialNumber: 'DS-K1T341A20200317',
        name: 'Staff Entrance',
        deviceName: 'Fingerprint Terminal',
        deviceType: 'DS-K1T341A',
        isOnline: false,
        doorCount: 1,
        doors: [
          { doorNo: 1, doorName: 'Staff Door', doorStatus: 'offline' }
        ]
      }
    ];
  },
  
  // Site management
  getSites: async (settings: HikvisionApiSettings): Promise<HikvisionSite[]> => {
    // Mocked implementation
    console.log('Getting sites with settings:', settings);
    return [
      { id: 'site001', name: 'Headquarters' },
      { id: 'site002', name: 'Branch Office' }
    ];
  },
  
  // Device operations
  addDevice: async (settings: HikvisionApiSettings, deviceInfo: { deviceName: string, deviceSerial: string, siteId: string }): Promise<boolean> => {
    // Mocked implementation
    console.log('Adding device:', deviceInfo, 'with settings:', settings);
    return true;
  },
  
  // Door operations
  getDoors: async (settings: HikvisionApiSettings, deviceSerial: string): Promise<HikvisionDoor[]> => {
    // Mocked implementation
    console.log('Getting doors for device:', deviceSerial, 'with settings:', settings);
    return [
      { doorNo: 1, doorName: 'Main Door', doorStatus: 'online' },
      { doorNo: 2, doorName: 'Emergency Exit', doorStatus: 'online' }
    ];
  },
  
  // Event subscription
  subscribeToEvents: async (settings: HikvisionApiSettings, webhookUrl: string): Promise<boolean> => {
    // Mocked implementation
    console.log('Subscribing to events with webhook URL:', webhookUrl, 'and settings:', settings);
    return true;
  }
};
