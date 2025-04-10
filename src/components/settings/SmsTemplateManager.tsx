
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { SmsTemplate, SmsProvider, TriggerEvent } from "@/types/notification";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { usePermissions } from "@/hooks/use-permissions";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const formSchema = z.object({
  name: z.string().min(2, { message: "Template name must be at least 2 characters." }),
  content: z.string().min(10, { message: "Content must be at least 10 characters." }),
  description: z.string().optional(),
  dltTemplateId: z.string().optional(),
  provider: z.enum(["msg91", "twilio"]),
  triggerEvents: z.array(z.string()).transform(events => events as TriggerEvent[]),
  enabled: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

const mockTemplates: SmsTemplate[] = [
  {
    id: "template-1",
    name: "Welcome Message",
    content: "Welcome to Muscle Garage, {{name}}! Your membership is now active.",
    description: "Sent to new members upon registration",
    provider: "msg91",
    triggerEvents: ["member_registration"],
    variables: ["name"],
    enabled: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "template-2",
    name: "Payment Confirmation",
    content: "Thank you for your payment of ₹{{amount}}. Receipt: {{receipt}}",
    description: "Sent after successful payment",
    dltTemplateId: "1234567890",
    provider: "msg91",
    triggerEvents: ["payment_success"],
    variables: ["amount", "receipt"],
    enabled: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "template-3",
    name: "Class Booking Confirmation",
    content: "Your booking for {{class}} on {{date}} at {{time}} is confirmed.",
    description: "Sent after booking a class",
    provider: "twilio",
    triggerEvents: ["class_booking"],
    variables: ["class", "date", "time"],
    enabled: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "template-4",
    name: "Membership Expiry Reminder",
    content: "Your membership expires on {{date}}. Renew now to avoid interruption.",
    description: "Sent before membership expiry",
    provider: "msg91",
    triggerEvents: ["plan_expiry"],
    variables: ["date"],
    enabled: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const availableTriggerEvents: {value: TriggerEvent, label: string}[] = [
  { value: "member_registration", label: "Member Registration" },
  { value: "payment_success", label: "Payment Success" },
  { value: "payment_failure", label: "Payment Failure" },
  { value: "class_booking", label: "Class Booking" },
  { value: "class_cancellation", label: "Class Cancellation" },
  { value: "plan_expiry", label: "Plan Expiry" },
  { value: "birthday", label: "Birthday" },
  { value: "motivation", label: "Motivation" },
];

const SmsTemplateManager: React.FC = () => {
  const [templates, setTemplates] = useState<SmsTemplate[]>(mockTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<SmsTemplate | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const { can } = usePermissions();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      content: "",
      description: "",
      dltTemplateId: "",
      provider: "msg91",
      triggerEvents: [],
      enabled: true,
    },
  });

  useEffect(() => {
    if (selectedTemplate) {
      form.reset({
        name: selectedTemplate.name,
        content: selectedTemplate.content,
        description: selectedTemplate.description || "",
        dltTemplateId: selectedTemplate.dltTemplateId || "",
        provider: selectedTemplate.provider,
        triggerEvents: selectedTemplate.triggerEvents,
        enabled: selectedTemplate.enabled,
      });
    } else {
      form.reset({
        name: "",
        content: "",
        description: "",
        dltTemplateId: "",
        provider: "msg91",
        triggerEvents: [],
        enabled: true,
      });
    }
  }, [selectedTemplate, form]);

  const handleCreateTemplate = () => {
    setSelectedTemplate(null);
    setIsDialogOpen(true);
  };

  const handleEditTemplate = (template: SmsTemplate) => {
    setSelectedTemplate(template);
    setIsDialogOpen(true);
  };

  const handleDeleteTemplate = (templateId: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setTemplates(templates.filter((t) => t.id !== templateId));
      toast.success("Template deleted successfully");
      setIsLoading(false);
    }, 500);
  };

  const onSubmit = (formData: FormValues) => {
    setIsLoading(true);
    
    const variableRegex = /{{([^}]+)}}/g;
    const matches = [...formData.content.matchAll(variableRegex)];
    const variables = matches.map((match) => match[1]);
    
    setTimeout(() => {
      if (selectedTemplate) {
        const updatedTemplates = templates.map((t) =>
          t.id === selectedTemplate.id
            ? {
                ...t,
                ...formData,
                variables,
                updatedAt: new Date().toISOString(),
              }
            : t
        );
        setTemplates(updatedTemplates);
        toast.success("Template updated successfully");
      } else {
        const newTemplate: SmsTemplate = {
          id: `template-${Date.now()}`,
          name: formData.name,
          content: formData.content,
          description: formData.description,
          dltTemplateId: formData.dltTemplateId,
          provider: formData.provider,
          triggerEvents: formData.triggerEvents,
          enabled: formData.enabled,
          variables,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: "admin"
        };
        setTemplates([...templates, newTemplate]);
        toast.success("Template created successfully");
      }
      setIsLoading(false);
      setIsDialogOpen(false);
    }, 1000);
  };

  const filteredTemplates = activeTab === "all" 
    ? templates 
    : activeTab === "active" 
      ? templates.filter(t => t.enabled) 
      : templates.filter(t => !t.enabled);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">SMS Templates</h2>
          <p className="text-muted-foreground">
            Manage SMS templates for automated notifications
          </p>
        </div>
        {can("manage_sms_templates") && (
          <Button onClick={handleCreateTemplate}>
            <Plus className="mr-2 h-4 w-4" /> Create Template
          </Button>
        )}
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Templates</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onEdit={handleEditTemplate}
                onDelete={handleDeleteTemplate}
                canEdit={can("manage_sms_templates")}
              />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="active" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onEdit={handleEditTemplate}
                onDelete={handleDeleteTemplate}
                canEdit={can("manage_sms_templates")}
              />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="inactive" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onEdit={handleEditTemplate}
                onDelete={handleDeleteTemplate}
                canEdit={can("manage_sms_templates")}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {selectedTemplate ? "Edit SMS Template" : "Create SMS Template"}
            </DialogTitle>
            <DialogDescription>
              {selectedTemplate
                ? "Update the details of this SMS template"
                : "Create a new SMS template for automated notifications"}
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="flex-1 pr-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-2">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Template Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Welcome Message" {...field} />
                        </FormControl>
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
                            <SelectItem value="msg91">MSG91</SelectItem>
                            <SelectItem value="twilio">Twilio</SelectItem>
                          </SelectContent>
                        </Select>
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
                        <Input placeholder="Brief description of when this template is used" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message Content</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter message content with variables like {{name}}"
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <p className="text-sm text-muted-foreground mt-1">
                        Use {"{{"}<span>variable</span>{"}}"} syntax for dynamic content (e.g., {"{{"}<span>name</span>{"}}"}, {"{{"}<span>amount</span>{"}}"})
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="dltTemplateId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>DLT Template ID (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="For Indian regulations (MSG91)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="triggerEvents"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="text-base">Trigger Events</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Select when this template should be sent
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {availableTriggerEvents.map((event) => (
                          <FormField
                            key={event.value}
                            control={form.control}
                            name="triggerEvents"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={event.value}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(event.value)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, event.value])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== event.value
                                              )
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {event.label}
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
                
                <FormField
                  control={form.control}
                  name="enabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Enabled</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Activate or deactivate this template
                        </p>
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
              </form>
            </Form>
          </ScrollArea>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              onClick={form.handleSubmit(onSubmit)}
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {selectedTemplate ? "Update Template" : "Create Template"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface TemplateCardProps {
  template: SmsTemplate;
  onEdit: (template: SmsTemplate) => void;
  onDelete: (id: string) => void;
  canEdit: boolean;
}

const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  onEdit,
  onDelete,
  canEdit,
}) => {
  return (
    <Card className={!template.enabled ? "opacity-70" : ""}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{template.name}</CardTitle>
          {template.enabled ? (
            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
              Active
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
              Inactive
            </Badge>
          )}
        </div>
        <CardDescription>{template.description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2">
          <div>
            <h4 className="text-sm font-medium">Content:</h4>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {template.content}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium">Provider:</h4>
            <p className="text-sm text-muted-foreground capitalize">
              {template.provider}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium">Trigger Events:</h4>
            <div className="flex flex-wrap gap-1 mt-1">
              {template.triggerEvents.map((event) => (
                <Badge key={event} variant="secondary" className="text-xs">
                  {event.replace(/_/g, " ")}
                </Badge>
              ))}
            </div>
          </div>
          {template.variables && template.variables.length > 0 && (
            <div>
              <h4 className="text-sm font-medium">Variables:</h4>
              <div className="flex flex-wrap gap-1 mt-1">
                {template.variables.map((variable) => (
                  <Badge key={variable} variant="outline" className="text-xs">
                    {variable}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        {canEdit && (
          <div className="flex justify-between w-full">
            <Button variant="outline" size="sm" onClick={() => onEdit(template)}>
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
              onClick={() => onDelete(template.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default SmsTemplateManager;
