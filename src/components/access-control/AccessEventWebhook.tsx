
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Clock, 
  RefreshCw, 
  ArrowRight, 
  UserCheck, 
  UserX, 
  Loader 
} from 'lucide-react';
import { useHikvisionSettings } from '@/hooks/access/use-hikvision-settings';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { HikvisionEvent } from '@/types/settings/hikvision-types';

interface AccessEventWebhookProps {
  branchId: string;
}

const AccessEventWebhook: React.FC<AccessEventWebhookProps> = ({ branchId }) => {
  const [events, setEvents] = useState<HikvisionEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [webhookEnabled, setWebhookEnabled] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');

  const { isConnected, settings } = useHikvisionSettings(branchId);

  // Load recent events
  useEffect(() => {
    if (branchId) {
      fetchEvents();
    }
  }, [branchId]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('hikvision_events')
        .select('*')
        .order('event_time', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      
      setEvents(data.map(event => ({
        id: event.id,
        eventId: event.event_id,
        eventType: event.event_type,
        eventTime: event.event_time,
        personId: event.person_id,
        personName: event.person_name,
        doorId: event.door_id,
        doorName: event.door_name,
        deviceId: event.device_id,
        cardNo: event.card_no,
        faceId: event.face_id,
        pictureUrl: event.picture_url,
        processed: event.processed,
        processedAt: event.processed_at
      })));
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to fetch access events');
    } finally {
      setLoading(false);
    }
  };

  const processEvent = async (eventId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('hikvision-process-events', {
        body: { eventId, branchId }
      });
      
      if (error) throw error;
      
      if (data.success) {
        toast.success('Event processed successfully');
        fetchEvents(); // Refresh the events list
      } else {
        toast.error(data.message || 'Failed to process event');
      }
    } catch (error) {
      console.error('Error processing event:', error);
      toast.error('Failed to process event');
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch (e) {
      return dateString;
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'entry':
        return <UserCheck className="h-4 w-4 text-green-500" />;
      case 'exit':
        return <ArrowRight className="h-4 w-4 text-blue-500" />;
      case 'denied':
        return <UserX className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getEventBadgeColor = (type: string) => {
    switch (type) {
      case 'entry':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'exit':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'denied':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Access Events</CardTitle>
          <CardDescription>
            Monitor and process access control events
          </CardDescription>
        </div>
        <Button onClick={fetchEvents} size="sm" variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No access events recorded</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Person</TableHead>
                  <TableHead>Door</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-mono text-xs">
                      {formatDate(event.eventTime)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getEventBadgeColor(event.eventType)}>
                        <span className="mr-1">{getEventTypeIcon(event.eventType)}</span>
                        {event.eventType.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>{event.personName || event.personId || 'Unknown'}</TableCell>
                    <TableCell>{event.doorName || 'Unknown'}</TableCell>
                    <TableCell>
                      {event.processed ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                          Processed
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300">
                          Pending
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {!event.processed && (
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => processEvent(event.eventId)}
                        >
                          Process
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col items-start space-y-4">
        <div className="flex items-center justify-between w-full">
          <div>
            <h4 className="font-medium">Event Webhook</h4>
            <p className="text-sm text-muted-foreground">
              Configure webhook for real-time access events
            </p>
          </div>
          <Switch 
            checked={webhookEnabled} 
            onCheckedChange={setWebhookEnabled}
            disabled={!isConnected}
          />
        </div>
        
        <Alert variant="info" className={webhookEnabled ? 'block' : 'hidden'}>
          <AlertDescription className="flex flex-col space-y-2">
            <p>Configure your Hikvision device to send events to:</p>
            <code className="bg-muted p-2 rounded block overflow-x-auto">
              {`${window.location.origin}/api/hikvision-webhook`}
            </code>
          </AlertDescription>
        </Alert>
      </CardFooter>
    </Card>
  );
};

export default AccessEventWebhook;
