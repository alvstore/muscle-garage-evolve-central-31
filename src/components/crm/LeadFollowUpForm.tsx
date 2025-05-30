import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Lead } from '@/types/crm';
import { useMutation } from '@tanstack/react-query';
import { leadConversionService } from '@/services/crm/leadConversionService';
import { toast } from 'sonner';

export interface LeadFollowUpFormProps {
  lead: Lead;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const LeadFollowUpForm: React.FC<LeadFollowUpFormProps> = ({ lead, onSuccess, onCancel }) => {
  const [followUpType, setFollowUpType] = useState<'email' | 'call' | 'meeting' | 'whatsapp'>('call');
  const [subject, setSubject] = useState(`Follow-up with ${lead.name}`);
  const [content, setContent] = useState('');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState('09:00');

  const scheduleFollowUpMutation = useMutation({
    mutationFn: (data: {
      type: 'email' | 'call' | 'meeting' | 'whatsapp';
      scheduledFor: string;
      subject: string;
      content: string;
    }) => leadConversionService.scheduleFollowUp(lead.id, data),
    onSuccess: () => {
      toast.success('Follow-up scheduled successfully');
      if (onSuccess) onSuccess();
    },
    onError: () => {
      toast.error('Failed to schedule follow-up');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date) {
      toast.error('Please select a date for the follow-up');
      return;
    }
    
    // Combine date and time
    const scheduledDate = new Date(date);
    const [hours, minutes] = time.split(':').map(Number);
    scheduledDate.setHours(hours, minutes);
    
    scheduleFollowUpMutation.mutate({
      type: followUpType,
      scheduledFor: scheduledDate.toISOString(),
      subject,
      content
    });
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Schedule Follow-up</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="follow-up-type">Follow-up Type</Label>
            <Select 
              value={followUpType} 
              onValueChange={(value) => setFollowUpType(value as 'email' | 'call' | 'meeting' | 'whatsapp')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select follow-up type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="call">Phone Call</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="meeting">Meeting</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Follow-up subject"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Notes</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Add notes about this follow-up"
              rows={4}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={scheduleFollowUpMutation.isPending}>
            {scheduleFollowUpMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Scheduling...
              </>
            ) : (
              'Schedule Follow-up'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default LeadFollowUpForm;
