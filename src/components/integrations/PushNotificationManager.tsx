
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Bell, BellOff, CheckCircle, AlertCircle, Smartphone } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/auth/use-auth';
import { pushNotificationService } from '@/services/integrations/pushNotificationService';

const PushNotificationManager = () => {
  const { user } = useAuth();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    checkNotificationStatus();
  }, []);
  
  const checkNotificationStatus = async () => {
    // Check if push notifications are supported
    const supported = pushNotificationService.isSupported();
    setIsSupported(supported);
    
    if (!supported) {
      return;
    }
    
    // Check if already subscribed
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      setIsSubscribed(!!subscription);
    } catch (error) {
      console.error('Failed to check notification status:', error);
    }
  };
  
  const handleToggleSubscription = async () => {
    if (!user) {
      toast.error('You must be logged in to manage notifications');
      return;
    }
    
    setLoading(true);
    
    try {
      if (isSubscribed) {
        // Unsubscribe
        const success = await pushNotificationService.unsubscribe();
        
        if (success) {
          setIsSubscribed(false);
          toast.success('Push notifications disabled');
        } else {
          toast.error('Failed to disable push notifications');
        }
      } else {
        // Subscribe
        const success = await pushNotificationService.subscribe(user.id);
        
        if (success) {
          setIsSubscribed(true);
          toast.success('Push notifications enabled');
        } else {
          toast.error('Failed to enable push notifications');
        }
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleSendTest = async () => {
    if (!isSubscribed) {
      toast.error('You must enable notifications first');
      return;
    }
    
    setLoading(true);
    
    try {
      await pushNotificationService.sendTestNotification();
    } finally {
      setLoading(false);
    }
  };
  
  if (!isSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BellOff className="w-5 h-5 mr-2" />
            Push Notifications
          </CardTitle>
          <CardDescription>
            Receive instant updates about your gym activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-6 text-center">
            <div>
              <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
              <p className="font-medium">Push Notifications Not Supported</p>
              <p className="text-sm text-muted-foreground mt-1">
                Your browser doesn't support push notifications. Try using a modern browser like Chrome or Firefox.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bell className="w-5 h-5 mr-2" />
          Push Notifications
        </CardTitle>
        <CardDescription>
          Receive instant updates about your gym activities
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="push-notifications">Enable Push Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Get notified about class bookings, payments, and more
              </p>
            </div>
            <Switch
              id="push-notifications"
              checked={isSubscribed}
              onCheckedChange={handleToggleSubscription}
              disabled={loading}
            />
          </div>
          
          {isSubscribed && (
            <div className="rounded-md bg-muted p-4">
              <div className="flex">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <div>
                  <h4 className="font-medium">Notifications Enabled</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    You'll receive notifications for important events.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="rounded-md bg-muted p-4">
            <h4 className="font-medium mb-2">You'll receive notifications for:</h4>
            <ul className="text-sm space-y-2">
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                <span>Upcoming class reminders</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                <span>Membership renewal reminders</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                <span>Payment confirmations</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                <span>Gym announcements and events</span>
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={handleSendTest} 
          disabled={!isSubscribed || loading}
        >
          <Smartphone className="h-4 w-4 mr-2" />
          Send Test Notification
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PushNotificationManager;
