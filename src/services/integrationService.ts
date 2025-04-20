
import { toast } from "sonner";

// Define integration configuration types
export interface IntegrationConfig {
  enabled: boolean;
  provider?: string;
  apiKey?: string;
  authKey?: string;
  accountSid?: string;
  authToken?: string;
  fromEmail?: string;
  senderId?: string;
  phoneNumberId?: string;
  businessAccountId?: string;
  notifications?: {
    [key: string]: boolean;
  };
  templates?: {
    [key: string]: boolean;
  };
  [key: string]: any;
}

// Mock integration configurations
const mockIntegrations: Record<string, IntegrationConfig> = {
  hikvision: {
    enabled: false,
    apiKey: "",
    appSecret: "",
    serverAddress: "",
    serverPort: "8080",
    username: "",
    password: "",
    channelIds: [],
    useSsl: false,
  },
  email: {
    enabled: false,
    provider: "sendgrid",
    apiKey: "",
    fromEmail: "noreply@musclegarage.com",
    notifications: {
      sendOnRegistration: true,
      sendOnInvoice: true,
      sendClassUpdates: false,
    },
  },
  sms: {
    enabled: false,
    provider: "msg91",
    authKey: "",
    senderId: "GYMAPP",
    templates: {
      membershipAlert: true,
      renewalReminder: true,
      otpVerification: true,
      attendanceConfirmation: false,
    },
  },
  whatsapp: {
    enabled: false,
    apiToken: "",
    phoneNumberId: "",
    businessAccountId: "",
    notifications: {
      sendWelcomeMessages: true,
      sendClassReminders: true,
      sendRenewalReminders: true,
      sendBirthdayGreetings: false,
    },
  },
};

// Helper function to safely store data in localStorage
const saveToLocalStorage = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Failed to save ${key} to localStorage:`, error);
    return false;
  }
};

// Helper function to safely retrieve data from localStorage
const getFromLocalStorage = (key: string, defaultValue: any) => {
  try {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : defaultValue;
  } catch (error) {
    console.error(`Failed to retrieve ${key} from localStorage:`, error);
    return defaultValue;
  }
};

// Initialize integration configs from localStorage or defaults
const initIntegrations = () => {
  const stored = getFromLocalStorage('integrations', null);
  if (stored) {
    return stored;
  }
  
  // If no stored data, save defaults and return them
  saveToLocalStorage('integrations', mockIntegrations);
  return mockIntegrations;
};

let integrations = initIntegrations();

// Integration service methods
const integrationService = {
  // Get all integration configurations
  getAllIntegrations: (): Record<string, IntegrationConfig> => {
    return integrations;
  },
  
  // Get a specific integration's configuration
  getConfig: (name: string): IntegrationConfig => {
    return integrations[name] || { enabled: false };
  },
  
  // Update a specific integration's configuration
  updateConfig: (name: string, config: Partial<IntegrationConfig>): boolean => {
    if (!integrations[name]) {
      // Integration doesn't exist
      return false;
    }
    
    integrations = {
      ...integrations,
      [name]: {
        ...integrations[name],
        ...config,
      },
    };
    
    // Save to localStorage
    return saveToLocalStorage('integrations', integrations);
  },
  
  // Enable an integration
  enableIntegration: (name: string): boolean => {
    if (!integrations[name]) {
      // Integration doesn't exist
      return false;
    }
    
    integrations = {
      ...integrations,
      [name]: {
        ...integrations[name],
        enabled: true,
      },
    };
    
    // Save to localStorage
    return saveToLocalStorage('integrations', integrations);
  },
  
  // Disable an integration
  disableIntegration: (name: string): boolean => {
    if (!integrations[name]) {
      // Integration doesn't exist
      return false;
    }
    
    integrations = {
      ...integrations,
      [name]: {
        ...integrations[name],
        enabled: false,
      },
    };
    
    // Save to localStorage
    return saveToLocalStorage('integrations', integrations);
  },
  
  // Test an integration's connection
  testIntegration: async (name: string): Promise<{ success: boolean; message: string }> => {
    // In a real app, this would make an API call to test the integration
    if (!integrations[name]) {
      return { success: false, message: "Integration not found" };
    }
    
    if (!integrations[name].enabled) {
      return { success: false, message: "Integration is not enabled" };
    }
    
    try {
      // Simulate API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Randomly succeed or fail for demo purposes
      const success = Math.random() > 0.3;
      return {
        success,
        message: success ? "Connection successful" : "Connection failed. Please check your credentials.",
      };
    } catch (error) {
      return {
        success: false,
        message: "An error occurred while testing the integration",
      };
    }
  },
  
  // Reset an integration to default settings
  resetIntegration: (name: string): boolean => {
    if (!mockIntegrations[name]) {
      // Integration doesn't exist in defaults
      return false;
    }
    
    integrations = {
      ...integrations,
      [name]: {
        ...mockIntegrations[name],
      },
    };
    
    // Save to localStorage
    return saveToLocalStorage('integrations', integrations);
  },
};

export default integrationService;
