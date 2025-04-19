import { useState, useEffect, useCallback } from 'react';
import integrationService, { IntegrationConfig } from '@/services/integrationService';

export const useIntegrations = (integrationName?: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [configs, setConfigs] = useState<Record<string, IntegrationConfig>>({});
  
  // Load all integration configs on mount
  useEffect(() => {
    const loadConfigs = () => {
      setIsLoading(true);
      try {
        const allConfigs = integrationService.getAllIntegrations();
        setConfigs(allConfigs);
      } catch (error) {
        console.error('Failed to load integration configs:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadConfigs();
  }, []);
  
  // Update a specific integration's config
  const updateConfig = useCallback((name: string, config: Partial<IntegrationConfig>) => {
    const success = integrationService.updateConfig(name, config);
    
    if (success) {
      setConfigs(prev => ({
        ...prev,
        [name]: {
          ...prev[name],
          ...config
        }
      }));
    }
    
    return success;
  }, []);
  
  // Toggle an integration on/off
  const toggleIntegration = useCallback((name: string, enable: boolean) => {
    const success = enable 
      ? integrationService.enableIntegration(name)
      : integrationService.disableIntegration(name);
    
    if (success) {
      setConfigs(prev => ({
        ...prev,
        [name]: {
          ...prev[name],
          enabled: enable
        }
      }));
    }
    
    return success;
  }, []);
  
  // Test an integration's connection
  const testIntegration = useCallback(async (name: string) => {
    return await integrationService.testIntegration(name);
  }, []);
  
  // Reset an integration to default settings
  const resetIntegration = useCallback((name: string) => {
    const success = integrationService.resetIntegration(name);
    
    if (success) {
      setConfigs(prev => ({
        ...prev,
        [name]: integrationService.getConfig(name)
      }));
    }
    
    return success;
  }, []);
  
  // If a specific integration was requested, return only that config
  if (integrationName) {
    const config = configs[integrationName] || { enabled: false };
    
    return {
      isLoading,
      config,
      updateConfig: (config: Partial<IntegrationConfig>) => updateConfig(integrationName, config),
      enable: () => toggleIntegration(integrationName, true),
      disable: () => toggleIntegration(integrationName, false),
      test: () => testIntegration(integrationName),
      reset: () => resetIntegration(integrationName)
    };
  }
  
  // Otherwise, return all configs and utility functions
  return {
    isLoading,
    configs,
    updateConfig,
    toggleIntegration,
    testIntegration,
    resetIntegration
  };
};
