
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface IntegrationSettingsProps {
  integrationEnabled: boolean;
  syncFrequency: "realtime" | "15min" | "hourly" | "daily";
  defaultAccessRules: {
    gymOnlyAccess: boolean;
    swimmingOnlyAccess: boolean;
    premiumAccess: boolean;
  };
  onToggleIntegration: (enabled: boolean) => void;
  onSyncFrequencyChange: (value: string) => void;
  onToggleAccessRule: (rule: string, value: boolean) => void;
}

export function IntegrationSettings({
  integrationEnabled,
  syncFrequency,
  defaultAccessRules,
  onToggleIntegration,
  onSyncFrequencyChange,
  onToggleAccessRule
}: IntegrationSettingsProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between space-x-2">
        <div>
          <h3 className="text-lg font-medium">Enable Device Integration</h3>
          <p className="text-sm text-muted-foreground">
            Allow this branch to connect with access control devices
          </p>
        </div>
        <Switch 
          checked={integrationEnabled}
          onCheckedChange={onToggleIntegration}
        />
      </div>
      
      {integrationEnabled && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="syncFrequency">Synchronization Frequency</Label>
            <Select 
              value={syncFrequency} 
              onValueChange={onSyncFrequencyChange}
            >
              <SelectTrigger id="syncFrequency" className="w-full">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="realtime">Real-time</SelectItem>
                <SelectItem value="15min">Every 15 minutes</SelectItem>
                <SelectItem value="hourly">Hourly</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground mt-1">
              How often should member data sync with devices
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Default Access Rules</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="gymOnlyAccess" className="flex-1">
                  Gym-only Access
                </Label>
                <Switch 
                  id="gymOnlyAccess"
                  checked={defaultAccessRules.gymOnlyAccess}
                  onCheckedChange={(value) => onToggleAccessRule("gymOnlyAccess", value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="swimmingOnlyAccess" className="flex-1">
                  Swimming-only Access
                </Label>
                <Switch 
                  id="swimmingOnlyAccess"
                  checked={defaultAccessRules.swimmingOnlyAccess}
                  onCheckedChange={(value) => onToggleAccessRule("swimmingOnlyAccess", value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="premiumAccess" className="flex-1">
                  Premium Access (All Areas)
                </Label>
                <Switch 
                  id="premiumAccess"
                  checked={defaultAccessRules.premiumAccess}
                  onCheckedChange={(value) => onToggleAccessRule("premiumAccess", value)}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
