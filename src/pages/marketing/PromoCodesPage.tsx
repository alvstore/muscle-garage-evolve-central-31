
import React, { useState, useEffect } from 'react';
import { Container } from '@/components/ui/container';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@/components/ui/breadcrumb';
import { ChevronRight, Tag, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PromoCodeList from '@/components/marketing/PromoCodeList';
import PromoCodeForm from '@/components/marketing/PromoCodeForm';
import { promoCodeService } from '@/services/promoCodeService';
import { PromoCode } from '@/types/marketing';
import { useToast } from "@/hooks/ui/use-toast";
import { Dialog, DialogContent } from '@/components/ui/dialog';

const PromoCodesPage = () => {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPromoCode, setEditingPromoCode] = useState<PromoCode | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    fetchPromoCodes();
  }, []);
  
  const fetchPromoCodes = async () => {
    setIsLoading(true);
    const data = await promoCodeService.getPromoCodes();
    setPromoCodes(data);
    setIsLoading(false);
  };
  
  const handleAddNew = () => {
    setEditingPromoCode(null);
    setIsFormOpen(true);
  };
  
  const handleEdit = (promoCode: PromoCode) => {
    setEditingPromoCode(promoCode);
    setIsFormOpen(true);
  };
  
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this promo code?")) {
      const success = await promoCodeService.deletePromoCode(id);
      if (success) {
        // Refresh the list
        fetchPromoCodes();
      }
    }
  };
  
  const handleFormSubmit = () => {
    setIsFormOpen(false);
    fetchPromoCodes();
  };
  
  return (
    <Container>
      <Breadcrumb className="mb-4">
        <BreadcrumbItem>
          <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <ChevronRight className="h-4 w-4" />
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="/marketing">Marketing</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <ChevronRight className="h-4 w-4" />
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="/marketing/promo-codes" isCurrentPage>
            Promo Codes
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Promotional Codes</h1>
          <p className="text-muted-foreground">
            Create and manage promotional codes for discounts and special offers
          </p>
        </div>
        <Button onClick={handleAddNew} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Create Promo Code
        </Button>
      </div>

      <PromoCodeList 
        promoCodes={promoCodes} 
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRefresh={fetchPromoCodes}
        onAddNew={handleAddNew}
      />
      
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <PromoCodeForm 
            promoCode={editingPromoCode} 
            onSubmit={handleFormSubmit} 
            onCancel={() => setIsFormOpen(false)} 
          />
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default PromoCodesPage;
