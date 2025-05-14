
export interface HikvisionEvent {
  id: string;
  eventType: string;
  eventTime: string;
  cardNumber?: string;
  employeeId?: string;
  doorId?: string;
  deviceId?: string;
  success: boolean;
  message?: string;
  branchId: string;
}

export interface HikvisionDeviceConfig {
  id: string;
  name: string;
  ipAddress: string;
  port: number;
  username: string;
  password: string;
  deviceSerialNumber: string;
  isActive: boolean;
  branchId: string;
}

export interface HikvisionAccessDoor {
  id: string;
  name: string;
  doorNumber: number;
  deviceId: string;
  accessLevels: string[];
}

const hikvisionService = {
  // Device configuration
  getDeviceConfigs: async (branchId: string): Promise<HikvisionDeviceConfig[]> => {
    try {
      // This would typically fetch from your backend
      return [];
    } catch (error) {
      console.error('Error fetching Hikvision device configs:', error);
      throw error;
    }
  },
  
  addDeviceConfig: async (config: Omit<HikvisionDeviceConfig, 'id'>): Promise<HikvisionDeviceConfig> => {
    try {
      // This would typically call your backend API
      return {
        id: `dev_${Date.now()}`,
        ...config
      };
    } catch (error) {
      console.error('Error adding Hikvision device config:', error);
      throw error;
    }
  },
  
  updateDeviceConfig: async (id: string, updates: Partial<HikvisionDeviceConfig>): Promise<HikvisionDeviceConfig> => {
    try {
      // This would typically call your backend API
      return {
        id,
        name: updates.name || '',
        ipAddress: updates.ipAddress || '',
        port: updates.port || 0,
        username: updates.username || '',
        password: updates.password || '',
        deviceSerialNumber: updates.deviceSerialNumber || '',
        isActive: updates.isActive ?? true,
        branchId: updates.branchId || '',
      };
    } catch (error) {
      console.error('Error updating Hikvision device config:', error);
      throw error;
    }
  },
  
  deleteDeviceConfig: async (id: string): Promise<void> => {
    try {
      // This would typically call your backend API
    } catch (error) {
      console.error('Error deleting Hikvision device config:', error);
      throw error;
    }
  },
  
  // Events
  getEvents: async (branchId: string, startDate?: Date, endDate?: Date): Promise<HikvisionEvent[]> => {
    try {
      // This would typically fetch from your backend
      return [];
    } catch (error) {
      console.error('Error fetching Hikvision events:', error);
      throw error;
    }
  },
  
  // Testing device connection
  testDeviceConnection: async (config: Partial<HikvisionDeviceConfig>): Promise<boolean> => {
    try {
      // This would typically test connection to the device via your backend
      return true;
    } catch (error) {
      console.error('Error testing Hikvision device connection:', error);
      return false;
    }
  },
  
  // Door access configuration
  getDoorConfigs: async (deviceId: string): Promise<HikvisionAccessDoor[]> => {
    try {
      // This would typically fetch from your backend
      return [];
    } catch (error) {
      console.error('Error fetching Hikvision door configs:', error);
      throw error;
    }
  },
  
  // Sync attendance records
  syncAttendanceRecords: async (branchId: string, startDate: Date, endDate: Date): Promise<number> => {
    try {
      // This would typically call your backend API to sync records
      return 0;
    } catch (error) {
      console.error('Error syncing Hikvision attendance records:', error);
      throw error;
    }
  }
};

export default hikvisionService;
