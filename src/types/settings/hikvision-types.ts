
// Hikvision access control types
export interface HikvisionApiSettings {
  id: string;
  branch_id: string;
  app_key: string;
  app_secret: string;
  api_url: string;
  site_id?: string;
  site_name?: string;
  devices: HikvisionDevice[];
  is_active: boolean;
  last_sync?: string;
  sync_interval?: number;
  created_at: string;
  updated_at: string;
}

export interface HikvisionDevice {
  id: string;
  device_id: string;
  name: string;
  ip_address: string;
  port?: number;
  username: string;
  password: string;
  device_type?: string;
  serial_number?: string;
  mac_address?: string;
  model?: string;
  firmware_version?: string;
  status: 'active' | 'inactive' | 'offline';
  branch_id: string;
  last_online?: string;
  last_sync?: string;
  additional_info?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface HikvisionPerson {
  id: string;
  person_id: string;
  member_id?: string;
  name: string;
  email?: string;
  phone?: string;
  gender?: string;
  card_no?: string;
  person_type?: number;
  face_data?: string[];
  finger_print_data?: string[];
  status: 'active' | 'inactive';
  sync_status?: string;
  branch_id: string;
  last_sync?: string;
  additional_info?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface HikvisionEvent {
  id: string;
  event_id: string;
  eventId: string; // Alias for camelCase compatibility
  event_type: string;
  eventType: string; // Alias for camelCase compatibility
  event_time: string;
  eventTime: string; // Alias for camelCase compatibility
  person_id?: string;
  personId?: string; // Alias for camelCase compatibility
  personName?: string; // Additional property for display
  device_id?: string;
  door_id?: string;
  door_name?: string;
  doorName?: string; // Alias for camelCase compatibility
  face_id?: string;
  card_no?: string;
  picture_url?: string;
  raw_data?: Record<string, any>;
  processed: boolean;
  processed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface AccessDoor {
  id: string;
  door_name: string;
  door_number?: string;
  hikvision_door_id: string;
  device_id: string;
  zone_id?: string;
  branch_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AccessZone {
  id: string;
  name: string;
  description?: string;
  branch_id: string;
  created_at: string;
  updated_at: string;
}

export interface HikvisionToken {
  id: string;
  branch_id: string;
  access_token: string;
  refresh_token?: string;
  token_type?: string;
  expires_in?: number;
  expire_time: string;
  scope?: string;
  area_domain?: string;
  available_sites?: any[];
  created_at: string;
  updated_at: string;
}

export interface AccessPrivilege {
  id: string;
  person_id: string;
  door_id: string;
  privilege: number;
  schedule?: number;
  valid_start_time?: string;
  valid_end_time?: string;
  status: 'active' | 'inactive';
  sync_status?: string;
  last_sync?: string;
  created_at: string;
  updated_at: string;
}
