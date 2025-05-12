import React from 'react';
import { Container } from '@/components/ui/container';
import CRMDashboard from '@/components/crm/CRMDashboard';

const DashboardPage = () => {
  return (
    <Container>
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-6">CRM Dashboard</h1>
        
        {/* Dashboard widgets will be shown from the CRMDashboard component */}
        
        <CRMDashboard />
      </div>
    </Container>
  );
};

export default DashboardPage;
