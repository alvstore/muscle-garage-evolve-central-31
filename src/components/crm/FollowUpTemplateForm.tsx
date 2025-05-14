
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FollowUpTemplate, FollowUpType } from '@/types/crm';
import { toast } from "sonner";

interface FollowUpTemplateFormProps {
  template?: FollowUpTemplate | null;
  onSave: (template: FollowUpTemplate) => void;
  onCancel: () => void;
}

const VARIABLE_OPTIONS = [
  { value: 'name', label: 'Lead Name' },
  { value: 'email', label: 'Lead Email' },
  { value: 'phone', label: 'Lead Phone' },
  { value: 'date', label: 'Current Date' },
  { value: 'time', label: 'Current Time' },
  { value: 'company', label: 'Company Name' },
];

const FollowUpTemplateForm: React.FC<FollowUpTemplateFormProps> = ({ template, onSave, onCancel }) => {
  const [title, setTitle] = useState(template?.title || '');
  const [content, setContent] = useState(template?.content || '');
  const [type, setType] = useState<FollowUpType>(template?.type || 'email');
  const [variables, setVariables] = useState<string[]>(template?.variables || []);
  const [isDefault, setIsDefault] = useState(template?.isDefault || false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = !!template;

  const handleVariableInsert = (variable: string) => {
    const variableText = `{{${variable}}}`;
    setContent(prev => prev + variableText);
    
    // Add to variables list if not already present
    if (!variables.includes(variable)) {
      setVariables([...variables, variable]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!title.trim()) {
      toast.error("Template title is required");
      setIsSubmitting(false);
      return;
    }

    if (!content.trim()) {
      toast.error("Template content is required");
      setIsSubmitting(false);
      return;
    }

    try {
      const updatedTemplate: FollowUpTemplate = {
        id: template?.id || Math.random().toString(36).substr(2, 9),
        title,
        name: title, // Set name to title to fix property missing issue
        content,
        type,
        variables,
        isDefault,
        created_at: template?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      onSave(updatedTemplate);
      toast.success(`Template ${isEditMode ? 'updated' : 'created'} successfully`);
    } catch (error) {
      toast.error(`Failed to ${isEditMode ? 'update' : 'create'} template`);
      console.error('Error saving template:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{isEditMode ? 'Edit Template' : 'Create Template'}</CardTitle>
        <CardDescription>
          {isEditMode 
            ? 'Update your follow-up template details' 
            : 'Create a new follow-up template for your leads'}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Template Name</Label>
            <Input 
              id="title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="Welcome Email"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">Template Type</Label>
            <Select value={type} onValueChange={(value) => setType(value as FollowUpType)}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="sms">SMS</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                <SelectItem value="call">Call Script</SelectItem>
                <SelectItem value="meeting">Meeting Agenda</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Template Content</Label>
            <Textarea 
              id="content" 
              value={content} 
              onChange={(e) => setContent(e.target.value)} 
              placeholder={type === 'email' ? 'Dear {{name}},' : 'Hi {{name}}, we wanted to follow up...'}
              className="min-h-[150px]"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label>Insert Variable</Label>
            <div className="flex flex-wrap gap-2">
              {VARIABLE_OPTIONS.map((variable) => (
                <Button 
                  key={variable.value} 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleVariableInsert(variable.value)}
                >
                  {variable.label}
                </Button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Click a variable to insert it at the current cursor position
            </p>
          </div>
          
          {/* Removed isDefault toggle for simplicity */}
          
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : isEditMode ? 'Update Template' : 'Create Template'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default FollowUpTemplateForm;
