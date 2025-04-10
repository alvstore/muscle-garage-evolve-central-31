
// Basic device type that should be returned from the Hikvision API
export interface HikvisionDevice {
  id: string;
  name: string;
  serialNumber: string;
  firmwareVersion: string;
  model: string;
  ipAddress: string;
  port: number;
  status: string; // online, offline, etc.
  deviceType?: string; // Added deviceType property
}

// Extended device type with status for the UI
export interface HikvisionDeviceWithStatus extends HikvisionDevice {
  status?: string; // Optional to match usage
  lastSeen?: string;
  healthStatus?: 'healthy' | 'warning' | 'error';
  deviceType?: string; // Added to match usage
}

// Access Control Credentials
export interface HikvisionCredentials {
  username: string;
  password: string;
  apiKey?: string;
  apiSecret?: string;
  baseUrl: string;
}

// Event data from Hikvision
export interface HikvisionEvent {
  id: string;
  eventTime: string;
  eventType: 'entry' | 'exit' | 'denied';
  cardNo?: string;
  employeeNo?: string;
  deviceId: string;
  deviceName: string;
  doorId?: string;
  doorName?: string;
  personId?: string;
  personName?: string;
  verified: boolean;
}

// Access level for door permissions
export interface HikvisionAccessLevel {
  id: string;
  name: string;
  doorIds: string[];
  doors?: HikvisionDoor[];
  scheduleId?: string;
  description?: string;
}

// Door information
export interface HikvisionDoor {
  id: string;
  name: string;
  deviceId: string;
  doorIndex: number;
  status?: 'open' | 'closed' | 'locked' | 'unlocked' | 'unknown';
}

// Person information
export interface HikvisionPerson {
  id: string;
  name: string;
  employeeNo?: string;
  gender?: 'male' | 'female' | 'other' | 'unknown';
  cards?: HikvisionCard[];
  accessLevelIds?: string[];
  accessLevels?: HikvisionAccessLevel[];
  enabled: boolean;
  beginTime?: string;
  endTime?: string;
  photos?: string[]; // Base64 encoded photos
}

// Card information
export interface HikvisionCard {
  id: string;
  cardNo: string;
  status: 'active' | 'inactive' | 'lost';
}

// Webhook events
export interface HikvisionWebhookEvent {
  eventType: string;
  eventTime: string;
  eventSource: string;
  data: any;
}

// Hardware sync status
export interface HikvisionSyncStatus {
  lastSyncTime: string;
  pendingChanges: number;
  syncInProgress: boolean;
  errors?: string[];
}

// Integration partner data
export interface HikvisionPartner {
  id: string;
  name: string;
  apiKey: string;
  apiSecret: string;
  baseUrl: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}
