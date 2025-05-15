
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Users, Mail, Tag, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface BulkLeadActionsProps {
  selectedLeads: string[];
  onSuccess: () => void;
  onClose: () => void;
}

const BulkLeadActions: React.FC<BulkLeadActionsProps> = ({ 
  selectedLeads, 
  onSuccess, 
  onClose 
}) => {
  const [action, setAction] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState<string>('');

  const handleAction = async () => {
    if (!action) {
      toast.error('Please select an action');
      return;
    }

    if ((action === 'status' || action === 'stage' || action === 'assign' || action === 'tag') && !value) {
      toast.error('Please select a value for the action');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Success message
      toast.success(`${selectedLeads.length} leads updated successfully`);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error performing bulk action:', error);
      toast.error('Failed to update leads');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Bulk Actions - {selectedLeads.length} leads selected</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Select Action</h3>
            <Select value={action} onValueChange={setAction}>
              <SelectTrigger>
                <SelectValue placeholder="Choose an action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="status">Update Status</SelectItem>
                <SelectItem value="stage">Update Funnel Stage</SelectItem>
                <SelectItem value="assign">Assign To Staff</SelectItem>
                <SelectItem value="tag">Add Tag</SelectItem>
                <SelectItem value="delete">Delete Leads</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {action === 'status' && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Select Status</h3>
              <Select value={value} onValueChange={setValue}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="qualified">Qualified</SelectItem>
                  <SelectItem value="converted">Converted</SelectItem>
                  <SelectItem value="lost">Lost</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          
          {action === 'stage' && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Select Funnel Stage</h3>
              <Select value={value} onValueChange={setValue}>
                <SelectTrigger>
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="awareness">Awareness</SelectItem>
                  <SelectItem value="interest">Interest</SelectItem>
                  <SelectItem value="consideration">Consideration</SelectItem>
                  <SelectItem value="intent">Intent</SelectItem>
                  <SelectItem value="evaluation">Evaluation</SelectItem>
                  <SelectItem value="purchase">Purchase</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          
          {action === 'assign' && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Assign To</h3>
              <Select value={value} onValueChange={setValue}>
                <SelectTrigger>
                  <SelectValue placeholder="Select staff member" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="staff1">John Doe (Sales)</SelectItem>
                  <SelectItem value="staff2">Jane Smith (Support)</SelectItem>
                  <SelectItem value="staff3">Mark Johnson (Manager)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          
          {action === 'tag' && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Add Tag</h3>
              <Select value={value} onValueChange={setValue}>
                <SelectTrigger>
                  <SelectValue placeholder="Select tag" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hot">Hot Lead</SelectItem>
                  <SelectItem value="cold">Cold Lead</SelectItem>
                  <SelectItem value="followup">Needs Follow-up</SelectItem>
                  <SelectItem value="vip">VIP</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          
          {action === 'delete' && (
            <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-md">
              <AlertCircle className="h-5 w-5" />
              <span>This will permanently delete {selectedLeads.length} leads. This action cannot be undone.</span>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleAction} 
            disabled={loading || !action || ((action !== 'delete') && !value)}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Processing...
              </>
            ) : action === 'delete' ? (
              'Delete Leads'
            ) : (
              'Apply Change'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BulkLeadActions;
