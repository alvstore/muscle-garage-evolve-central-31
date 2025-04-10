import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';
import { MoreVertical, Pencil, Trash2, Copy, Send, Plus, RefreshCw } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { smsTemplateService } from "@/services/integrations/smsTemplateService";
import { SmsTemplate, SmsProvider, TriggerEvent, Permission } from '@/types/notification';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { useAuth } from '@/hooks/use-auth';

const smsTemplateSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters." }),
  content: z.string().min(10, { message: "Content must be at least 10 characters." }),
  description: z.string().optional(),
  dltTemplateId: z.string().optional(),
  provider: z.enum(["msg91", "twilio"]),
  triggerEvents: z.array(z.string()).nonempty({ message: "Select at least one trigger event." }),
  variables: z.array(z.string()).optional(),
  enabled: z.boolean().default(true),
});

const SmsTemplateManager = () => {
  const [templates, setTemplates] = useState<SmsTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<SmsTemplate | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [testPhoneNumber, setTestPhoneNumber] = useState('');
  const [testData, setTestData] = useState<Record<string, string>>({});
  const [templateVariables, setTemplateVariables] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const form = useForm<z.infer<typeof smsTemplateSchema>>({
    resolver: zodResolver(smsTemplateSchema),
    defaultValues: {
      name: "",
      content: "",
      description: "",
      dltTemplateId: "",
      provider: "msg91",
      triggerEvents: [],
      variables: [],
      enabled: true,
    },
  });
  
  const columns = [
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'provider',
      header: 'Provider',
    },
    {
      accessorKey: 'triggerEvents',
      header: 'Trigger Events',
      cell: ({ row }: { row: any }) => (
        <div className="flex flex-wrap gap-1">
          {(row.triggerEvents || []).map((event: string) => (
            <Badge key={event} variant="secondary" className="capitalize">
              {event.replace(/_/g, " ")}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      accessorKey: 'enabled',
      header: 'Status',
      cell: ({ row }) => (
        <Switch 
          checked={row.enabled} 
          onCheckedChange={(checked) => handleToggleStatus(row.id, checked)}
        />
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleEdit(row)}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDuplicate(row)}>
              <Copy className="h-4 w-4 mr-2" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleOpenTestModal(row)}>
              <Send className="h-4 w-4 mr-2" />
              Send Test SMS
            </DropdownMenuItem>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem className="text-destructive focus:text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the template.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDelete(row.id)}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
  
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await smsTemplateService.getTemplates();
      setTemplates(data);
    } catch (error) {
      console.error("Failed to fetch templates:", error);
      toast({
        title: "Error",
        description: "Failed to fetch SMS templates. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  const handleOpenModal = () => {
    setIsEditMode(false);
    setSelectedTemplate(null);
    form.reset();
    setOpen(true);
  };
  
  const handleCloseModal = () => {
    setOpen(false);
    setIsTestModalOpen(false);
  };
  
  const handleEdit = (template: SmsTemplate) => {
    setIsEditMode(true);
    setSelectedTemplate(template);
    
    form.reset({
      name: template.name,
      content: template.content,
      description: template.description || "",
      dltTemplateId: template.dltTemplateId || "",
      provider: template.provider,
      triggerEvents: template.triggerEvents,
      variables: template.variables || [],
      enabled: template.enabled,
    });
    
    setOpen(true);
  };
  
  const handleDuplicate = (template: SmsTemplate) => {
    const newTemplate = { ...template, id: '', name: `${template.name} (Copy)` };
    createTemplate(newTemplate);
  };
  
  const handleDelete = async (id: string) => {
    try {
      await smsTemplateService.deleteTemplate(id);
      setTemplates(templates.filter((template) => template.id !== id));
      toast({
        title: "Success",
        description: "Template deleted successfully.",
      });
    } catch (error) {
      console.error("Failed to delete template:", error);
      toast({
        title: "Error",
        description: "Failed to delete template. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleToggleStatus = async (id: string, enabled: boolean) => {
    try {
      await smsTemplateService.updateTemplate(id, { enabled });
      setTemplates(
        templates.map((template) =>
          template.id === id ? { ...template, enabled } : template
        )
      );
      toast({
        title: "Success",
        description: `Template ${enabled ? 'enabled' : 'disabled'} successfully.`,
      });
    } catch (error) {
      console.error("Failed to update template status:", error);
      toast({
        title: "Error",
        description: "Failed to update template status. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const createTemplate = async (template: Omit<SmsTemplate, "id" | "createdAt" | "updatedAt">) => {
    try {
      const newTemplate = await smsTemplateService.createTemplate({
        name: template.name,
        content: template.content,
        description: template.description,
        dltTemplateId: template.dltTemplateId,
        provider: template.provider,
        triggerEvents: template.triggerEvents,
        variables: template.variables,
        enabled: template.enabled,
      });
      
      if (newTemplate) {
        setTemplates([...templates, newTemplate]);
        toast({
          title: "Success",
          description: "Template created successfully.",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to create template.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to create template:", error);
      toast({
        title: "Error",
        description: "Failed to create template. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const updateTemplate = async (id: string, templateData: Partial<SmsTemplate>) => {
    try {
      const updatedTemplate = await smsTemplateService.updateTemplate(id, templateData);
      if (updatedTemplate) {
        setTemplates(
          templates.map((template) =>
            template.id === id ? updatedTemplate : template
          )
        );
        toast({
          title: "Success",
          description: "Template updated successfully.",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to update template.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to update template:", error);
      toast({
        title: "Error",
        description: "Failed to update template. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const onSubmit = async (values: z.infer<typeof smsTemplateSchema>) => {
    setIsSubmitting(true);
    try {
      const templateData = {
        ...values,
        variables: smsTemplateService.extractVariables(values.content),
        triggerEvents: values.triggerEvents as TriggerEvent[],
      };
      
      if (isEditMode && selectedTemplate) {
        await updateTemplate(selectedTemplate.id, templateData);
      } else {
        await createTemplate(templateData as Omit<SmsTemplate, "id" | "createdAt" | "updatedAt">);
      }
      
      fetchData(); // Refresh data
      handleCloseModal();
    } catch (error) {
      console.error("Failed to save template:", error);
      toast({
        title: "Error",
        description: "Failed to save template. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleOpenTestModal = (template: SmsTemplate) => {
    setSelectedTemplate(template);
    setTemplateVariables(smsTemplateService.extractVariables(template.content));
    
    const initialTestData: Record<string, string> = {};
    smsTemplateService.extractVariables(template.content).forEach(variable => {
      initialTestData[variable] = '';
    });
    setTestData(initialTestData);
    
    setIsTestModalOpen(true);
  };
  
  const handleTestDataChange = (variable: string, value: string) => {
    setTestData(prevData => ({
      ...prevData,
      [variable]: value,
    }));
  };
  
  const handleSendTest = async () => {
    if (!selectedTemplate) return;
    
    try {
      await smsTemplateService.sendTestSms(selectedTemplate.id, testPhoneNumber, testData);
      handleCloseModal();
    } catch (error) {
      console.error("Failed to send test SMS:", error);
      toast({
        title: "Error",
        description: "Failed to send test SMS. Please check your phone number and test data.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div>
      <Card>
        <CardHeader>
          <div className="flex justify-between">
            <div>
              <CardTitle>SMS Templates</CardTitle>
              <CardDescription>Manage SMS templates for automated notifications.</CardDescription>
            </div>
            <Button onClick={fetchData} variant="outline" disabled={loading}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Button onClick={handleOpenModal}>
              <Plus className="h-4 w-4 mr-2" />
              Create Template
            </Button>
          </div>
          <DataTable columns={columns} data={templates} loading={loading} />
        </CardContent>
      </Card>
      
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>{isEditMode ? 'Edit Template' : 'Create Template'}</AlertDialogTitle>
            <AlertDialogDescription>
              {isEditMode ? 'Update the template details.' : 'Create a new SMS template.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Template Name" {...field} />
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
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Template Content" className="min-h-[100px]" {...field} />
                    </FormControl>
                    <FormDescription>
                      Use {`{variable}`} to insert dynamic content.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Template Description" {...field} />
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
                      <Input placeholder="DLT Template ID" {...field} />
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
                    <FormLabel>Provider</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                name="triggerEvents"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trigger Events</FormLabel>
                    <Select
                      multiple
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select trigger events" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="member_registration">Member Registration</SelectItem>
                        <SelectItem value="payment_success">Payment Success</SelectItem>
                        <SelectItem value="payment_failure">Payment Failure</SelectItem>
                        <SelectItem value="class_booking">Class Booking</SelectItem>
                        <SelectItem value="class_cancellation">Class Cancellation</SelectItem>
                        <SelectItem value="plan_expiry">Plan Expiry</SelectItem>
                        <SelectItem value="birthday">Birthday</SelectItem>
                        <SelectItem value="motivation">Motivation</SelectItem>
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
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Enabled</FormLabel>
                      <FormDescription>
                        Enable or disable this template.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <AlertDialogFooter>
                <AlertDialogCancel onClick={handleCloseModal}>Cancel</AlertDialogCancel>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <span className="h-4 w-4 rounded-full border-2 border-current border-r-transparent animate-spin mr-2"></span>
                      Saving...
                    </span>
                  ) : (
                    isEditMode ? 'Update' : 'Create'
                  )}
                </Button>
              </AlertDialogFooter>
            </form>
          </Form>
        </AlertDialogContent>
      </AlertDialog>
      
      <AlertDialog open={isTestModalOpen} onOpenChange={setIsTestModalOpen}>
        <AlertDialogContent className="max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>Send Test SMS</AlertDialogTitle>
            <AlertDialogDescription>
              Enter a phone number and test data to send a test SMS.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone Number
              </Label>
              <Input
                type="tel"
                id="phone"
                value={testPhoneNumber}
                onChange={(e) => setTestPhoneNumber(e.target.value)}
                className="col-span-3"
              />
            </div>
            <Separator />
            {templateVariables.map((variable) => (
              <div key={variable} className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor={variable} className="text-right">
                  {variable}
                </Label>
                <Input
                  type="text"
                  id={variable}
                  value={testData[variable] || ''}
                  onChange={(e) => handleTestDataChange(variable, e.target.value)}
                  className="col-span-3"
                />
              </div>
            ))}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCloseModal}>Cancel</AlertDialogCancel>
            <Button variant="default" size="sm" onClick={handleSendTest}>
              Send Test SMS
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SmsTemplateManager;
