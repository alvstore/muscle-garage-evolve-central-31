export interface SmsProvider {
  id: string;
  name: string;
  apiKey: string;
  senderId: string;
  isActive: boolean;
}

export interface SmsTemplates {
  membershipAlert: boolean;
  renewalReminder: boolean;
  otpVerification: boolean;
  attendanceConfirmation: boolean;
}

export interface SmsSettings {
  id?: string;
  provider: SmsProvider | string;
  templates?: SmsTemplates;
  [key: string]: any; // For backward compatibility with existing properties
}
