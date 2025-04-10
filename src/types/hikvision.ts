
// Add these properties to align with what the component expects
export interface HikvisionEvent {
  eventId: string;
  doorId: string;
  eventTime: string;
  eventType: "entry" | "exit" | "denied";
  memberId?: string;
  memberName?: string;
  deviceName?: string;
  deviceLocation?: string;
  // Additional properties that might be expected in the components
  id?: string;
  deviceId?: string;
  success?: boolean;
  message?: string;
  faceId?: string;
}

export interface HikvisionCredentials {
  appKey: string;
  appSecret: string;
  baseUrl: string;
  isValid: boolean;
}

export interface HikvisionDevice {
  id: string;
  name: string;
  type: string;
  location: string;
  status: "online" | "offline" | "unknown";
  ipAddress?: string;
  lastSeen?: string;
  deviceId?: string;
}
