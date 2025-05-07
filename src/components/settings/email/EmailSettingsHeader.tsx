
import React from 'react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';

interface EmailSettingsHeaderProps {
  enabled: boolean;
  onEnableChange: (checked: boolean) => void;
  isLoading?: boolean;
}

export const EmailSettingsHeader = ({ enabled, onEnableChange, isLoading }: EmailSettingsHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold">Email Integration</h1>
        <p className="text-muted-foreground">Configure email notifications and templates</p>
      </div>
      <div className="flex items-center gap-2">
        <Switch 
          checked={enabled}
          onCheckedChange={(checked) => {
            onEnableChange(checked);
            toast.success(`Email integration ${checked ? 'enabled' : 'disabled'}`);
          }}
          disabled={isLoading}
        />
        <Label>{enabled ? 'Enabled' : 'Disabled'}</Label>
      </div>
    </div>
  );
};
