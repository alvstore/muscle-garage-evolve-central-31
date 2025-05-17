
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useBranch } from "@/hooks/settings/use-branches";

export default function AccessControlSettings() {
  const { currentBranch } = useBranch();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSave = async () => {
    if (!currentBranch?.id) {
      toast.error("Please select a branch first");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast.success("Access control settings saved successfully");
    } catch (error) {
      console.error("Error saving access control settings:", error);
      toast.error("Failed to save access control settings");
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!currentBranch?.id) {
    return (
      <div className="text-center p-4">
        Please select a branch to view settings
      </div>
    );
  }
  
  return (
    <Tabs defaultValue="hikvision" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-4">
        <TabsTrigger value="hikvision">Hikvision</TabsTrigger>
        <TabsTrigger value="essl">eSSL</TabsTrigger>
      </TabsList>
      
      <TabsContent value="hikvision" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Hikvision Access Control</CardTitle>
            <CardDescription>
              Configure Hikvision access control devices for your branch
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="hikvision-enabled">Enable Hikvision Integration</Label>
              <Switch id="hikvision-enabled" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="hikvision-app-key">App Key</Label>
              <Input id="hikvision-app-key" type="text" placeholder="Enter App Key" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="hikvision-app-secret">App Secret</Label>
              <Input id="hikvision-app-secret" type="password" placeholder="••••••••••••••••••••••" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="hikvision-api-url">API URL</Label>
              <Input id="hikvision-api-url" type="text" placeholder="https://api.hikvision.com" />
            </div>
            
            <div className="pt-4 border-t">
              <h4 className="text-sm font-medium mb-4">Device Configuration</h4>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="device-1">Main Entrance Device</Label>
                  <Input id="device-1" type="text" placeholder="Enter device serial" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="device-2">Exit Device</Label>
                  <Input id="device-2" type="text" placeholder="Enter device serial" />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSave} disabled={isLoading}>
              Save Hikvision Settings
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
      
      <TabsContent value="essl" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>eSSL Access Control</CardTitle>
            <CardDescription>
              Configure eSSL access control devices for your branch
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="essl-enabled">Enable eSSL Integration</Label>
              <Switch id="essl-enabled" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="essl-api-url">API URL</Label>
              <Input id="essl-api-url" type="text" placeholder="Enter API URL" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="essl-username">API Username</Label>
              <Input id="essl-username" type="text" placeholder="Enter username" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="essl-password">API Password</Label>
              <Input id="essl-password" type="password" placeholder="••••••••••••••••••••••" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="essl-device-serial">Device Serial</Label>
              <Input id="essl-device-serial" type="text" placeholder="Enter device serial" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="essl-push-url">Webhook URL</Label>
              <Input id="essl-push-url" type="text" placeholder="https://yourdomain.com/api/essl-webhook" />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSave} disabled={isLoading}>
              Save eSSL Settings
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
