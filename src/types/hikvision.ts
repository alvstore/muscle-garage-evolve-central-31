
/**
 * Hikvision Partner Pro OpenAPI Types
 */

// Authentication
export interface HikvisionAuthCredentials {
  appKey: string;
  secretKey: string;
}

export interface HikvisionAuthResponse {
  code: string;
  msg: string;
  data: {
    accessToken: string;
    expireTime: number;
    areaDomain: string;
  };
}

// Device Management
export interface HikvisionDevice {
  deviceId: string;
  deviceName?: string;
  deviceType?: string;
  deviceAddress?: string;
  devicePort?: number;
  deviceUsername?: string;
  devicePassword?: string;
  deviceStatus?: 'online' | 'offline' | 'unknown';
  channelNum?: number;
  serialNumber?: string;
  deviceVersion?: string;
  createdTime?: string;
  lastOnlineTime?: string;
}

export interface HikvisionDeviceRequest {
  deviceId?: string;
  deviceName?: string;
  deviceAddress?: string;
  devicePort?: number;
  deviceUsername?: string;
  devicePassword?: string;
  deviceType?: string;
  deviceVersion?: string;
  // Additional properties for device operations
  [key: string]: any;
}

export interface HikvisionDeviceResponse {
  code: string;
  msg: string;
  data?: {
    deviceId?: string;
    devices?: HikvisionDevice[];
    total?: number;
    [key: string]: any;
  };
}

// Site Management
export interface HikvisionSite {
  id: string;
  name: string;
  description?: string;
  createdTime?: string;
  updatedTime?: string;
}

export interface HikvisionSiteResponse {
  code: string;
  msg: string;
  data?: {
    id?: string;
    sites?: HikvisionSite[];
    total?: number;
  };
}

// Person Management
export interface HikvisionPerson {
  personId: string;
  personName?: string;
  gender?: string;
  orgIndexCode?: string;
  certificateType?: string;
  certificateNo?: string;
  phoneNo?: string;
  email?: string;
  birthday?: string;
  address?: string;
  faces?: Array<{
    faceId?: string;
    faceData?: string;
  }>;
  cards?: Array<{
    cardId?: string;
    cardNo?: string;
  }>;
}

export interface HikvisionPersonResponse {
  code: string;
  msg: string;
  data?: {
    personId?: string;
    total?: number;
    persons?: HikvisionPerson[];
  };
}

// Access Privileges
export interface HikvisionAccessPrivilege {
  personId: string;
  deviceIds: string[];
  privilegeStartTime?: string;
  privilegeEndTime?: string;
}

export interface HikvisionAccessPrivilegeResponse {
  code: string;
  msg: string;
  data?: {
    privilegeId?: string;
  };
}

// Common API response interface
export interface HikvisionApiResponse<T = any> {
  code: string;
  msg: string;
  data?: T;
}

// Event Types
export interface HikvisionEvent {
  event_id: string;
  event_type: 'entry' | 'exit' | 'denied';
  event_time: string;
  person_id?: string;
  person_name?: string;
  door_id?: string;
  door_name?: string;
  device_id?: string;
  device_name?: string;
  card_no?: string;
  face_id?: string;
}

// Log Types
export interface HikvisionSyncLog {
  id: string;
  branch_id: string;
  event_type: 'sync' | 'error' | 'warning' | 'info' | 'process' | 'simulation';
  status: 'success' | 'error' | 'warning' | 'pending';
  message: string;
  details?: string;
  entity_type?: 'member' | 'device' | 'door' | 'attendance';
  entity_id?: string;
  entity_name?: string;
  created_at: string;
}

export interface HikvisionSyncLogResponse {
  logs: HikvisionSyncLog[];
  total: number;
}
