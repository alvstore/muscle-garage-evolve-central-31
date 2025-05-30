
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { InventoryItem } from '@/types/inventory';

export const inventoryService = {
  async getInventoryItems(branchId: string | undefined): Promise<InventoryItem[]> {
    try {
      if (!branchId) return [];
      
      const { data, error } = await supabase
        .from('inventory_items')
        .select('*')
        .eq('branch_id', branchId)
        .order('name', { ascending: true });

      if (error) throw error;
      return data as InventoryItem[];
    } catch (error: any) {
      console.error('Error fetching inventory items:', error);
      toast.error('Failed to load inventory items');
      return [];
    }
  },

  async createInventoryItem(item: Omit<InventoryItem, 'id'>): Promise<InventoryItem | null> {
    try {
      const { data, error } = await supabase
        .from('inventory_items')
        .insert([item])
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Inventory item created successfully');
      return data as InventoryItem;
    } catch (error: any) {
      console.error('Error creating inventory item:', error);
      toast.error(`Failed to create inventory item: ${error.message}`);
      return null;
    }
  },

  async updateInventoryItem(id: string, updates: Partial<InventoryItem>): Promise<InventoryItem | null> {
    try {
      const { data, error } = await supabase
        .from('inventory_items')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Inventory item updated successfully');
      return data as InventoryItem;
    } catch (error: any) {
      console.error('Error updating inventory item:', error);
      toast.error(`Failed to update inventory item: ${error.message}`);
      return null;
    }
  },

  async deleteInventoryItem(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('inventory_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Inventory item deleted successfully');
      return true;
    } catch (error: any) {
      console.error('Error deleting inventory item:', error);
      toast.error(`Failed to delete inventory item: ${error.message}`);
      return false;
    }
  },
  
  async getLowStockItems(branchId: string | undefined): Promise<InventoryItem[]> {
    try {
      if (!branchId) return [];
      
      const { data, error } = await supabase
        .from('inventory_items')
        .select('*')
        .eq('branch_id', branchId)
        .lt('quantity', supabase.rpc('coalesce_to_zero', { value: 'reorder_level' }))
        .order('name');

      if (error) throw error;
      return data as InventoryItem[];
    } catch (error: any) {
      console.error('Error fetching low stock items:', error);
      toast.error('Failed to load inventory alerts');
      return [];
    }
  }
};
