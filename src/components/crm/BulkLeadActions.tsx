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
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from '@/hooks/use-toast-manager';
import { LeadStatus, FunnelStage } from '@/types/crm';

interface BulkLeadActionsProps {
  leadIds: string[];
  onUpdate: () => void;
}

const BulkLeadActions: React.FC<BulkLeadActionsProps> = ({ leadIds, onUpdate }) => {
  const [status, setStatus] = useState<LeadStatus>('new');
  const [funnelStage, setFunnelStage] = useState<FunnelStage>('cold');
  const [isUpdating, setIsUpdating] = useState(false);

  const updateLeadsStatus = async () => {
    setIsUpdating(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const count = leadIds.length;

      // Make sure the component uses toast correctly:
      const { toast } = useToast();

      // When showing success toasts:
      toast.success('Leads status updated', {
        description: `${count} leads have been updated to ${status}`
      });

      onUpdate();
    } catch (error) {
      // When showing error toasts:
      toast.error('Update failed', {
        description: 'Failed to update leads status'
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const updateLeadsFunnelStage = async () => {
    setIsUpdating(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const count = leadIds.length;
      toast.success('Leads funnel stage updated', {
        description: `${count} leads have been updated to ${funnelStage}`
      });

      onUpdate();
    } catch (error) {
      toast.error('Update failed', {
        description: 'Failed to update leads funnel stage'
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Bulk Actions</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Bulk Actions</AlertDialogTitle>
          <AlertDialogDescription>
            Choose an action to apply to the selected leads.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <Select onValueChange={(value) => setStatus(value as LeadStatus)} defaultValue={status}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="qualified">Qualified</SelectItem>
                <SelectItem value="proposal">Proposal</SelectItem>
                <SelectItem value="negotiation">Negotiation</SelectItem>
                <SelectItem value="won">Won</SelectItem>
                <SelectItem value="lost">Lost</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
                <SelectItem value="converted">Converted</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="funnelStage" className="text-right">
              Funnel Stage
            </Label>
            <Select onValueChange={(value) => setFunnelStage(value as FunnelStage)} defaultValue={funnelStage}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a funnel stage" />
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
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button onClick={updateLeadsStatus} disabled={isUpdating}>
            {isUpdating ? "Updating..." : "Update Status"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default BulkLeadActions;
