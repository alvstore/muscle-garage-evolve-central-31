
import React, { useState } from 'react';
import { Container } from '@/components/ui/container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { NotificationPreferences } from '@/types/notification';
import { Bell, Mail, MessageSquare, Phone } from 'lucide-react';

export default function NotificationsPage() {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    email: true,
    push: true,
    sms: false,
    whatsapp: false,
  });

  const handlePreferenceChange = (key: keyof NotificationPreferences) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const savePreferences = () => {
    // This would connect to an API to save the preferences
    console.log('Saving preferences:', preferences);
  };

  return (
    <Container>
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-6">Notifications</h1>

        <Tabs defaultValue="preferences" className="space-y-4">
          <TabsList>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="history">Notification History</TabsTrigger>
          </TabsList>

          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Receive updates via email
                      </p>
                    </div>
                  </div>
                  <Switch 
                    checked={preferences.email}
                    onCheckedChange={() => handlePreferenceChange('email')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Push Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications within the app
                      </p>
                    </div>
                  </div>
                  <Switch 
                    checked={preferences.push}
                    onCheckedChange={() => handlePreferenceChange('push')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">SMS Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Receive updates via SMS
                      </p>
                    </div>
                  </div>
                  <Switch 
                    checked={preferences.sms}
                    onCheckedChange={() => handlePreferenceChange('sms')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <MessageSquare className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">WhatsApp Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Receive updates via WhatsApp
                      </p>
                    </div>
                  </div>
                  <Switch 
                    checked={preferences.whatsapp}
                    onCheckedChange={() => handlePreferenceChange('whatsapp')}
                  />
                </div>

                <div className="pt-4">
                  <Button onClick={savePreferences}>Save Preferences</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Notification History</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center py-4 text-muted-foreground">
                  No notifications in your history
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
}
