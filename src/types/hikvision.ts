
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

// Device Channels
export interface HikvisionDeviceChannel {
  channelId: string;
  channelName?: string;
  channelNo?: number;
  channelType?: string;
  deviceId: string;
  status?: 'online' | 'offline' | 'unknown';
}

export interface HikvisionChannelResponse {
  code: string;
  msg: string;
  data?: {
    channels: HikvisionDeviceChannel[];
    total: number;
  };
}

// Transparent API Call
export interface HikvisionTransparentRequest {
  deviceId: string;
  uri: string;
  body?: string | object;
  params?: Record<string, string>;
  headers?: Record<string, string>;
}

export interface HikvisionTransparentResponse {
  code: string;
  msg: string;
  data?: any;
}

// Batch Operations
export interface HikvisionPropertyItem {
  deviceId: string;
  deviceType?: string;
  uri: string;
  xpath?: string;
  value?: any;
}

export interface HikvisionBatchPropertyRequest {
  properties: HikvisionPropertyItem[];
}

export interface HikvisionBatchPropertyResponse {
  code: string;
  msg: string;
  data?: {
    results: Array<{
      deviceId: string;
      uri: string;
      code: string;
      msg: string;
      value?: any;
    }>;
  };
}

// Event Subscription
export interface HikvisionSubscriptionRequest {
  topics: string[];
  subscriptionId?: string;
  subscriptionDuration?: number;
}

export interface HikvisionSubscriptionResponse {
  code: string;
  msg: string;
  data?: {
    subscriptionId: string;
    expiresAt: number;
  };
}

// Events and Alarms
export interface HikvisionEventMessage {
  msgId: string;
  topic: string;
  data: any;
  timestamp: number;
}

export interface HikvisionEventsResponse {
  code: string;
  msg: string;
  data?: {
    messages: HikvisionEventMessage[];
    lastOffset?: string;
  };
}

export interface HikvisionOffsetRequest {
  subscriptionId: string;
  topic: string;
  offset: string;
}

// Person Management for Attendance
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
