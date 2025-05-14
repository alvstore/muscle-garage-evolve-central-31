
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';
import { Lead, FollowUpTemplate } from '@/types/crm';

// Mock Templates
const mockTemplates: FollowUpTemplate[] = [
  {
    id: '1',
    name: 'Welcome Email',
    title: 'Welcome Email',
    type: 'email',
    content: 'Hello {{name}},\n\nWelcome to our gym! We are excited to have you join our fitness community.',
    variables: ['name'],
    isDefault: true,
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Follow-up Email',
    title: 'Follow-up Email',
    type: 'email',
    content: 'Hello {{name}},\n\nJust checking in to see how your fitness journey is going. Do you have any questions?',
    variables: ['name'],
    isDefault: false,
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Reminder SMS',
    title: 'Reminder SMS',
    type: 'sms',
    content: 'Hi {{name}}, this is a reminder about your upcoming appointment at {{time}} tomorrow.',
    variables: ['name', 'time'],
    isDefault: false,
    created_at: new Date().toISOString()
  }
];

interface LeadFollowUpFormProps {
  lead: Lead | null;
  onSave?: (followUpData: any) => Promise<void>;
  onClose: () => void;
}

const LeadFollowUpForm: React.FC<LeadFollowUpFormProps> = ({ lead, onSave, onClose }) => {
  const [followUpData, setFollowUpData] = useState({
    type: 'email' as 'email' | 'sms' | 'whatsapp' | 'call' | 'meeting',
    scheduledDate: new Date(),
    subject: '',
    content: '',
    templateId: ''
  });
  const [templates, setTemplates] = useState<FollowUpTemplate[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // In a real app, you'd fetch templates from your API here
    setTemplates(mockTemplates);
  }, []);

  const handleTemplateChange = (templateId: string) => {
    const selectedTemplate = templates.find(t => t.id === templateId);
    if (selectedTemplate) {
      // Replace variables in the content
      let processedContent = selectedTemplate.content;
      if (lead) {
        processedContent = processedContent.replace('{{name}}', `${lead.first_name} ${lead.last_name}`);
        processedContent = processedContent.replace('{{time}}', '9:00 AM'); // Example time
      }
      
      setFollowUpData({
        ...followUpData,
        templateId,
        type: selectedTemplate.type,
        subject: selectedTemplate.title,
        content: processedContent
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lead) return;
    
    try {
      // Preparation for submission
      const dataToSubmit = {
        ...followUpData,
        leadId: lead.id,
        scheduledDate: format(followUpData.scheduledDate, "yyyy-MM-dd'T'HH:mm:ss"),
        createdAt: new Date().toISOString()
      };
      
      // Submit data
      if (onSave) {
        await onSave(dataToSubmit);
      }
      
      toast({
        title: "Success",
        description: "Follow-up scheduled successfully."
      });
      
      onClose();
    } catch (error) {
      console.error('Error scheduling follow-up:', error);
      toast({
        title: "Error",
        description: "Failed to schedule follow-up.",
        variant: "destructive"
      });
    }
  };

  if (!lead) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Schedule Follow-Up</CardTitle>
        <CardDescription>
          Schedule a follow-up for {lead.first_name} {lead.last_name}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select 
                value={followUpData.type} 
                onValueChange={(value) => setFollowUpData({...followUpData, type: value as any})}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="call">Phone Call</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="scheduled-date">Scheduled Date</Label>
              <DatePicker 
                date={followUpData.scheduledDate} 
                setDate={(date) => date && setFollowUpData({...followUpData, scheduledDate: date})}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="template">Template</Label>
            <Select 
              value={followUpData.templateId} 
              onValueChange={handleTemplateChange}
            >
              <SelectTrigger id="template">
                <SelectValue placeholder="Select template or type custom message" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Custom Message</SelectItem>
                {templates.filter(t => t.type === followUpData.type).map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {(followUpData.type === 'email') && (
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={followUpData.subject}
                onChange={(e) => setFollowUpData({...followUpData, subject: e.target.value})}
                placeholder="Enter subject"
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="content">Message</Label>
            <Textarea
              id="content"
              rows={5}
              value={followUpData.content}
              onChange={(e) => setFollowUpData({...followUpData, content: e.target.value})}
              placeholder="Enter message content"
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Schedule Follow-Up</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default LeadFollowUpForm;
