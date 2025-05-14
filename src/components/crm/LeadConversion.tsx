
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Lead } from '@/types/crm';
import { Membership } from '@/types/membership';
import { addDays, format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface LeadConversionProps {
  lead: Lead;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConvert: (leadId: string, membershipId?: string, notes?: string) => Promise<void>;
  memberships: Membership[];
  isConverting: boolean;
}

const LeadConversion: React.FC<LeadConversionProps> = ({
  lead,
  open,
  onOpenChange,
  onConvert,
  memberships,
  isConverting
}) => {
  const [selectedMembershipId, setSelectedMembershipId] = useState<string>('');
  const [notes, setNotes] = useState('');
  const { toast } = useToast();
  
  useEffect(() => {
    if (open) {
      setSelectedMembershipId('');
      setNotes('');
    }
  }, [open]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await onConvert(lead.id, selectedMembershipId || undefined, notes);
      toast({
        title: 'Lead converted',
        description: 'Lead has been converted to a member successfully.',
      });
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: 'Conversion failed',
        description: error.message || 'There was an error converting the lead.',
        variant: 'destructive',
      });
    }
  };
  
  const selectedMembership = memberships.find(m => m.id === selectedMembershipId);
  
  // Calculate end date based on duration_days or fallback to duration_months
  const calculateEndDate = (membership: Membership | undefined) => {
    if (!membership) return 'N/A';
    
    const today = new Date();
    const days = membership.duration_days || (membership.duration_months || 0) * 30;
    
    return format(addDays(today, days), 'PPP');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Convert Lead to Member</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="membership">Membership Plan</Label>
            <Select 
              value={selectedMembershipId} 
              onValueChange={(value) => setSelectedMembershipId(value)}
            >
              <SelectTrigger id="membership">
                <SelectValue placeholder="Select a membership plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No membership plan</SelectItem>
                {memberships.map((membership) => (
                  <SelectItem key={membership.id} value={membership.id}>
                    {membership.name} - {membership.price}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {selectedMembership && (
            <div className="rounded-md bg-muted p-3 text-sm">
              <p><strong>Plan:</strong> {selectedMembership.name}</p>
              <p><strong>Price:</strong> {selectedMembership.price}</p>
              <p><strong>Duration:</strong> {selectedMembership.duration_days} days</p>
              <p><strong>End Date:</strong> {calculateEndDate(selectedMembership)}</p>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional notes about this conversion"
              rows={3}
            />
          </div>
          
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isConverting}>
              {isConverting ? 'Converting...' : 'Convert Lead'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LeadConversion;
