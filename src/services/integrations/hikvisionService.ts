
import { HikvisionCredentials, HikvisionDevice, HikvisionEvent, HikvisionPerson } from "@/types/hikvision";

export { HikvisionEvent }; // Export HikvisionEvent for use in other modules

// Mock implementation for testing
export const hikvisionService = {
  testConnection: async (credentials: HikvisionCredentials): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    return true;
  },

  getDevices: async (credentials: HikvisionCredentials): Promise<HikvisionDevice[]> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return [
      {
        id: "device1",
        name: "Main Entrance",
        serialNumber: "DS-K1T341BMF20220512",
        firmwareVersion: "V3.2.2_build210427",
        model: "DS-K1T341BMF",
        ipAddress: "192.168.1.100",
        port: 80,
        status: "online",
        deviceType: "access_control"
      },
      {
        id: "device2",
        name: "Staff Entrance",
        serialNumber: "DS-K1T341BMF20220513",
        firmwareVersion: "V3.2.2_build210427",
        model: "DS-K1T341BMF",
        ipAddress: "192.168.1.101",
        port: 80,
        status: "online",
        deviceType: "access_control"
      },
      {
        id: "device3",
        name: "Gym Area",
        serialNumber: "DS-K1T341BMF20220514",
        firmwareVersion: "V3.2.2_build210427",
        model: "DS-K1T341BMF",
        ipAddress: "192.168.1.102",
        port: 80,
        status: "offline",
        deviceType: "access_control"
      }
    ];
  },
  
  getEvents: async (credentials: HikvisionCredentials, params?: any): Promise<HikvisionEvent[]> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return [
      {
        id: "event1",
        eventTime: "2023-07-10T08:30:00Z",
        eventType: "entry",
        cardNo: "12345",
        employeeNo: "EMP001",
        deviceId: "device1",
        deviceName: "Main Entrance",
        doorId: "door1",
        doorName: "Front Door",
        personId: "person1",
        personName: "John Doe",
        verified: true
      },
      {
        id: "event2",
        eventTime: "2023-07-10T09:15:00Z",
        eventType: "denied",
        cardNo: "67890",
        employeeNo: "EMP002",
        deviceId: "device1",
        deviceName: "Main Entrance",
        doorId: "door1",
        doorName: "Front Door",
        personId: "person2",
        personName: "Jane Smith",
        verified: false
      },
      {
        id: "event3",
        eventTime: "2023-07-10T17:45:00Z",
        eventType: "exit",
        cardNo: "12345",
        employeeNo: "EMP001",
        deviceId: "device1",
        deviceName: "Main Entrance",
        doorId: "door1",
        doorName: "Front Door",
        personId: "person1",
        personName: "John Doe",
        verified: true
      }
    ];
  },
  
  getPersons: async (credentials: HikvisionCredentials): Promise<HikvisionPerson[]> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return [
      {
        id: "person1",
        name: "John Doe",
        employeeNo: "EMP001",
        gender: "male",
        enabled: true,
        beginTime: "2023-01-01T00:00:00Z",
        endTime: "2024-01-01T00:00:00Z"
      },
      {
        id: "person2",
        name: "Jane Smith",
        employeeNo: "EMP002",
        gender: "female",
        enabled: true,
        beginTime: "2023-01-01T00:00:00Z",
        endTime: "2024-01-01T00:00:00Z"
      }
    ];
  },
  
  syncMembersToHikvision: async (credentials: HikvisionCredentials, members: any[]): Promise<{ success: boolean; synced: number; errors: number }> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      success: true,
      synced: members.length,
      errors: 0
    };
  }
};
