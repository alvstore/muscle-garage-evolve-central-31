
import React from 'react';
import { Container } from '@/components/ui/container';

const WorkoutPlanPage = () => {
  return (
    <Container>
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-6">Workout Plans</h1>
        <div className="bg-card rounded-lg shadow p-6">
          <p>Create and manage workout plans for members</p>
        </div>
      </div>
    </Container>
  );
};

export default WorkoutPlanPage;
