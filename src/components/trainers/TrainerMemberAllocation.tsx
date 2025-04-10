
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Member, Trainer } from '@/types';
import { toast } from 'sonner';

interface TrainerMemberAllocationProps {
  member: Member;
  trainers: Trainer[];
  onAllocationChange: (trainerId: string | undefined) => void;
  isTrainerView?: boolean;
}

const TrainerMemberAllocation: React.FC<TrainerMemberAllocationProps> = ({
  member,
  trainers,
  onAllocationChange,
  isTrainerView = false
}) => {
  const [selectedTrainerId, setSelectedTrainerId] = useState<string | undefined>(member.trainerId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get the current trainer object if there is one assigned
  const currentTrainer = trainers.find(trainer => trainer.id === selectedTrainerId);
  
  const handleTrainerChange = (trainerId: string) => {
    if (trainerId === 'none') {
      setSelectedTrainerId(undefined);
    } else {
      setSelectedTrainerId(trainerId);
    }
  };
  
  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // In a real app, this would be an API call to update the member's trainer
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onAllocationChange(selectedTrainerId);
      
      toast.success(`Trainer ${selectedTrainerId ? 'assigned' : 'removed'} successfully`);
    } catch (error) {
      console.error('Error updating trainer allocation:', error);
      toast.error('Failed to update trainer allocation');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Trainer Allocation</CardTitle>
          <CardDescription>
            {isTrainerView 
              ? "Manage your assigned members" 
              : "Assign a personal trainer to this member"}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-md font-semibold mb-2">Member Details</h3>
          <div className="grid grid-cols-2 gap-2 p-3 bg-muted rounded-md">
            <div>
              <p className="text-sm font-medium">Name</p>
              <p className="text-sm text-muted-foreground">{member.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Membership Status</p>
              <p className="text-sm text-muted-foreground capitalize">{member.membershipStatus}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Goal</p>
              <p className="text-sm text-muted-foreground">{member.goal || "Not specified"}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Branch</p>
              <p className="text-sm text-muted-foreground">{member.primaryBranchId}</p>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-md font-semibold mb-2">Assigned Trainer</h3>
          <div className="mb-4">
            <Select 
              value={selectedTrainerId || 'none'} 
              onValueChange={handleTrainerChange}
              disabled={isTrainerView}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a trainer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No trainer</SelectItem>
                {trainers.map(trainer => (
                  <SelectItem key={trainer.id} value={trainer.id}>
                    {trainer.name} ({trainer.specialization?.join(", ")})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {currentTrainer && (
          <div className="p-3 bg-muted rounded-md">
            <h4 className="text-sm font-semibold mb-2">Trainer Details</h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-sm font-medium">Specialization</p>
                <p className="text-sm text-muted-foreground">
                  {currentTrainer.specialization?.join(", ") || "Not specified"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Experience</p>
                <p className="text-sm text-muted-foreground">
                  {currentTrainer.experience} years
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Certifications</p>
                <p className="text-sm text-muted-foreground">
                  {currentTrainer.certifications?.join(", ") || "Not specified"}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {!isTrainerView && (
          <div className="flex justify-end">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Allocation"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TrainerMemberAllocation;
