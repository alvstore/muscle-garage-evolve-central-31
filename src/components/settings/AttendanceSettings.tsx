
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAttendanceSettings } from "@/hooks/use-realtime-settings";
import { useBranch } from "@/hooks/use-branch";
import { Loader2 } from "lucide-react";

const AttendanceSettings = () => {
  const { currentBranch } = useBranch();
  const branchId = currentBranch?.id || null;
  const { data: settings, isLoading, isSaving, updateData } = useAttendanceSettings(branchId);
  
  const handleHikvisionToggle = (enabled: boolean) => {
    updateData({ hikvision_enabled: enabled });
  };
  
  const handleQRToggle = (enabled: boolean) => {
    updateData({ qr_enabled: enabled });
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Attendance Settings</CardTitle>
          <CardDescription>
            Configure how members check-in to your facility
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h3 className="font-medium">Hikvision Access Control</h3>
                <p className="text-sm text-muted-foreground">Enable biometric check-in via Hikvision devices</p>
              </div>
              <Switch
                checked={settings.hikvision_enabled}
                onCheckedChange={handleHikvisionToggle}
                disabled={isSaving}
              />
            </div>
            
            {settings.hikvision_enabled && (
              <div className="border rounded-md p-4 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="api-key">API Key</Label>
                    <Input id="api-key" placeholder="Enter Hikvision API key" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="api-secret">API Secret</Label>
                    <Input id="api-secret" type="password" placeholder="Enter API secret" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="api-url">API URL</Label>
                  <Input id="api-url" placeholder="https://hikvision-api.example.com" />
                </div>
                
                <div className="flex justify-end">
                  <Button variant="secondary" size="sm">
                    Test Connection
                  </Button>
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h3 className="font-medium">QR Code Check-in</h3>
                <p className="text-sm text-muted-foreground">Enable QR code scanning for attendance</p>
              </div>
              <Switch
                checked={settings.qr_enabled}
                onCheckedChange={handleQRToggle}
                disabled={isSaving}
              />
            </div>
            
            {settings.qr_enabled && (
              <div className="border rounded-md p-4 space-y-4">
                <p className="text-sm">QR code check-in is enabled. Members can scan QR codes to mark attendance.</p>
                
                <div className="flex items-center justify-center p-4">
                  <div className="p-4 border rounded-md bg-gray-50">
                    <div className="w-32 h-32 bg-gray-200 flex items-center justify-center">
                      <p className="text-xs text-center text-gray-600">QR Code Preview</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center gap-2">
                  <Button variant="secondary" size="sm">Generate New QR</Button>
                  <Button variant="outline" size="sm">Download</Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceSettings;
