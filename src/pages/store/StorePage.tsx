
import React, { useState, useEffect } from 'react';
import { Container } from '@/components/ui/container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductList from '@/components/store/ProductList';
import ProductForm from '@/components/store/ProductForm';
import OrderList from '@/components/store/OrderList';
import POSSystem from '@/components/store/POSSystem';
import ProductCheckout from '@/components/store/ProductCheckout';
import { CartItem, Product } from '@/types/features/store/store';
import { useAuth } from '@/hooks/auth/use-auth';
import { ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

const StorePage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('products');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
  const isMember = user?.role === 'member';
  
  // Load cart from localStorage on init
  useEffect(() => {
    const savedCart = localStorage.getItem('muscleGarageCart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart data:', e);
      }
    }
  }, []);

  // Save cart to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('muscleGarageCart', JSON.stringify(cartItems));
  }, [cartItems]);
  
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

  const handleAddToCart = (product: Product, quantity: number = 1) => {
    setCartItems(prev => {
      // Check if product already in cart
      const existing = prev.find(item => item.productId === product.id);
      
      if (existing) {
        // Update quantity if already in cart
        return prev.map(item => 
          item.productId === product.id 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      } else {
        // Add new item to cart
        return [...prev, {
          productId: product.id,
          product,
          quantity,
          price: product.salePrice || product.price
        }];
      }
    });
    
    toast.success(`${product.name} added to cart`);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    setCartItems(prev => 
      prev.map(item => 
        item.productId === productId 
          ? { ...item, quantity } 
          : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.productId !== productId));
  };

  const handleCheckout = () => {
    // In a real app, this would process the order and save it to the database
    setCartItems([]);
  };
  
  return (
    <Container>
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-6">
          {isMember ? "Shop Products" : "Store Management"}
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
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
                  onAddToCart={handleAddToCart}
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
          
          <div>
            <ProductCheckout 
              cartItems={cartItems}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              onCheckout={handleCheckout}
            />
          </div>
        </div>
      </div>
    </Container>
  );
};

export default StorePage;
