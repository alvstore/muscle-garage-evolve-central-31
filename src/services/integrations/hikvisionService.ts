
// Basic Hikvision integration service

export interface HikvisionCredentials {
  appKey: string;
  secretKey: string;
  baseUrl: string;
}

export interface HikvisionDevice {
  id: string;
  serialNumber: string;
  name: string;
  model: string;
  online: boolean;
  doors: HikvisionDoor[];
}

export interface HikvisionDoor {
  id: number;
  name: string;
}

export interface HikvisionPerson {
  id: string;
  name: string;
  cardNo: string;
  personType: number;
  faceImage?: string;
}

export interface HikvisionEvent {
  eventId: string;
  eventType: string;
  eventTime: string;
  deviceId: string;
  doorId: number;
  personId: string;
  cardNo?: string;
}

export interface HikvisionSyncStatus {
  taskId: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  progress: number;
  message?: string;
}

class HikvisionService {
  private credentials: HikvisionCredentials | null = null;
  private token: string | null = null;
  private tokenExpiry: Date | null = null;

  constructor() {
    // Initialize with empty credentials
  }

  setCredentials(credentials: HikvisionCredentials) {
    this.credentials = credentials;
  }

  async authenticate(): Promise<string> {
    if (!this.credentials) {
      throw new Error('Credentials not configured');
    }

    // For demonstration purposes
    console.log('Authenticating with Hikvision API...');
    this.token = "mock_hikvision_token";
    this.tokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    return this.token;
  }

  private async getAuthToken(): Promise<string> {
    if (!this.token || !this.tokenExpiry || this.tokenExpiry < new Date()) {
      return this.authenticate();
    }
    return this.token;
  }

  // Device management
  async listDevices(): Promise<HikvisionDevice[]> {
    await this.getAuthToken();
    
    // Mock implementation
    return [
      {
        id: '1',
        serialNumber: 'DS-K1T341AMF20220512',
        name: 'Main Entrance',
        model: 'DS-K1T341AMF',
        online: true,
        doors: [
          { id: 1, name: 'Front Door' },
          { id: 2, name: 'Back Door' },
        ]
      },
      {
        id: '2',
        serialNumber: 'DS-K1T342BMF20220513',
        name: 'Gym Area',
        model: 'DS-K1T342BMF',
        online: true,
        doors: [
          { id: 1, name: 'Gym Entrance' },
        ]
      }
    ];
  }

  // Person management
  async addPerson(person: Omit<HikvisionPerson, 'id'>): Promise<HikvisionPerson> {
    await this.getAuthToken();
    
    // Mock implementation
    return {
      id: `person_${Date.now()}`,
      ...person
    };
  }

  async updatePerson(person: HikvisionPerson): Promise<HikvisionPerson> {
    await this.getAuthToken();
    
    // Mock implementation
    return person;
  }

  async deletePerson(personId: string): Promise<boolean> {
    await this.getAuthToken();
    
    // Mock implementation
    return true;
  }

  // Synchronization
  async syncPersonToDevices(personId: string, deviceIds: string[]): Promise<string> {
    await this.getAuthToken();
    
    // Mock implementation - return task ID
    return `sync_task_${Date.now()}`;
  }

  async getSyncStatus(taskId: string): Promise<HikvisionSyncStatus> {
    await this.getAuthToken();
    
    // Mock implementation
    return {
      taskId,
      status: 'completed',
      progress: 100
    };
  }

  // Events
  async getRecentEvents(deviceId?: string): Promise<HikvisionEvent[]> {
    await this.getAuthToken();
    
    // Mock implementation
    return [
      {
        eventId: '1',
        eventType: 'doorOpen',
        eventTime: new Date().toISOString(),
        deviceId: deviceId || '1',
        doorId: 1,
        personId: 'person_1',
        cardNo: '123456'
      }
    ];
  }
}

const hikvisionService = new HikvisionService();
export default hikvisionService;
