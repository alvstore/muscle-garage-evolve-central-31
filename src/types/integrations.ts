
// Integration status from the database
// Matches the integration_statuses table
// https://github.com/supabase/supabase-js#using-typescript

export interface IntegrationStatus {
  id: string;
  branch_id: string | null;
  config: Record<string, any> | null;
  created_at: string | null;
  description: string;
  icon: string | null;
  integration_key: string;
  name: string;
  status: string;
  updated_at: string | null;
}

// Hikvision device configuration
// Matches the hikvision_devices table
export interface HikvisionDevice {
  id: string;
  branch_id: string;
  device_id: string;
  device_type: string | null;
  name: string;
  ip_address: string;
  username: string;
  password: string;
  port: number | null;
  model: string | null;
  firmware_version: string | null;
  mac_address: string | null;
  serial_number: string | null;
  status: string | null;
  last_online: string | null;
  last_sync: string | null;
  additional_info: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

// ESSL device settings
// Matches the essl_device_settings table
export interface EsslDeviceSettings {
  id: string;
  branch_id: string;
  device_name: string;
  device_serial: string;
  devices: any[]; // Array of device configurations
  created_at: string;
  updated_at: string;
}

// Types for device integration status
export type DeviceStatus = 'online' | 'offline' | 'error' | 'syncing';

export interface DeviceIntegrationStatus {
  deviceId: string;
  deviceType: 'hikvision' | 'essl';
  status: DeviceStatus;
  lastSync: string | null;
  error: string | null;
}

// Legacy types for backward compatibility
export interface HikvisionCredentials {
  apiUrl?: string;
  clientId?: string;
  clientSecret?: string;
  appKey?: string;
  secretKey?: string;
  username?: string;
  password?: string;
}
