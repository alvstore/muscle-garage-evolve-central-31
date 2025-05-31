
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/auth/use-auth";
import { useBookClass } from "@/hooks/classes/use-classes";
import { toast } from "sonner";
import { GymClass, ClassBooking } from "@/types/class";
import { memberService } from "@/services/members/memberService";
import { Loader2 } from "lucide-react";
import { Member } from "@/types/members/member";

interface ClassBookingFormProps {
  gymClass: GymClass;
  open: boolean;
  onClose: () => void;
  onBookingComplete: (booking: ClassBooking) => void;
}

const ClassBookingForm = ({ gymClass, open, onClose, onBookingComplete }: ClassBookingFormProps) => {
  const [notes, setNotes] = useState("");
  const { user } = useAuth();
  
  const { mutate: bookClass, isPending } = useBookClass();
  
  // For admin/staff - allow selecting a member
  const [selectedMemberId, setSelectedMemberId] = useState("");
  
  // Fetch members from the branch - use branch_id instead of branchId
  const { data: members, isLoading: isLoadingMembers } = useQuery({
    queryKey: ['members', gymClass.branch_id],
    queryFn: () => memberService.getMembersByBranch(gymClass.branch_id),
    enabled: open && (user?.role === 'admin' || user?.role === 'staff'),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Reset form when opened with a new class
  useEffect(() => {
    if (open) {
      setNotes("");
      if (user?.role === 'member') {
        setSelectedMemberId(user.id);
      } else {
        setSelectedMemberId("");
      }
    }
  }, [open, user]);

  const handleSubmit = () => {
    // Validate form
    const memberId = user?.role === 'member' ? user.id : selectedMemberId;
    
    if (!memberId) {
      toast.error("Please select a member");
      return;
    }
    
    // Validation for class capacity
    if (gymClass.enrolled >= gymClass.capacity) {
      toast.error("This class is already full");
      return;
    }
    
    // Validation for class time (don't book past classes) - use start_time
    if (new Date(gymClass.start_time) < new Date()) {
      toast.error("Cannot book a class that has already started or ended");
      return;
    }
    
    // Book the class
    bookClass(
      { classId: gymClass.id, memberId },
      {
        onSuccess: (data) => {
          if (data) {
            onBookingComplete(data);
            toast.success(`Successfully booked for ${gymClass.name}`);
            onClose();
          } else {
            toast.error('Failed to book class. Please try again.');
          }
        },
        onError: (error: any) => {
          const errorMessage = error?.response?.data?.message || 
                            "There was an error booking the class. Please try again.";
          toast.error(errorMessage);
        }
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-[425px] p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle>Book Class: {gymClass.name}</DialogTitle>
          <DialogDescription>
            Complete the form below to book this class.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2 sm:py-4">
          {/* Only show member selection for admin/staff users */}
          {user?.role !== 'member' && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Member</label>
              <Select value={selectedMemberId} onValueChange={setSelectedMemberId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a member" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px]">
                  {isLoadingMembers ? (
                    <div className="flex items-center justify-center p-2">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      <span>Loading members...</span>
                    </div>
                  ) : members && members.length > 0 ? (
                    members.map((member: Member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.name}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-2 text-center text-muted-foreground">
                      No members found in this branch
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Class Details</label>
            <div className="rounded-md bg-accent/20 p-3 text-sm">
              <p className="mb-1"><strong>Start:</strong> {new Date(gymClass.start_time).toLocaleString()}</p>
              <p className="mb-1"><strong>End:</strong> {new Date(gymClass.end_time).toLocaleString()}</p>
              <p className={`mb-1 ${gymClass.enrolled >= gymClass.capacity ? "text-red-500 font-medium" : ""}`}>
                <strong>Availability:</strong> {gymClass.enrolled}/{gymClass.capacity} enrolled
                {gymClass.enrolled >= gymClass.capacity && " (Class Full)"}
              </p>
              <p><strong>Trainer:</strong> {gymClass.trainer || 'Unassigned'}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Notes (Optional)</label>
            <textarea 
              className="w-full rounded-md border p-2 min-h-[80px] resize-none"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special requirements or notes"
            />
          </div>
        </div>
        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-4">
          <Button type="button" variant="outline" onClick={onClose} className="mt-2 sm:mt-0">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isPending || gymClass.enrolled >= gymClass.capacity || new Date(gymClass.start_time) < new Date()}
            className="w-full sm:w-auto"
          >
            {isPending ? "Booking..." : "Confirm Booking"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ClassBookingForm;
