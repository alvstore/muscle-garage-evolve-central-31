
import { HikvisionCredentials, HikvisionDevice, HikvisionEvent, HikvisionPerson } from '@/types/hikvision';

// Re-export the type correctly with 'export type'
export type { HikvisionEvent };

class HikvisionService {
  // Test connection with Hikvision API
  async testConnection(credentials: HikvisionCredentials): Promise<boolean> {
    console.log('Testing connection with credentials:', credentials);
    // For demo, just return true
    return new Promise(resolve => setTimeout(() => resolve(true), 1000));
  }

  // Get devices from Hikvision
  async getDevices(credentials?: HikvisionCredentials): Promise<HikvisionDevice[]> {
    console.log('Getting devices with credentials:', credentials);
    return new Promise(resolve => setTimeout(() => resolve([
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
        type: 'access'
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
        type: 'access'
      },
    ]), 1000));
  }

  // Get events from Hikvision
  async getEvents(startTime?: string, credentials?: HikvisionCredentials): Promise<HikvisionEvent[]> {
    console.log('Getting events since:', startTime);
    console.log('With credentials:', credentials);
    
    return new Promise(resolve => setTimeout(() => resolve([
      {
        id: 'event1',
        eventId: 'event1',
        eventTime: new Date().toISOString(),
        eventType: 'entry',
        deviceId: 'device1',
        deviceName: 'Main Entrance Controller',
        doorId: 'door1',
        doorName: 'Front Door',
        personId: 'member-1',
        personName: 'John Doe',
        verified: true
      },
      {
        id: 'event2',
        eventId: 'event2',
        eventTime: new Date(Date.now() - 3600000).toISOString(),
        eventType: 'exit',
        deviceId: 'device1',
        deviceName: 'Main Entrance Controller',
        doorId: 'door1',
        doorName: 'Front Door',
        personId: 'member-2',
        personName: 'Jane Smith',
        verified: true
      },
    ]), 1000));
  }

  // Get persons from Hikvision
  async getPersons(credentials?: HikvisionCredentials): Promise<HikvisionPerson[]> {
    console.log('Getting persons with credentials:', credentials);
    return new Promise(resolve => setTimeout(() => resolve([]), 1000));
  }

  // Sync members to Hikvision
  async syncMembersToHikvision(credentials?: HikvisionCredentials): Promise<number> {
    console.log('Syncing members with credentials:', credentials);
    return new Promise(resolve => setTimeout(() => resolve(5), 1000));
  }

  // Process attendance from Hikvision events
  async processAttendance(events: HikvisionEvent[]): Promise<number> {
    console.log('Processing attendance for events:', events);
    return new Promise(resolve => setTimeout(() => resolve(events.length), 1000));
  }

  // Get credentials
  async getCredentials(): Promise<HikvisionCredentials> {
    console.log('Getting credentials');
    return new Promise(resolve => setTimeout(() => resolve({
      username: 'admin',
      password: '',
      apiKey: '',
      apiSecret: '',
      baseUrl: 'https://hikvision.example.com',
      isValid: false
    }), 1000));
  }

  // Save credentials
  async saveCredentials(credentials: HikvisionCredentials): Promise<void> {
    console.log('Saving credentials:', credentials);
    return new Promise(resolve => setTimeout(() => resolve(), 1000));
  }

  // Validate credentials
  async validateCredentials(credentials: HikvisionCredentials): Promise<boolean> {
    console.log('Validating credentials:', credentials);
    return this.testConnection(credentials);
  }

  // Simulate event (for demo purposes)
  async simulateEvent(memberId: string, eventType: 'entry' | 'exit' | 'denied'): Promise<HikvisionEvent> {
    console.log('Simulating event for member:', memberId, 'type:', eventType);
    
    return {
      id: `sim-${Date.now()}`,
      eventId: `sim-${Date.now()}`,
      eventTime: new Date().toISOString(),
      eventType,
      deviceId: 'device1',
      deviceName: 'Main Entrance Controller',
      doorId: 'door1',
      doorName: 'Front Door',
      personId: memberId,
      personName: 'John Doe', // In a real app, would look up the name
      verified: true
    };
  }
}

export const hikvisionService = new HikvisionService();
