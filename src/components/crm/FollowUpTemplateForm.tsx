
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from '@/hooks/use-toast';
import { FollowUpTemplate } from '@/types/crm';

interface FollowUpTemplateFormProps {
  template?: FollowUpTemplate | null;
  onSave: (template: FollowUpTemplate) => void;
  onCancel: () => void;
}

export const FollowUpTemplateForm: React.FC<FollowUpTemplateFormProps> = ({
  template,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState<Partial<FollowUpTemplate>>({
    id: '',
    title: '',
    name: '',
    content: '',
    type: 'email',
    variables: [],
    isDefault: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });
  
  const [variableInput, setVariableInput] = useState('');
  
  useEffect(() => {
    if (template) {
      setFormData({
        ...template
      });
    }
  }, [template]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleTypeChange = (value: string) => {
    setFormData(prev => ({ ...prev, type: value as 'email' | 'sms' | 'whatsapp' | 'call' | 'meeting' }));
  };
  
  const handleDefaultChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, isDefault: checked }));
  };
  
  const addVariable = () => {
    if (!variableInput.trim()) return;
    
    const variable = variableInput.trim();
    if (!formData.variables?.includes(variable)) {
      setFormData(prev => ({
        ...prev,
        variables: [...(prev.variables || []), variable]
      }));
    }
    
    setVariableInput('');
  };
  
  const removeVariable = (variable: string) => {
    setFormData(prev => ({
      ...prev,
      variables: prev.variables?.filter(v => v !== variable) || []
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content || !formData.type) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    // Ensure name is set from title if not provided
    const finalTemplate: FollowUpTemplate = {
      id: formData.id || crypto.randomUUID(),
      name: formData.name || formData.title,
      title: formData.title!,
      content: formData.content!,
      type: formData.type!,
      variables: formData.variables || [],
      isDefault: formData.isDefault || false,
      created_at: formData.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    onSave(finalTemplate);
    toast({
      title: "Success",
      description: "Template saved successfully",
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{template ? 'Edit Template' : 'Create New Template'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Template Name</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Welcome Email"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">Template Type</Label>
            <Select
              value={formData.type}
              onValueChange={handleTypeChange}
            >
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
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              rows={10}
              placeholder="Template content. Use {{variable}} syntax for variables."
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label>Variables</Label>
            <div className="flex space-x-2">
              <Input
                value={variableInput}
                onChange={(e) => setVariableInput(e.target.value)}
                placeholder="e.g., name"
              />
              <Button type="button" onClick={addVariable} variant="outline">Add</Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.variables?.map(variable => (
                <div key={variable} className="bg-secondary text-secondary-foreground rounded px-3 py-1 text-sm flex items-center">
                  {variable}
                  <button
                    type="button"
                    onClick={() => removeVariable(variable)}
                    className="ml-2 text-secondary-foreground/70 hover:text-secondary-foreground"
                  >
                    &times;
                  </button>
                </div>
              ))}
              {formData.variables?.length === 0 && (
                <p className="text-sm text-muted-foreground">No variables added yet.</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              checked={formData.isDefault}
              onCheckedChange={handleDefaultChange}
            />
            <Label htmlFor="isDefault">Make this a default template</Label>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              Save Template
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default FollowUpTemplateForm;
