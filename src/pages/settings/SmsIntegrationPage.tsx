
import React, { useState } from 'react';
import { Container } from "@/components/ui/container";
import { toast } from "sonner";
import { useIntegrations } from '@/hooks/use-integrations';
import { IntegrationConfig } from '@/services/integrationService';
import { SmsSettingsHeader } from '@/components/settings/sms/SmsSettingsHeader';
import { SmsProviderSettings } from '@/components/settings/sms/SmsProviderSettings';
import { NotificationSettings } from '@/components/settings/sms/NotificationSettings';

const SmsIntegrationPage = () => {
  const { config, updateConfig, test, enable, disable } = useIntegrations('sms');
  const [pendingChanges, setPendingChanges] = useState<Partial<IntegrationConfig>>({});

  const handleUpdateConfig = (changes: Partial<IntegrationConfig>) => {
    setPendingChanges(prev => ({
      ...prev,
      ...changes
    }));
  };

  const handleSave = () => {
    const success = updateConfig(pendingChanges);
    if (success) {
      toast.success("SMS settings saved successfully");
      setPendingChanges({});
    } else {
      toast.error("Failed to save SMS settings");
    }
  };

  const handleTest = async () => {
    const result = await test();
    if (result.success) {
      toast.success("SMS test sent successfully");
    } else {
      toast.error(`SMS test failed: ${result.message}`);
    }
  };

  // Merge pending changes with current config for UI display
  const displayConfig = {
    ...config,
    ...pendingChanges
  };

  return (
    <Container>
      <div className="py-6 space-y-6">
        <SmsSettingsHeader 
          enabled={config.enabled}
          onEnableChange={(checked) => {
            if (checked) {
              enable();
              toast.success("SMS integration enabled");
            } else {
              disable();
              toast.success("SMS integration disabled");
            }
          }}
        />

        <div className="space-y-6">
          <SmsProviderSettings 
            config={displayConfig}
            onUpdateConfig={handleUpdateConfig}
            onTest={handleTest}
            onSave={handleSave}
          />
          
          <NotificationSettings 
            config={displayConfig}
            onUpdateConfig={handleUpdateConfig}
            onSave={handleSave}
          />
        </div>
      </div>
    </Container>
  );
};

export default SmsIntegrationPage;
