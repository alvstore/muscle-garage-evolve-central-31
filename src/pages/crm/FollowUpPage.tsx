
import React, { useState } from 'react';
import { Container } from '@/components/ui/container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FollowUpTemplatesList from '@/components/crm/FollowUpTemplatesList';
import FollowUpSchedule from '@/components/crm/FollowUpSchedule';
import FollowUpHistory from '@/components/crm/FollowUpHistory';
import FollowUpTemplateForm from '@/components/crm/FollowUpTemplateForm';
import { FollowUpTemplate } from '@/types/crm';

const FollowUpPage = () => {
  const [activeTab, setActiveTab] = useState('templates');
  const [editingTemplate, setEditingTemplate] = useState<FollowUpTemplate | null>(null);
  
  const handleEditTemplate = (template: FollowUpTemplate) => {
    setEditingTemplate(template);
    setActiveTab('add');
  };
  
  const handleAddTemplate = () => {
    setEditingTemplate(null);
    setActiveTab('add');
  };
  
  const handleComplete = () => {
    setActiveTab('templates');
    setEditingTemplate(null);
  };

  return (
    <Container>
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-6">Follow-Up System</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="templates">Message Templates</TabsTrigger>
            <TabsTrigger value="add">Add/Edit Template</TabsTrigger>
            <TabsTrigger value="schedule">Follow-Up Schedule</TabsTrigger>
            <TabsTrigger value="history">Follow-Up History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="templates" className="mt-6">
            <FollowUpTemplatesList onEdit={handleEditTemplate} onAddNew={handleAddTemplate} />
          </TabsContent>
          
          <TabsContent value="add" className="mt-6">
            <FollowUpTemplateForm template={editingTemplate} onComplete={handleComplete} />
          </TabsContent>
          
          <TabsContent value="schedule" className="mt-6">
            <FollowUpSchedule />
          </TabsContent>
          
          <TabsContent value="history" className="mt-6">
            <FollowUpHistory />
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
};

export default FollowUpPage;
