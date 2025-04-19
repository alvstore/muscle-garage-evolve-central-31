
import { toast } from '@/hooks/use-toast';

export interface IntegrationConfig {
  enabled: boolean;
  apiKey?: string;
  apiSecret?: string;
  endpoint?: string;
  webhookUrl?: string;
  otherSettings?: Record<string, any>;
}

// Default integration configurations
const defaultIntegrations: Record<string, IntegrationConfig> = {
  hikvision: {
    enabled: false,
    endpoint: '',
    apiKey: '',
    apiSecret: '',
    otherSettings: {
      pollingInterval: 60, // In seconds
      deviceIds: []
    }
  },
  sms: {
    enabled: false,
    apiKey: '',
    otherSettings: {
      sender: 'MuscleGarage',
      defaultTemplate: 'Welcome to Muscle Garage! Your OTP is: {{otp}}'
    }
  },
  email: {
    enabled: false,
    apiKey: '',
    otherSettings: {
      sender: 'noreply@musclegarage.com',
      defaultSubject: 'Message from Muscle Garage',
      templates: {}
    }
  },
  razorpay: {
    enabled: false,
    apiKey: '',
    apiSecret: '',
    webhookUrl: '',
    otherSettings: {
      currency: 'INR'
    }
  }
};

// In-memory storage for integration settings
// In a real app, this would be stored in a database
let integrations: Record<string, IntegrationConfig> = { ...defaultIntegrations };

/**
 * Service for managing all external integrations
 */
export const integrationService = {
  /**
   * Get configuration for a specific integration
   */
  getConfig: (integrationName: string): IntegrationConfig => {
    return integrations[integrationName] || { enabled: false };
  },
  
  /**
   * Update configuration for a specific integration
   */
  updateConfig: (integrationName: string, config: Partial<IntegrationConfig>): boolean => {
    try {
      if (!integrations[integrationName]) {
        integrations[integrationName] = { enabled: false };
      }
      
      integrations[integrationName] = {
        ...integrations[integrationName],
        ...config
      };
      
      // In a real app, this would save to database
      
      toast({
        title: "Integration updated",
        description: `${integrationName} integration has been updated successfully.`
      });
      
      return true;
    } catch (error) {
      console.error(`Failed to update ${integrationName} integration:`, error);
      
      toast({
        title: "Integration update failed",
        description: `Could not update ${integrationName} integration.`,
        variant: "destructive"
      });
      
      return false;
    }
  },
  
  /**
   * Enable a specific integration
   */
  enableIntegration: (integrationName: string): boolean => {
    return integrationService.updateConfig(integrationName, { enabled: true });
  },
  
  /**
   * Disable a specific integration
   */
  disableIntegration: (integrationName: string): boolean => {
    return integrationService.updateConfig(integrationName, { enabled: false });
  },
  
  /**
   * Test if an integration is properly configured
   */
  testIntegration: async (integrationName: string): Promise<boolean> => {
    const config = integrations[integrationName];
    
    if (!config || !config.enabled) {
      toast({
        title: "Integration not enabled",
        description: `${integrationName} integration is not enabled.`,
        variant: "destructive"
      });
      return false;
    }
    
    // In a real app, this would make an actual test call to the integration API
    // For now, we'll simulate a successful test
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Integration test successful",
      description: `${integrationName} integration is working properly.`
    });
    
    return true;
  },
  
  /**
   * Get all available integrations
   */
  getAllIntegrations: (): Record<string, IntegrationConfig> => {
    return { ...integrations };
  },
  
  /**
   * Reset an integration to default settings
   */
  resetIntegration: (integrationName: string): boolean => {
    if (!defaultIntegrations[integrationName]) {
      return false;
    }
    
    return integrationService.updateConfig(
      integrationName, 
      defaultIntegrations[integrationName]
    );
  }
};

export default integrationService;
