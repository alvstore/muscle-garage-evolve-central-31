
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import EmailTemplateEditor from "./EmailTemplateEditor";
import EmailTemplatePreview from "./EmailTemplatePreview";

const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, "Template name must be at least 3 characters"),
  subject: z.string().min(3, "Subject line must be at least 3 characters"),
  content: z.string().min(10, "Template content must be at least 10 characters"),
});

type EmailTemplateFormProps = {
  isOpen: boolean;
  onClose: () => void;
  template?: any;
};

const EmailTemplateDialog: React.FC<EmailTemplateFormProps> = ({ 
  isOpen, 
  onClose, 
  template 
}) => {
  const [showPreview, setShowPreview] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: template?.id || undefined,
      name: template?.name || "",
      subject: template?.subject || "",
      content: template?.content || "",
    }
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Here we would normally save to the database
      console.log("Form values:", values);
      
      // Mock successful save
      toast.success(`Email template ${template ? 'updated' : 'created'} successfully`);
      onClose();
    } catch (error) {
      console.error("Error saving template:", error);
      toast.error("Failed to save template");
    }
  };
  
  const handleContentChange = (newContent: string) => {
    form.setValue('content', newContent);
  };
  
  const handleShowPreview = () => {
    setShowPreview(true);
  };
  
  const handleClosePreview = () => {
    setShowPreview(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-[900px]">
          <DialogHeader>
            <DialogTitle>{template ? 'Edit' : 'Create'} Email Template</DialogTitle>
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
                        <Input placeholder="e.g., Welcome to {gym_name}!" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Content</FormLabel>
                    <FormControl>
                      <EmailTemplateEditor 
                        content={field.value} 
                        onChange={handleContentChange} 
                        onPreview={handleShowPreview}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit">
                  {template ? 'Update' : 'Create'} Template
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Preview Dialog */}
      {showPreview && (
        <EmailTemplatePreview 
          isOpen={showPreview} 
          onClose={handleClosePreview} 
          template={{
            ...form.getValues(),
            id: template?.id || 'preview'
          }} 
        />
      )}
    </>
  );
};

export default EmailTemplateDialog;
