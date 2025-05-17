import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DatePickerWithRange } from '@/components/ui/date-picker-with-range';
import { Check, X, ChevronRight, UserPlus, UserMinus, Key, KeyRound, Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useHikvision } from '@/hooks/use-hikvision-consolidated';
import { toast } from 'sonner';
import { addDays, format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { Checkbox } from "@/components/ui/checkbox";

interface MemberAccessControlProps {
  member: any;
}

export default function MemberAccessControl({ member }: MemberAccessControlProps) {
  const { 
    registerMember, 
    unregisterMember, 
    grantAccess, 
    revokeAccess, 
    getMemberAccess,
    devices: hikvisionDevices
  } = useHikvision();
  const [isLoading, setIsLoading] = useState(false);
  const [devices, setDevices] = useState<any[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [doorNumbers, setDoorNumbers] = useState<number[]>([1]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 365)
  });
  const [isRegistered, setIsRegistered] = useState(false);
  const [accessCredentials, setAccessCredentials] = useState<any[]>([]);
  
  // Fetch member access credentials on load
  useEffect(() => {
    const fetchAccessDetails = async () => {
      if (member?.id) {
        try {
          const credentials = await getMemberAccess(member.id);
          setAccessCredentials(credentials);
          setIsRegistered(credentials.length > 0);
        } catch (error) {
          console.error("Failed to fetch access credentials:", error);
        }
      }
    };
    
      // Use actual devices from the hook
    if (hikvisionDevices && hikvisionDevices.length > 0) {
      setDevices(hikvisionDevices.map(device => ({
        id: device.deviceId,
        name: device.name,
        doors: device.doors || [1] // Default to door 1 if no doors specified
      })));
    }
      { id: 'device3', name: 'Locker Rooms', doors: [1, 2] }
    ]);
    
    fetchAccessDetails();
  }, [member?.id]);
  
  const handleRegisterMember = async () => {
    if (!member) return;
    
    setIsLoading(true);
    try {
      const success = await registerMember(member);
      if (success) {
        setIsRegistered(true);
        toast.success('Member registered successfully to access control system');
      } else {
        toast.error('Failed to register member');
      }
    } catch (error) {
      console.error('Error registering member:', error);
      toast.error('An error occurred while registering the member');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleUnregisterMember = async () => {
    if (!member) return;
    
    if (!confirm('Are you sure you want to unregister this member from the access control system?')) {
      return;
    }
    
    setIsLoading(true);
    try {
      const success = await unregisterMember(member.id);
      if (success) {
        setIsRegistered(false);
        setAccessCredentials([]);
        toast.success('Member unregistered successfully from access control system');
      } else {
        toast.error('Failed to unregister member');
      }
    } catch (error) {
      console.error('Error unregistering member:', error);
      toast.error('An error occurred while unregistering the member');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGrantAccess = async () => {
    if (!member || !selectedDevice) {
      toast.error('Please select a device first');
      return;
    }
    
    if (!dateRange?.from || !dateRange?.to) {
      toast.error('Please select a valid date range');
      return;
    }
    
    setIsLoading(true);
    try {
      const startTime = format(dateRange.from, "yyyy-MM-dd'T'00:00:00'Z'");
      const endTime = format(dateRange.to, "yyyy-MM-dd'T'23:59:59'Z'");
      
      const success = await grantAccess(member.id, selectedDevice, doorNumbers, startTime, endTime);
      if (success) {
        // Refresh access credentials
        const credentials = await memberAccess.getMemberAccess(member.id);
        setAccessCredentials(credentials);
        toast.success('Access granted successfully');
      } else {
        toast.error('Failed to grant access');
      }
    } catch (error) {
      console.error('Error granting access:', error);
      toast.error('An error occurred while granting access');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRevokeAccess = async () => {
    if (!member || !selectedDevice) {
      toast.error('Please select a device first');
      return;
    }
    
    if (!confirm('Are you sure you want to revoke access for this device?')) {
      return;
    }
    
    setIsLoading(true);
    try {
      const success = await revokeAccess(member.id, selectedDevice);
      if (success) {
        // Refresh access credentials
        const credentials = await memberAccess.getMemberAccess(member.id);
        setAccessCredentials(credentials);
        toast.success('Access revoked successfully');
      } else {
        toast.error('Failed to revoke access');
      }
    } catch (error) {
      console.error('Error revoking access:', error);
      toast.error('An error occurred while revoking access');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Access Control</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="status">
          <TabsList className="mb-4">
            <TabsTrigger value="status">Status</TabsTrigger>
            <TabsTrigger value="configure">Configure</TabsTrigger>
            <TabsTrigger value="history">Access History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="status">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">Biometric Registration Status</h3>
                  <p className="text-sm text-muted-foreground">Member registration in access control system</p>
                </div>
                <div className="flex items-center gap-2">
                  {isRegistered ? (
                    <>
                      <Check className="h-5 w-5 text-green-500" />
                      <span className="font-medium text-green-500">Registered</span>
                    </>
                  ) : (
                    <>
                      <X className="h-5 w-5 text-red-500" />
                      <span className="font-medium text-red-500">Not Registered</span>
                    </>
                  )}
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-semibold text-lg mb-4">Access Credentials</h3>
                
                {memberAccess.isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : accessCredentials.length === 0 ? (
                  <div className="text-center py-8">
                    <KeyRound className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                    <h4 className="text-lg font-medium">No Access Credentials</h4>
                    <p className="text-sm text-muted-foreground">This member doesn't have any access credentials yet.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {accessCredentials.map(credential => (
                      <div key={credential.id} className="flex items-center justify-between border rounded-lg p-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <Key className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{credential.credential_type}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {credential.credential_value}
                          </span>
                        </div>
                        <div className="text-sm">
                          <div>Issued: {new Date(credential.issued_at).toLocaleDateString()}</div>
                          {credential.expires_at && (
                            <div>Expires: {new Date(credential.expires_at).toLocaleDateString()}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="mt-6 flex justify-end">
                  {isRegistered ? (
                    <Button variant="destructive" onClick={handleUnregisterMember} disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <UserMinus className="mr-2 h-4 w-4" />
                          Unregister Member
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button onClick={handleRegisterMember} disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <UserPlus className="mr-2 h-4 w-4" />
                          Register Member
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="configure">
            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="font-semibold">Access Control Device</h3>
                <Select value={selectedDevice} onValueChange={setSelectedDevice}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a device" />
                  </SelectTrigger>
                  <SelectContent>
                    {devices.map(device => (
                      <SelectItem key={device.id} value={device.id}>
                        {device.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-semibold">Access Period</h3>
                <DatePickerWithRange
                  date={dateRange}
                  setDate={(newRange) => setDateRange(newRange)}
                  onDateChange={setDateRange}
                />
              </div>
              
              <div className="space-y-3">
                <h3 className="font-semibold">Door Access</h3>
                {devices.find(d => d.id === selectedDevice)?.doors.map((door: number) => (
                  <div key={door} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`door-${door}`} 
                      checked={doorNumbers.includes(door)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setDoorNumbers([...doorNumbers, door]);
                        } else {
                          setDoorNumbers(doorNumbers.filter(d => d !== door));
                        }
                      }}
                    />
                    <label
                      htmlFor={`door-${door}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Door {door}
                    </label>
                  </div>
                ))}
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Switch id="elevator-access" />
                  <Label htmlFor="elevator-access">Elevator Access</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="fingerprint-auth" />
                  <Label htmlFor="fingerprint-auth">Require Fingerprint</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="face-auth" defaultChecked />
                  <Label htmlFor="face-auth">Require Face Recognition</Label>
                </div>
              </div>
              
              <div className="flex justify-between">
                <Button variant="destructive" onClick={handleRevokeAccess} disabled={!selectedDevice || isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <X className="mr-2 h-4 w-4" />
                      Revoke Access
                    </>
                  )}
                </Button>
                <Button onClick={handleGrantAccess} disabled={!selectedDevice || isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ChevronRight className="mr-2 h-4 w-4" />
                      Grant Access
                    </>
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="history">
            <div className="text-center py-8">
              <p className="text-muted-foreground">Access history records will appear here</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
