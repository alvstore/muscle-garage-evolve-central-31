
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from 'lucide-react';
import { FollowUpType } from '@/types/crm';

interface LeadFollowUpFormProps {
  lead: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  onSubmit: (data: {
    type: FollowUpType;
    subject?: string;
    content: string;
    scheduledDate: string;
    leadId: string;
  }) => void;
  onCancel: () => void;
}

const LeadFollowUpForm: React.FC<LeadFollowUpFormProps> = ({ lead, onSubmit, onCancel }) => {
  const [followUpType, setFollowUpType] = useState<FollowUpType>('email');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [scheduledDate, setScheduledDate] = useState(
    new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      type: followUpType,
      subject: followUpType === 'email' ? subject : undefined,
      content,
      scheduledDate,
      leadId: lead.id
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Schedule Follow-Up</CardTitle>
        <CardDescription>
          Schedule a follow-up with {lead.name}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="follow-up-type">Follow-Up Type</Label>
            <Select 
              value={followUpType} 
              onValueChange={(value: string) => setFollowUpType(value as FollowUpType)}
            >
              <SelectTrigger id="follow-up-type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="sms">SMS</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                <SelectItem value="call">Call</SelectItem>
                <SelectItem value="meeting">Meeting</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {followUpType === 'email' && (
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input 
                id="subject" 
                value={subject} 
                onChange={(e) => setSubject(e.target.value)} 
                placeholder="Follow up regarding your inquiry" 
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="content">
              {followUpType === 'email' ? 'Email Body' : 
               followUpType === 'sms' || followUpType === 'whatsapp' ? 'Message' : 'Notes'}
            </Label>
            <Textarea 
              id="content" 
              value={content} 
              onChange={(e) => setContent(e.target.value)} 
              placeholder={followUpType === 'email' ? "Dear customer..." : "Hi there..."}
              rows={followUpType === 'email' ? 5 : 3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="scheduled-date">Schedule For</Label>
            <div className="flex gap-2">
              <Input 
                id="scheduled-date" 
                type="date" 
                value={scheduledDate} 
                onChange={(e) => setScheduledDate(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium">Contact Details</p>
            <div className="text-sm text-muted-foreground">
              <p>{lead.name}</p>
              <p>{lead.email}</p>
              <p>{lead.phone}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule Follow-Up
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default LeadFollowUpForm;
