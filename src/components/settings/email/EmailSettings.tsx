import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useEmailSettings } from '@/hooks/use-email-settings';

const EmailSettings = () => {
  const { settings, isLoading, updateSettings, sendTestEmail } = useEmailSettings();
  const [testEmail, setTestEmail] = React.useState('');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="ml-2">Loading email settings...</span>
      </div>
    );
  }

  const handleTestEmail = async () => {
    if (!testEmail) {
      return;
    }
    await sendTestEmail(testEmail);
  };

  const handleSaveSettings = async () => {
    // Example implementation - in a real app you would have a form
    await updateSettings({
      provider: 'smtp', // Just an example, you would get this from a form
      from_email: 'example@yourgym.com',
      is_active: true,
      notifications: {
        sendOnInvoice: true,
        sendClassUpdates: true,
        sendOnRegistration: true
      }
    });
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Email Settings</h3>
        
        {/* This would be where your actual email settings form would go */}
        <div className="space-y-4">
          {/* Example test email functionality */}
          <div className="flex items-center gap-2">
            <input
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="Enter email for test"
              className="border p-2 rounded"
            />
            <Button onClick={handleTestEmail}>
              Send Test
            </Button>
            <Button onClick={handleSaveSettings}>
              Save Settings
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailSettings;
