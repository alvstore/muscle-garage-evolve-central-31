
import React from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { X, Plus, Save } from 'lucide-react';
import { FollowUpTemplate, FollowUpType } from '@/types/crm';
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

interface FollowUpTemplateFormProps {
  template?: FollowUpTemplate;
  onComplete: () => void;
}

// Variables that can be used in templates
const availableVariables = [
  { id: "leadName", label: "Lead Name" },
  { id: "gymName", label: "Gym Name" },
  { id: "staffName", label: "Staff Name" },
  { id: "date", label: "Date" },
  { id: "time", label: "Time" },
  { id: "membershipPlans", label: "Membership Plans" },
  { id: "personalTrainingOptions", label: "Personal Training Options" },
  { id: "gymLocation", label: "Gym Location" },
  { id: "gymPhone", label: "Gym Phone" },
  { id: "gymEmail", label: "Gym Email" },
];

const templateSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  type: z.enum(["email", "sms", "whatsapp", "call", "meeting"]),
  content: z.string().min(10, { message: "Content must be at least 10 characters" }),
  isDefault: z.boolean().default(false),
});

const FollowUpTemplateForm: React.FC<FollowUpTemplateFormProps> = ({ template, onComplete }) => {
  const [selectedVariables, setSelectedVariables] = React.useState<string[]>(
    template?.variables || []
  );
  
  const form = useForm<z.infer<typeof templateSchema>>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      title: template?.title || "",
      type: template?.type || "email",
      content: template?.content || "",
      isDefault: template?.isDefault || false,
    },
  });
  
  const addVariable = (variableId: string) => {
    if (!selectedVariables.includes(variableId)) {
      setSelectedVariables([...selectedVariables, variableId]);
      
      // Insert the variable placeholder at cursor position in content
      const contentField = form.getValues("content");
      const cursorPosition = (document.querySelector("textarea[name='content']") as HTMLTextAreaElement)?.selectionStart || contentField.length;
      const variablePlaceholder = `{{${variableId}}}`;
      
      const newContent = 
        contentField.substring(0, cursorPosition) + 
        variablePlaceholder + 
        contentField.substring(cursorPosition);
      
      form.setValue("content", newContent);
    }
  };
  
  const removeVariable = (variableId: string) => {
    setSelectedVariables(selectedVariables.filter(v => v !== variableId));
    
    // Remove all occurrences of the variable from content
    const contentField = form.getValues("content");
    const variablePlaceholder = `{{${variableId}}}`;
    const newContent = contentField.replace(new RegExp(variablePlaceholder, "g"), "");
    
    form.setValue("content", newContent);
  };
  
  const onSubmit = (values: z.infer<typeof templateSchema>) => {
    try {
      const newTemplate: FollowUpTemplate = {
        id: template?.id || uuidv4(),
        title: values.title,
        type: values.type as FollowUpType,
        content: values.content,
        variables: selectedVariables,
        createdBy: template?.createdBy || "current-user-id",
        createdAt: template?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isDefault: values.isDefault,
      };
      
      // In a real app, this would be an API call
      console.log("Template data:", newTemplate);
      toast.success(`Template ${template ? "updated" : "created"} successfully`);
      onComplete();
    } catch (error) {
      console.error("Error saving template:", error);
      toast.error("Error saving template");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{template ? "Edit" : "Create"} Follow-up Template</CardTitle>
        <CardDescription>
          Create reusable templates for your lead follow-ups
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Template Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Initial Contact" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Follow-up Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="sms">SMS</SelectItem>
                        <SelectItem value="whatsapp">WhatsApp</SelectItem>
                        <SelectItem value="call">Call Script</SelectItem>
                        <SelectItem value="meeting">Meeting Agenda</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Available Variables</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {availableVariables.map(variable => (
                  <Badge 
                    key={variable.id}
                    variant="outline" 
                    className="cursor-pointer hover:bg-primary/10"
                    onClick={() => addVariable(variable.id)}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    {variable.label}
                  </Badge>
                ))}
              </div>
            </div>
            
            {selectedVariables.length > 0 && (
              <div>
                <label className="text-sm font-medium">Selected Variables</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedVariables.map(variableId => {
                    const variable = availableVariables.find(v => v.id === variableId);
                    return (
                      <Badge 
                        key={variableId}
                        variant="secondary" 
                        className="cursor-pointer"
                      >
                        {variable?.label || variableId}
                        <X 
                          className="h-3 w-3 ml-1 hover:text-destructive" 
                          onClick={() => removeVariable(variableId)}
                        />
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}
            
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Template Content</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter your template content here. Use variables from above by clicking on them."
                      className="min-h-[200px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="isDefault"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Set as Default Template</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Make this the default template for {form.watch("type")} follow-ups
                    </div>
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
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" type="button" onClick={onComplete}>
                Cancel
              </Button>
              <Button type="submit">
                <Save className="h-4 w-4 mr-2" />
                {template ? "Update" : "Save"} Template
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default FollowUpTemplateForm;
