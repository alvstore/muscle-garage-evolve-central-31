import { HikvisionDeviceWithStatus, HikvisionDevice, HikvisionPartner } from "@/types/hikvision";

// Mock data - replace with actual database calls
let mockDevices: HikvisionDeviceWithStatus[] = [];
let mockPartners: HikvisionPartner[] = [];

// Initialize mock data (for testing purposes)
const initializeMockData = () => {
  mockDevices = [
    {
      id: "device1",
      name: "Main Entrance Camera",
      serialNumber: "SN12345",
      firmwareVersion: "v1.2.3",
      model: "DS-2CD2347G2-L",
      ipAddress: "192.168.1.10",
      port: 8000,
      status: "online",
      lastSeen: new Date().toISOString(),
      healthStatus: "healthy",
      deviceId: "device1"
    },
    {
      id: "device2",
      name: "Back Door Camera",
      serialNumber: "SN67890",
      firmwareVersion: "v1.2.3",
      model: "DS-2CD2347G2-L",
      ipAddress: "192.168.1.11",
      port: 8000,
      status: "offline",
      lastSeen: new Date().toISOString(),
      healthStatus: "error",
      deviceId: "device2"
    },
  ];

  mockPartners = [
    {
      id: "partner1",
      name: "Security Solutions Inc.",
      apiKey: "apikey123",
      apiSecret: "secret456",
      baseUrl: "https://securitysolutions.com/api",
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
};

initializeMockData();

export const hikvisionPartnerService = {
  // Device Management
  getAllDevices: async (): Promise<HikvisionDeviceWithStatus[]> => {
    return mockDevices;
  },

  getDeviceById: async (deviceId: string): Promise<HikvisionDeviceWithStatus | undefined> => {
    return mockDevices.find(device => device.id === deviceId);
  },

  // Fix device creation
  createDevice: async (deviceData: Partial<HikvisionDeviceWithStatus>): Promise<HikvisionDeviceWithStatus> => {
    const newDevice: HikvisionDeviceWithStatus = {
      id: `device${Date.now()}`,
      name: deviceData.name || 'New Device',
      serialNumber: deviceData.serialNumber || `SN${Date.now()}`,
      firmwareVersion: deviceData.firmwareVersion || 'v1.0',
      model: deviceData.model || 'Generic Model',
      ipAddress: deviceData.ipAddress || '192.168.1.1',
      port: deviceData.port || 80,
      status: deviceData.status || 'offline',
      lastSeen: new Date().toISOString(),
      healthStatus: 'healthy',
      // Add id as deviceId for compatibility
      deviceId: `device${Date.now()}`
    };
    
    mockDevices.push(newDevice);
    return newDevice;
  },

  // Fix update device
  updateDevice: async (deviceId: string, deviceData: Partial<HikvisionDeviceWithStatus>): Promise<HikvisionDeviceWithStatus> => {
    const index = mockDevices.findIndex(d => d.id === deviceId);
    if (index < 0) throw new Error(`Device with ID ${deviceId} not found`);
    
    const updatedDevice = {
      ...mockDevices[index],
      ...deviceData,
      // Ensure deviceId is present
      deviceId: deviceId
    };
    
    mockDevices[index] = updatedDevice;
    return updatedDevice;
  },

  deleteDevice: async (deviceId: string): Promise<void> => {
    mockDevices = mockDevices.filter(device => device.id !== deviceId);
  },

  // Partner Management
  getAllPartners: async (): Promise<HikvisionPartner[]> => {
    return mockPartners;
  },

  getPartnerById: async (partnerId: string): Promise<HikvisionPartner | undefined> => {
    return mockPartners.find(partner => partner.id === partnerId);
  },

  createPartner: async (partnerData: HikvisionPartner): Promise<HikvisionPartner> => {
    const newPartner: HikvisionPartner = {
      ...partnerData,
      id: `partner${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockPartners.push(newPartner);
    return newPartner;
  },

  updatePartner: async (partnerId: string, partnerData: Partial<HikvisionPartner>): Promise<HikvisionPartner> => {
    const index = mockPartners.findIndex(partner => partner.id === partnerId);
    if (index < 0) throw new Error(`Partner with ID ${partnerId} not found`);

    const updatedPartner = {
      ...mockPartners[index],
      ...partnerData,
      updatedAt: new Date().toISOString(),
    };

    mockPartners[index] = updatedPartner;
    return updatedPartner;
  },

  deletePartner: async (partnerId: string): Promise<void> => {
    mockPartners = mockPartners.filter(partner => partner.id !== partnerId);
  },
};
