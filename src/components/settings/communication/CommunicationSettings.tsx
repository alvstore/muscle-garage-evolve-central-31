
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
import { useBranch } from "@/hooks/use-branches";

export default function CommunicationSettings() {
  const { currentBranch } = useBranch();
  const [isLoading, setIsLoading] = useState(false);
  const [emailProvider, setEmailProvider] = useState("sendgrid");
  const [smsProvider, setSmsProvider] = useState("msg91");
  
  const handleSave = async () => {
    if (!currentBranch?.id) {
      toast.error("Please select a branch first");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast.success("Communication settings saved successfully");
    } catch (error) {
      console.error("Error saving communication settings:", error);
      toast.error("Failed to save communication settings");
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
    <Tabs defaultValue="email" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-4">
        <TabsTrigger value="email">Email</TabsTrigger>
        <TabsTrigger value="sms">SMS</TabsTrigger>
        <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
      </TabsList>
      
      <TabsContent value="email" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Email Configuration</CardTitle>
            <CardDescription>
              Configure your email provider for sending notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email-provider">Email Provider</Label>
              <Select value={emailProvider} onValueChange={setEmailProvider}>
                <SelectTrigger id="email-provider">
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sendgrid">SendGrid</SelectItem>
                  <SelectItem value="mailgun">Mailgun</SelectItem>
                  <SelectItem value="smtp">Custom SMTP</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sender-email">Sender Email Address</Label>
              <Input id="sender-email" type="email" placeholder="noreply@yourgym.com" />
            </div>
            
            {emailProvider === "sendgrid" && (
              <div className="space-y-2">
                <Label htmlFor="sendgrid-api-key">SendGrid API Key</Label>
                <Input id="sendgrid-api-key" type="password" placeholder="••••••••••••••••••••••" />
              </div>
            )}
            
            {emailProvider === "mailgun" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="mailgun-api-key">Mailgun API Key</Label>
                  <Input id="mailgun-api-key" type="password" placeholder="••••••••••••••••••••••" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="mailgun-domain">Mailgun Domain</Label>
                  <Input id="mailgun-domain" type="text" placeholder="mg.yourdomain.com" />
                </div>
              </>
            )}
            
            {emailProvider === "smtp" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="smtp-host">SMTP Host</Label>
                  <Input id="smtp-host" type="text" placeholder="smtp.example.com" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="smtp-port">SMTP Port</Label>
                  <Input id="smtp-port" type="number" placeholder="587" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="smtp-username">SMTP Username</Label>
                  <Input id="smtp-username" type="text" placeholder="user@example.com" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="smtp-password">SMTP Password</Label>
                  <Input id="smtp-password" type="password" placeholder="••••••••••••••••••••••" />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="smtp-secure">Use SSL/TLS</Label>
                  <Switch id="smtp-secure" defaultChecked />
                </div>
              </>
            )}
            
            <div className="pt-4 border-t">
              <h4 className="text-sm font-medium mb-4">Email Notifications</h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-on-register">Send on registration</Label>
                  <Switch id="email-on-register" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-on-invoice">Send invoices</Label>
                  <Switch id="email-on-invoice" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-class-updates">Send class updates</Label>
                  <Switch id="email-class-updates" defaultChecked />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSave} disabled={isLoading}>
              Save Email Settings
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
      
      <TabsContent value="sms" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>SMS Configuration</CardTitle>
            <CardDescription>
              Configure your SMS provider for sending text messages
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sms-provider">SMS Provider</Label>
              <Select value={smsProvider} onValueChange={setSmsProvider}>
                <SelectTrigger id="sms-provider">
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="msg91">MSG91 (India)</SelectItem>
                  <SelectItem value="twilio">Twilio</SelectItem>
                  <SelectItem value="custom">Custom API</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sender-id">Sender ID</Label>
              <Input id="sender-id" type="text" placeholder="GYMAPP" />
            </div>
            
            {smsProvider === "msg91" && (
              <div className="space-y-2">
                <Label htmlFor="msg91-auth-key">MSG91 Auth Key</Label>
                <Input id="msg91-auth-key" type="password" placeholder="••••••••••••••••••••••" />
              </div>
            )}
            
            {smsProvider === "twilio" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="twilio-account-sid">Twilio Account SID</Label>
                  <Input id="twilio-account-sid" type="text" placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxx" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="twilio-auth-token">Twilio Auth Token</Label>
                  <Input id="twilio-auth-token" type="password" placeholder="••••••••••••••••••••••" />
                </div>
              </>
            )}
            
            {smsProvider === "custom" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="custom-api-url">API URL</Label>
                  <Input id="custom-api-url" type="text" placeholder="https://api.example.com/send" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="custom-api-headers">API Headers (JSON)</Label>
                  <Input id="custom-api-headers" type="text" placeholder='{"Authorization": "Bearer xyz"}' />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="custom-api-params">API Parameters</Label>
                  <Input id="custom-api-params" type="text" placeholder="phone={phone}&message={message}" />
                </div>
              </>
            )}
            
            <div className="pt-4 border-t">
              <h4 className="text-sm font-medium mb-4">SMS Templates</h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="sms-membership-alert">Membership Alerts</Label>
                  <Switch id="sms-membership-alert" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="sms-renewal-reminder">Renewal Reminders</Label>
                  <Switch id="sms-renewal-reminder" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="sms-otp">OTP Verification</Label>
                  <Switch id="sms-otp" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="sms-attendance">Attendance Confirmation</Label>
                  <Switch id="sms-attendance" />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSave} disabled={isLoading}>
              Save SMS Settings
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
      
      <TabsContent value="whatsapp" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>WhatsApp Configuration</CardTitle>
            <CardDescription>
              Configure WhatsApp Business API for messaging
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="whatsapp-enabled">Enable WhatsApp</Label>
              <Switch id="whatsapp-enabled" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="whatsapp-api-token">API Token</Label>
              <Input id="whatsapp-api-token" type="password" placeholder="••••••••••••••••••••••" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="whatsapp-phone-id">Phone Number ID</Label>
              <Input id="whatsapp-phone-id" type="text" placeholder="1234567890" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="whatsapp-business-id">Business Account ID</Label>
              <Input id="whatsapp-business-id" type="text" placeholder="1234567890" />
            </div>
            
            <div className="pt-4 border-t">
              <h4 className="text-sm font-medium mb-4">WhatsApp Notifications</h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="wa-welcome-messages">Send Welcome Messages</Label>
                  <Switch id="wa-welcome-messages" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="wa-class-reminders">Send Class Reminders</Label>
                  <Switch id="wa-class-reminders" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="wa-renewal-reminders">Send Renewal Reminders</Label>
                  <Switch id="wa-renewal-reminders" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="wa-birthday-greetings">Send Birthday Greetings</Label>
                  <Switch id="wa-birthday-greetings" />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSave} disabled={isLoading}>
              Save WhatsApp Settings
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
