
// Attendance and access control types
export type AttendanceMethod = 'manual' | 'qr_code' | 'biometric' | 'card' | 'mobile_app';

export interface MemberAttendance {
  id: string;
  member_id: string;
  branch_id: string;
  check_in: string;
  check_out?: string;
  method: AttendanceMethod;
  device_id?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface AttendanceSettings {
  id: string;
  branch_id?: string;
  qr_enabled: boolean;
  hikvision_enabled: boolean;
  device_config: Record<string, any>;
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
  branch_id: string;
  device_type?: string;
  model?: string;
  serial_number?: string;
  mac_address?: string;
  firmware_version?: string;
  status: 'active' | 'inactive' | 'error';
  last_online?: string;
  last_sync?: string;
  additional_info?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface HikvisionEvent {
  id: string;
  event_id: string;
  event_type: string;
  event_time: string;
  device_id?: string;
  door_id?: string;
  door_name?: string;
  person_id?: string;
  face_id?: string;
  card_no?: string;
  picture_url?: string;
  raw_data?: Record<string, any>;
  processed: boolean;
  processed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface AccessDenialLog {
  id: string;
  person_id?: string;
  door_id?: string;
  device_id?: string;
  event_id?: string;
  event_time?: string;
  branch_id?: string;
  raw_data?: Record<string, any>;
  created_at: string;
}
