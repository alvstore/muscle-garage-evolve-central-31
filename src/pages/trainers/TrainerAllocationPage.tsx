
import React from 'react';
import { Container } from '@/components/ui/container';
import TrainerMemberAllocation from '@/components/trainers/TrainerMemberAllocation';
import { usePermissions } from '@/hooks/auth/use-permissions';

const TrainerAllocationPage = () => {
  const { userRole } = usePermissions();
  const isTrainerView = userRole === 'trainer';
  
  return (
    <Container>
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-6">
          {isTrainerView ? "My Assigned Members" : "Trainer-Member Allocation"}
        </h1>
        
        <TrainerMemberAllocation isTrainerView={isTrainerView} />
      </div>
    </Container>
  );
};

export default TrainerAllocationPage;
