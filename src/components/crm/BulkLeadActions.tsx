
import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TagsInput } from "@/components/ui/tags-input";
import { useToast } from '@/hooks/use-toast';
import { LeadStatus, FunnelStage } from '@/types/crm';
import { leadService } from '@/services/leadService';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormDescription } from "@/components/ui/form";
import { useAuth } from '@/hooks/use-auth';
import { User } from '@/types/user';

interface BulkLeadActionsProps {
  selectedLeads: string[];
  onSuccess: () => void;
  onClose: () => void;
}

export function BulkLeadActions({ selectedLeads, onSuccess, onClose }: BulkLeadActionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isFunnelStageDialogOpen, setIsFunnelStageDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [isAddTagsDialogOpen, setIsAddTagsDialogOpen] = useState(false);
  const [newTags, setNewTags] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<LeadStatus>('new');
  const [selectedFunnelStage, setSelectedFunnelStage] = useState<FunnelStage>('cold');
  const [selectedUser, setSelectedUser] = useState<string | undefined>(undefined);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const availableStatuses: LeadStatus[] = ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost', 'archived', 'converted'];
  const availableFunnelStages: FunnelStage[] = ['cold', 'warm', 'hot', 'won', 'lost'];
  
  const availableUsers: User[] = [
    { id: '1', name: 'John Doe', email: 'john.doe@example.com', role: 'staff' },
    { id: '2', name: 'Jane Smith', email: 'jane.smith@example.com', role: 'staff' },
    { id: '3', name: 'Alice Johnson', email: 'alice.johnson@example.com', role: 'staff' },
  ];

  const updateLeadStatus = (status: LeadStatus) => {
    if (selectedLeads.length === 0) return;
    
    setIsLoading(true);
    
    const updatePromises = selectedLeads.map(id => 
      leadService.updateLead(id, { status })
    );
    
    Promise.all(updatePromises)
      .then(() => {
        toast.success({
          title: "Success",
          description: `Status updated for ${selectedLeads.length} lead(s)`
        });
        onSuccess();
        onClose();
      })
      .catch(error => {
        console.error('Error updating lead status:', error);
        toast.error({
          title: "Error",
          description: 'Failed to update lead status'
        });
      })
      .finally(() => setIsLoading(false));
  };

  const updateFunnelStage = (funnel_stage: FunnelStage) => {
    if (selectedLeads.length === 0) return;
    
    setIsLoading(true);
    
    const updatePromises = selectedLeads.map(id => 
      leadService.updateLead(id, { funnel_stage })
    );
    
    Promise.all(updatePromises)
      .then(() => {
        toast.success({
          title: "Success",
          description: `Funnel stage updated for ${selectedLeads.length} lead(s)`
        });
        onSuccess();
        onClose();
      })
      .catch(error => {
        console.error('Error updating funnel stage:', error);
        toast.error({
          title: "Error",
          description: 'Failed to update funnel stage'
        });
      })
      .finally(() => setIsLoading(false));
  };

  const assignLeads = (userId: string) => {
    if (!userId || selectedLeads.length === 0) return;
    
    setIsLoading(true);
    
    const updatePromises = selectedLeads.map(id => 
      leadService.updateLead(id, { assigned_to: userId })
    );
    
    Promise.all(updatePromises)
      .then(() => {
        toast.success({
          title: "Success",
          description: `Assigned ${selectedLeads.length} lead(s) to user`
        });
        onSuccess();
        onClose();
      })
      .catch(error => {
        console.error('Error assigning leads:', error);
        toast.error({
          title: "Error",
          description: 'Failed to assign leads'
        });
      })
      .finally(() => setIsLoading(false));
  };

  const addTags = (newTags: string[]) => {
    if (!newTags.length || selectedLeads.length === 0) return;
    
    setIsLoading(true);
    
    const updatePromises = selectedLeads.map(async (leadId) => {
      const lead = await leadService.getLeadById(leadId);
      const currentTags = lead.tags || [];
      const uniqueTags = [...new Set([...currentTags, ...newTags])];
      
      return leadService.updateLead(leadId, { tags: uniqueTags });
    });
    
    Promise.all(updatePromises)
      .then(() => {
        toast.success({
          title: "Success",
          description: `Tags added to ${selectedLeads.length} lead(s)`
        });
        onSuccess();
        onClose();
      })
      .catch(error => {
        console.error('Error adding tags:', error);
        toast.error({
          title: "Error",
          description: 'Failed to add tags'
        });
      })
      .finally(() => setIsLoading(false));
  };

  const deleteLeads = () => {
    if (selectedLeads.length === 0) return;
    
    setIsLoading(true);
    
    const deletePromises = selectedLeads.map(id => leadService.deleteLead(id));
    
    Promise.all(deletePromises)
      .then(() => {
        toast.success({
          title: "Success",
          description: `Deleted ${selectedLeads.length} lead(s)`
        });
        onSuccess();
        onClose();
      })
      .catch(error => {
        console.error('Error deleting leads:', error);
        toast.error({
          title: "Error",
          description: 'Failed to delete leads'
        });
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <>
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <Button onClick={() => setIsDeleteDialogOpen(true)} variant="destructive" disabled={isLoading}>Delete Leads</Button>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the selected leads from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteLeads} disabled={isLoading}>
              {isLoading ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <AlertDialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <Button onClick={() => setIsStatusDialogOpen(true)} variant="outline" disabled={isLoading}>Update Status</Button>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Update Lead Status</AlertDialogTitle>
            <FormDescription>
              Select a new status for the selected leads.
            </FormDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Select onValueChange={(value) => setSelectedStatus(value as LeadStatus)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                {availableStatuses.map((status) => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => updateLeadStatus(selectedStatus)} disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <AlertDialog open={isFunnelStageDialogOpen} onOpenChange={setIsFunnelStageDialogOpen}>
        <Button onClick={() => setIsFunnelStageDialogOpen(true)} variant="outline" disabled={isLoading}>Update Funnel Stage</Button>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Update Funnel Stage</AlertDialogTitle>
            <FormDescription>
              Select a new funnel stage for the selected leads.
            </FormDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Select onValueChange={(value) => setSelectedFunnelStage(value as FunnelStage)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a funnel stage" />
              </SelectTrigger>
              <SelectContent>
                {availableFunnelStages.map((stage) => (
                  <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => updateFunnelStage(selectedFunnelStage)} disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <AlertDialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <Button onClick={() => setIsAssignDialogOpen(true)} variant="outline" disabled={isLoading}>Assign Leads</Button>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Assign Leads</AlertDialogTitle>
            <FormDescription>
              Select a user to assign the selected leads to.
            </FormDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Select onValueChange={(value) => setSelectedUser(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a user" />
              </SelectTrigger>
              <SelectContent>
                {availableUsers.map((user) => (
                  <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => assignLeads(selectedUser || '')} disabled={isLoading}>
              {isLoading ? 'Assigning...' : 'Assign'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <AlertDialog open={isAddTagsDialogOpen} onOpenChange={setIsAddTagsDialogOpen}>
        <Button onClick={() => setIsAddTagsDialogOpen(true)} variant="outline" disabled={isLoading}>Add Tags</Button>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Add Tags</AlertDialogTitle>
            <FormDescription>
              Enter tags to add to the selected leads.
            </FormDescription>
          </AlertDialogHeader>
          <div className="grid gap-2 py-4">
            <Label htmlFor="tags">Tags</Label>
            <TagsInput 
              value={newTags}
              onChange={setNewTags}
              placeholder="Add tags and press Enter"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => addTags(newTags)} disabled={isLoading}>
              {isLoading ? 'Adding...' : 'Add'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
