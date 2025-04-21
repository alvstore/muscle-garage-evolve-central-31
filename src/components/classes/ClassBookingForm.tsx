
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { GymClass, ClassBooking, BookingStatus } from "@/types/class";

interface ClassBookingFormProps {
  gymClass: GymClass;
  open: boolean;
  onClose: () => void;
  onBookingComplete: (booking: ClassBooking) => void;
}

const ClassBookingForm = ({ gymClass, open, onClose, onBookingComplete }: ClassBookingFormProps) => {
  const [loading, setLoading] = useState(false);
  const [memberId, setMemberId] = useState("");
  const [notes, setNotes] = useState("");
  
  // Mock member list - in a real app, this would be fetched from an API
  const mockMembers = [
    { id: "member-1", name: "John Doe" },
    { id: "member-2", name: "Jane Smith" },
    { id: "member-3", name: "Mike Johnson" },
  ];

  const handleSubmit = () => {
    if (!memberId) {
      toast.error("Please select a member");
      return;
    }

    setLoading(true);
    
    // Create a booking
    setTimeout(() => {
      const member = mockMembers.find(m => m.id === memberId);
      
      if (!member) {
        toast.error("Invalid member selection");
        setLoading(false);
        return;
      }
      
      // Create a new booking
      const newBooking: ClassBooking = {
        id: `booking-${Date.now()}`,
        classId: gymClass.id,
        className: gymClass.name,
        memberId: member.id,
        memberName: member.name,
        bookingDate: new Date().toISOString(),
        status: "confirmed",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        notes: notes || undefined
      };
      
      // In a real app, this would be an API call
      onBookingComplete(newBooking);
      toast.success(`Booked ${member.name} for ${gymClass.name}`);
      setLoading(false);
      onClose();
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Book Class: {gymClass.name}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Member</label>
            <Select value={memberId} onValueChange={setMemberId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a member" />
              </SelectTrigger>
              <SelectContent>
                {mockMembers.map(member => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Class Details</label>
            <div className="rounded-md bg-accent/20 p-3 text-sm">
              <p><strong>Start:</strong> {new Date(gymClass.startTime).toLocaleString()}</p>
              <p><strong>End:</strong> {new Date(gymClass.endTime).toLocaleString()}</p>
              <p><strong>Availability:</strong> {gymClass.enrolled}/{gymClass.capacity} enrolled</p>
              <p><strong>Trainer:</strong> {gymClass.trainerName || (gymClass.trainer ? gymClass.trainer.name : "Not assigned")}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Notes (Optional)</label>
            <textarea 
              className="w-full rounded-md border p-2 min-h-[80px]"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special requirements or notes"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={loading || gymClass.enrolled >= gymClass.capacity}
          >
            {loading ? "Booking..." : "Confirm Booking"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ClassBookingForm;
