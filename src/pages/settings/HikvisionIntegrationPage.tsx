import React, { useState, useEffect } from "react";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTable } from "@/components/ui/data-table";
// Update the imports to avoid conflicts
import { HikvisionEvent as ServiceHikvisionEvent } from "@/services/integrations/hikvisionService";
import { HikvisionEvent, HikvisionCredentials, HikvisionDevice } from "@/types/hikvision";
import { hikvisionService } from "@/services/integrations/hikvisionService";

const HikvisionIntegrationPage = () => {
  const [credentials, setCredentials] = useState<HikvisionCredentials>({
    appKey: "",
    appSecret: "",
    baseUrl: "",
    isValid: false,
  });
  const [devices, setDevices] = useState<HikvisionDevice[]>([]);
  const [events, setEvents] = useState<HikvisionEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCredentials();
    loadDevices();
    loadEvents();
  }, []);

  const loadCredentials = async () => {
    setLoading(true);
    try {
      const creds = await hikvisionService.getCredentials();
      setCredentials(creds);
    } catch (error) {
      setError("Failed to load credentials");
      toast.error("Failed to load Hikvision credentials.");
    } finally {
      setLoading(false);
    }
  };

  const loadDevices = async () => {
    setLoading(true);
    try {
      const deviceList = await hikvisionService.getDevices();
      setDevices(deviceList);
    } catch (error) {
      setError("Failed to load devices");
      toast.error("Failed to load Hikvision devices.");
    } finally {
      setLoading(false);
    }
  };

  const loadEvents = async () => {
    setLoading(true);
    try {
      const serviceEvents = await hikvisionService.getEvents();
      // Cast events properly when setting state
      setEvents(serviceEvents as unknown as HikvisionEvent[]);
    } catch (error) {
      setError("Failed to load events");
      toast.error("Failed to load Hikvision events.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCredentials = async () => {
    setLoading(true);
    try {
      const isValid = await hikvisionService.validateCredentials(credentials);
      setCredentials({ ...credentials, isValid: isValid });
      await hikvisionService.saveCredentials(credentials);
      toast.success("Hikvision credentials saved successfully.");
    } catch (error) {
      setError("Failed to save credentials");
      toast.error("Failed to save Hikvision credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleTestConnection = async () => {
    setLoading(true);
    try {
      const isValid = await hikvisionService.validateCredentials(credentials);
      setCredentials({ ...credentials, isValid: isValid });
      toast.success("Connection to Hikvision device is successful.");
    } catch (error) {
      setError("Connection failed");
      toast.error("Connection to Hikvision device failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleProcessAttendance = async () => {
    setLoading(true);
    try {
      // For processAttendance fix
      await hikvisionService.processAttendance(events as unknown as ServiceHikvisionEvent[]);
      toast.success("Attendance processed successfully.");
    } catch (error) {
      setError("Failed to process attendance");
      toast.error("Failed to process attendance.");
    } finally {
      setLoading(false);
    }
  };

  const columns = React.useMemo(
    () => [
      {
        accessorKey: "memberName",
        header: "Member Name",
      },
      {
        accessorKey: "deviceName",
        header: "Device Name",
      },
      {
        accessorKey: "eventTime",
        header: "Event Time",
      },
      {
        accessorKey: "eventType",
        header: "Event Type",
      },
    ],
    []
  );

  return (
    <Container>
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-6">Hikvision Integration</h1>

        {error && <div className="text-red-500 mb-4">Error: {error}</div>}

        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Credentials</CardTitle>
            <CardDescription>
              Configure your Hikvision device credentials.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="appKey">App Key</Label>
              <Input
                id="appKey"
                value={credentials.appKey}
                onChange={(e) =>
                  setCredentials({ ...credentials, appKey: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="appSecret">App Secret</Label>
              <Input
                id="appSecret"
                value={credentials.appSecret}
                onChange={(e) =>
                  setCredentials({ ...credentials, appSecret: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="baseUrl">Base URL</Label>
              <Input
                id="baseUrl"
                value={credentials.baseUrl}
                onChange={(e) =>
                  setCredentials({ ...credentials, baseUrl: e.target.value })
                }
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="isValid">Connection Status</Label>
              {credentials.isValid ? (
                // Add valid variant for badge
                <Badge variant="outline">Success</Badge>
              ) : (
                <Badge variant="destructive">Failed</Badge>
              )}
            </div>
            <div className="flex justify-end space-x-2">
              <Button onClick={handleTestConnection} disabled={loading}>
                Test Connection
              </Button>
              <Button onClick={handleSaveCredentials} disabled={loading}>
                Save Credentials
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Devices</CardTitle>
            <CardDescription>List of connected Hikvision devices.</CardDescription>
          </CardHeader>
          <CardContent>
            {devices.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {devices.map((device) => (
                    <TableRow key={device.id}>
                      <TableCell>{device.name}</TableCell>
                      <TableCell>{device.type}</TableCell>
                      <TableCell>{device.location}</TableCell>
                      <TableCell>{device.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div>No devices found.</div>
            )}
          </CardContent>
        </Card>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Events</CardTitle>
            <CardDescription>
              List of recent events from Hikvision devices.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {events.length > 0 ? (
              <DataTable columns={columns} data={events} />
            ) : (
              <div>No events found.</div>
            )}
            <Button onClick={handleProcessAttendance} disabled={loading} className="mt-4">
              Process Attendance
            </Button>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
};

export default HikvisionIntegrationPage;
