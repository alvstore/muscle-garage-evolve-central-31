
import React, { useState } from 'react';
import { Container } from '@/components/ui/container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductList from '@/components/store/ProductList';
import ProductForm from '@/components/store/ProductForm';
import OrderList from '@/components/store/OrderList';
import POSSystem from '@/components/store/POSSystem';
import { Product } from '@/types/store';

const StorePage = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setActiveTab('add');
  };
  
  const handleAddProduct = () => {
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
        <h1 className="text-2xl font-bold mb-6">Store Management</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="add">Add/Edit Product</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="pos">Point of Sale</TabsTrigger>
          </TabsList>
          
          <TabsContent value="products" className="mt-6">
            <ProductList onEdit={handleEditProduct} onAddNew={handleAddProduct} />
          </TabsContent>
          
          <TabsContent value="add" className="mt-6">
            <ProductForm product={editingProduct} onComplete={handleComplete} />
          </TabsContent>
          
          <TabsContent value="orders" className="mt-6">
            <OrderList />
          </TabsContent>
          
          <TabsContent value="pos" className="mt-6">
            <POSSystem />
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
};

export default StorePage;
