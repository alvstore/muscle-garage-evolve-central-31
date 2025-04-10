
import React, { useState } from 'react';
import { Container } from '@/components/ui/container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LeadsList from '@/components/crm/LeadsList';
import LeadForm from '@/components/crm/LeadForm';
import LeadImport from '@/components/crm/LeadImport';
import { Lead } from '@/types/crm';

const LeadsPage = () => {
  const [activeTab, setActiveTab] = useState('list');
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  
  const handleAddNew = () => {
    setEditingLead(null);
    setActiveTab('add');
  };
  
  const handleEdit = (lead: Lead) => {
    setEditingLead(lead);
    setActiveTab('add');
  };
  
  const handleComplete = () => {
    setActiveTab('list');
    setEditingLead(null);
  };

  return (
    <Container>
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-6">Lead Management</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="list">Leads List</TabsTrigger>
            <TabsTrigger value="add">Add/Edit Lead</TabsTrigger>
            <TabsTrigger value="import">Import Leads</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list" className="mt-6">
            <LeadsList onEdit={handleEdit} onAddNew={handleAddNew} />
          </TabsContent>
          
          <TabsContent value="add" className="mt-6">
            <LeadForm lead={editingLead} onComplete={handleComplete} />
          </TabsContent>
          
          <TabsContent value="import" className="mt-6">
            <LeadImport onComplete={handleComplete} />
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
};

export default LeadsPage;
