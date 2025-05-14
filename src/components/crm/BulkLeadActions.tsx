import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Copy, Edit, Trash2, Plus, UserPlus, Send, Calendar } from "lucide-react"
import { Lead, FollowUpType } from '@/types/crm';
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { DatePicker } from "@/components/ui/date-picker"
import { format, addDays } from 'date-fns';
import { followUpService } from '@/services/followUpService';
import { useAuth } from '@/hooks/use-auth';

interface BulkLeadActionsProps {
  leads: Lead[];
  onDelete: (id: string) => Promise<void>;
  onUpdate: (id: string, updates: Partial<Lead>) => Promise<void>;
}

const BulkLeadActions: React.FC<BulkLeadActionsProps> = ({ leads, onDelete, onUpdate }) => {
  const { toast } = useToast()
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showFollowUpForm, setShowFollowUpForm] = useState(false);
  const [followUpData, setFollowUpData] = useState({
    type: 'call' as FollowUpType,
    scheduledFor: addDays(new Date(), 1),
    subject: 'Follow-up',
    content: '',
  });
  const { user } = useAuth();

  const handleSelectLead = (leadId: string) => {
    setSelectedLeads(prev =>
      prev.includes(leadId) ? prev.filter(id => id !== leadId) : [...prev, leadId]
    );
  };

  const handleSelectAllLeads = () => {
    if (selectedLeads.length === leads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(leads.map(lead => lead.id));
    }
  };

  const handleDeleteSelected = () => {
    setShowDeleteAlert(true);
  };

  const confirmDelete = async () => {
    try {
      await Promise.all(selectedLeads.map(id => onDelete(id)));
      toast({
        title: "Success",
        description: "Selected leads deleted successfully.",
      })
      setSelectedLeads([]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete leads.",
        variant: "destructive",
      })
    } finally {
      setShowDeleteAlert(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteAlert(false);
  };

  const handleScheduleFollowUp = () => {
    setShowFollowUpForm(true);
  };

  const handleFollowUpInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFollowUpData(prev => ({ ...prev, [name]: value }));
  };

  const handleFollowUpDateChange = (date: Date | undefined) => {
    if (date) {
      setFollowUpData(prev => ({ ...prev, scheduledFor: date }));
    }
  };

  const scheduleBulkFollowUp = async (leads, followUpData, user) => {
  try {
    // Function should have two arguments
    const result = await followUpService.scheduleBulkFollowUps(
      leads, 
      { 
        ...followUpData, 
        assignedTo: user?.id 
      }
    );
    return result;
  } catch (error) {
    console.error("Error scheduling bulk follow-ups:", error);
    throw error;
  }
};

  const handleSubmitFollowUp = async () => {
  try {
    const promises = selectedLeads.map(leadId => {
      return followUpService.scheduleFollowUp(leadId, {
        lead_id: leadId,
        type: followUpData.type,
        content: followUpData.content,
        subject: followUpData.subject,
        status: 'scheduled',
        scheduled_at: followUpData.scheduledFor.toISOString(),
        notes: followUpData.content, // Add missing property
        user_id: user?.id || '', // Add missing property
        created_at: new Date().toISOString() // Add missing property
      });
    });
    
    await Promise.all(promises);
    toast({
      title: "Success",
      description: "Follow-ups scheduled successfully.",
    });
    setShowFollowUpForm(false);
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to schedule follow-ups.",
      variant: "destructive",
    });
  }
};

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" disabled={leads.length === 0}>
            Bulk Actions <MoreHorizontal className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleScheduleFollowUp}>
            <Calendar className="mr-2 h-4 w-4" /> Schedule Follow-up
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDeleteSelected} disabled={selectedLeads.length === 0}>
            <Trash2 className="mr-2 h-4 w-4" /> Delete Selected
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Confirmation Alert */}
      {showDeleteAlert && (
        <Alert variant="destructive">
          <AlertTitle>Are you sure?</AlertTitle>
          <AlertDescription>
            This action will permanently delete the selected leads.
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="ghost" onClick={cancelDelete}>Cancel</Button>
              <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Schedule Follow-up Form */}
      {showFollowUpForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Schedule Follow-up</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="type">Type</Label>
                <Input
                  id="type"
                  name="type"
                  value={followUpData.type}
                  onChange={handleFollowUpInputChange}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Scheduled For</Label>
                <DatePicker
                  date={followUpData.scheduledFor}
                  setDate={handleFollowUpDateChange}
                />
              </div>
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  name="subject"
                  value={followUpData.subject}
                  onChange={handleFollowUpInputChange}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  name="content"
                  value={followUpData.content}
                  onChange={handleFollowUpInputChange}
                  className="mt-1"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="ghost" onClick={() => setShowFollowUpForm(false)}>Cancel</Button>
              <Button onClick={handleSubmitFollowUp}>Schedule</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkLeadActions;
