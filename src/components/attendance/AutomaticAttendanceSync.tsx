
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from 'sonner';
import { CheckCheck, Loader2, RefreshCw } from 'lucide-react';
import { useCompany } from '@/hooks/company/use-company';

const AutomaticAttendanceSync: React.FC = () => {
  const [isHikvisionEnabled, setIsHikvisionEnabled] = useState(false);
  const [hikvisionConfig, setHikvisionConfig] = useState({
    ipAddress: '',
    port: '',
    username: '',
    password: '',
  });
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [syncStatus, setSyncStatus] = useState<'success' | 'failed' | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { company, updateCompany } = useCompany();

  useEffect(() => {
    if (company?.attendance_settings) {
      setIsHikvisionEnabled(company.attendance_settings.hikvision_enabled);
      setHikvisionConfig(company.attendance_settings.device_config || {
        ipAddress: '',
        port: '',
        username: '',
        password: '',
      });
      setLastSync(company.attendance_settings.last_sync ? new Date(company.attendance_settings.last_sync) : null);
      setSyncStatus(company.attendance_settings.sync_status as 'success' | 'failed' || null);
    }
    setIsLoading(false);
  }, [company]);

  const syncAttendance = async () => {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        const success = Math.random() > 0.5;
        if (success) {
          setLastSync(new Date());
          setSyncStatus('success');
          resolve();
        } else {
          setSyncStatus('failed');
          reject(new Error('Sync failed'));
        }
      }, 3000);
    });
  };

  const triggerSync = async () => {
    if (!confirm("Are you sure you want to trigger a manual synchronization?")) {
      return;
    }
    
    setIsSyncing(true);
    try {
      await syncAttendance();
      toast.success("Sync completed successfully");
    } catch (error) {
      console.error("Error syncing attendance:", error);
      toast.error("Failed to sync attendance: " + (error as any)?.description || "Unknown error");
    } finally {
      setIsSyncing(false);
    }
  };

  const updateSettings = async () => {
    setIsLoading(true);
    try {
      await updateCompany({
        attendance_settings: {
          qr_enabled: true, // Add missing required property
          hikvision_enabled: isHikvisionEnabled,
          device_config: hikvisionConfig,
          last_sync: lastSync?.toISOString(),
          sync_status: syncStatus,
        }
      });
      toast.success("Settings updated successfully");
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error("Failed to update settings: " + (error as any)?.description || "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  const resetSync = async () => {
    setIsLoading(true);
    try {
      await updateCompany({
        attendance_settings: {
          qr_enabled: true, // Add missing required property
          hikvision_enabled: isHikvisionEnabled,
          device_config: hikvisionConfig,
          last_sync: null,
          sync_status: null,
        }
      });
      toast.success("Sync status reset successfully");
    } catch (error) {
      console.error("Error resetting sync:", error);
      toast.error("Failed to reset sync: " + (error as any)?.description || "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-6">Loading settings...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Automatic Attendance Sync</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="hikvision-enabled">Enable Hikvision Sync</Label>
            <Switch
              id="hikvision-enabled"
              checked={isHikvisionEnabled}
              onCheckedChange={(checked) => setIsHikvisionEnabled(checked)}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Automatically sync attendance data from Hikvision devices.
          </p>
        </div>

        {isHikvisionEnabled && (
          <div className="space-y-4 border rounded-md p-4">
            <h4 className="text-sm font-medium">Hikvision Device Configuration</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ip-address">IP Address</Label>
                <Input
                  type="text"
                  id="ip-address"
                  value={hikvisionConfig.ipAddress}
                  onChange={(e) => setHikvisionConfig({ ...hikvisionConfig, ipAddress: e.target.value })}
                  placeholder="Enter IP Address"
                />
              </div>
              <div>
                <Label htmlFor="port">Port</Label>
                <Input
                  type="text"
                  id="port"
                  value={hikvisionConfig.port}
                  onChange={(e) => setHikvisionConfig({ ...hikvisionConfig, port: e.target.value })}
                  placeholder="Enter Port"
                />
              </div>
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  type="text"
                  id="username"
                  value={hikvisionConfig.username}
                  onChange={(e) => setHikvisionConfig({ ...hikvisionConfig, username: e.target.value })}
                  placeholder="Enter Username"
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  type="password"
                  id="password"
                  value={hikvisionConfig.password}
                  onChange={(e) => setHikvisionConfig({ ...hikvisionConfig, password: e.target.value })}
                  placeholder="Enter Password"
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium">Last Sync</p>
            {lastSync ? (
              <p className="text-xs text-muted-foreground">
                {lastSync.toLocaleString()}
                {syncStatus === 'success' && (
                  <CheckCheck className="inline-block h-4 w-4 text-green-500 ml-1" />
                )}
                {syncStatus === 'failed' && (
                  <RefreshCw className="inline-block h-4 w-4 text-red-500 ml-1" />
                )}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">Never</p>
            )}
          </div>
          <Button
            variant="secondary"
            disabled={isSyncing}
            onClick={triggerSync}
          >
            {isSyncing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Syncing...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Sync Now
              </>
            )}
          </Button>
        </div>

        <div className="flex justify-between items-center">
          <Button onClick={updateSettings} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Save Settings"
            )}
          </Button>
          <Button variant="destructive" onClick={resetSync} disabled={isLoading}>
            Reset Sync Status
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AutomaticAttendanceSync;
