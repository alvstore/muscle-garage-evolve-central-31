
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Eye, RefreshCw, Search, Filter } from 'lucide-react';

interface WebhookLog {
  id: string;
  event_type: string;
  payload: any;
  status: 'success' | 'pending' | 'failed';
  processed_at?: string;
  error_message?: string;
  created_at: string;
  source?: string;
  signature?: string;
}

interface RazorpayPayment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  order_id?: string;
  method?: string;
  email?: string;
  contact?: string;
}

interface RazorpaySubscription {
  id: string;
  plan_id: string;
  customer_id: string;
  status: string;
  current_start?: number;
  current_end?: number;
}

const WebhookLogs = () => {
  const [logs, setLogs] = useState<WebhookLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState<WebhookLog | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'success' | 'pending' | 'failed'>('all');

  useEffect(() => {
    fetchWebhookLogs();
  }, []);

  const fetchWebhookLogs = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('webhook_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      
      setLogs(data || []);
    } catch (error) {
      console.error('Error fetching webhook logs:', error);
      toast.error('Failed to fetch webhook logs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetryWebhook = async (logId: string) => {
    try {
      const { error } = await supabase
        .from('webhook_logs')
        .update({ 
          status: 'pending',
          error_message: null,
          processed_at: null 
        })
        .eq('id', logId);

      if (error) throw error;
      
      toast.success('Webhook marked for retry');
      fetchWebhookLogs();
    } catch (error) {
      console.error('Error retrying webhook:', error);
      toast.error('Failed to retry webhook');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatPayload = (payload: any) => {
    if (!payload) return 'No payload';
    
    try {
      return JSON.stringify(payload, null, 2);
    } catch (error) {
      return 'Invalid JSON payload';
    }
  };

  const getEventDescription = (eventType: string, payload: any) => {
    switch (eventType) {
      case 'payment.captured':
        const payment = payload?.payment || payload;
        return `Payment of ₹${(payment?.amount || 0) / 100} captured`;
      case 'payment.failed':
        const failedPayment = payload?.payment || payload;
        return `Payment of ₹${(failedPayment?.amount || 0) / 100} failed`;
      case 'subscription.charged':
        return `Subscription charged successfully`;
      case 'subscription.cancelled':
        return `Subscription cancelled`;
      default:
        return eventType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = searchTerm === '' || 
      log.event_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return <div>Loading webhook logs...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Webhook Logs</span>
            <Button onClick={fetchWebhookLogs} size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search by event type or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="status">Status Filter</Label>
              <select
                id="status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              >
                <option value="all">All Status</option>
                <option value="success">Success</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {filteredLogs.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No webhook logs found</p>
            ) : (
              filteredLogs.map((log) => (
                <div key={log.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium">{log.event_type}</h4>
                        <Badge className={getStatusColor(log.status)}>
                          {log.status}
                        </Badge>
                        {log.source && (
                          <Badge variant="outline">{log.source}</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {getEventDescription(log.event_type, log.payload)}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>ID: {log.id.substring(0, 8)}...</span>
                        <span>Created: {new Date(log.created_at).toLocaleString()}</span>
                        {log.processed_at && (
                          <span>Processed: {new Date(log.processed_at).toLocaleString()}</span>
                        )}
                      </div>
                      {log.error_message && (
                        <p className="text-sm text-red-600 mt-2">
                          Error: {log.error_message}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedLog(log)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {log.status === 'failed' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRetryWebhook(log.id)}
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {selectedLog && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Webhook Details</span>
              <Button variant="outline" onClick={() => setSelectedLog(null)}>
                Close
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label>Event Type</Label>
                <p className="text-sm">{selectedLog.event_type}</p>
              </div>
              <div>
                <Label>Status</Label>
                <Badge className={getStatusColor(selectedLog.status)}>
                  {selectedLog.status}
                </Badge>
              </div>
              <div>
                <Label>Payload</Label>
                <pre className="bg-gray-100 p-3 rounded-md text-xs overflow-auto max-h-96">
                  {formatPayload(selectedLog.payload)}
                </pre>
              </div>
              {selectedLog.error_message && (
                <div>
                  <Label>Error Message</Label>
                  <p className="text-sm text-red-600">{selectedLog.error_message}</p>
                </div>
              )}
              <div>
                <Label>Timestamps</Label>
                <div className="text-sm space-y-1">
                  <p>Created: {new Date(selectedLog.created_at).toLocaleString()}</p>
                  {selectedLog.processed_at && (
                    <p>Processed: {new Date(selectedLog.processed_at).toLocaleString()}</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WebhookLogs;
