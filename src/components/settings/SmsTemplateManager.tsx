
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Loader2, Plus, Pencil, Trash2, MessageSquare, Send, Save } from "lucide-react";

// Template schema
const templateSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: "Template name is required" }),
  dltTemplateId: z.string().min(1, { message: "DLT Template ID is required" }),
  provider: z.enum(["msg91", "twilio"]),
  content: z.string().min(10, { message: "Content must be at least 10 characters" }),
  isActive: z.boolean().default(true),
});

type TemplateFormValues = z.infer<typeof templateSchema>;

// Extract variables from content
const extractVariables = (content: string): string[] => {
  const regex = /{([^}]+)}/g;
  const matches = content.match(regex) || [];
  return matches.map(match => match.replace(/{|}/g, ''));
};

// Template interface
interface SmsTemplate {
  id: string;
  name: string;
  dltTemplateId: string;
  provider: "msg91" | "twilio";
  content: string;
  variables: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Mock data for initial templates
const mockTemplates: SmsTemplate[] = [
  {
    id: "1",
    name: "Payment Confirmation",
    dltTemplateId: "1234567890",
    provider: "msg91",
    content: "Dear {name}, your payment of Rs.{amount} for {plan} plan has been confirmed. Thank you for choosing Muscle Garage!",
    variables: ["name", "amount", "plan"],
    isActive: true,
    createdAt: "2023-10-15T10:00:00Z",
    updatedAt: "2023-10-15T10:00:00Z"
  },
  {
    id: "2",
    name: "Membership Expiry",
    dltTemplateId: "9876543210",
    provider: "msg91",
    content: "Hi {name}, your {plan} membership at Muscle Garage will expire on {expiryDate}. Renew now to avoid interruption!",
    variables: ["name", "plan", "expiryDate"],
    isActive: true,
    createdAt: "2023-10-16T11:30:00Z",
    updatedAt: "2023-10-16T11:30:00Z"
  },
  {
    id: "3",
    name: "Class Booking",
    dltTemplateId: "1357924680",
    provider: "twilio",
    content: "Hello {name}, your booking for {className} on {date} at {time} is confirmed. See you at Muscle Garage!",
    variables: ["name", "className", "date", "time"],
    isActive: true,
    createdAt: "2023-10-17T09:15:00Z",
    updatedAt: "2023-10-17T09:15:00Z"
  }
];

const SmsTemplateManager = () => {
  const [templates, setTemplates] = useState<SmsTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [testPhone, setTestPhone] = useState("");
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<SmsTemplate | null>(null);
  const [testValues, setTestValues] = useState<Record<string, string>>({});
  const [previewContent, setPreviewContent] = useState("");

  const form = useForm<TemplateFormValues>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      name: "",
      dltTemplateId: "",
      provider: "msg91",
      content: "",
      isActive: true
    }
  });

  useEffect(() => {
    // In a real app, this would be an API call
    setTimeout(() => {
      setTemplates(mockTemplates);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleCreateTemplate = () => {
    setCurrentTemplate(null);
    form.reset({
      name: "",
      dltTemplateId: "",
      provider: "msg91",
      content: "",
      isActive: true
    });
    setEditDialogOpen(true);
  };

  const handleEditTemplate = (template: SmsTemplate) => {
    setCurrentTemplate(template);
    form.reset({
      id: template.id,
      name: template.name,
      dltTemplateId: template.dltTemplateId,
      provider: template.provider,
      content: template.content,
      isActive: template.isActive
    });
    
    // Initialize test values with variables from the template
    const initialValues: Record<string, string> = {};
    template.variables.forEach(variable => {
      initialValues[variable] = `[${variable}]`;
    });
    setTestValues(initialValues);
    
    // Update preview
    let preview = template.content;
    Object.entries(initialValues).forEach(([key, value]) => {
      preview = preview.replace(new RegExp(`{${key}}`, 'g'), value);
    });
    setPreviewContent(preview);
    
    setEditDialogOpen(true);
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates(templates.filter(template => template.id !== id));
    toast.success("Template deleted successfully");
  };

  const handleSendTest = (template: SmsTemplate) => {
    if (!testPhone) {
      toast.error("Please enter a test phone number");
      return;
    }

    setIsSendingTest(true);
    // In a real app, this would be an API call to send a test SMS
    setTimeout(() => {
      setIsSendingTest(false);
      toast.success(`Test SMS sent to ${testPhone}`);
    }, 1500);
  };

  const handleTestValueChange = (variable: string, value: string) => {
    const updatedValues = { ...testValues, [variable]: value };
    setTestValues(updatedValues);
    
    // Update preview
    let preview = form.getValues("content");
    Object.entries(updatedValues).forEach(([key, value]) => {
      preview = preview.replace(new RegExp(`{${key}}`, 'g'), value);
    });
    setPreviewContent(preview);
  };

  const onSubmit = (data: TemplateFormValues) => {
    const variables = extractVariables(data.content);
    
    const newTemplate: SmsTemplate = {
      id: data.id || String(Date.now()),
      name: data.name,
      dltTemplateId: data.dltTemplateId,
      provider: data.provider,
      content: data.content,
      variables,
      isActive: data.isActive || true,
      createdAt: currentTemplate?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (currentTemplate) {
      // Update existing template
      setTemplates(templates.map(t => t.id === newTemplate.id ? newTemplate : t));
      toast.success("Template updated successfully");
    } else {
      // Create new template
      setTemplates([...templates, newTemplate]);
      toast.success("Template created successfully");
    }

    setEditDialogOpen(false);
  };

  // Watch content to extract variables in real-time
  const watchContent = form.watch("content");
  useEffect(() => {
    if (watchContent) {
      const variables = extractVariables(watchContent);
      
      // Initialize new variables with default test values
      const updatedValues = { ...testValues };
      variables.forEach(variable => {
        if (!updatedValues[variable]) {
          updatedValues[variable] = `[${variable}]`;
        }
      });
      
      setTestValues(updatedValues);
      
      // Update preview
      let preview = watchContent;
      Object.entries(updatedValues).forEach(([key, value]) => {
        preview = preview.replace(new RegExp(`{${key}}`, 'g'), value);
      });
      setPreviewContent(preview);
    }
  }, [watchContent]);

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <CardTitle>SMS Templates</CardTitle>
            <CardDescription>Manage templates for SMS communications</CardDescription>
          </div>
          <Button onClick={handleCreateTemplate}>
            <Plus className="mr-2 h-4 w-4" />
            Create Template
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Loading templates...</p>
            </div>
          </div>
        ) : templates.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No templates found</h3>
            <p className="mt-2 text-sm text-muted-foreground mb-4">
              Create your first SMS template to start sending messages
            </p>
            <Button onClick={handleCreateTemplate}>
              <Plus className="mr-2 h-4 w-4" />
              Create Template
            </Button>
          </div>
        ) : (
          <div className="overflow-hidden rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Template Name</TableHead>
                  <TableHead>DLT ID</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Variables</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {templates.map((template) => (
                  <TableRow key={template.id}>
                    <TableCell className="font-medium">
                      {template.name}
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                        {template.content.substring(0, 50)}...
                      </p>
                    </TableCell>
                    <TableCell>{template.dltTemplateId}</TableCell>
                    <TableCell className="capitalize">{template.provider}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {template.variables.map(variable => (
                          <Badge key={variable} variant="outline" className="text-xs">
                            {`{${variable}}`}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={template.isActive ? "default" : "secondary"}
                        className={template.isActive ? "bg-green-100 text-green-800" : ""}
                      >
                        {template.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditTemplate(template)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteTemplate(template.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Template Edit/Create Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="sm:max-w-[650px]">
            <DialogHeader>
              <DialogTitle>
                {currentTemplate ? "Edit SMS Template" : "Create SMS Template"}
              </DialogTitle>
              <DialogDescription>
                {currentTemplate
                  ? "Update the details of this SMS template"
                  : "Create a new SMS template for automated communications"}
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
                          <Input placeholder="e.g., Payment Confirmation" {...field} />
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
                          <Input placeholder="e.g., 1234567890" {...field} />
                        </FormControl>
                        <FormDescription>
                          Required for SMS delivery in India
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="provider"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SMS Provider</FormLabel>
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
                          <SelectItem value="msg91">MSG91</SelectItem>
                          <SelectItem value="twilio">Twilio</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Template Content</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., Hello {name}, your payment of Rs.{amount} for {plan} is confirmed."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Use {"{name}"}, {"{amount}"}, etc. as variables
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Active Status</FormLabel>
                        <FormDescription>
                          Template will be available for sending messages
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

                {extractVariables(form.getValues("content")).length > 0 && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium">Variables Preview</h3>
                      <p className="text-sm text-muted-foreground">
                        Test how your template will look with actual values
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {extractVariables(form.getValues("content")).map((variable) => (
                        <div key={variable} className="space-y-2">
                          <label className="text-sm font-medium" htmlFor={`var-${variable}`}>
                            {variable}
                          </label>
                          <Input
                            id={`var-${variable}`}
                            value={testValues[variable] || `[${variable}]`}
                            onChange={(e) => handleTestValueChange(variable, e.target.value)}
                            placeholder={`Value for ${variable}`}
                          />
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Message Preview</label>
                      <div className="p-4 border rounded-md bg-muted/30">
                        <p className="text-sm whitespace-pre-wrap">{previewContent}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium" htmlFor="test-phone">
                        Send Test SMS
                      </label>
                      <div className="flex gap-2">
                        <Input
                          id="test-phone"
                          value={testPhone}
                          onChange={(e) => setTestPhone(e.target.value)}
                          placeholder="e.g., +91 9876543210"
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          disabled={isSendingTest}
                          onClick={() => {
                            if (currentTemplate) {
                              handleSendTest(currentTemplate);
                            } else {
                              toast.error("Save the template first before sending a test");
                            }
                          }}
                        >
                          {isSendingTest ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Send className="mr-2 h-4 w-4" />
                          )}
                          Test
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                <DialogFooter>
                  <Button type="submit">
                    <Save className="mr-2 h-4 w-4" />
                    {currentTemplate ? "Update Template" : "Save Template"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default SmsTemplateManager;
