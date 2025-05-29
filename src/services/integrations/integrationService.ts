import { supabase } from '@/integrations/supabase/client';
import { IntegrationStatus } from '@/types/integrations';
import { toast } from 'sonner';

/**
 * Service for managing integration statuses and configurations
 */
export const integrationService = {
  /**
   * Get all integration statuses for a branch
   */
  getIntegrationStatuses: async (branchId: string): Promise<IntegrationStatus[]> => {
    try {
      const { data, error } = await supabase
        .from('integration_statuses')
        .select('*')
        .eq('branch_id', branchId);

      if (error) {
        console.error('Error fetching integration statuses:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getIntegrationStatuses:', error);
      toast.error('Failed to fetch integration statuses');
      return [];
    }
  },

  /**
   * Update an integration status
   */
  updateIntegrationStatus: async (
    id: string,
    updates: Partial<Omit<IntegrationStatus, 'id' | 'created_at' | 'updated_at'>>
  ): Promise<IntegrationStatus | null> => {
    try {
      const { data, error } = await supabase
        .from('integration_statuses')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating integration status:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in updateIntegrationStatus:', error);
      toast.error('Failed to update integration status');
      return null;
    }
  },

  /**
   * Create a new integration status
   */
  createIntegrationStatus: async (
    statusData: Omit<IntegrationStatus, 'id' | 'created_at' | 'updated_at'>
  ): Promise<IntegrationStatus | null> => {
    try {
      const { data, error } = await supabase
        .from('integration_statuses')
        .insert([statusData])
        .select()
        .single();

      if (error) {
        console.error('Error creating integration status:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in createIntegrationStatus:', error);
      toast.error('Failed to create integration status');
      return null;
    }
  },

  /**
   * Get or create an integration status
   */
  ensureIntegrationStatus: async (
    branchId: string,
    integrationKey: string,
    defaults: Partial<IntegrationStatus> = {}
  ): Promise<IntegrationStatus> => {
    // Try to get existing status
    const { data: existing } = await supabase
      .from('integration_statuses')
      .select('*')
      .eq('branch_id', branchId)
      .eq('integration_key', integrationKey)
      .maybeSingle();

    if (existing) {
      return existing;
    }

    // Create new status with defaults
    const newStatus: Omit<IntegrationStatus, 'id' | 'created_at' | 'updated_at'> = {
      branch_id: branchId,
      integration_key: integrationKey,
      name: defaults.name || integrationKey,
      description: defaults.description || `${integrationKey} integration`,
      status: 'inactive',
      config: {},
      icon: defaults.icon || null,
      ...defaults,
    };

    const created = await this.createIntegrationStatus(newStatus);
    if (!created) {
      throw new Error(`Failed to create integration status for ${integrationKey}`);
    }

    return created;
  },

  /**
   * Delete an integration status
   */
  deleteIntegrationStatus: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('integration_statuses')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting integration status:', error);
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteIntegrationStatus:', error);
      toast.error('Failed to delete integration status');
      return false;
    }
  },

  /**
   * Sync integration status with actual device status
   */
  syncIntegrationStatus: async (branchId: string, integrationKey: string): Promise<boolean> => {
    try {
      // Get current status
      const currentStatus = await this.ensureIntegrationStatus(branchId, integrationKey);
      
      // Here you would implement the actual sync logic with the device
      // This is a placeholder that simulates a successful sync
      const updatedStatus = {
        ...currentStatus,
        status: 'active',
        updated_at: new Date().toISOString(),
      };

      await this.updateIntegrationStatus(currentStatus.id, updatedStatus);
      return true;
    } catch (error) {
      console.error(`Error syncing ${integrationKey} status:`, error);
      return false;
    }
  },
};
