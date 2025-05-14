
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { Lead, FollowUpType } from '@/types/crm';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { leadConversionService } from '@/services/leadConversionService';
import { toast } from '@/hooks/use-toast';
import { format, addDays } from 'date-fns';
import { Loader2, Calendar, MessageCircle, Mail, Phone, User } from 'lucide-react';
import { useBranch } from '@/hooks/use-branch';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { FormDescription } from '@/components/ui/form';

interface LeadFollowUpFormProps {
  lead: Lead;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const LeadFollowUpForm: React.FC<LeadFollowUpFormProps> = ({ 
  lead, 
  onSuccess, 
  onCancel 
}) => {
  const queryClient = useQueryClient();
  const { currentBranch } = useBranch();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    type: 'call' as FollowUpType,
    scheduledFor: addDays(new Date(), 1),
    subject: `Follow-up with ${lead.name}`,
    content: `Scheduled follow-up with ${lead.name} regarding membership options.`,
    assignedTo: user?.id || ''
  });

  // Fetch staff members for assignment
  const { data: staffMembers, isLoading: isLoadingStaff } = useQuery({
    queryKey: ['staffMembers', currentBranch?.id],
    queryFn: async () => {
      if (!currentBranch?.id) return [];
      
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('branch_id', currentBranch.id)
        .in('role', ['staff', 'admin']);
        
      if (error) throw error;
      return data || [];
    },
    enabled: !!currentBranch?.id
  });

  // Schedule follow-up mutation
  const scheduleFollowUpMutation = useMutation({
    mutationFn: () => leadConversionService.scheduleFollowUp(
      lead.id, 
      {
        type: formData.type,
        scheduledFor: formData.scheduledFor.toISOString(),
        subject: formData.subject,
        content: formData.content,
        assignedTo: formData.assignedTo,
        branchId: currentBranch?.id // Pass branch ID for task creation
      }
    ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['followUpHistory', lead.id] });
      queryClient.invalidateQueries({ queryKey: ['scheduledFollowUps'] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] }); // Invalidate tasks to refresh the task list
      toast({
        title: "Success", 
        description: "Follow-up scheduled and task created successfully"
      });
      if (onSuccess) onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: "Error", 
        description: `Failed to schedule follow-up: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData(prev => ({ ...prev, scheduledFor: date }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    scheduleFollowUpMutation.mutate();
  };

  // Get icon based on follow-up type
  const getFollowUpIcon = () => {
    switch (formData.type) {
      case 'call':
        return <Phone className="h-4 w-4 mr-2" />;
      case 'email':
        return <Mail className="h-4 w-4 mr-2" />;
      case 'meeting':
        return <Calendar className="h-4 w-4 mr-2" />;
      case 'whatsapp':
      case 'sms':
        return <MessageCircle className="h-4 w-4 mr-2" />;
      default:
        return <Calendar className="h-4 w-4 mr-2" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Schedule Follow-up</CardTitle>
        <FormDescription>
          Create a scheduled follow-up for this lead
        </FormDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Follow-up Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleSelectChange('type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="call">Call</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Scheduled For</Label>
              <DatePicker
                date={formData.scheduledFor}
                setDate={handleDateChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assignedTo">Assigned To</Label>
            <Select
              value={formData.assignedTo}
              onValueChange={(value) => handleSelectChange('assignedTo', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select staff member" />
              </SelectTrigger>
              <SelectContent>
                {isLoadingStaff ? (
                  <div className="flex items-center justify-center py-2">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <span>Loading staff...</span>
                  </div>
                ) : staffMembers && staffMembers.length > 0 ? (
                  staffMembers.map((staff: any) => (
                    <SelectItem key={staff.id} value={staff.id}>
                      {staff.full_name}
                    </SelectItem>
                  ))
                ) : (
                  <div className="p-2 text-center text-muted-foreground">
                    No staff members found
                  </div>
                )}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              Assigning a staff member will create a task for follow-up
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Follow-up subject"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Message</Label>
            <Textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Follow-up message or notes"
              rows={4}
            />
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={scheduleFollowUpMutation.isPending}
        >
          {scheduleFollowUpMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Scheduling...
            </>
          ) : (
            <>
              {getFollowUpIcon()}
              Schedule Follow-up
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LeadFollowUpForm;
