export interface IntegrationConfig {
  enabled: boolean;
  provider: string;
  senderId?: string;
  templates?: {
    membershipAlert: boolean;
    renewalReminder: boolean;
    otpVerification: boolean;
    attendanceConfirmation: boolean;
  };
  // MSG91 specific fields
  msg91AuthKey?: string;
  // Twilio specific fields
  twilioAccountSid?: string;
  twilioAuthToken?: string;
  // Custom API specific fields
  customApiUrl?: string;
  customApiHeaders?: string;
  customApiMethod?: "GET" | "POST";
  customApiParams?: string;
  // WhatsApp specific fields
  apiToken?: string;
  phoneNumberId?: string;
  businessAccountId?: string;
  notifications?: any;
  // Other properties
  [key: string]: any;
}

const integrationService = {
  getConfig: (type: string): IntegrationConfig => {
    // In a real app, this would fetch from API/database
    // For now, return mock data
    const mockConfigs: Record<string, IntegrationConfig> = {
      sms: {
        enabled: true,
        provider: 'msg91',
        senderId: 'MUSCLEGM',
        msg91AuthKey: '123456',
        templates: {
          membershipAlert: true,
          renewalReminder: true,
          otpVerification: true,
          attendanceConfirmation: false
        }
      },
      email: {
        enabled: true,
        provider: 'sendgrid',
        templates: {
          membershipAlert: true,
          renewalReminder: true,
          otpVerification: true,
          attendanceConfirmation: false
        }
      },
      whatsapp: {
        enabled: false,
        provider: 'meta',
        apiToken: '',
        phoneNumberId: '',
        businessAccountId: '',
        notifications: {
          sendWelcomeMessages: true,
          sendClassReminders: true,
          sendRenewalReminders: true,
          sendBirthdayGreetings: false
        }
      }
    };
    
    return mockConfigs[type] || {
      enabled: false,
      provider: '',
      templates: {
        membershipAlert: false,
        renewalReminder: false,
        otpVerification: false,
        attendanceConfirmation: false
      }
    };
  },
  
  getAllIntegrations: (): Record<string, IntegrationConfig> => {
    // In a real app, this would fetch all integrations from API/database
    return {
      sms: integrationService.getConfig('sms'),
      email: integrationService.getConfig('email'),
      whatsapp: integrationService.getConfig('whatsapp')
    };
  },
  
  updateConfig: (type: string, config: Partial<IntegrationConfig>): boolean => {
    console.log(`Updating ${type} config:`, config);
    // In a real app, this would save to API/database
    return true;
  },
  
  test: async (type: string): Promise<{ success: boolean, message: string }> => {
    console.log(`Testing ${type} integration`);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return mock success result
    return {
      success: true,
      message: "Test successful"
    };
  },
  
  // Alias for test for backward compatibility
  testIntegration: async (type: string): Promise<{ success: boolean, message: string }> => {
    return integrationService.test(type);
  },
  
  enable: (type: string): boolean => {
    console.log(`Enabling ${type} integration`);
    return true;
  },
  
  // Alias for enable for backward compatibility
  enableIntegration: (type: string): boolean => {
    return integrationService.enable(type);
  },
  
  disable: (type: string): boolean => {
    console.log(`Disabling ${type} integration`);
    return true;
  },
  
  // Alias for disable for backward compatibility
  disableIntegration: (type: string): boolean => {
    return integrationService.disable(type);
  },
  
  // New method to reset integration to default settings
  resetIntegration: (type: string): boolean => {
    console.log(`Resetting ${type} integration to defaults`);
    // In a real app, this would reset to default settings in API/database
    return true;
  }
};

export default integrationService;
