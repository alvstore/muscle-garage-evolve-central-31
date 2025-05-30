
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
// Update the import path for any CRM-related types
import { FollowUpTemplate } from '@/types/crm/crm';

interface FollowUpTemplateFormProps {
  template?: FollowUpTemplate;
  onSave: (template: FollowUpTemplate) => Promise<void>;
  onCancel: () => void;
}

export default function FollowUpTemplateForm({ template, onSave, onCancel }: FollowUpTemplateFormProps) {
  const [name, setName] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [subject, setSubject] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (template) {
      setName(template.name || '');
      setContent(template.content || '');
      setSubject(template.subject || '');
    }
  }, [template]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !content.trim()) {
      toast.error('Please complete all required fields');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const updatedTemplate: FollowUpTemplate = {
        id: template?.id || '',
        name,
        content,
        subject
      };
      
      await onSave(updatedTemplate);
      toast.success(`Template ${template ? 'updated' : 'created'} successfully`);
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error(`Failed to ${template ? 'update' : 'create'} template`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>{template ? 'Edit Template' : 'Create New Template'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Template Name</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Enter template name" 
              required 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="subject">Email Subject</Label>
            <Input 
              id="subject" 
              value={subject} 
              onChange={(e) => setSubject(e.target.value)} 
              placeholder="Enter email subject" 
              required 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Template Content</Label>
            <Textarea 
              id="content" 
              value={content} 
              onChange={(e) => setContent(e.target.value)} 
              placeholder="Enter template content" 
              rows={8} 
              required 
            />
            <p className="text-xs text-muted-foreground">
              Available variables: {'{name}'}, {'{date}'}, {'{company}'}, {'{offer}'}
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : template ? 'Update Template' : 'Create Template'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
