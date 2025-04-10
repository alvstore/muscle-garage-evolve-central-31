
import React from 'react';
import { Container } from '@/components/ui/container';
import FunnelBoard from '@/components/crm/FunnelBoard';

const FunnelPage = () => {
  return (
    <Container>
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-6">Lead Funnel System</h1>
        <FunnelBoard />
      </div>
    </Container>
  );
};

export default FunnelPage;
