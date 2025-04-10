
import React from 'react';
import { Container } from '@/components/ui/container';
import TrainerNotifications from '@/components/trainers/TrainerNotifications';

const TrainerNotificationsPage = () => {
  return (
    <Container>
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-6">My Notifications</h1>
        <TrainerNotifications />
      </div>
    </Container>
  );
};

export default TrainerNotificationsPage;
