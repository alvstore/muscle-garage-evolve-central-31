
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, AlertTriangle, Copy, Info } from 'lucide-react';
import { toast } from 'sonner';
import { razorpayService } from '@/services/integrations/razorpayService';
import { RazorpayEventType } from '@/types/webhooks';

interface RazorpayWebhookEvent {
  type: RazorpayEventType;
  label: string;
  description: string;
}

const WEBHOOK_EVENTS: RazorpayWebhookEvent[] = [
  {
    type: 'payment.captured',
    label: 'Payment Captured',
    description: 'When a payment is successfully captured'
  },
  {
    type: 'payment.failed',
    label: 'Payment Failed',
    description: 'When a payment attempt fails'
  },
  {
    type: 'order.paid',
    label: 'Order Paid',
    description: 'When an order is marked as paid'
  },
  {
    type: 'subscription.activated',
    label: 'Subscription Activated',
    description: 'When a subscription is activated'
  },
  {
    type: 'subscription.charged',
    label: 'Subscription Charged',
    description: 'When a subscription payment is charged'
  },
  {
    type: 'subscription.cancelled',
    label: 'Subscription Cancelled',
    description: 'When a subscription is cancelled'
  },
  {
    type: 'refund.processed',
    label: 'Refund Processed',
    description: 'When a refund is processed'
  }
];

const RazorpayWebhookConfig = () => {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [selectedEvents, setSelectedEvents] = useState<RazorpayEventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const config = await razorpayService.getWebhookConfig();
      setIsConfigured(config.isConfigured);
      
      if (config.isConfigured) {
        setWebhookUrl(config.url || '');
        setSelectedEvents(config.events || []);
        setIsActive(config.active || false);
      } else {
        // Default values for new configuration
        setWebhookUrl(`${window.location.origin}/api/webhooks/razorpay`);
        setSelectedEvents(WEBHOOK_EVENTS.map(event => event.type));
      }
    } catch (error) {
      console.error('Failed to fetch webhook config:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfig = async () => {
    if (!webhookUrl) {
      toast.error('Please enter a webhook URL');
      return;
    }
    
    if (selectedEvents.length === 0) {
      toast.error('Please select at least one webhook event');
      return;
    }
    
    setSaving(true);
    try {
      const success = await razorpayService.configureWebhook(
        webhookUrl,
        selectedEvents,
        isActive
      );
      
      if (success) {
        setIsConfigured(true);
      }
    } finally {
      setSaving(false);
    }
  };

  const toggleEvent = (eventType: RazorpayEventType) => {
    setSelectedEvents(prev => {
      if (prev.includes(eventType)) {
        return prev.filter(type => type !== eventType);
      } else {
        return [...prev, eventType];
      }
    });
  };

  const selectAllEvents = () => {
    setSelectedEvents(WEBHOOK_EVENTS.map(event => event.type));
  };

  const clearAllEvents = () => {
    setSelectedEvents([]);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Razorpay Webhook Configuration</CardTitle>
            <CardDescription>Set up webhook endpoints to handle payment events</CardDescription>
          </div>
          {isConfigured && (
            <Badge className="bg-green-600">
              <CheckCircle className="w-3 h-3 mr-1" /> Configured
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span>Loading webhook configuration...</span>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="webhook-active">Webhook Active</Label>
                <Switch
                  id="webhook-active"
                  checked={isActive}
                  onCheckedChange={setIsActive}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                When enabled, Razorpay will send webhook events to your endpoint
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="webhook-url">Webhook URL</Label>
              <div className="flex space-x-2">
                <Input
                  id="webhook-url"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://your-domain.com/api/webhooks/razorpay"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    navigator.clipboard.writeText(webhookUrl);
                    toast.success('Webhook URL copied to clipboard');
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                This is the URL Razorpay will send webhook events to
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Webhook Events</Label>
                <div className="space-x-2">
                  <Button variant="outline" size="sm" onClick={selectAllEvents}>
                    Select All
                  </Button>
                  <Button variant="outline" size="sm" onClick={clearAllEvents}>
                    Clear All
                  </Button>
                </div>
              </div>
              <div className="space-y-4 mt-3">
                {WEBHOOK_EVENTS.map((event) => (
                  <div key={event.type} className="flex items-start space-x-2">
                    <Checkbox
                      id={`event-${event.type}`}
                      checked={selectedEvents.includes(event.type)}
                      onCheckedChange={() => toggleEvent(event.type)}
                    />
                    <div className="space-y-1">
                      <Label
                        htmlFor={`event-${event.type}`}
                        className="font-medium cursor-pointer"
                      >
                        {event.label}
                      </Label>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-3 rounded-md flex">
              <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 mr-2 flex-shrink-0" />
              <div className="text-sm text-yellow-800 dark:text-yellow-400">
                <p className="font-medium">Important:</p>
                <p>After saving, you must add this webhook URL in your Razorpay Dashboard under Settings &gt; Webhooks.</p>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button onClick={handleSaveConfig} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Webhook Configuration'
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RazorpayWebhookConfig;
