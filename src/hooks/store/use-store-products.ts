
import { useState, useEffect } from 'react';
import { useBranch } from '@/hooks/settings/use-branches';
import { storeService, StoreProduct } from '@/services/store/storeService';
import { toast } from 'sonner';

export const useStoreProducts = () => {
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentBranch } = useBranch();

  const fetchProducts = async () => {
    if (!currentBranch?.id) {
      setProducts([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await storeService.getProducts(currentBranch.id);
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products');
      toast.error('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  const addProduct = async (product: Omit<StoreProduct, 'id' | 'created_at' | 'updated_at'>) => {
    if (!currentBranch?.id) {
      toast.error('No branch selected');
      return null;
    }
    
    const productWithBranch = {
      ...product,
      branch_id: currentBranch.id
    };
    
    try {
      const newProduct = await storeService.createProduct(productWithBranch);
      if (newProduct) {
        setProducts(prev => [newProduct, ...prev]);
        toast.success('Product added successfully');
      }
      return newProduct;
    } catch (err) {
      console.error('Error adding product:', err);
      toast.error('Failed to add product');
      return null;
    }
  };

  const updateProduct = async (id: string, updates: Partial<StoreProduct>) => {
    try {
      const updatedProduct = await storeService.updateProduct(id, updates);
      if (updatedProduct) {
        setProducts(prev => prev.map(product => product.id === id ? updatedProduct : product));
        toast.success('Product updated successfully');
      }
      return updatedProduct;
    } catch (err) {
      console.error('Error updating product:', err);
      toast.error('Failed to update product');
      return null;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const success = await storeService.deleteProduct(id);
      if (success) {
        setProducts(prev => prev.filter(product => product.id !== id));
        toast.success('Product deleted successfully');
      }
      return success;
    } catch (err) {
      console.error('Error deleting product:', err);
      toast.error('Failed to delete product');
      return false;
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentBranch?.id]);

  return {
    products,
    isLoading,
    error,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct
  };
};
