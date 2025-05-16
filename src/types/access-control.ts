
export interface AccessZone {
  id: string;
  name: string;
  description?: string;
  branch_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface AccessDoor {
  id: string;
  door_name: string;
  device_id: string;
  hikvision_door_id: string;
  door_number?: string;
  is_active?: boolean;
  zone_id?: string;
  branch_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface MemberAccess {
  id: string;
  member_id: string;
  door_id?: string;
  zone_id?: string;
  access_level: string;
  valid_from: string;
  valid_until?: string;
  created_at?: string;
  updated_at?: string;
}

export interface HikvisionSettings {
  id?: string;
  app_key: string;
  app_secret: string;
  api_url: string;
  is_active: boolean;
  branch_id: string;
  devices: HikvisionDevice[];
  created_at?: string;
  updated_at?: string;
}

export interface HikvisionDevice {
  serialNumber: string;
  name: string;
  deviceName?: string;
  deviceType?: string;
  isOnline?: boolean;
  isCloudManaged?: boolean;
  doorCount?: number;
  doors?: HikvisionDoor[];
}

export interface HikvisionDoor {
  doorNo: number;
  doorName?: string;
  doorStatus?: string;
}

export interface TokenData {
  accessToken: string;
  expiresIn: number;
  areaDomain?: string;
}
