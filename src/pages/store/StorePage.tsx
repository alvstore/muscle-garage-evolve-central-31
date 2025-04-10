
import React, { useState } from 'react';
import { Container } from '@/components/ui/container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductList from '@/components/store/ProductList';
import ProductForm from '@/components/store/ProductForm';
import OrderList from '@/components/store/OrderList';
import POSSystem from '@/components/store/POSSystem';
import { Product } from '@/types/store';
import { useAuth } from '@/hooks/use-auth';

const StorePage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('products');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const isMember = user?.role === 'member';
  
  const handleEditProduct = (product: Product) => {
    if (isMember) return; // Prevent members from editing
    setEditingProduct(product);
    setActiveTab('add');
  };
  
  const handleAddProduct = () => {
    if (isMember) return; // Prevent members from adding
    setEditingProduct(null);
    setActiveTab('add');
  };
  
  const handleComplete = () => {
    setActiveTab('products');
    setEditingProduct(null);
  };

  return (
    <Container>
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-6">
          {isMember ? "Shop Products" : "Store Management"}
        </h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="products">Products</TabsTrigger>
            {!isMember && (
              <TabsTrigger value="add">Add/Edit Product</TabsTrigger>
            )}
            {!isMember && (
              <TabsTrigger value="orders">Orders</TabsTrigger>
            )}
            {!isMember && (
              <TabsTrigger value="pos">Point of Sale</TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="products" className="mt-6">
            <ProductList 
              onEdit={handleEditProduct} 
              onAddNew={handleAddProduct}
              isMemberView={isMember}
            />
          </TabsContent>
          
          {!isMember && (
            <TabsContent value="add" className="mt-6">
              <ProductForm product={editingProduct} onComplete={handleComplete} />
            </TabsContent>
          )}
          
          {!isMember && (
            <TabsContent value="orders" className="mt-6">
              <OrderList />
            </TabsContent>
          )}
          
          {!isMember && (
            <TabsContent value="pos" className="mt-6">
              <POSSystem />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </Container>
  );
};

export default StorePage;
