
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MoreVertical, MessageSquare, CreditCard, Trash, UserCog } from 'lucide-react';
import { toast } from 'sonner';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { supabase } from '@/services/supabaseClient';

interface MemberQuickActionsProps {
  memberId: string;
  memberName: string;
  onDeleted?: () => void;
}

const MemberQuickActions = ({ memberId, memberName, onDeleted }: MemberQuickActionsProps) => {
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleViewProfile = () => {
    navigate(`/members/${memberId}`);
  };

  const handleAddPayment = () => {
    navigate(`/finance/transactions/new?memberId=${memberId}`);
    toast.info("Payment form opened");
  };

  const handleSendMessage = () => {
    navigate(`/communication/messages/new?recipientId=${memberId}`);
    toast.info("Message form opened");
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      
      // In a real implementation, this would delete the member from the database
      await supabase
        .from('profiles')
        .delete()
        .eq('id', memberId);
      
      toast.success(`Member ${memberName} deleted successfully`);
      setShowDeleteConfirm(false);
      
      if (onDeleted) {
        onDeleted();
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete member');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="flex border-t">
        <Button 
          variant="ghost" 
          className="flex-1 rounded-none py-2 h-auto font-normal text-xs"
          onClick={handleViewProfile}
        >
          View Profile
        </Button>
        <div className="border-r"></div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex-1 rounded-none py-2 h-auto font-normal text-xs"
            >
              Quick Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Member Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleViewProfile}>
              <UserCog className="mr-2 h-4 w-4" />
              View Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleAddPayment}>
              <CreditCard className="mr-2 h-4 w-4" />
              Add Payment
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSendMessage}>
              <MessageSquare className="mr-2 h-4 w-4" />
              Send Message
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => setShowDeleteConfirm(true)}
              className="text-red-600 focus:text-red-600"
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete Member
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="border-r"></div>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-none h-auto py-2"
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {memberName}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default MemberQuickActions;
