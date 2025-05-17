import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { hikvisionService, HikvisionEvent } from '@/integrations/hikvision/hikvisionService';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { usePermissions } from '@/hooks/auth/use-permissions';

interface HikvisionWebhookHandlerProps {
  onEventReceived?: (event: HikvisionEvent) => void;
  autoProcess?: boolean;
}

const HikvisionWebhookHandler = ({ 
  onEventReceived, 
  autoProcess = true 
}: HikvisionWebhookHandlerProps) => {
  const [events, setEvents] = useState<HikvisionEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('recent');
  const { can } = usePermissions();
  
  useEffect(() => {
    fetchRecentEvents();
    
    // Set up polling for new events (in a real app, this would use WebSockets)
    const intervalId = setInterval(fetchRecentEvents, 60000); // Poll every minute
    
    return () => clearInterval(intervalId);
  }, []);
  
  const fetchRecentEvents = async () => {
    setLoading(true);
    
    try {
      // Get events from the last hour
      const startTime = new Date(Date.now() - 3600000).toISOString();
      const recentEvents = await hikvisionService.getEvents(startTime);
      
      setEvents(recentEvents);
      
      // Process events for attendance if autoProcess is enabled
      if (autoProcess && recentEvents.length > 0) {
        await hikvisionService.processAttendance(recentEvents);
      }
    } catch (error) {
      console.error('Failed to fetch Hikvision events:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleProcessAttendance = async () => {
    setLoading(true);
    
    try {
      const processedCount = await hikvisionService.processAttendance(events);
      
      if (processedCount > 0) {
        toast.success(`Processed ${processedCount} attendance records`);
      } else {
        toast.info('No new attendance records to process');
      }
    } catch (error) {
      console.error('Failed to process attendance:', error);
      toast.error('Failed to process attendance records');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSimulateEvent = async () => {
    if (!can('log_attendance')) {
      toast.error('You do not have permission to perform this action');
      return;
    }
    
    setLoading(true);
    
    try {
      // For demo purposes, we'll simulate an entry event for a fixed member ID
      const event = await hikvisionService.simulateEvent('member-1', 'entry');
      
      if (event) {
        // Add the new event to the list
        setEvents(prev => [event, ...prev]);
        
        // Notify parent component
        if (onEventReceived) {
          onEventReceived(event);
        }
        
        // Process for attendance if autoProcess is enabled
        if (autoProcess) {
          await hikvisionService.processAttendance([event]);
        }
        
        toast.success('Simulated entry event successfully');
      }
    } catch (error) {
      console.error('Failed to simulate event:', error);
      toast.error('Failed to simulate access control event');
    } finally {
      setLoading(false);
    }
  };
  
  const getEventBadgeVariant = (eventType: string) => {
    switch (eventType) {
      case 'entry':
        return 'success';
      case 'exit':
        return 'secondary';
      case 'denied':
        return 'destructive';
      default:
        return 'outline';
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Access Control Events</CardTitle>
        <CardDescription>
          Monitor and process events from Hikvision access controller
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-medium">
              Recent Access Events
            </h3>
            <p className="text-sm text-muted-foreground">
              Total events: {events.length}
            </p>
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchRecentEvents}
              disabled={loading}
            >
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleProcessAttendance}
              disabled={loading || events.length === 0}
            >
              Process Attendance
            </Button>
            {can('log_attendance') && (
              <Button
                variant="default"
                size="sm"
                onClick={handleSimulateEvent}
                disabled={loading}
              >
                Simulate Event
              </Button>
            )}
          </div>
        </div>
        
        <Tabs defaultValue="recent" value={tab} onValueChange={setTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="recent">Recent Events</TabsTrigger>
            <TabsTrigger value="denied">Access Denied</TabsTrigger>
          </TabsList>
          
          <TabsContent value="recent">
            {loading ? (
              <div className="flex justify-center py-10">
                <div className="h-8 w-8 rounded-full border-4 border-t-accent animate-spin"></div>
              </div>
            ) : events.length > 0 ? (
              <div className="space-y-3">
                {events
                  .filter(event => event.event_type !== 'denied')
                  .map(event => (
                    <div key={event.event_id} className="flex items-center justify-between border-b pb-3">
                      <div>
                        <p className="font-medium">{event.person_name || 'Unknown Person'}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>
                            {format(new Date(event.event_time), 'h:mm a, MMM d')}
                          </span>
                          <span>
                            {event.door_name || `Door ${event.door_id}`}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getEventBadgeVariant(event.event_type) as any}>
                          {event.event_type === 'entry' ? 'Entry' : 'Exit'}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {event.card_no ? `Card: ${event.card_no}` : 'Face Recognition'}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                No recent access events found
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="denied">
            {loading ? (
              <div className="flex justify-center py-10">
                <div className="h-8 w-8 rounded-full border-4 border-t-accent animate-spin"></div>
              </div>
            ) : events.filter(event => event.event_type === 'denied').length > 0 ? (
              <div className="space-y-3">
                {events
                  .filter(event => event.event_type === 'denied')
                  .map(event => (
                    <div key={event.event_id} className="flex items-center justify-between border-b pb-3">
                      <div>
                        <p className="font-medium">{event.person_name || 'Unknown Person'}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>
                            {format(new Date(event.event_time), 'h:mm a, MMM d')}
                          </span>
                          <span>
                            {event.door_name || `Door ${event.door_id}`}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="destructive">
                          Access Denied
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {event.card_no ? `Card: ${event.card_no}` : 'Face Recognition'}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                No access denied events found
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default HikvisionWebhookHandler;
