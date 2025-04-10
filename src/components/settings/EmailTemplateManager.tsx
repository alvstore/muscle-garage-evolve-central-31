
import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Plus, Mail, Send, Trash2, Pencil, X, RefreshCw, Check, Copy, Eye, 
  CheckCircle, AlertCircle, Info
} from "lucide-react";
import { toast } from "sonner";

// Define EmailTemplate type
interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  provider: "sendgrid" | "mailgun" | "smtp";
  body: string;
  variables: string[];
  active: boolean;
  triggers: string[];
  createdAt: string;
  updatedAt: string;
}

// Define the form schema
const templateFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, { message: "Template name must be at least 3 characters." }),
  subject: z.string().min(3, { message: "Subject line is required" }),
  provider: z.enum(["sendgrid", "mailgun", "smtp"]),
  body: z.string().min(10, { message: "Email body must be at least 10 characters." }),
  active: z.boolean().default(true),
  triggers: z.array(z.string()).optional(),
});

type TemplateFormValues = z.infer<typeof templateFormSchema>;

const MOCK_TEMPLATES: EmailTemplate[] = [
  {
    id: "1",
    name: "Welcome Email",
    subject: "Welcome to Muscle Garage!",
    provider: "sendgrid",
    body: "<h1>Welcome, {name}!</h1><p>Thank you for joining Muscle Garage. Your membership plan is {plan}.</p><p>Your membership is active until {expiryDate}.</p>",
    variables: ["{name}", "{plan}", "{expiryDate}"],
    active: true,
    triggers: ["registration"],
    createdAt: "2023-05-10T10:30:00Z",
    updatedAt: "2023-05-10T10:30:00Z",
  },
  {
    id: "2",
    name: "Payment Confirmation",
    subject: "Payment Successful - Muscle Garage",
    provider: "mailgun",
    body: "<h1>Payment Received</h1><p>Dear {name},</p><p>We've received your payment of {amount} for {plan}.</p><p>Thank you for choosing Muscle Garage!</p>",
    variables: ["{name}", "{amount}", "{plan}"],
    active: true,
    triggers: ["payment_success"],
    createdAt: "2023-05-15T14:20:00Z",
    updatedAt: "2023-06-01T09:10:00Z",
  },
  {
    id: "3",
    name: "Plan Expiry Reminder",
    subject: "Your Membership is About to Expire",
    provider: "smtp",
    body: "<h1>Membership Expiry Notice</h1><p>Hello {name},</p><p>Your {plan} membership will expire on {expiryDate}.</p><p>Renew now to continue enjoying our services without interruption.</p>",
    variables: ["{name}", "{plan}", "{expiryDate}"],
    active: true,
    triggers: ["plan_expiry"],
    createdAt: "2023-06-10T11:45:00Z",
    updatedAt: "2023-06-10T11:45:00Z",
  },
];

const TRIGGER_OPTIONS = [
  { value: "registration", label: "Member Registration" },
  { value: "payment_success", label: "Payment Success" },
  { value: "payment_failure", label: "Payment Failure" },
  { value: "class_booking", label: "Class Booking" },
  { value: "class_cancellation", label: "Class Cancellation" },
  { value: "plan_expiry", label: "Plan Expiry" },
  { value: "birthday", label: "Birthday Greeting" },
  { value: "pt_session_reminder", label: "PT Session Reminder" },
  { value: "feedback_request", label: "Feedback Request" },
];

