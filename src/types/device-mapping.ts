
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
}

export interface DeviceMappingFormValues {
  deviceId: string;
  deviceName: string;
  deviceType: 'entry' | 'exit' | 'swimming' | 'gym' | 'special';
  deviceSerial: string;
  deviceLocation: string;
  isActive: boolean;
}
