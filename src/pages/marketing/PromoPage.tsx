
import React, { useState, useEffect } from 'react';
import { Container } from '@/components/ui/container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PromoCodeList from '@/components/marketing/PromoCodeList';
import PromoCodeForm from '@/components/marketing/PromoCodeForm';
import PromoCodeStats from '@/components/marketing/PromoCodeStats';
import { PromoCode } from '@/types/marketing';
import { useToast } from '@/hooks/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

const PromoPage = () => {
  const [activeTab, setActiveTab] = useState('list');
  const [editingPromo, setEditingPromo] = useState<PromoCode | null>(null);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    fetchPromoCodes();
  }, []);
  
  const fetchPromoCodes = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('promo_codes')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setPromoCodes(data || []);
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
    fetchPromoCodes();
  };
  
  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('promo_codes')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setPromoCodes(promoCodes.filter(code => code.id !== id));
      toast({
        title: 'Success',
        description: 'Promo code deleted successfully',
      });
    } catch (err) {
      console.error('Error deleting promo code:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete promo code',
        variant: 'destructive',
      });
    }
  };
  
  const handleRefresh = () => {
    setIsLoading(true);
    fetchPromoCodes();
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