const EmailTemplateManager = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>(MOCK_TEMPLATES);
  const [activeTemplate, setActiveTemplate] = useState<EmailTemplate | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [previewMode, setPreviewMode] = useState<"code" | "preview">("preview");
  const [activeTab, setActiveTab] = useState("all");

  // Form setup
  const form = useForm<TemplateFormValues>({
    resolver: zodResolver(templateFormSchema),
    defaultValues: {
      name: "",
      subject: "",
      provider: "sendgrid",
      body: "",
      active: true,
      triggers: [],
    },
  });

  // Function to extract variables from template body
  const extractVariables = (body: string): string[] => {
    const regex = /{([^}]+)}/g;
    const matches = body.match(regex) || [];
    return [...new Set(matches)];
  };

  // Add or update template
  const onSubmit = async (data: TemplateFormValues) => {
    try {
      // Extract variables from the body
      const variables = extractVariables(data.body);
      
      if (isEditing && activeTemplate) {
        // Update existing template
        const updatedTemplate: EmailTemplate = {
          ...activeTemplate,
          name: data.name,
          subject: data.subject,
          provider: data.provider,
          body: data.body,
          variables,
          active: data.active || false,
          triggers: data.triggers || [],
          updatedAt: new Date().toISOString(),
        };
        
        const updatedTemplates = templates.map(t => 
          t.id === updatedTemplate.id ? updatedTemplate : t
        );
        
        setTemplates(updatedTemplates);
        toast.success("Template updated successfully");
      } else {
        // Create new template
        const newTemplate: EmailTemplate = {
          id: Date.now().toString(),
          name: data.name,
          subject: data.subject,
          provider: data.provider,
          body: data.body,
          variables,
          active: data.active || false,
          triggers: data.triggers || [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        setTemplates([...templates, newTemplate]);
        toast.success("Template created successfully");
      }
      
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving template:", error);
      toast.error("Failed to save template");
    }
  };

  // Reset form and state
  const resetForm = () => {
    form.reset({
      name: "",
      subject: "",
      provider: "sendgrid",
      body: "",
      active: true,
      triggers: [],
    });
    setActiveTemplate(null);
    setIsEditing(false);
  };

  // Edit template
  const handleEditTemplate = (template: EmailTemplate) => {
    setActiveTemplate(template);
    setIsEditing(true);
    
    form.reset({
      id: template.id,
      name: template.name,
      subject: template.subject,
      provider: template.provider,
      body: template.body,
      active: template.active,
      triggers: template.triggers,
    });
    
    setIsDialogOpen(true);
  };

  // Delete template
  const handleDeleteTemplate = (id: string) => {
    if (confirm("Are you sure you want to delete this template?")) {
      const updatedTemplates = templates.filter(t => t.id !== id);
      setTemplates(updatedTemplates);
      toast.success("Template deleted successfully");
    }
  };

  // Send test email
  const handleSendTestEmail = async () => {
    if (!activeTemplate) return;
    
    if (!testEmail) {
      toast.error("Please enter a test email address");
      return;
    }
    
    try {
      setIsSendingTest(true);
      // In a real implementation, this would call an API
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success(`Test email sent to ${testEmail}`);
    } catch (error) {
      toast.error("Failed to send test email");
    } finally {
      setIsSendingTest(false);
    }
  };

  // Watch body field to update variables
  const bodyValue = form.watch("body");
  useEffect(() => {
    if (bodyValue) {
      const variables = extractVariables(bodyValue);
      // Update the variables in the form (if needed)
      console.log("Detected variables:", variables);
    }
  }, [bodyValue]);

  // Generate HTML preview with sample data
  const generatePreview = (template: EmailTemplate | null) => {
    if (!template) return "";
    
    let previewHtml = template.body;
    
    // Replace variables with sample data
    previewHtml = previewHtml.replace(/{name}/g, "John Doe");
    previewHtml = previewHtml.replace(/{plan}/g, "Premium Membership");
    previewHtml = previewHtml.replace(/{amount}/g, "$99.99");
    previewHtml = previewHtml.replace(/{expiryDate}/g, "December 31, 2023");
    previewHtml = previewHtml.replace(/{gym}/g, "Muscle Garage");
    previewHtml = previewHtml.replace(/{date}/g, "November 15, 2023");
    previewHtml = previewHtml.replace(/{time}/g, "10:30 AM");
    
    return previewHtml;
  };

  // Create new template
  const handleCreateTemplate = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  // Handle body input change for syntax highlighting
  const handleBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    form.setValue("body", e.target.value);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Email Templates</CardTitle>
            <CardDescription>
              Manage email templates for automated communications
            </CardDescription>
          </div>
          <Button onClick={handleCreateTemplate}>
            <Plus className="mr-2 h-4 w-4" />
            New Template
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Templates</TabsTrigger>
              <TabsTrigger value="registration">Registration</TabsTrigger>
              <TabsTrigger value="payment">Payment</TabsTrigger>
              <TabsTrigger value="classes">Classes</TabsTrigger>
              <TabsTrigger value="reminders">Reminders</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <TemplateTable 
                templates={templates} 
                onEdit={handleEditTemplate} 
                onDelete={handleDeleteTemplate} 
              />
            </TabsContent>
            
            <TabsContent value="registration">
              <TemplateTable 
                templates={templates.filter(t => t.triggers.includes('registration'))} 
                onEdit={handleEditTemplate} 
                onDelete={handleDeleteTemplate} 
              />
            </TabsContent>
            
            <TabsContent value="payment">
              <TemplateTable 
                templates={templates.filter(t => 
                  t.triggers.includes('payment_success') || 
                  t.triggers.includes('payment_failure')
                )} 
                onEdit={handleEditTemplate} 
                onDelete={handleDeleteTemplate} 
              />
            </TabsContent>
            
            <TabsContent value="classes">
              <TemplateTable 
                templates={templates.filter(t => 
                  t.triggers.includes('class_booking') || 
                  t.triggers.includes('class_cancellation')
                )} 
                onEdit={handleEditTemplate} 
                onDelete={handleDeleteTemplate} 
              />
            </TabsContent>
            
            <TabsContent value="reminders">
              <TemplateTable 
                templates={templates.filter(t => 
                  t.triggers.includes('plan_expiry') || 
                  t.triggers.includes('birthday') ||
                  t.triggers.includes('pt_session_reminder')
                )} 
                onEdit={handleEditTemplate} 
                onDelete={handleDeleteTemplate} 
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Template Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Email Template" : "Create Email Template"}
            </DialogTitle>
            <DialogDescription>
              {isEditing 
                ? "Update this email template's details and content." 
                : "Create a new email template for automated communications."}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Template Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Welcome Email" {...field} />
                      </FormControl>
                      <FormDescription>
                        Give your template a descriptive name
                      </FormDescription>
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
                        <Input placeholder="e.g., Welcome to Muscle Garage" {...field} />
                      </FormControl>
                      <FormDescription>
                        The subject line for this email
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
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
                            <SelectValue placeholder="Select provider" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="sendgrid">SendGrid</SelectItem>
                          <SelectItem value="mailgun">Mailgun</SelectItem>
                          <SelectItem value="smtp">SMTP (Own Server)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Service used to send this email
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Active Status</FormLabel>
                        <FormDescription>
                          Enable or disable this template
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
                name="triggers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trigger Events</FormLabel>
                    <FormDescription className="mb-2">
                      Select events that will use this template (optional)
                    </FormDescription>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      {TRIGGER_OPTIONS.map(option => (
                        <div 
                          key={option.value} 
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="checkbox"
                            id={`trigger-${option.value}`}
                            value={option.value}
                            checked={(field.value || []).includes(option.value)}
                            onChange={(e) => {
                              const newValue = e.target.checked
                                ? [...(field.value || []), option.value]
                                : (field.value || []).filter(v => v !== option.value);
                              field.onChange(newValue);
                            }}
                            className="h-4 w-4 rounded border-gray-300"
                          />
                          <label 
                            htmlFor={`trigger-${option.value}`}
                            className="text-sm font-medium"
                          >
                            {option.label}
                          </label>
                        </div>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="body"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Body</FormLabel>
                      <Tabs defaultValue="edit" className="w-full">
                        <TabsList className="mb-2">
                          <TabsTrigger value="edit">Edit</TabsTrigger>
                          <TabsTrigger value="preview">Preview</TabsTrigger>
                        </TabsList>
                        <TabsContent value="edit" className="border rounded-md p-4">
                          <FormControl>
                            <Textarea
                              placeholder="Enter your email HTML content here. Use {name}, {plan}, etc. for variables."
                              className="font-mono min-h-[300px] resize-y"
                              {...field}
                              onChange={handleBodyChange}
                            />
                          </FormControl>
                          <div className="mt-2">
                            <FormDescription>
                              Available variables: {extractVariables(field.value).join(", ")}
                            </FormDescription>
                          </div>
                          <FormMessage />
                        </TabsContent>
                        <TabsContent value="preview">
                          <div className="border rounded-md p-4 min-h-[300px] bg-white">
                            <div className="text-sm mb-2 text-muted-foreground">
                              Preview with sample data:
                            </div>
                            <div 
                              className="preview-html" 
                              dangerouslySetInnerHTML={{ 
                                __html: generatePreview({ 
                                  ...activeTemplate,
                                  body: field.value,
                                  variables: extractVariables(field.value)
                                } as EmailTemplate) 
                              }} 
                            />
                          </div>
                        </TabsContent>
                      </Tabs>
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Send Test Email</h3>
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <Input
                      type="email"
                      placeholder="test@example.com"
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                    />
                  </div>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={handleSendTestEmail}
                    disabled={isSendingTest}
                  >
                    {isSendingTest ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Test
                      </>
                    )}
                  </Button>
                </div>
              </div>
              
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>HTML Email Tips</AlertTitle>
                <AlertDescription>
                  Use inline CSS for best compatibility across email clients. 
                  Test your email on multiple devices before using in production.
                </AlertDescription>
              </Alert>
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    resetForm();
                    setIsDialogOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {isEditing ? "Update Template" : "Create Template"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Template Table Component
interface TemplateTableProps {
  templates: EmailTemplate[];
  onEdit: (template: EmailTemplate) => void;
  onDelete: (id: string) => void;
}

const TemplateTable = ({ templates, onEdit, onDelete }: TemplateTableProps) => {
  if (templates.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No templates found for this category.
      </div>
    );
  }
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Template Name</TableHead>
          <TableHead>Subject</TableHead>
          <TableHead>Provider</TableHead>
          <TableHead>Triggers</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {templates.map((template) => (
          <TableRow key={template.id}>
            <TableCell className="font-medium">{template.name}</TableCell>
            <TableCell>{template.subject}</TableCell>
            <TableCell>
              <span className="capitalize">{template.provider}</span>
            </TableCell>
            <TableCell>
              {template.triggers.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {template.triggers.map(trigger => (
                    <span 
                      key={trigger} 
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {TRIGGER_OPTIONS.find(opt => opt.value === trigger)?.label || trigger}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-muted-foreground text-sm">No triggers</span>
              )}
            </TableCell>
            <TableCell>
              {template.active ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Active
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                  Inactive
                </span>
              )}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(template)}
                >
                  <Pencil className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(template.id)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default EmailTemplateManager;
