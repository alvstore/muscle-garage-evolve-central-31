
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { emailTemplateService } from "@/services/integrations/emailTemplateService";
import { EmailTemplate, TriggerEvent, EmailProvider } from "@/types/finance";
import { Loader2, PlusCircle, Send, Edit, Trash2, Check, X, RefreshCw, Eye } from "lucide-react";

// Email template form schema
const emailTemplateSchema = z.object({
  name: z.string().min(1, { message: "Template name is required" }),
  description: z.string().optional(),
  subject: z.string().min(1, { message: "Email subject is required" }),
  provider: z.enum(["sendgrid", "mailgun", "smtp"]),
  htmlContent: z.string().min(1, { message: "Email content is required" }),
  textContent: z.string().optional(),
  enabled: z.boolean().default(true),
  triggerEvents: z.array(z.string()).min(1, { message: "Select at least one trigger event" }),
});

type EmailTemplateFormValues = z.infer<typeof emailTemplateSchema>;

const triggerEventOptions: { label: string; value: TriggerEvent }[] = [
  { label: "Member Registration", value: "member_registration" },
  { label: "Payment Success", value: "payment_success" },
  { label: "Payment Failure", value: "payment_failure" },
  { label: "Class Booking", value: "class_booking" },
  { label: "Class Cancellation", value: "class_cancellation" },
  { label: "Plan Expiry", value: "plan_expiry" },
  { label: "Birthday", value: "birthday" },
  { label: "Motivation", value: "motivation" },
];

const providerOptions: { label: string; value: EmailProvider }[] = [
  { label: "SendGrid", value: "sendgrid" },
  { label: "Mailgun", value: "mailgun" },
  { label: "SMTP", value: "smtp" },
];

