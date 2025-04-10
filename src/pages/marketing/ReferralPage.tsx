
import React, { useState } from 'react';
import { Container } from '@/components/ui/container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ReferralList from '@/components/marketing/ReferralList';
import ReferralProgramForm from '@/components/marketing/ReferralProgramForm';
import ReferralStats from '@/components/marketing/ReferralStats';
import { ReferralProgram } from '@/types/marketing';

const ReferralPage = () => {
  const [activeTab, setActiveTab] = useState('list');
  const [editingProgram, setEditingProgram] = useState<ReferralProgram | null>(null);
  
  const handleEditProgram = (program: ReferralProgram) => {
    setEditingProgram(program);
    setActiveTab('program');
  };
  
  const handleComplete = () => {
    setActiveTab('list');
    setEditingProgram(null);
  };

  return (
    <Container>
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-6">Referral Program</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="list">Referrals</TabsTrigger>
            <TabsTrigger value="program">Program Setup</TabsTrigger>
            <TabsTrigger value="stats">Performance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list" className="mt-6">
            <ReferralList />
          </TabsContent>
          
          <TabsContent value="program" className="mt-6">
            <ReferralProgramForm program={editingProgram} onComplete={handleComplete} />
          </TabsContent>
          
          <TabsContent value="stats" className="mt-6">
            <ReferralStats />
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
};

export default ReferralPage;
