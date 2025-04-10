import { 
  BellRing, 
  Building, 
  CreditCard, 
  Key, 
  Lock, 
  Mail, 
  MessageCircle, // Replace MessageText with MessageCircle
  Shield, 
  UserCog, 
  Users,
  Smartphone
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

const SettingsPage = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [biometricAuth, setBiometricAuth] = useState(false);
  
  const handleSaveSettings = () => {
    // Simulate saving settings
    toast.success("Settings saved successfully!");
  };
  
  return (
    <Container>
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>
        
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="account">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <UserCog className="h-4 w-4" />
                <span>Account Settings</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="px-3 py-2 border rounded-md">
                    <Mail className="h-4 w-4 mr-2 inline-block" />
                    <span className="align-middle">contact@example.com</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Button variant="outline" size="sm">
                    <Lock className="h-4 w-4 mr-2" />
                    Change Password
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="notifications">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <BellRing className="h-4 w-4" />
                <span>Notification Preferences</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <Switch 
                    id="email-notifications"
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="sms-notifications">SMS Notifications</Label>
                  <Switch
                    id="sms-notifications"
                    checked={smsNotifications}
                    onCheckedChange={setSmsNotifications}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="push-notifications">Push Notifications</Label>
                  <Switch
                    id="push-notifications"
                    checked={pushNotifications}
                    onCheckedChange={setPushNotifications}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="security">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>Security Settings</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="two-factor-auth">Two-Factor Authentication</Label>
                  <Switch 
                    id="two-factor-auth"
                    checked={twoFactorAuth}
                    onCheckedChange={setTwoFactorAuth}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="biometric-auth">Biometric Authentication</Label>
                  <Switch
                    id="biometric-auth"
                    checked={biometricAuth}
                    onCheckedChange={setBiometricAuth}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="integrations">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                <span>Integrations</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="hikvision">Hikvision Integration</Label>
                    <p className="text-sm text-muted-foreground">Connect to your Hikvision system for attendance tracking.</p>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <a href="/settings/hikvision" className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4" />
                      Configure
                    </a>
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="billing">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                <span>Billing & Subscription</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label>Current Plan</Label>
                  <div className="px-3 py-2 border rounded-md">
                    <span className="align-middle">Premium</span>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Manage Subscription
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="team">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Team Management</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label>Invite New Members</Label>
                  <Button variant="outline" size="sm">
                    Invite
                  </Button>
                </div>
                {/* Add team management features here */}
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="api">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                <span>API Keys</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label>Generate New API Key</Label>
                  <Button variant="outline" size="sm">
                    Generate Key
                  </Button>
                </div>
                {/* Add API key management features here */}
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="support">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                <span>Support</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label>Contact Support</Label>
                  <Button variant="outline" size="sm">
                    Contact Us
                  </Button>
                </div>
                {/* Add support contact information here */}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        <div className="mt-6">
          <Button onClick={handleSaveSettings}>Save Settings</Button>
        </div>
      </div>
    </Container>
  );
};

export default SettingsPage;
