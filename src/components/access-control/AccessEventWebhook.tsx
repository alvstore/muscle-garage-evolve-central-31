
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/services/supabaseClient';
import { hikvisionService } from '@/services/hikvisionService';
import { useHikvisionSettings } from '@/hooks/use-hikvision-settings';

interface AccessEventWebhookProps {
  branchId?: string;
}

const AccessEventWebhook = ({ branchId }: AccessEventWebhookProps) => {
  const { settings } = useHikvisionSettings();
  const [webhookUrl, setWebhookUrl] = useState('');
  const [webhookSecret, setWebhookSecret] = useState('');
  const [logOutput, setLogOutput] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);
  const [lastEventTime, setLastEventTime] = useState<Date | null>(null);
  
  const handleFetchLogs = async () => {
    if (!branchId) return;
    
    setIsLoadingLogs(true);
    try {
      const { data, error } = await supabase
        .from('access_logs')
        .select('*')
        .eq('branch_id', branchId)
        .order('event_time', { ascending: false })
        .limit(20);
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        setLastEventTime(new Date(data[0].event_time));
        setLogOutput(JSON.stringify(data, null, 2));
      } else {
        setLogOutput('No access events found.');
      }
    } catch (error) {
      console.error('Error fetching access logs:', error);
      toast.error('Failed to load access logs');
    } finally {
      setIsLoadingLogs(false);
    }
  };
  
  const handleSubscribe = async () => {
    if (!settings || !webhookUrl) return;
    
    setIsSubscribing(true);
    try {
      const result = await hikvisionService.subscribeToEvents(settings, webhookUrl);
      
      // Save webhook configuration
      await supabase.from('integration_statuses').upsert({
        integration_key: 'hikvision_webhook',
        name: 'Hikvision Event Webhook',
        status: 'configured',
        config: {
          url: webhookUrl,
          secret: webhookSecret,
          updated_at: new Date().toISOString()
        },
        branch_id: branchId,
        description: 'Webhook configuration for Hikvision access events'
      });
      
      toast.success('Successfully subscribed to access events');
    } catch (error) {
      console.error('Error subscribing to events:', error);
      toast.error('Failed to subscribe to events');
    } finally {
      setIsSubscribing(false);
    }
  };
  
  // Load existing webhook config
  React.useEffect(() => {
    const loadWebhookConfig = async () => {
      if (!branchId) return;
      
      try {
        const { data, error } = await supabase
          .from('integration_statuses')
          .select('config')
          .eq('integration_key', 'hikvision_webhook')
          .eq('branch_id', branchId)
          .single();
          
        if (data && data.config) {
          setWebhookUrl(data.config.url || '');
          setWebhookSecret(data.config.secret || '');
        }
      } catch (error) {
        // Webhook config might not exist yet
        console.log('No existing webhook configuration found');
      }
    };
    
    loadWebhookConfig();
  }, [branchId]);
  
  if (!settings?.is_active) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-10">
            <h3 className="text-lg font-medium mb-2">Access Control Not Configured</h3>
            <p className="text-muted-foreground">
              Please configure and enable Hikvision integration in settings
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Access Event Webhook</CardTitle>
        <CardDescription>
          Configure webhook for receiving real-time access events
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label htmlFor="webhook-url">Webhook URL</Label>
            <Input
              id="webhook-url"
              placeholder="https://your-webhook-endpoint.com/api/access-events"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
            />
            <p className="text-sm text-muted-foreground mt-1">
              This URL will receive POST requests with access event data
            </p>
          </div>
          
          <div>
            <Label htmlFor="webhook-secret">Webhook Secret (Optional)</Label>
            <Input
              id="webhook-secret"
              type="password"
              placeholder="Secret key for request verification"
              value={webhookSecret}
              onChange={(e) => setWebhookSecret(e.target.value)}
            />
            <p className="text-sm text-muted-foreground mt-1">
              Used to verify that webhooks are coming from Hikvision
            </p>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button
            onClick={handleSubscribe}
            disabled={isSubscribing || !webhookUrl}
          >
            {isSubscribing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Subscribing...
              </>
            ) : (
              'Subscribe to Events'
            )}
          </Button>
        </div>
        
        <div className="pt-4 border-t">
          <div className="flex justify-between items-center mb-2">
            <Label>Recent Access Events</Label>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleFetchLogs}
              disabled={isLoadingLogs}
            >
              {isLoadingLogs ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Refresh Logs
            </Button>
          </div>
          
          {lastEventTime && (
            <p className="text-sm text-muted-foreground mb-2">
              Last event: {lastEventTime.toLocaleString()}
            </p>
          )}
          
          <Textarea
            className="font-mono text-sm h-[300px]"
            readOnly
            value={logOutput || 'Click "Refresh Logs" to view recent access events.'}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default AccessEventWebhook;
