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
  
  enable: (type: string): boolean => {
    console.log(`Enabling ${type} integration`);
    return true;
  },
  
  disable: (type: string): boolean => {
    console.log(`Disabling ${type} integration`);
    return true;
  }
};

export default integrationService;
