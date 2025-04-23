
import React from 'react';
import { Container } from '@/components/ui/container';
import { DietPlanList } from '@/components/fitness';

const DietPlanPage = () => {
  return (
    <Container>
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-6">Diet Plans</h1>
        <div className="bg-card rounded-lg shadow p-6">
          <DietPlanList />
        </div>
      </div>
    </Container>
  );
};

export default DietPlanPage;
