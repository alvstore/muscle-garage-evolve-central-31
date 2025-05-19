
export interface HikvisionSettings {
  apiUrl: string;
  appKey: string;
  appSecret: string;
  isActive: boolean;
  branchId?: string;
  siteId?: string;
  siteName?: string;
  syncInterval?: number;
  lastSync?: string | null;
}

export interface HikvisionSite {
  siteId: string;
  siteName: string;
  parentSiteId?: string;
  desc?: string;
}

export interface HikvisionDoor {
  id: string;
  doorNumber?: string;
  doorName: string;
  deviceId: string;
}

export interface HikvisionDevice {
  id: string;
  deviceId: string;
  name: string;
  serialNumber?: string;
  model?: string;
  deviceType: 'entry' | 'exit' | 'gym' | 'swimming' | 'special';
  ipAddress?: string;
  port?: number;
  username?: string;
  password?: string;
  isActive: boolean;
  isCloudManaged: boolean;
  useIsupFallback: boolean;
  lastOnline?: string;
  lastSync?: string;
  location?: string;
  branchId?: string;
  siteId?: string;
  doors: HikvisionDoor[];
}

export interface HikvisionPerson {
  personId: string;
  memberId?: string;
  name: string;
  gender?: string;
  cardNo?: string;
  phone?: string;
  email?: string;
  status: 'active' | 'inactive';
  faceData?: string[];
  fingerPrintData?: string[];
  branchId: string;
  lastSync?: string;
  syncStatus?: 'success' | 'failed' | 'pending';
}

export interface HikvisionAccessPrivilege {
  id: string;
  personId: string;
  doorId: string;
  privilege: number;
  schedule: number;
  validStartTime?: string;
  validEndTime?: string;
  status: 'active' | 'inactive';
  lastSync?: string;
  syncStatus?: 'success' | 'failed' | 'pending';
}

export interface HikvisionEvent {
  id: string;
  eventId: string;
  eventType: 'entry' | 'exit' | 'denied';
  eventTime: string;
  personId?: string;
  personName?: string;
  doorId?: string;
  doorName?: string;
  deviceId?: string;
  deviceName?: string;
  cardNo?: string;
  faceId?: string;
  pictureUrl?: string;
  processed: boolean;
  processedAt?: string;
}
