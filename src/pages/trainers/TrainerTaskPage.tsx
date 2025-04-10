
import React from 'react';
import TrainerTaskManagement from '@/components/trainers/TrainerTaskManagement';

const TrainerTaskPage = () => {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Task Management</h1>
      <TrainerTaskManagement />
    </div>
  );
};

export default TrainerTaskPage;
