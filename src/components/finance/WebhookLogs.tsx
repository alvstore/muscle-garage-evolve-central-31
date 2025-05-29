
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, CheckCircle, Clock, RefreshCw } from "lucide-react";
import { RazorpayWebhook, RazorpayEventType } from '@/types/webhooks';
import { razorpayWebhookService } from '@/services/webhooks/razorpayWebhookService';
import { format } from 'date-fns';

const WebhookLogs: React.FC = () => {
  const [logs, setLogs] = useState<RazorpayWebhook[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [eventFilter, setEventFilter] = useState<string>('all');
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchLogs();
  }, [statusFilter, eventFilter]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      let status: 'success' | 'failed' | 'pending' | undefined;
      if (statusFilter !== 'all') {
        status = statusFilter as 'success' | 'failed' | 'pending';
      }
      
      let eventType: RazorpayEventType | undefined;
      if (eventFilter !== 'all') {
        eventType = eventFilter as RazorpayEventType;
      }
      
      const data = await razorpayWebhookService.getWebhookLogs(50, 0, status, eventType);
      setLogs(data);
    } catch (error) {
      console.error("Failed to fetch webhook logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = async (id: string) => {
    setProcessingId(id);
    try {
      const success = await razorpayWebhookService.retryWebhook(id);
      if (success) {
        fetchLogs();
      }
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle className="w-3 h-3 mr-1" /> Success</Badge>;
      case 'failed':
        return <Badge variant="destructive"><AlertTriangle className="w-3 h-3 mr-1" /> Failed</Badge>;
      case 'pending':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-500"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const formatEventType = (type: string) => {
    return type.replace('.', ' ').split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Razorpay Webhook Logs</CardTitle>
            <CardDescription>Monitor and manage payment webhook events</CardDescription>
          </div>
          <Button 
            variant="outline" 
            onClick={fetchLogs} 
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4 mb-4">
          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="space-y-2">
              <label className="text-sm font-medium">Status Filter</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Event Type Filter</label>
              <Select value={eventFilter} onValueChange={setEventFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  <SelectItem value="payment.captured">Payment Captured</SelectItem>
                  <SelectItem value="payment.failed">Payment Failed</SelectItem>
                  <SelectItem value="order.paid">Order Paid</SelectItem>
                  <SelectItem value="subscription.activated">Subscription Activated</SelectItem>
                  <SelectItem value="subscription.charged">Subscription Charged</SelectItem>
                  <SelectItem value="subscription.cancelled">Subscription Cancelled</SelectItem>
                  <SelectItem value="refund.processed">Refund Processed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Details</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    <div className="flex items-center justify-center">
                      <RefreshCw className="h-5 w-5 animate-spin mr-2" />
                      Loading webhook logs...
                    </div>
                  </TableCell>
                </TableRow>
              ) : logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    No webhook logs found
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">
                      {formatEventType(log.eventType)}
                    </TableCell>
                    <TableCell>{getStatusBadge(log.status)}</TableCell>
                    <TableCell>
                      {format(new Date(log.createdAt), 'dd MMM yyyy, HH:mm')}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {log.status === 'failed' ? (
                        <span className="text-red-500">{log.error}</span>
                      ) : (
                        <span className="text-muted-foreground">
                          {log.payload?.payment ? `Payment ID: ${log.payload.payment.entity.id}` : 
                           log.payload?.subscription ? `Subscription ID: ${log.payload.subscription.entity.id}` : 
                           'Webhook received'}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {log.status === 'failed' && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleRetry(log.id)}
                          disabled={processingId === log.id}
                        >
                          {processingId === log.id ? (
                            <>
                              <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                              Retrying...
                            </>
                          ) : (
                            <>
                              <RefreshCw className="w-3 h-3 mr-1" />
                              Retry
                            </>
                          )}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default WebhookLogs;
