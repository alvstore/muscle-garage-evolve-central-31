
import React from 'react';
import { Container } from '@/components/ui/container';

const MemberProgressPage = () => {
  return (
    <Container>
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-6">Member Progress</h1>
        <div className="bg-card rounded-lg shadow p-6">
          <p>Track and manage member fitness progress</p>
        </div>
      </div>
    </Container>
  );
};

export default MemberProgressPage;
