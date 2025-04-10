
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Plus, Trash, Pencil, Send, Copy, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { toast } from "sonner";
import { smsTemplateService } from "@/services/integrations/smsTemplateService";
import { SmsTemplate, SmsLog, TriggerEvent } from "@/types/finance";

// Schema for SMS Template validation
const smsTemplateSchema = z.object({
  name: z.string().min(1, { message: "Template name is required" }),
  description: z.string().optional(),
  dltTemplateId: z.string().min(1, { message: "DLT Template ID is required" }),
  provider: z.enum(["msg91", "twilio"]),
  content: z.string().min(1, { message: "Template content is required" }),
  enabled: z.boolean().default(true),
  triggerEvents: z.array(z.string()).nonempty({ message: "Select at least one trigger event" }),
});

type SmsTemplateFormValues = z.infer<typeof smsTemplateSchema>;

// Test data for SMS preview
const defaultTestData = {
  name: "John Smith",
  date: new Date().toLocaleDateString(),
  plan: "Gold Membership",
  amount: "₹1,999",
  class: "CrossFit",
  trainer: "Mike Johnson",
  gym: "Muscle Garage",
  otp: "4321",
  count: "15",
};

// Trigger event options
const triggerEventOptions: { value: TriggerEvent; label: string }[] = [
  { value: "member_registration", label: "Member Registration" },
  { value: "payment_success", label: "Payment Success" },
  { value: "payment_failure", label: "Payment Failure" },
  { value: "class_booking", label: "Class Booking" },
  { value: "class_cancellation", label: "Class Cancellation" },
  { value: "plan_expiry", label: "Plan Expiry" },
  { value: "birthday", label: "Birthday" },
  { value: "motivation", label: "Motivation" },
];

