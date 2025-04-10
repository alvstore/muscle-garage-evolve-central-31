
import React, { useState } from 'react';
import { Container } from '@/components/ui/container';
import TrainerMemberAllocation from '@/components/trainers/TrainerMemberAllocation';
import { usePermissions } from '@/hooks/use-permissions';
import { Member, Trainer } from '@/types';

// Mock data for the example
const mockMember: Member = {
  id: "member-1",
  email: "john@example.com",
  name: "John Doe",
  role: "member",
  membershipStatus: "active",
  primaryBranchId: "branch-1"  // This is now a valid property on Member
};

const mockTrainers: Trainer[] = [
  {
    id: "trainer-1",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "trainer",
    specialization: ["Cardio", "Yoga"],
    experience: 5,
    certifications: ["ACE", "NASM"]
  },
  {
    id: "trainer-2",
    name: "Mike Johnson",
    email: "mike@example.com",
    role: "trainer",
    specialization: ["Strength", "Bodybuilding"],
    experience: 8,
    certifications: ["ISSA", "NSCA"]
  }
];

const TrainerAllocationPage = () => {
  const { userRole } = usePermissions();
  const isTrainerView = userRole === 'trainer';
  const [selectedTrainerId, setSelectedTrainerId] = useState<string | undefined>(mockMember.trainerId);
  
  const handleAllocationChange = (trainerId: string | undefined) => {
    setSelectedTrainerId(trainerId);
    console.log("Trainer changed to:", trainerId);
  };
  
  return (
    <Container>
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-6">Trainer-Member Allocation</h1>
        
        <TrainerMemberAllocation 
          member={mockMember} 
          trainers={mockTrainers} 
          onAllocationChange={handleAllocationChange}
          isTrainerView={isTrainerView} 
        />
      </div>
    </Container>
  );
};

export default TrainerAllocationPage;
