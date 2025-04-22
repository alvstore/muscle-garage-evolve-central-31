
import { Branch } from './branch';

export interface DeviceMapping {
  id: string;
  branchId: string;
  deviceId: string;
  deviceName: string;
  deviceType: 'entry' | 'exit' | 'swimming' | 'gym' | 'special';
  deviceSerial: string;
  deviceLocation: string;
  isActive: boolean;
  lastSyncTime?: string;
  createdAt: string;
  updatedAt: string;
  // Enhanced fields for integration options
  apiMethod: 'OpenAPI' | 'ISAPI';
  ipAddress?: string;
  port?: string;
  username?: string;
  password?: string;
  useISAPIFallback?: boolean;
  lastFailedSync?: string;
  lastSuccessfulSync?: string;
  syncStatus?: 'success' | 'failed' | 'pending';
}

export interface BranchDeviceSettings {
  branchId: string;
  devices: DeviceMapping[];
  defaultAccessRules: {
    gymOnlyAccess: boolean;
    swimmingOnlyAccess: boolean;
    premiumAccess: boolean;
  };
  syncFrequency: 'realtime' | '15min' | 'hourly' | 'daily';
  integrationEnabled: boolean;
  useISAPIWhenOpenAPIFails: boolean; // Global fallback setting
}

export interface DeviceMappingFormValues {
  deviceId: string;
  deviceName: string;
  deviceType: 'entry' | 'exit' | 'swimming' | 'gym' | 'special';
  deviceSerial: string;
  deviceLocation: string;
  isActive: boolean;
  apiMethod: 'OpenAPI' | 'ISAPI';
  ipAddress?: string;
  port?: string;
  username?: string;
  password?: string;
  useISAPIFallback?: boolean;
}

export interface ApiTestResult {
  success: boolean;
  message: string;
  apiMethod: 'OpenAPI' | 'ISAPI';
  timestamp: string;
}
