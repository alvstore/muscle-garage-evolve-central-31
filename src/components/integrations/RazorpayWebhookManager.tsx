
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Loader2, RefreshCw, AlertTriangle, CheckCircle2, Clock, Copy, ExternalLink, Info } from 'lucide-react';
import { toast } from 'sonner';
import { WebhookLog, RazorpayEventType, WebhookSettings } from '@/types/finance';
import { webhookService } from '@/services/integrations/webhookService';

const RazorpayWebhookManager = () => {
  const [webhookLogs, setWebhookLogs] = useState<WebhookLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [selectedLog, setSelectedLog] = useState<WebhookLog | null>(null);
  const [webhookEndpoint, setWebhookEndpoint] = useState('https://api.muscle-garage-evolve.com/api/webhooks/razorpay');
  const [webhookSecret, setWebhookSecret] = useState('');
  
  // Stats
  const [stats, setStats] = useState({
    total: 0,
    processed: 0,
    failed: 0,
    pending: 0
  });
  
  // Settings
  const [webhookSettings, setWebhookSettings] = useState<WebhookSettings>({
    enableNotifications: true,
    autoRetry: true,
    retryAttempts: 3,
    notifyAdminOnFailure: true
  });
  
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
  
  const fetchWebhookStats = async () => {
    const statsData = await webhookService.getWebhookStats();
    setStats(statsData);
  };
  
  useEffect(() => {
    fetchWebhookLogs();
    fetchWebhookStats();
  }, []);
  
  const handleProcessWebhook = async (logId: string) => {
    setProcessingId(logId);
    const success = await webhookService.processWebhookManually(logId);
    if (success) {
      await fetchWebhookLogs();
      await fetchWebhookStats();
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
        fetchWebhookStats();
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
  
  const handleSaveSettings = async () => {
    const success = await webhookService.updateWebhookSettings(webhookSettings);
    if (success) {
      toast.success('Webhook settings saved successfully');
    }
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
  
  const getEventDescription = (eventType: RazorpayEventType) => {
    switch (eventType) {
      case 'payment.captured':
        return 'Payment was successfully captured. Invoice will be marked as paid.';
      case 'payment.failed':
        return 'Payment attempt failed. Invoice will be flagged with failure reason.';
      case 'order.paid':
        return 'Order was successfully paid. Membership/class purchase will be confirmed.';
      case 'subscription.activated':
        return 'Subscription was activated. Recurring plan will be marked as active.';
      case 'subscription.charged':
        return 'Subscription was charged. A recurring payment entry will be logged.';
      case 'subscription.cancelled':
        return 'Subscription was cancelled. Recurring plan will be marked as cancelled.';
      case 'refund.processed':
        return 'Refund was processed. Payment/refund status will be updated.';
      default:
        return 'This event will be processed according to configured workflows.';
    }
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
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="events">Event Types</TabsTrigger>
            </TabsList>
            
            <TabsContent value="logs">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold">{stats.total}</div>
                        <div className="text-sm text-muted-foreground">Total Events</div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600">{stats.processed}</div>
                        <div className="text-sm text-muted-foreground">Processed</div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-red-600">{stats.failed}</div>
                        <div className="text-sm text-muted-foreground">Failed</div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
                        <div className="text-sm text-muted-foreground">Pending</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Recent Events</h3>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        fetchWebhookLogs();
                        fetchWebhookStats();
                      }}
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
                          <TableHead>Razorpay ID</TableHead>
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
                            <TableCell className="font-mono text-xs">{log.razorpayId || 'N/A'}</TableCell>
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
              </div>
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
            
            <TabsContent value="settings">
              <div className="space-y-6">
                <div className="border p-4 rounded-md bg-muted/50">
                  <h3 className="font-medium mb-4">Webhook Processing Settings</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="auto-retry" className="font-medium">
                          Auto-retry Failed Webhooks
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically retry failed webhook processing
                        </p>
                      </div>
                      <Switch 
                        id="auto-retry" 
                        checked={webhookSettings.autoRetry}
                        onCheckedChange={(checked) => 
                          setWebhookSettings({...webhookSettings, autoRetry: checked})
                        }
                      />
                    </div>
                    
                    {webhookSettings.autoRetry && (
                      <div className="space-y-2">
                        <Label htmlFor="retry-attempts">Maximum Retry Attempts</Label>
                        <Select 
                          value={webhookSettings.retryAttempts.toString()} 
                          onValueChange={(value) => 
                            setWebhookSettings({...webhookSettings, retryAttempts: parseInt(value)})
                          }
                        >
                          <SelectTrigger id="retry-attempts">
                            <SelectValue placeholder="Select retry attempts" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 attempt</SelectItem>
                            <SelectItem value="3">3 attempts</SelectItem>
                            <SelectItem value="5">5 attempts</SelectItem>
                            <SelectItem value="10">10 attempts</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div>
                        <Label htmlFor="enable-notifications" className="font-medium">
                          Webhook Notifications
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Send notifications when webhooks are received
                        </p>
                      </div>
                      <Switch 
                        id="enable-notifications" 
                        checked={webhookSettings.enableNotifications}
                        onCheckedChange={(checked) => 
                          setWebhookSettings({...webhookSettings, enableNotifications: checked})
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="notify-admin" className="font-medium">
                          Admin Failure Notifications
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Notify administrators about webhook failures
                        </p>
                      </div>
                      <Switch 
                        id="notify-admin" 
                        checked={webhookSettings.notifyAdminOnFailure}
                        onCheckedChange={(checked) => 
                          setWebhookSettings({...webhookSettings, notifyAdminOnFailure: checked})
                        }
                      />
                    </div>
                  </div>
                </div>
                
                <Button onClick={handleSaveSettings}>
                  Save Settings
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="events">
              <div className="space-y-4">
                <div className="border p-4 rounded-md bg-blue-50">
                  <div className="flex items-start gap-2">
                    <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-blue-800">Webhook Events</h3>
                      <p className="text-sm text-blue-700">
                        The following events are handled by our system. Make sure to enable these in your Razorpay dashboard.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Event Type</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Action Taken</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">payment.captured</TableCell>
                        <TableCell>When a payment is successfully captured</TableCell>
                        <TableCell>Mark invoice as paid, notify member</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">payment.failed</TableCell>
                        <TableCell>When a payment attempt fails</TableCell>
                        <TableCell>Flag invoice with failure reason, notify member</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">order.paid</TableCell>
                        <TableCell>When an order is successfully paid</TableCell>
                        <TableCell>Confirm purchase (class/package/membership)</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">subscription.activated</TableCell>
                        <TableCell>When a subscription is activated</TableCell>
                        <TableCell>Mark recurring plan as active</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">subscription.charged</TableCell>
                        <TableCell>When a recurring payment is charged</TableCell>
                        <TableCell>Log recurring payment entry</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">subscription.cancelled</TableCell>
                        <TableCell>When a subscription is cancelled</TableCell>
                        <TableCell>Mark recurring plan as cancelled</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">refund.processed</TableCell>
                        <TableCell>When a refund is processed</TableCell>
                        <TableCell>Update payment/refund status, notify member</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
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
              
              <div className="flex items-center justify-between">
                <span className="font-medium">Event Description:</span>
                <span className="text-sm">{getEventDescription(selectedLog.eventType as RazorpayEventType)}</span>
              </div>
              
              {selectedLog.razorpayId && (
                <div className="flex items-center justify-between">
                  <span className="font-medium">Razorpay ID:</span>
                  <span className="font-mono text-xs">{selectedLog.razorpayId}</span>
                </div>
              )}
              
              {selectedLog.relatedEntityId && (
                <div className="flex items-center justify-between">
                  <span className="font-medium">Related Entity ID:</span>
                  <span className="font-mono text-xs">{selectedLog.relatedEntityId}</span>
                </div>
              )}
              
              {selectedLog.processedAt && (
                <div className="flex items-center justify-between">
                  <span className="font-medium">Processed at:</span>
                  <span>{formatDate(selectedLog.processedAt)}</span>
                </div>
              )}
              
              {selectedLog.retryCount !== undefined && selectedLog.retryCount > 0 && (
                <div className="flex items-center justify-between">
                  <span className="font-medium">Retry Count:</span>
                  <span>{selectedLog.retryCount}</span>
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
                  <SelectItem value="refund.processed">Refund Processed</SelectItem>
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