const SmsTemplateManager = () => {
  const [activeTab, setActiveTab] = useState("templates");
  const [isLoading, setIsLoading] = useState(false);
  const [templates, setTemplates] = useState<SmsTemplate[]>([]);
  const [smsLogs, setSmsLogs] = useState<SmsLog[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<SmsTemplate | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [isTestSmsDialogOpen, setIsTestSmsDialogOpen] = useState(false);
  const [isTestLoading, setIsTestLoading] = useState(false);
  const [testPhone, setTestPhone] = useState("");
  const [testData, setTestData] = useState<Record<string, string>>(defaultTestData);
  const [smsPreview, setSmsPreview] = useState("");
  const [editingTestData, setEditingTestData] = useState(false);
  const [detectedVariables, setDetectedVariables] = useState<string[]>([]);
  
  // Form setup
  const form = useForm<SmsTemplateFormValues>({
    resolver: zodResolver(smsTemplateSchema),
    defaultValues: {
      name: "",
      description: "",
      dltTemplateId: "",
      provider: "msg91",
      content: "",
      enabled: true,
      triggerEvents: ["member_registration"],
    },
  });
  
  // Load templates on component mount
  useEffect(() => {
    fetchTemplates();
  }, []);
  
  // Load SMS logs when the logs tab is active
  useEffect(() => {
    if (activeTab === "logs") {
      fetchSmsLogs();
    }
  }, [activeTab]);
  
  // Update detected variables when content changes
  const contentValue = form.watch("content");
  useEffect(() => {
    if (contentValue) {
      const variables = smsTemplateService.extractVariables(contentValue);
      setDetectedVariables(variables);
      
      // Update SMS preview
      if (variables.length > 0) {
        const previewText = smsTemplateService.previewSms(contentValue, testData);
        setSmsPreview(previewText);
      } else {
        setSmsPreview(contentValue);
      }
    } else {
      setDetectedVariables([]);
      setSmsPreview("");
    }
  }, [contentValue, testData]);
  
  // Fetch templates from API
  const fetchTemplates = async () => {
    setIsLoading(true);
    try {
      const templates = await smsTemplateService.getTemplates();
      setTemplates(templates);
    } catch (error) {
      console.error("Error fetching templates:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch SMS logs from API
  const fetchSmsLogs = async () => {
    setIsLoading(true);
    try {
      const response = await smsTemplateService.getSmsLogs();
      setSmsLogs(response.logs);
    } catch (error) {
      console.error("Error fetching SMS logs:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Open the template dialog for creation or editing
  const openTemplateDialog = (template?: SmsTemplate) => {
    if (template) {
      setSelectedTemplate(template);
      form.reset({
        name: template.name,
        description: template.description || "",
        dltTemplateId: template.dltTemplateId,
        provider: template.provider,
        content: template.content,
        enabled: template.enabled,
        triggerEvents: template.triggerEvents as string[],
      });
    } else {
      setSelectedTemplate(null);
      form.reset({
        name: "",
        description: "",
        dltTemplateId: "",
        provider: "msg91",
        content: "",
        enabled: true,
        triggerEvents: ["member_registration"],
      });
    }
    setIsTemplateDialogOpen(true);
  };
  
  // Open the test SMS dialog
  const openTestSmsDialog = (template: SmsTemplate) => {
    setSelectedTemplate(template);
    setTestPhone("");
    setSmsPreview(smsTemplateService.previewSms(template.content, testData));
    setIsTestSmsDialogOpen(true);
  };
  
  // Save template (create or update)
  const onSubmit = async (data: SmsTemplateFormValues) => {
    setIsLoading(true);
    try {
      const variables = smsTemplateService.extractVariables(data.content);
      
      if (selectedTemplate) {
        // Update existing template
        await smsTemplateService.updateTemplate(selectedTemplate.id, {
          ...data,
          variables,
        });
      } else {
        // Create new template
        await smsTemplateService.createTemplate({
          ...data,
          variables,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
      
      fetchTemplates();
      setIsTemplateDialogOpen(false);
    } catch (error) {
      console.error("Error saving template:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Delete template
  const deleteTemplate = async () => {
    if (!selectedTemplate) return;
    
    setIsLoading(true);
    try {
      await smsTemplateService.deleteTemplate(selectedTemplate.id);
      fetchTemplates();
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting template:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Send test SMS
  const sendTestSms = async () => {
    if (!selectedTemplate || !testPhone) {
      toast.error("Please enter a phone number");
      return;
    }
    
    setIsTestLoading(true);
    try {
      await smsTemplateService.sendTestSms(
        selectedTemplate.id,
        testPhone,
        testData
      );
      setIsTestSmsDialogOpen(false);
    } catch (error) {
      console.error("Error sending test SMS:", error);
    } finally {
      setIsTestLoading(false);
    }
  };
  
  // Retry failed SMS
  const retrySms = async (logId: string) => {
    try {
      await smsTemplateService.retrySms(logId);
      fetchSmsLogs();
    } catch (error) {
      console.error("Error retrying SMS:", error);
    }
  };
  
  // Reset test data to defaults
  const resetTestData = () => {
    setTestData(defaultTestData);
  };
  
  // Update test data field
  const updateTestData = (key: string, value: string) => {
    setTestData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>SMS Template Manager</CardTitle>
        <CardDescription>
          Create and manage SMS templates for automated messaging
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="logs">SMS Logs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="templates" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">SMS Templates</h3>
              <Button onClick={() => openTemplateDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Add Template
              </Button>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : templates.length === 0 ? (
              <div className="text-center p-8 border rounded-lg bg-muted/20">
                <p className="text-muted-foreground">No templates found. Create your first SMS template.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {templates.map((template) => (
                  <Card key={template.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="grid grid-cols-1 md:grid-cols-5 group">
                        <div className="col-span-3 p-4">
                          <div className="flex flex-col h-full">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-semibold">{template.name}</h4>
                                {template.description && (
                                  <p className="text-sm text-muted-foreground">
                                    {template.description}
                                  </p>
                                )}
                              </div>
                              <Badge variant={template.enabled ? "default" : "outline"}>
                                {template.enabled ? "Enabled" : "Disabled"}
                              </Badge>
                            </div>
                            
                            <div className="mt-2 text-sm">
                              <p className="line-clamp-2">{template.content}</p>
                            </div>
                            
                            <div className="mt-2 flex flex-wrap gap-1">
                              {template.triggerEvents.map((event) => (
                                <Badge variant="secondary" key={event} className="text-xs">
                                  {triggerEventOptions.find(e => e.value === event)?.label || event}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <div className="col-span-2 bg-muted/20 p-4 flex flex-col justify-between">
                          <div>
                            <div className="flex flex-wrap gap-1 mb-2">
                              {template.variables.map((variable) => (
                                <Badge key={variable} variant="outline" className="text-xs">
                                  {`{${variable}}`}
                                </Badge>
                              ))}
                            </div>
                            <div className="text-xs text-muted-foreground mb-2">
                              <span>Provider: </span>
                              <span className="font-semibold capitalize">{template.provider}</span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              <span>DLT ID: </span>
                              <span className="font-semibold">{template.dltTemplateId}</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-end gap-2 mt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedTemplate(template);
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openTestSmsDialog(template)}
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => openTemplateDialog(template)}
                            >
                              <Pencil className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="logs" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">SMS Logs</h3>
              <Button variant="outline" onClick={fetchSmsLogs}>
                Refresh
              </Button>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : smsLogs.length === 0 ? (
              <div className="text-center p-8 border rounded-lg bg-muted/20">
                <p className="text-muted-foreground">No SMS logs found.</p>
              </div>
            ) : (
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Template</TableHead>
                      <TableHead>Recipient</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Sent At</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {smsLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          <div className="font-medium">{log.templateName}</div>
                          <div className="text-xs text-muted-foreground capitalize">
                            {log.provider}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>{log.recipient}</div>
                          <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                            {log.content.substring(0, 50)}...
                          </div>
                        </TableCell>
                        <TableCell>
                          {log.status === "sent" ? (
                            <Badge variant="success" className="bg-green-100 text-green-800 hover:bg-green-100">
                              <CheckCircle2 className="h-3 w-3 mr-1" /> Sent
                            </Badge>
                          ) : log.status === "failed" ? (
                            <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-100">
                              <AlertCircle className="h-3 w-3 mr-1" /> Failed
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                              <Clock className="h-3 w-3 mr-1" /> Pending
                            </Badge>
                          )}
                          {log.error && (
                            <div className="text-xs text-red-500 mt-1 truncate max-w-[150px]">
                              {log.error}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {log.sentAt
                            ? new Date(log.sentAt).toLocaleString()
                            : new Date(log.createdAt).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {log.status === "failed" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => retrySms(log.id)}
                            >
                              Retry
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      
      {/* Template Form Dialog */}
      <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedTemplate ? "Edit SMS Template" : "Create SMS Template"}
            </DialogTitle>
            <DialogDescription>
              Configure your SMS template with placeholders for dynamic content
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Template Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Payment Confirmation" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Sent when payment is successful" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="dltTemplateId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>DLT Template ID</FormLabel>
                        <FormControl>
                          <Input placeholder="1234567890" {...field} />
                        </FormControl>
                        <FormDescription>
                          Registered DLT template ID for this message
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="provider"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SMS Provider</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-row space-y-0 space-x-4"
                          >
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="msg91" />
                              </FormControl>
                              <FormLabel className="font-normal">MSG91</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="twilio" />
                              </FormControl>
                              <FormLabel className="font-normal">Twilio</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="enabled"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Enable Template</FormLabel>
                          <FormDescription>
                            Activate this template for automatic sending
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="triggerEvents"
                    render={() => (
                      <FormItem>
                        <div className="mb-2">
                          <FormLabel>Trigger Events</FormLabel>
                          <FormDescription>
                            Select when this template should be sent
                          </FormDescription>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {triggerEventOptions.map((option) => (
                            <FormField
                              key={option.value}
                              control={form.control}
                              name="triggerEvents"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={option.value}
                                    className="flex flex-row items-start space-x-2 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(option.value)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, option.value])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== option.value
                                                )
                                              );
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="text-sm font-normal">
                                      {option.label}
                                    </FormLabel>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message Content</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Hello {name}, your payment of {amount} for {plan} was successful. Thank you for choosing {gym}."
                            className="min-h-[150px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Use {"{variable}"} for dynamic content
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Detected Variables</div>
                    {detectedVariables.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {detectedVariables.map((variable) => (
                          <Badge key={variable} variant="secondary">
                            {`{${variable}}`}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        No variables detected
                      </div>
                    )}
                  </div>
                  
                  <div className="pt-2">
                    <div className="text-sm font-medium mb-2">Preview</div>
                    <div className="bg-muted p-3 rounded-md text-sm relative min-h-[100px]">
                      {smsPreview || (
                        <span className="text-muted-foreground">
                          Preview will appear here
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsTemplateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Template"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete SMS Template</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this template? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={deleteTemplate}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Test SMS Dialog */}
      <Dialog open={isTestSmsDialogOpen} onOpenChange={setIsTestSmsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Test SMS</DialogTitle>
            <DialogDescription>
              Preview and send a test message using this template
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <FormLabel htmlFor="testPhone">Phone Number</FormLabel>
              <Input
                id="testPhone"
                placeholder="+91 9876543210"
                value={testPhone}
                onChange={(e) => setTestPhone(e.target.value)}
              />
              <FormDescription>
                Enter the phone number with country code
              </FormDescription>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <FormLabel>Preview</FormLabel>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingTestData(!editingTestData)}
                >
                  {editingTestData ? "Done" : "Edit Test Data"}
                </Button>
              </div>
              
              {editingTestData ? (
                <div className="space-y-3 border p-3 rounded-md">
                  <div className="flex justify-between items-center">
                    <div className="text-sm font-medium">Test Variables</div>
                    <Button variant="ghost" size="sm" onClick={resetTestData}>
                      Reset
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {detectedVariables.map((variable) => (
                      <div key={variable} className="space-y-1">
                        <FormLabel className="text-xs" htmlFor={`var-${variable}`}>
                          {variable}
                        </FormLabel>
                        <Input
                          id={`var-${variable}`}
                          size={1}
                          value={testData[variable] || ""}
                          onChange={(e) => updateTestData(variable, e.target.value)}
                          placeholder={variable}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-muted p-3 rounded-md text-sm whitespace-pre-wrap">
                  {smsPreview}
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsTestSmsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={sendTestSms} disabled={isTestLoading || !testPhone}>
              {isTestLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Test SMS
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default SmsTemplateManager;
