
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface StoreProduct {
  id: string;
  name: string;
  sku: string;
  description?: string;
  category: string;
  price: number;
  sale_price?: number;
  stock: number;
  status: string;
  branch_id?: string;
  featured?: boolean;
  images?: string[];
  brand?: string;
  barcode?: string;
  features?: string[];
  created_at?: string;
  updated_at?: string;
  inventory_id?: string;
}

export const storeService = {
  async getProducts(branchId: string | undefined): Promise<StoreProduct[]> {
    try {
      if (!branchId) {
        console.warn('No branch ID provided for getProducts');
        return [];
      }
      
      const { data, error } = await supabase
        .from('store_products')
        .select('*')
        .eq('branch_id', branchId)
        .order('name');

      if (error) {
        console.error('Supabase error fetching products:', error);
        toast.error('Failed to load products');
        return [];
      }
      
      return data as StoreProduct[];
    } catch (error: any) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
      return [];
    }
  },
  
  async createProduct(product: Omit<StoreProduct, 'id' | 'created_at' | 'updated_at'>): Promise<StoreProduct | null> {
    try {
      if (!product.branch_id) {
        toast.error('Branch ID is required to create a product');
        return null;
      }
      
      const { data, error } = await supabase
        .from('store_products')
        .insert([product])
        .select()
        .single();

      if (error) {
        console.error('Error creating product:', error);
        toast.error(`Failed to create product: ${error.message}`);
        return null;
      }
      
      toast.success('Product created successfully');
      return data as StoreProduct;
    } catch (error: any) {
      console.error('Error creating product:', error);
      toast.error(`Failed to create product: ${error.message}`);
      return null;
    }
  },
  
  async updateProduct(id: string, updates: Partial<StoreProduct>): Promise<StoreProduct | null> {
    try {
      const { data, error } = await supabase
        .from('store_products')
        .update({...updates, updated_at: new Date().toISOString()})
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating product:', error);
        toast.error(`Failed to update product: ${error.message}`);
        return null;
      }
      
      toast.success('Product updated successfully');
      return data as StoreProduct;
    } catch (error: any) {
      console.error('Error updating product:', error);
      toast.error(`Failed to update product: ${error.message}`);
      return null;
    }
  },
  
  async deleteProduct(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('store_products')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting product:', error);
        toast.error(`Failed to delete product: ${error.message}`);
        return false;
      }
      
      toast.success('Product deleted successfully');
      return true;
    } catch (error: any) {
      console.error('Error deleting product:', error);
      toast.error(`Failed to delete product: ${error.message}`);
      return false;
    }
  }
};
