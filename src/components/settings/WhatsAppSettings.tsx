
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Loader2, EyeOff, Eye, Plus, Trash2, MessageSquare } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

// Define the form schema with Zod
const whatsappSchema = z.object({
  apiToken: z.string().min(1, { message: "API Token is required" }),
  phoneNumberId: z.string().min(1, { message: "Phone Number ID is required" }),
  businessAccountId: z.string().min(1, { message: "Business Account ID is required" }),
  notifications: z.object({
    sendWelcomeMessages: z.boolean().default(true),
    sendClassReminders: z.boolean().default(true),
    sendRenewalReminders: z.boolean().default(true),
    sendBirthdayGreetings: z.boolean().default(true),
  }),
});

type WhatsAppFormValues = z.infer<typeof whatsappSchema>;

// Template type definition
interface Template {
  id: string;
  name: string;
  content: string;
  language: string;
  category: string;
}

const WhatsAppSettings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showSecrets, setShowSecrets] = useState(false);
  const [templates, setTemplates] = useState<Template[]>([
    {
      id: "1",
      name: "welcome_message",
      content: "Welcome to Muscle Garage, {{1}}! We're excited to have you join our fitness community.",
      language: "en",
      category: "MARKETING",
    },
    {
      id: "2",
      name: "class_reminder",
      content: "Reminder: Your {{1}} class is scheduled for {{2}} at {{3}}.",
      language: "en",
      category: "UTILITY",
    },
  ]);
  const [isAddingTemplate, setIsAddingTemplate] = useState(false);
  const [newTemplate, setNewTemplate] = useState<Partial<Template>>({
    name: "",
    content: "",
    language: "en",
    category: "UTILITY",
  });

  // Default values for the form
  const defaultValues: Partial<WhatsAppFormValues> = {
    apiToken: "",
    phoneNumberId: "",
    businessAccountId: "",
    notifications: {
      sendWelcomeMessages: true,
      sendClassReminders: true,
      sendRenewalReminders: true,
      sendBirthdayGreetings: true,
    },
  };

  const form = useForm<WhatsAppFormValues>({
    resolver: zodResolver(whatsappSchema),
    defaultValues,
  });

  async function onSubmit(data: WhatsAppFormValues) {
    try {
      setIsLoading(true);
      // In a real implementation, this would be an API call to save settings
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      console.log("WhatsApp settings saved:", data);
      toast.success("WhatsApp settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const handleAddTemplate = () => {
    if (!newTemplate.name || !newTemplate.content) {
      toast.error("Template name and content are required");
      return;
    }

    const template: Template = {
      id: Date.now().toString(),
      name: newTemplate.name,
      content: newTemplate.content,
      language: newTemplate.language || "en",
      category: newTemplate.category || "UTILITY",
    };

    setTemplates([...templates, template]);
    setNewTemplate({ name: "", content: "", language: "en", category: "UTILITY" });
    setIsAddingTemplate(false);
    toast.success("Template added successfully");
  };

  const handleRemoveTemplate = (id: string) => {
    setTemplates(templates.filter(template => template.id !== id));
    toast.success("Template removed successfully");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>WhatsApp Settings</CardTitle>
        <CardDescription>
          Configure WhatsApp Business API integration for communications
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">WhatsApp Cloud API Credentials</h3>
              <p className="text-sm text-muted-foreground">
                Enter your WhatsApp Business API credentials to enable WhatsApp messaging.
              </p>
              
              <div className="grid grid-cols-1 gap-6">
                <FormField
                  control={form.control}
                  name="apiToken"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>WhatsApp Cloud API Token</FormLabel>
                      <div className="flex items-center">
                        <FormControl>
                          <Input 
                            placeholder="Enter API Token" 
                            type={showSecrets ? "text" : "password"} 
                            {...field} 
                          />
                        </FormControl>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          type="button"
                          onClick={() => setShowSecrets(!showSecrets)}
                          className="ml-2"
                        >
                          {showSecrets ? <EyeOff size={16} /> : <Eye size={16} />}
                        </Button>
                      </div>
                      <FormDescription>
                        From your Meta for Developers dashboard
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phoneNumberId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Phone Number ID" {...field} />
                      </FormControl>
                      <FormDescription>
                        The ID of the phone number in the WhatsApp Business API
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="businessAccountId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Account ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Business Account ID" {...field} />
                      </FormControl>
                      <FormDescription>
                        Your WhatsApp Business Account ID
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Message Templates</h3>
                <Dialog open={isAddingTemplate} onOpenChange={setIsAddingTemplate}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Template
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Message Template</DialogTitle>
                      <DialogDescription>
                        Create a new pre-approved WhatsApp message template
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <FormLabel htmlFor="name">Template Name</FormLabel>
                        <Input
                          id="name"
                          placeholder="e.g., appointment_reminder"
                          value={newTemplate.name}
                          onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                        />
                        <FormDescription>
                          Use snake_case without spaces
                        </FormDescription>
                      </div>
                      <div className="grid gap-2">
                        <FormLabel htmlFor="content">Template Content</FormLabel>
                        <Textarea
                          id="content"
                          placeholder="Hello {{1}}, your membership expires on {{2}}."
                          rows={4}
                          value={newTemplate.content}
                          onChange={(e) => setNewTemplate({ ...newTemplate, content: e.target.value })}
                        />
                        <FormDescription>
                          Use {{1}}, {{2}}, etc. for variables
                        </FormDescription>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <FormLabel htmlFor="language">Language</FormLabel>
                          <Input
                            id="language"
                            placeholder="en"
                            value={newTemplate.language}
                            onChange={(e) => setNewTemplate({ ...newTemplate, language: e.target.value })}
                          />
                        </div>
                        <div className="grid gap-2">
                          <FormLabel htmlFor="category">Category</FormLabel>
                          <Input
                            id="category"
                            placeholder="UTILITY"
                            value={newTemplate.category}
                            onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddingTemplate(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddTemplate}>
                        Add Template
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Content</TableHead>
                      <TableHead>Language</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {templates.map((template) => (
                      <TableRow key={template.id}>
                        <TableCell className="font-medium">{template.name}</TableCell>
                        <TableCell className="max-w-[300px] truncate">{template.content}</TableCell>
                        <TableCell>{template.language}</TableCell>
                        <TableCell>{template.category}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveTemplate(template.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {templates.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4">
                          <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <MessageSquare className="h-8 w-8" />
                            <p>No templates found</p>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setIsAddingTemplate(true)}
                            >
                              Add your first template
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Notification Settings</h3>
              <p className="text-sm text-muted-foreground">
                Configure which notifications should be sent via WhatsApp
              </p>
              
              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="notifications.sendWelcomeMessages"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Welcome Messages</FormLabel>
                        <FormDescription>
                          Send a welcome message when new members join
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
                  name="notifications.sendClassReminders"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Class Reminders</FormLabel>
                        <FormDescription>
                          Send reminders for upcoming classes
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
                  name="notifications.sendRenewalReminders"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Renewal Reminders</FormLabel>
                        <FormDescription>
                          Send reminders for membership renewals
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
                  name="notifications.sendBirthdayGreetings"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Birthday Greetings</FormLabel>
                        <FormDescription>
                          Send greetings on members' birthdays
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
            </div>
            
            <div className="flex justify-end gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => form.reset(defaultValues)}
              >
                Reset
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default WhatsAppSettings;
