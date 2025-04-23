
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, "Template name must be at least 3 characters"),
  content: z.string().max(160, "SMS content must not exceed 160 characters"),
  isDltRequired: z.boolean().default(false),
  dltTemplateId: z.string().optional(),
  dltCategory: z.enum(["TRANSACTIONAL", "PROMOTIONAL"]).optional(),
  senderId: z.string().optional(),
});

type SmsTemplateFormProps = {
  isOpen: boolean;
  onClose: () => void;
  template?: any;
};

const SmsTemplateDialog: React.FC<SmsTemplateFormProps> = ({ 
  isOpen, 
  onClose, 
  template 
}) => {
  const [characterCount, setCharacterCount] = useState(0);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: template?.id || undefined,
      name: template?.name || "",
      content: template?.content || "",
      isDltRequired: template?.isDltRequired || false,
      dltTemplateId: template?.dltTemplateId || "",
      dltCategory: template?.dltCategory || "TRANSACTIONAL",
      senderId: template?.senderId || "",
    }
  });

  const isDltRequired = form.watch("isDltRequired");
  const content = form.watch("content");
  
  useEffect(() => {
    setCharacterCount(content?.length || 0);
  }, [content]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Here we would normally save to the database
      console.log("Form values:", values);
      
      // Validate if DLT is required and fields are filled
      if (values.isDltRequired && !values.dltTemplateId) {
        toast.error("DLT Template ID is required when DLT compliance is enabled");
        return;
      }
      
      // Mock successful save
      toast.success(`SMS template ${template ? 'updated' : 'created'} successfully`);
      onClose();
    } catch (error) {
      console.error("Error saving template:", error);
      toast.error("Failed to save template");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>{template ? 'Edit SMS Template' : 'Create SMS Template'}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Template Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Membership Renewal Reminder" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex items-center space-x-2 my-4">
              <FormField
                control={form.control}
                name="isDltRequired"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-2 space-y-0">
                    <FormControl>
                      <Switch 
                        checked={field.value} 
                        onCheckedChange={field.onChange} 
                      />
                    </FormControl>
                    <Label htmlFor="dlt-mode">Enable DLT Compliance (India)</Label>
                  </FormItem>
                )}
              />
            </div>
            
            {isDltRequired && (
              <>
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
                        Enter the DLT registered template ID
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="dltCategory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>DLT Category</FormLabel>
                      <Select 
                        defaultValue={field.value} 
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="TRANSACTIONAL">Transactional</SelectItem>
                          <SelectItem value="PROMOTIONAL">Promotional</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Category of the DLT template
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="senderId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sender ID</FormLabel>
                      <FormControl>
                        <Input placeholder="GYMAPP" maxLength={6} {...field} />
                      </FormControl>
                      <FormDescription>
                        6-character alphanumeric sender ID (e.g., GYMAPP)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SMS Content</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Hi {member_name}, your membership at {gym_name} will expire on {expiry_date}. Please renew to continue enjoying our facilities." 
                      rows={4}
                      maxLength={160}
                      {...field} 
                    />
                  </FormControl>
                  <div className={`text-xs ${characterCount > 160 ? 'text-red-500' : 'text-muted-foreground'}`}>
                    {characterCount}/160 characters
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                Save Template
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SmsTemplateDialog;
