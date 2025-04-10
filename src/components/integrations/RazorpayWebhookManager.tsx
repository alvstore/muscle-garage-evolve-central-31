
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, RefreshCw, AlertTriangle, CheckCircle2, Clock, Copy, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { WebhookLog, RazorpayEventType } from '@/types/finance';
import { webhookService } from '@/services/integrations/webhookService';

const RazorpayWebhookManager = () => {
  const [webhookLogs, setWebhookLogs] = useState<WebhookLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [selectedLog, setSelectedLog] = useState<WebhookLog | null>(null);
  const [webhookEndpoint, setWebhookEndpoint] = useState('https://api.muscle-garage-evolve.com/api/webhooks/razorpay');
  const [webhookSecret, setWebhookSecret] = useState('');
  
  // Test webhook state
  const [showTestDialog, setShowTestDialog] = useState(false);
  const [testEventType, setTestEventType] = useState<RazorpayEventType>('payment.captured');
  const [testPayload, setTestPayload] = useState('{\n  "payment_id": "pay_test123456",\n  "amount": 50000,\n  "currency": "INR"\n}');
  const [sendingTest, setSendingTest] = useState(false);
  
  const fetchWebhookLogs = async () => {
    setLoading(true);
    const logs = await webhookService.getWebhookLogs();
    setWebhookLogs(logs);
    setLoading(false);
  };
  
  useEffect(() => {
    fetchWebhookLogs();
  }, []);
  
  const handleProcessWebhook = async (logId: string) => {
    setProcessingId(logId);
    const success = await webhookService.processWebhookManually(logId);
    if (success) {
      await fetchWebhookLogs();
    }
    setProcessingId(null);
  };
  
  const handleSendTestWebhook = async () => {
    setSendingTest(true);
    try {
      // Parse JSON payload
      const payload = JSON.parse(testPayload);
      await webhookService.sendTestWebhook(testEventType, payload);
      setShowTestDialog(false);
      // Refresh logs after a brief delay to allow processing
      setTimeout(() => {
        fetchWebhookLogs();
      }, 1000);
    } catch (error) {
      toast.error('Invalid JSON payload');
    } finally {
      setSendingTest(false);
    }
  };
  
  const handleCopyWebhookUrl = () => {
    navigator.clipboard.writeText(webhookEndpoint);
    toast.success('Webhook URL copied to clipboard');
  };
  
  const handleViewDetails = (log: WebhookLog) => {
    setSelectedLog(log);
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'processed':
        return <Badge className="bg-green-100 text-green-800">Processed</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processed':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return null;
    }
  };
  
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };
  
  const formatEventType = (type: string) => {
    return type.replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Razorpay Webhooks</CardTitle>
          <CardDescription>
            Configure and manage Razorpay webhook events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="logs">
            <TabsList className="mb-4">
              <TabsTrigger value="logs">Webhook Logs</TabsTrigger>
              <TabsTrigger value="setup">Setup Instructions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="logs">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Recent Events</h3>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={fetchWebhookLogs}
                    disabled={loading}
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <RefreshCw className="h-4 w-4 mr-1" />}
                    Refresh
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => setShowTestDialog(true)}
                  >
                    Send Test Webhook
                  </Button>
                </div>
              </div>
              
              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : webhookLogs.length === 0 ? (
                <div className="text-center py-8 border rounded-md bg-muted/50">
                  <p className="text-muted-foreground">No webhook logs found</p>
                  <Button 
                    variant="link" 
                    className="mt-2"
                    onClick={() => setShowTestDialog(true)}
                  >
                    Send a test webhook to get started
                  </Button>
                </div>
              ) : (
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Status</TableHead>
                        <TableHead>Event Type</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead>Processed At</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {webhookLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(log.status)}
                              {getStatusBadge(log.status)}
                            </div>
                          </TableCell>
                          <TableCell>{formatEventType(log.eventType)}</TableCell>
                          <TableCell>{formatDate(log.createdAt)}</TableCell>
                          <TableCell>{log.processedAt ? formatDate(log.processedAt) : 'N/A'}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleViewDetails(log)}
                              >
                                View Details
                              </Button>
                              {log.status === 'failed' && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleProcessWebhook(log.id)}
                                  disabled={processingId === log.id}
                                >
                                  {processingId === log.id ? (
                                    <Loader2 className="h-3 w-3 animate-spin mr-1" />
                                  ) : null}
                                  Retry
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="setup">
              <div className="space-y-6">
                <div className="border p-4 rounded-md bg-muted/50">
                  <h3 className="font-medium mb-2">Webhook URL</h3>
                  <div className="flex gap-2">
                    <Input 
                      value={webhookEndpoint} 
                      onChange={(e) => setWebhookEndpoint(e.target.value)}
                      className="flex-1 font-mono text-sm"
                    />
                    <Button variant="outline" size="icon" onClick={handleCopyWebhookUrl}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Add this URL to your Razorpay Dashboard under Settings &gt; Webhooks
                  </p>
                </div>
                
                <div className="border p-4 rounded-md bg-muted/50">
                  <h3 className="font-medium mb-2">Webhook Secret</h3>
                  <div className="flex gap-2">
                    <Input 
                      type="password"
                      value={webhookSecret} 
                      onChange={(e) => setWebhookSecret(e.target.value)}
                      className="flex-1"
                      placeholder="Enter your webhook secret"
                    />
                    <Button variant="outline">Save Secret</Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Set this same secret in your Razorpay Dashboard when adding the webhook
                  </p>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Setup Instructions</h3>
                  <ol className="list-decimal list-inside space-y-2 text-sm">
                    <li>Log in to your Razorpay Dashboard</li>
                    <li>Navigate to Settings &gt; Webhooks</li>
                    <li>Click on "Add New Webhook"</li>
                    <li>Enter the Webhook URL shown above</li>
                    <li>Generate a random string as your Webhook Secret</li>
                    <li>Select the events you want to receive (we recommend all payment related events)</li>
                    <li>Save your webhook configuration</li>
                  </ol>
                  
                  <Button 
                    variant="outline" 
                    className="mt-2"
                    onClick={() => window.open('https://dashboard.razorpay.com/#/app/webhooks', '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Open Razorpay Dashboard
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Log Details Dialog */}
      {selectedLog && (
        <Dialog open={!!selectedLog} onOpenChange={(open) => !open && setSelectedLog(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{formatEventType(selectedLog.eventType)}</DialogTitle>
              <DialogDescription>
                Created at {formatDate(selectedLog.createdAt)}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Status:</span>
                <div className="flex items-center gap-2">
                  {getStatusIcon(selectedLog.status)}
                  {getStatusBadge(selectedLog.status)}
                </div>
              </div>
              
              {selectedLog.processedAt && (
                <div className="flex items-center justify-between">
                  <span className="font-medium">Processed at:</span>
                  <span>{formatDate(selectedLog.processedAt)}</span>
                </div>
              )}
              
              {selectedLog.error && (
                <div className="space-y-1">
                  <span className="font-medium">Error:</span>
                  <div className="bg-red-50 text-red-800 p-2 rounded text-sm font-mono overflow-x-auto">
                    {selectedLog.error}
                  </div>
                </div>
              )}
              
              <div className="space-y-1">
                <span className="font-medium">Payload:</span>
                <div className="bg-muted p-3 rounded text-sm font-mono overflow-x-auto max-h-96 overflow-y-auto">
                  <pre>{JSON.stringify(JSON.parse(selectedLog.payload), null, 2)}</pre>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              {selectedLog.status === 'failed' && (
                <Button 
                  onClick={() => handleProcessWebhook(selectedLog.id)}
                  disabled={processingId === selectedLog.id}
                >
                  {processingId === selectedLog.id ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-1" />
                  ) : null}
                  Retry Processing
                </Button>
              )}
              <Button variant="outline" onClick={() => setSelectedLog(null)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Test Webhook Dialog */}
      <Dialog open={showTestDialog} onOpenChange={setShowTestDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Send Test Webhook</DialogTitle>
            <DialogDescription>
              Simulate a webhook event from Razorpay for testing
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="event-type">Event Type</Label>
              <Select 
                value={testEventType} 
                onValueChange={(value) => setTestEventType(value as RazorpayEventType)}
              >
                <SelectTrigger id="event-type">
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="payment.authorized">Payment Authorized</SelectItem>
                  <SelectItem value="payment.captured">Payment Captured</SelectItem>
                  <SelectItem value="payment.failed">Payment Failed</SelectItem>
                  <SelectItem value="payment.refunded">Payment Refunded</SelectItem>
                  <SelectItem value="order.paid">Order Paid</SelectItem>
                  <SelectItem value="subscription.activated">Subscription Activated</SelectItem>
                  <SelectItem value="subscription.charged">Subscription Charged</SelectItem>
                  <SelectItem value="subscription.cancelled">Subscription Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="payload">Payload (JSON)</Label>
              <Textarea 
                id="payload" 
                value={testPayload} 
                onChange={(e) => setTestPayload(e.target.value)}
                className="font-mono text-sm h-40"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTestDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSendTestWebhook}
              disabled={sendingTest}
            >
              {sendingTest ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
              Send Test Webhook
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RazorpayWebhookManager;
