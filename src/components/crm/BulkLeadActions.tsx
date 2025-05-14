import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { leadService } from '@/services/leadService';
import { followUpService } from '@/services/followUpService';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Loader2, Users, Tag, Calendar } from 'lucide-react';
import { FollowUpType } from '@/types/crm';

interface BulkLeadActionsProps {
  selectedLeads: string[];
  onActionComplete?: () => void;
}

const BulkLeadActions: React.FC<BulkLeadActionsProps> = ({ 
  selectedLeads, 
  onActionComplete 
}) => {
  const queryClient = useQueryClient();
  const [showFollowUpDialog, setShowFollowUpDialog] = useState(false);
  const [showTagDialog, setShowTagDialog] = useState(false);
  const [showStageDialog, setShowStageDialog] = useState(false);
  
  // Follow-up form state
  const [followUpData, setFollowUpData] = useState({
    type: 'call' as FollowUpType,
    scheduledFor: new Date(),
    subject: '',
    content: ''
  });
  
  // Tag form state
  const [tagData, setTagData] = useState({
    tags: ''
  });
  
  // Stage form state
  const [stageData, setStageData] = useState({
    stage: 'cold' as 'cold' | 'warm' | 'hot' | 'won' | 'lost'
  });

  // Bulk update stage mutation
  const updateStageMutation = useMutation({
    mutationFn: async () => {
      const promises = selectedLeads.map(leadId => 
        leadService.updateLead(leadId, { funnel_stage: stageData.stage })
      );
      return Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast.success(`${selectedLeads.length} leads moved to ${stageData.stage} stage`);
      setShowStageDialog(false);
      if (onActionComplete) onActionComplete();
    },
    onError: () => {
      toast.error('Failed to update lead stages');
    }
  });

  // Bulk add tags mutation
  const addTagsMutation = useMutation({
    mutationFn: async () => {
      const newTags = tagData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      const promises = selectedLeads.map(async (leadId) => {
        const lead = await leadService.getLeadById(leadId);
        if (!lead) return null;
        
        const currentTags = lead.tags || [];
        const updatedTags = [...new Set([...currentTags, ...newTags])];
        
        return leadService.updateLead(leadId, { tags: updatedTags });
      });
      
      return Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast.success(`Tags added to ${selectedLeads.length} leads`);
      setShowTagDialog(false);
      if (onActionComplete) onActionComplete();
    },
    onError: () => {
      toast.error('Failed to add tags');
    }
  });

  // Bulk schedule follow-up mutation
  const scheduleFollowUpMutation = useMutation({
    mutationFn: async () => {
      const promises = selectedLeads.map(leadId => 
        followUpService.createFollowUpHistory({
          lead_id: leadId,
          type: followUpData.type,
          content: followUpData.content,
          subject: followUpData.subject,
          status: 'scheduled',
          scheduled_at: followUpData.scheduledFor.toISOString()
        })
      );
      return Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['followUpHistory'] });
      queryClient.invalidateQueries({ queryKey: ['scheduledFollowUps'] });
      toast.success(`Follow-ups scheduled for ${selectedLeads.length} leads`);
      setShowFollowUpDialog(false);
      if (onActionComplete) onActionComplete();
    },
    onError: () => {
      toast.error('Failed to schedule follow-ups');
    }
  });

  const handleFollowUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    scheduleFollowUpMutation.mutate();
  };

  const handleTagSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTagsMutation.mutate();
  };

  const handleStageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateStageMutation.mutate();
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" disabled={selectedLeads.length === 0}>
            Bulk Actions ({selectedLeads.length})
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setShowStageDialog(true)}>
            Move to Stage
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowTagDialog(true)}>
            Add Tags
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowFollowUpDialog(true)}>
            Schedule Follow-up
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Stage Dialog */}
      <Dialog open={showStageDialog} onOpenChange={setShowStageDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Move Leads to Stage</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleStageSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="stage">Select Stage</Label>
              <Select
                value={stageData.stage}
                onValueChange={(value: 'cold' | 'warm' | 'hot' | 'won' | 'lost') => 
                  setStageData({ ...stageData, stage: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cold">Cold</SelectItem>
                  <SelectItem value="warm">Warm</SelectItem>
                  <SelectItem value="hot">Hot</SelectItem>
                  <SelectItem value="won">Won</SelectItem>
                  <SelectItem value="lost">Lost</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button 
                type="submit" 
                disabled={updateStageMutation.isPending}
              >
                {updateStageMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Moving...
                  </>
                ) : (
                  <>
                    <Users className="mr-2 h-4 w-4" />
                    Move {selectedLeads.length} Leads
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Tags Dialog */}
      <Dialog open={showTagDialog} onOpenChange={setShowTagDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Tags to Leads</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleTagSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                id="tags"
                value={tagData.tags}
                onChange={(e) => setTagData({ ...tagData, tags: e.target.value })}
                placeholder="e.g. VIP, Interested in Yoga, Follow up"
              />
            </div>
            <DialogFooter>
              <Button 
                type="submit" 
                disabled={addTagsMutation.isPending || !tagData.tags.trim()}
              >
                {addTagsMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Tag className="mr-2 h-4 w-4" />
                    Add Tags to {selectedLeads.length} Leads
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Follow-up Dialog */}
      <Dialog open={showFollowUpDialog} onOpenChange={setShowFollowUpDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Follow-up for Leads</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleFollowUpSubmit} className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Follow-up Type</Label>
                <Select
                  value={followUpData.type}
                  onValueChange={(value: FollowUpType) => 
                    setFollowUpData({ ...followUpData, type: value })
                  }
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
                  date={followUpData.scheduledFor}
                  setDate={(date) => date && setFollowUpData({ ...followUpData, scheduledFor: date })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={followUpData.subject}
                onChange={(e) => setFollowUpData({ ...followUpData, subject: e.target.value })}
                placeholder="Follow-up subject"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Message</Label>
              <Textarea
                id="content"
                value={followUpData.content}
                onChange={(e) => setFollowUpData({ ...followUpData, content: e.target.value })}
                placeholder="Follow-up message or notes"
                rows={4}
              />
            </div>
            <DialogFooter>
              <Button 
                type="submit" 
                disabled={
                  scheduleFollowUpMutation.isPending || 
                  !followUpData.subject.trim() || 
                  !followUpData.content.trim()
                }
              >
                {scheduleFollowUpMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Scheduling...
                  </>
                ) : (
                  <>
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule for {selectedLeads.length} Leads
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BulkLeadActions;
