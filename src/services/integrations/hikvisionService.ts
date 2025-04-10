
import { HikvisionDevice, HikvisionEvent, HikvisionCredentials } from '@/types/hikvision';

// This is a mock implementation for development purposes
// In a real app, this would make actual API calls to Hikvision devices

const mockCredentials: HikvisionCredentials = {
  username: "admin",
  password: "password",
  baseUrl: "https://hikvision.example.com/api"
};

const mockDevices: HikvisionDevice[] = [
  {
    id: "device1",
    name: "Main Entrance",
    serialNumber: "DS-K1T671M20201204C",
    firmwareVersion: "V3.2.2_build210302",
    model: "DS-K1T671M",
    ipAddress: "192.168.1.100",
    port: 80,
    status: "online"
  },
  {
    id: "device2",
    name: "Staff Entrance",
    serialNumber: "DS-K1T671M20201205D",
    firmwareVersion: "V3.2.2_build210302",
    model: "DS-K1T671M",
    ipAddress: "192.168.1.101",
    port: 80,
    status: "online"
  },
  {
    id: "device3",
    name: "Emergency Exit",
    serialNumber: "DS-K1T671M20201206E",
    firmwareVersion: "V3.2.2_build210302",
    model: "DS-K1T605M",
    ipAddress: "192.168.1.102",
    port: 80,
    status: "offline"
  }
];

const mockEvents: HikvisionEvent[] = [
  {
    id: "event1",
    eventTime: new Date(Date.now() - 5000).toISOString(),
    eventType: "entry",
    cardNo: "123456",
    employeeNo: "EMP001",
    deviceId: "device1",
    deviceName: "Main Entrance",
    doorId: "door1",
    doorName: "Main Door",
    personId: "person1",
    personName: "John Doe",
    verified: true
  },
  {
    id: "event2",
    eventTime: new Date(Date.now() - 60000).toISOString(),
    eventType: "exit",
    cardNo: "123456",
    employeeNo: "EMP001",
    deviceId: "device1",
    deviceName: "Main Entrance",
    doorId: "door1",
    doorName: "Main Door",
    personId: "person1",
    personName: "John Doe",
    verified: true
  },
  {
    id: "event3",
    eventTime: new Date(Date.now() - 120000).toISOString(),
    eventType: "denied",
    cardNo: "654321",
    employeeNo: "EMP002",
    deviceId: "device2",
    deviceName: "Staff Entrance",
    doorId: "door2",
    doorName: "Staff Door",
    personId: "person2",
    personName: "Jane Smith",
    verified: false
  }
];

export const hikvisionService = {
  // Get credentials
  getCredentials: async (): Promise<HikvisionCredentials> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockCredentials);
      }, 500);
    });
  },

  // Save credentials
  saveCredentials: async (credentials: HikvisionCredentials): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("Saving credentials:", credentials);
        resolve(true);
      }, 500);
    });
  },

  // Validate credentials
  validateCredentials: async (credentials: HikvisionCredentials): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 1000);
    });
  },

  // Get all devices
  getDevices: async (): Promise<HikvisionDevice[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockDevices);
      }, 800);
    });
  },

  // Get events for a given time range
  getEvents: async (startTime: string, endTime?: string): Promise<HikvisionEvent[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockEvents);
      }, 800);
    });
  },

  // Process attendance from events
  processAttendance: async (events: HikvisionEvent[]): Promise<number> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Processing ${events.length} events for attendance`);
        resolve(events.length);
      }, 1000);
    });
  },

  // Simulate an event for testing
  simulateEvent: async (memberId: string, eventType: 'entry' | 'exit' | 'denied'): Promise<HikvisionEvent> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const event: HikvisionEvent = {
          id: `sim-${Date.now()}`,
          eventTime: new Date().toISOString(),
          eventType,
          personId: memberId,
          personName: "Simulated User",
          deviceId: "device1",
          deviceName: "Main Entrance",
          verified: eventType !== 'denied'
        };
        console.log("Simulated event:", event);
        resolve(event);
      }, 500);
    });
  }
};