const EmailTemplateManager: React.FC = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [testDialogOpen, setTestDialogOpen] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [activeTab, setActiveTab] = useState("templates");
  const [testData, setTestData] = useState<Record<string, string>>({
    name: "John Doe",
    plan: "Gold Membership",
    amount: "₹5,000",
    date: "2025-05-15",
    gym_name: "Muscle Garage",
    class_name: "Yoga Basics",
    trainer_name: "Mike Johnson",
  });
  const [previewContent, setPreviewContent] = useState("");

  // Form setup
  const form = useForm<EmailTemplateFormValues>({
    resolver: zodResolver(emailTemplateSchema),
    defaultValues: {
      name: "",
      description: "",
      subject: "",
      provider: "sendgrid",
      htmlContent: "",
      textContent: "",
      enabled: true,
      triggerEvents: [],
    },
  });

  // Extract variables from template content
  const extractedVariables = form.watch("htmlContent")
    ? emailTemplateService.extractVariables(form.watch("htmlContent"))
    : [];

  // Load templates
  const loadTemplates = async () => {
    setIsLoading(true);
    try {
      const data = await emailTemplateService.getTemplates();
      setTemplates(data);
    } catch (error) {
      console.error("Failed to load email templates:", error);
      toast.error("Failed to load email templates");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  // Handle form submission
  const onSubmit = async (data: EmailTemplateFormValues) => {
    try {
      setIsLoading(true);
      
      // Add extracted variables to the template data
      const templateData = {
        ...data,
        variables: extractedVariables,
        name: data.name || "Untitled Template", // Ensure name is not optional
        subject: data.subject || "No Subject",
        htmlContent: data.htmlContent || "",
        triggerEvents: data.triggerEvents as TriggerEvent[], // Type assertion
      };
      
      if (isEditing && selectedTemplate) {
        await emailTemplateService.updateTemplate(selectedTemplate.id, templateData);
      } else {
        await emailTemplateService.createTemplate(templateData as Omit<EmailTemplate, "id" | "createdAt" | "updatedAt">);
      }
      
      // Reset form and state
      form.reset();
      setIsEditing(false);
      setIsCreating(false);
      setSelectedTemplate(null);
      
      // Reload templates
      await loadTemplates();
    } catch (error) {
      console.error("Failed to save template:", error);
      toast.error("Failed to save template");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle edit template
  const handleEditTemplate = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setIsEditing(true);
    setIsCreating(true);
    
    form.reset({
      name: template.name,
      description: template.description || "",
      subject: template.subject,
      provider: template.provider,
      htmlContent: template.htmlContent,
      textContent: template.textContent || "",
      enabled: template.enabled,
      triggerEvents: template.triggerEvents as string[],
    });
  };

  // Handle delete template
  const handleDeleteTemplate = async (id: string) => {
    if (confirm("Are you sure you want to delete this template?")) {
      try {
        setIsLoading(true);
        await emailTemplateService.deleteTemplate(id);
        
        // If we're editing this template, reset the form
        if (selectedTemplate && selectedTemplate.id === id) {
          form.reset();
          setIsEditing(false);
          setIsCreating(false);
          setSelectedTemplate(null);
        }
        
        // Reload templates
        await loadTemplates();
      } catch (error) {
        console.error("Failed to delete template:", error);
        toast.error("Failed to delete template");
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Preview template with test data
  const handlePreviewTemplate = () => {
    const htmlContent = form.getValues("htmlContent");
    const previewHtml = emailTemplateService.previewEmail(htmlContent, testData);
    setPreviewContent(previewHtml);
    setPreviewDialogOpen(true);
  };

  // Send test email
  const handleSendTestEmail = async () => {
    if (!testEmail) {
      toast.error("Please enter a test email address");
      return;
    }
    
    if (!selectedTemplate && !isCreating) {
      toast.error("Please select a template or create a new one");
      return;
    }
    
    try {
      setIsSendingTest(true);
      
      let templateId: string;
      
      if (isCreating && !isEditing) {
        // Create a temporary template for testing
        const templateData = {
          name: form.getValues("name") || "Test Template",
          subject: form.getValues("subject") || "Test Subject",
          provider: form.getValues("provider") as EmailProvider,
          htmlContent: form.getValues("htmlContent"),
          textContent: form.getValues("textContent"),
          variables: extractedVariables,
          enabled: true,
          triggerEvents: form.getValues("triggerEvents") as TriggerEvent[],
        };
        
        const newTemplate = await emailTemplateService.createTemplate(templateData);
        if (!newTemplate) {
          throw new Error("Failed to create temporary template");
        }
        
        templateId = newTemplate.id;
      } else {
        templateId = selectedTemplate!.id;
      }
      
      const result = await emailTemplateService.sendTestEmail(templateId, testEmail, testData);
      
      if (result) {
        setTestDialogOpen(false);
      }
    } catch (error) {
      console.error("Failed to send test email:", error);
      toast.error("Failed to send test email");
    } finally {
      setIsSendingTest(false);
    }
  };

  // Create new template button handler
  const handleNewTemplate = () => {
    form.reset({
      name: "",
      description: "",
      subject: "",
      provider: "sendgrid",
      htmlContent: "",
      textContent: "",
      enabled: true,
      triggerEvents: [],
    });
    setIsEditing(false);
    setIsCreating(true);
    setSelectedTemplate(null);
  };

  // Cancel edit/create
  const handleCancel = () => {
    form.reset();
    setIsEditing(false);
    setIsCreating(false);
    setSelectedTemplate(null);
  };

  // Update test data
  const handleTestDataChange = (key: string, value: string) => {
    setTestData(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Email Template Management</CardTitle>
          <CardDescription>
            Create and manage email templates for notifications and communications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="test-data">Test Data</TabsTrigger>
            </TabsList>
            
            <TabsContent value="templates">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Templates List */}
                <div className="lg:col-span-1 border rounded-md">
                  <div className="p-4 border-b">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Template Library</h3>
                      <Button 
                        size="sm" 
                        onClick={handleNewTemplate}
                        disabled={isCreating}
                      >
                        <PlusCircle className="h-4 w-4 mr-2" />
                        New Template
                      </Button>
                    </div>
                  </div>
                  
                  <ScrollArea className="h-[500px]">
                    {isLoading ? (
                      <div className="flex justify-center items-center p-6">
                        <Loader2 className="h-6 w-6 animate-spin" />
                      </div>
                    ) : templates.length === 0 ? (
                      <div className="p-6 text-center text-muted-foreground">
                        No templates found. Create your first template!
                      </div>
                    ) : (
                      <div className="p-2">
                        {templates.map((template) => (
                          <div 
                            key={template.id}
                            className={`mb-2 p-3 rounded-md cursor-pointer transition-colors ${
                              selectedTemplate?.id === template.id
                                ? "bg-primary/10 border border-primary/30"
                                : "hover:bg-accent"
                            }`}
                            onClick={() => handleEditTemplate(template)}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="font-medium">{template.name}</div>
                                <div className="text-sm text-muted-foreground truncate">
                                  {template.subject}
                                </div>
                              </div>
                              <div className="flex space-x-1">
                                <Badge variant={template.enabled ? "default" : "outline"}>
                                  {template.enabled ? "Active" : "Inactive"}
                                </Badge>
                              </div>
                            </div>
                            <div className="mt-2 flex gap-2 flex-wrap">
                              {template.triggerEvents.map((event) => (
                                <Badge key={event} variant="secondary" className="text-xs">
                                  {event.replace(/_/g, ' ')}
                                </Badge>
                              ))}
                            </div>
                            <div className="mt-2 flex justify-end space-x-2">
                              <Button 
                                variant="outline" 
                                size="icon" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditTemplate(template);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteTemplate(template.id);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </div>
                
                {/* Template Editor */}
                <div className="lg:col-span-2 border rounded-md">
                  {isCreating ? (
                    <div className="p-4">
                      <h3 className="text-lg font-medium mb-4">
                        {isEditing ? "Edit Template" : "Create New Template"}
                      </h3>
                      
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Template Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Welcome Email" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="subject"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email Subject</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Welcome to Muscle Garage" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Description (Optional)</FormLabel>
                                <FormControl>
                                  <Input placeholder="Brief description of this template" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="provider"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email Provider</FormLabel>
                                  <Select 
                                    onValueChange={field.onChange} 
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select a provider" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {providerOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                          {option.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="enabled"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between p-4 border rounded-md">
                                  <div className="space-y-0.5">
                                    <FormLabel>Enable Template</FormLabel>
                                    <FormDescription>
                                      Activate this template for use in email notifications
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
                          </div>
                          
                          <FormField
                            control={form.control}
                            name="triggerEvents"
                            render={() => (
                              <FormItem>
                                <div className="mb-2">
                                  <FormLabel>Trigger Events</FormLabel>
                                  <FormDescription>
                                    Select when this template should be used
                                  </FormDescription>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                  {triggerEventOptions.map((option) => (
                                    <FormField
                                      key={option.value}
                                      control={form.control}
                                      name="triggerEvents"
                                      render={({ field }) => {
                                        return (
                                          <FormItem
                                            key={option.value}
                                            className="flex flex-row items-start space-x-3 space-y-0"
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
                                                      )
                                                }}
                                              />
                                            </FormControl>
                                            <FormLabel className="font-normal">
                                              {option.label}
                                            </FormLabel>
                                          </FormItem>
                                        )
                                      }}
                                    />
                                  ))}
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="htmlContent"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email Content (HTML)</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="<p>Hello {name},</p><p>Welcome to {gym_name}!</p>" 
                                    className="min-h-[200px] font-mono text-sm"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormDescription>
                                  Use {'{variable}'} syntax for dynamic content
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="textContent"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Plain Text (Optional)</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Hello {name}, Welcome to {gym_name}!" 
                                    className="min-h-[100px]"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormDescription>
                                  Fallback for email clients that don't support HTML
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          {extractedVariables.length > 0 && (
                            <div className="p-4 border rounded-md bg-muted/50">
                              <h4 className="font-medium mb-2">Variables Detected:</h4>
                              <div className="flex flex-wrap gap-2">
                                {extractedVariables.map((variable) => (
                                  <Badge key={variable} variant="secondary">
                                    {variable}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <div className="flex justify-between pt-2">
                            <div className="space-x-2">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={handlePreviewTemplate}
                                disabled={!form.getValues("htmlContent")}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Preview
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => setTestDialogOpen(true)}
                                disabled={!form.getValues("htmlContent")}
                              >
                                <Send className="h-4 w-4 mr-2" />
                                Send Test
                              </Button>
                            </div>
                            <div className="space-x-2">
                              <Button 
                                type="button" 
                                variant="outline" 
                                onClick={handleCancel}
                              >
                                Cancel
                              </Button>
                              <Button type="submit" disabled={isLoading}>
                                {isLoading ? (
                                  <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Saving...
                                  </>
                                ) : isEditing ? (
                                  <>
                                    <Check className="h-4 w-4 mr-2" />
                                    Update Template
                                  </>
                                ) : (
                                  <>
                                    <Check className="h-4 w-4 mr-2" />
                                    Create Template
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        </form>
                      </Form>
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center p-6">
                      <div className="text-center space-y-3">
                        <h3 className="text-lg font-medium">Email Template Editor</h3>
                        <p className="text-muted-foreground">
                          Select a template to edit or create a new one
                        </p>
                        <Button onClick={handleNewTemplate}>
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Create New Template
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="test-data">
              <Card>
                <CardHeader>
                  <CardTitle>Test Data Configuration</CardTitle>
                  <CardDescription>
                    Set up sample data for testing email templates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(testData).map(([key, value]) => (
                      <div key={key} className="space-y-2">
                        <Label htmlFor={`test-data-${key}`}>
                          {key.replace(/_/g, ' ')}
                        </Label>
                        <Input
                          id={`test-data-${key}`}
                          value={value}
                          onChange={(e) => handleTestDataChange(key, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="justify-between">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setTestData({
                        name: "John Doe",
                        plan: "Gold Membership",
                        amount: "₹5,000",
                        date: "2025-05-15",
                        gym_name: "Muscle Garage",
                        class_name: "Yoga Basics",
                        trainer_name: "Mike Johnson",
                      });
                    }}
                  >
                    Reset to Defaults
                  </Button>
                  <Button onClick={() => setActiveTab("templates")}>
                    Back to Templates
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Preview Dialog */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="max-w-3xl h-[70vh]">
          <DialogHeader>
            <DialogTitle>Template Preview</DialogTitle>
            <DialogDescription>
              Preview of your email with the test data applied
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-full border rounded-md p-4 mt-4">
            <div 
              className="preview-content" 
              dangerouslySetInnerHTML={{ __html: previewContent }} 
            />
          </ScrollArea>
          <DialogFooter>
            <Button onClick={() => setPreviewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Send Test Email Dialog */}
      <Dialog open={testDialogOpen} onOpenChange={setTestDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Test Email</DialogTitle>
            <DialogDescription>
              Send a test email to verify the template
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="test-email">Recipient Email</Label>
              <Input
                id="test-email"
                type="email"
                placeholder="your@email.com"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTestDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSendTestEmail} 
              disabled={isSendingTest || !testEmail}
            >
              {isSendingTest ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Test Email
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmailTemplateManager;
