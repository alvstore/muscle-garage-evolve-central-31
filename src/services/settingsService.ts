
import api from "./api";

// Settings interfaces
export interface GeneralSettings {
  gymName: string;
  contactEmail: string;
  contactPhone: string;
  businessHoursStart: string;
  businessHoursEnd: string;
  timezone: string;
  currency: string;
  taxRate: number;
}

export interface AccessControlSettings {
  appKey: string;
  secretKey: string;
  siteId: string;
  deviceSerials: {
    entryDevice1: string;
    entryDevice2: string;
    entryDevice3: string;
    swimmingDevice: string;
  };
  planBasedAccess: {
    gymOnlyAccess: boolean;
    swimmingOnlyAccess: boolean;
    bothAccess: boolean;
  };
}

export interface WhatsAppSettings {
  apiToken: string;
  phoneNumberId: string;
  businessAccountId: string;
  notifications: {
    sendWelcomeMessages: boolean;
    sendClassReminders: boolean;
    sendRenewalReminders: boolean;
    sendBirthdayGreetings: boolean;
  };
}

export interface EmailSettings {
  provider: "sendgrid" | "mailgun" | "smtp";
  senderEmail: string;
  notifications: {
    sendOnRegistration: boolean;
    sendOnInvoice: boolean;
    sendClassUpdates: boolean;
  };
  sendgridApiKey?: string;
  mailgunApiKey?: string;
  mailgunDomain?: string;
  smtpHost?: string;
  smtpPort?: number;
  smtpUsername?: string;
  smtpPassword?: string;
  smtpSecure?: boolean;
}

export interface SmsSettings {
  provider: "msg91" | "twilio";
  senderId: string;
  templates: {
    membershipAlert: boolean;
    renewalReminder: boolean;
    otpVerification: boolean;
    attendanceConfirmation: boolean;
  };
  msg91AuthKey?: string;
  twilioAccountSid?: string;
  twilioAuthToken?: string;
}

export interface NotificationSettings {
  inAppNotificationsEnabled: boolean;
  pushNotificationsEnabled: boolean;
  pushProvider?: "firebase" | "onesignal";
  firebaseConfig?: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    appId: string;
  };
  oneSignalConfig?: {
    appId: string;
    apiKey: string;
  };
  notificationTypes: {
    attendanceReminders: boolean;
    paymentDueAlerts: boolean;
    classAlerts: boolean;
    birthdayPings: boolean;
  };
}

export interface AutomationSettings {
  membershipRules: {
    expiryReminderEnabled: boolean;
    expiryReminderDays: number;
    autoRenewalFollowupEnabled: boolean;
    autoRenewalFollowupDays: number;
  };
  leadRules: {
    autoAssignmentEnabled: boolean;
    assignmentStrategy: string;
    followupRemindersEnabled: boolean;
  };
  schedulingFrequency: string;
}

export interface PermissionSettings {
  roles: {
    id: string;
    name: string;
    description: string;
    isSystem: boolean;
    permissions: Record<string, boolean>;
  }[];
}

// Settings service methods
const settingsService = {
  // General settings
  getGeneralSettings: async (): Promise<GeneralSettings> => {
    const response = await api.get('/settings/general');
    return response.data;
  },
  
  updateGeneralSettings: async (settings: GeneralSettings): Promise<GeneralSettings> => {
    const response = await api.put('/settings/general', settings);
    return response.data;
  },
  
  // Access control settings
  getAccessControlSettings: async (): Promise<AccessControlSettings> => {
    const response = await api.get('/settings/access-control');
    return response.data;
  },
  
  updateAccessControlSettings: async (settings: AccessControlSettings): Promise<AccessControlSettings> => {
    const response = await api.put('/settings/access-control', settings);
    return response.data;
  },
  
  // WhatsApp settings
  getWhatsAppSettings: async (): Promise<WhatsAppSettings> => {
    const response = await api.get('/settings/whatsapp');
    return response.data;
  },
  
  updateWhatsAppSettings: async (settings: WhatsAppSettings): Promise<WhatsAppSettings> => {
    const response = await api.put('/settings/whatsapp', settings);
    return response.data;
  },
  
  // Email settings
  getEmailSettings: async (): Promise<EmailSettings> => {
    const response = await api.get('/settings/email');
    return response.data;
  },
  
  updateEmailSettings: async (settings: EmailSettings): Promise<EmailSettings> => {
    const response = await api.put('/settings/email', settings);
    return response.data;
  },
  
  sendTestEmail: async (email: string): Promise<void> => {
    await api.post('/settings/email/test', { email });
  },
  
  // SMS settings
  getSmsSettings: async (): Promise<SmsSettings> => {
    const response = await api.get('/settings/sms');
    return response.data;
  },
  
  updateSmsSettings: async (settings: SmsSettings): Promise<SmsSettings> => {
    const response = await api.put('/settings/sms', settings);
    return response.data;
  },
  
  sendTestSms: async (phoneNumber: string): Promise<void> => {
    await api.post('/settings/sms/test', { phoneNumber });
  },
  
  // Notification settings
  getNotificationSettings: async (): Promise<NotificationSettings> => {
    const response = await api.get('/settings/notifications');
    return response.data;
  },
  
  updateNotificationSettings: async (settings: NotificationSettings): Promise<NotificationSettings> => {
    const response = await api.put('/settings/notifications', settings);
    return response.data;
  },
  
  sendTestNotification: async (): Promise<void> => {
    await api.post('/settings/notifications/test');
  },
  
  // Automation settings
  getAutomationSettings: async (): Promise<AutomationSettings> => {
    const response = await api.get('/settings/automation');
    return response.data;
  },
  
  updateAutomationSettings: async (settings: AutomationSettings): Promise<AutomationSettings> => {
    const response = await api.put('/settings/automation', settings);
    return response.data;
  },
  
  runAutomationTasks: async (): Promise<void> => {
    await api.post('/settings/automation/run');
  },
  
  // Permission settings
  getPermissionSettings: async (): Promise<PermissionSettings> => {
    const response = await api.get('/settings/permissions');
    return response.data;
  },
  
  updatePermissionSettings: async (settings: PermissionSettings): Promise<PermissionSettings> => {
    const response = await api.put('/settings/permissions', settings);
    return response.data;
  },
};

export default settingsService;
