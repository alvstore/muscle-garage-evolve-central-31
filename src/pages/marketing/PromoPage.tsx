
import React, { useState } from 'react';
import { Container } from '@/components/ui/container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PromoCodeList from '@/components/marketing/PromoCodeList';
import PromoCodeForm from '@/components/marketing/PromoCodeForm';
import PromoCodeStats from '@/components/marketing/PromoCodeStats';
import { PromoCode } from '@/types/marketing';

const PromoPage = () => {
  const [activeTab, setActiveTab] = useState('list');
  const [editingPromo, setEditingPromo] = useState<PromoCode | null>(null);
  
  const handleEditPromo = (promo: PromoCode) => {
    setEditingPromo(promo);
    setActiveTab('add');
  };
  
  const handleAddPromo = () => {
    setEditingPromo(null);
    setActiveTab('add');
  };
  
  const handleComplete = () => {
    setActiveTab('list');
    setEditingPromo(null);
  };

  return (
    <Container>
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-6">Promotional Codes</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="list">Promo Codes</TabsTrigger>
            <TabsTrigger value="add">Add/Edit Promo</TabsTrigger>
            <TabsTrigger value="stats">Usage Statistics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list" className="mt-6">
            <PromoCodeList onEdit={handleEditPromo} onAddNew={handleAddPromo} />
          </TabsContent>
          
          <TabsContent value="add" className="mt-6">
            <PromoCodeForm promo={editingPromo} onComplete={handleComplete} />
          </TabsContent>
          
          <TabsContent value="stats" className="mt-6">
            <PromoCodeStats />
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
};

export default PromoPage;
