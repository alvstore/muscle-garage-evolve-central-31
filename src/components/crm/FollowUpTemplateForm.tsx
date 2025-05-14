
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FollowUpTemplate, FollowUpType } from '@/types/crm';
import { useToast } from '@/hooks/use-toast';
import { followUpService } from '@/services/followUpService';
import { useAuth } from '@/hooks/use-auth';

interface FollowUpTemplateFormProps {
  template?: FollowUpTemplate;
  onComplete: () => void;
}

const FollowUpTemplateForm: React.FC<FollowUpTemplateFormProps> = ({ template, onComplete }) => {
  const isEditing = !!template;
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<Partial<FollowUpTemplate>>({
    name: '',
    title: '',
    content: '',
    type: 'call' as FollowUpType,
    variables: []
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (template) {
      setFormData({
        ...template,
      });
    }
  }, [template]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.content || !formData.type) {
      toast({
        title: 'Missing fields',
        description: 'Please fill in all required fields.',
        variant: 'destructive'
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const followUpData = {
        ...formData,
        title: formData.title || formData.name,
        variables: formData.variables || [],
        created_by: user?.id
      } as Omit<FollowUpTemplate, 'id' | 'created_at'>;
      
      if (isEditing && template) {
        await followUpService.updateFollowUpTemplate(template.id, followUpData);
        toast({
          title: 'Template updated',
          description: 'Follow-up template has been updated successfully.'
        });
      } else {
        await followUpService.createFollowUpTemplate(followUpData);
        toast({
          title: 'Template created',
          description: 'New follow-up template has been created successfully.'
        });
      }
      
      onComplete();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'There was an error processing your request.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit' : 'Create'} Follow-up Template</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Template Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name || ''}
              onChange={handleInputChange}
              placeholder="E.g., Follow-up Call Template"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => handleSelectChange('type', value)}
            >
              <SelectTrigger id="type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="call">Call</SelectItem>
                <SelectItem value="sms">SMS</SelectItem>
                <SelectItem value="meeting">Meeting</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="title">Title/Subject</Label>
            <Input
              id="title"
              name="title"
              value={formData.title || ''}
              onChange={handleInputChange}
              placeholder="E.g., Following up on our conversation"
            />
            <p className="text-xs text-muted-foreground">
              Optional. If left blank, template name will be used.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              name="content"
              value={formData.content || ''}
              onChange={handleInputChange}
              placeholder="Template content here. Use {variable} for dynamic content."
              rows={8}
              required
            />
            <p className="text-xs text-muted-foreground">
              Use variables like {'{name}'}, {'{date}'}, etc. These will be replaced when the template is used.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onComplete}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : isEditing ? 'Update Template' : 'Save Template'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default FollowUpTemplateForm;
