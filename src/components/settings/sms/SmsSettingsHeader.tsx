
import React from 'react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface SmsSettingsHeaderProps {
  enabled: boolean;
  onEnableChange: (checked: boolean) => void;
}

export const SmsSettingsHeader = ({ 
  enabled, 
  onEnableChange 
}: SmsSettingsHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold">SMS Integration</h1>
        <p className="text-muted-foreground">Configure SMS notifications and templates</p>
      </div>
      <div className="flex items-center gap-2">
        <Switch 
          checked={enabled} 
          onCheckedChange={onEnableChange}
        />
        <Label>{enabled ? 'Enabled' : 'Disabled'}</Label>
      </div>
    </div>
  );
};
