
export type DeviceType = "entry" | "exit" | "swimming" | "gym" | "special";
export type ApiMethod = "OpenAPI" | "ISAPI";
export type SyncStatus = "pending" | "success" | "failed";

export interface DeviceMapping {
  id: string;
  branchId: string;
  deviceId: string;
  deviceName: string;
  deviceType: DeviceType;
  deviceSerial: string;
  deviceLocation: string;
  isActive: boolean;
  apiMethod: ApiMethod;
  lastSuccessfulSync?: string;
  lastFailedSync?: string;
  syncStatus?: SyncStatus;
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
  syncFrequency: "realtime" | "15min" | "hourly" | "daily";
  integrationEnabled: boolean;
  useISAPIWhenOpenAPIFails: boolean;
}

export interface DeviceMappingFormValues {
  deviceId: string;
  deviceName: string;
  deviceType: DeviceType;
  deviceSerial: string;
  deviceLocation: string;
  isActive: boolean;
  apiMethod?: ApiMethod;
}
