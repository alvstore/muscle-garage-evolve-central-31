
import React, { useState, useEffect } from 'react';
import { Container } from '@/components/ui/container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PromoCodeList from '@/components/marketing/PromoCodeList';
import PromoCodeForm from '@/components/marketing/PromoCodeForm';
import PromoCodeStats from '@/components/marketing/PromoCodeStats';
import { PromoCode } from '@/types/marketing';
import { useToast } from '@/hooks/use-toast';

const PromoPage = () => {
  const [activeTab, setActiveTab] = useState('list');
  const [editingPromo, setEditingPromo] = useState<PromoCode | null>(null);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    // In a real implementation, this would fetch data from your API
    const fetchPromoCodes = async () => {
      try {
        // Mocked data for now
        setPromoCodes([
          {
            id: '1',
            code: 'SUMMER20',
            description: '20% off summer promotion',
            type: 'percentage',
            value: 20,
            status: 'active',
            start_date: '2023-05-01T00:00:00Z',
            end_date: '2023-08-31T23:59:59Z',
            usage_limit: 100,
            current_usage: 45,
            applicable_products: ['all'],
            applicable_memberships: ['all'],
            createdAt: '2023-04-15T10:30:00Z',
            updatedAt: '2023-04-15T10:30:00Z',
          }
        ]);
      } catch (err) {
        console.error('Error fetching promo codes:', err);
        toast({
          title: 'Error',
          description: 'Failed to load promotional codes',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPromoCodes();
  }, [toast]);
  
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
  
  const handleDelete = async (id: string) => {
    // In a real implementation, this would delete from your API
    setPromoCodes(promoCodes.filter(code => code.id !== id));
    toast({
      title: 'Success',
      description: 'Promo code deleted successfully',
    });
  };
  
  const handleRefresh = () => {
    setIsLoading(true);
    // In a real implementation, this would re-fetch from your API
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: 'Success',
        description: 'Promo codes refreshed',
      });
    }, 500);
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
            <PromoCodeList 
              promoCodes={promoCodes}
              isLoading={isLoading}
              onEdit={handleEditPromo}
              onDelete={handleDelete}
              onRefresh={handleRefresh}
              onAddNew={handleAddPromo}
            />
          </TabsContent>
          
          <TabsContent value="add" className="mt-6">
            <PromoCodeForm 
              promoCode={editingPromo} 
              onSubmit={handleComplete} 
              onCancel={handleComplete} 
            />
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
