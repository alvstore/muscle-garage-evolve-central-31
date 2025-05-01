import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface IncomeRecord {
  id: string;
  date: string;
  amount: number;
  category: string;
  description: string;
  source: string;
  paymentMethod: string;
  reference: string;
  attachment?: string;
  branch_id: string;
  created_at?: string;
  updated_at?: string;
}

export const financeService = {
  // Get all income records with optional filters
  async getIncomeRecords(
    branchId?: string,
    startDate?: string,
    endDate?: string,
    category?: string
  ): Promise<IncomeRecord[]> {
    try {
      let query = supabase
        .from('income_records')
        .select('*')
        .order('date', { ascending: false });

      if (branchId) {
        query = query.eq('branch_id', branchId);
      }

      if (startDate) {
        query = query.gte('date', startDate);
      }

      if (endDate) {
        query = query.lte('date', endDate);
      }

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching income records:', error);
      toast.error('Failed to fetch income records');
      throw error;
    }
  },

  // Create a new income record
  async createIncomeRecord(record: Omit<IncomeRecord, 'id'>): Promise<IncomeRecord> {
    try {
      const { data, error } = await supabase
        .from('income_records')
        .insert([record])
        .select()
        .single();

      if (error) throw error;
      return data as IncomeRecord;
    } catch (error) {
      console.error('Error creating income record:', error);
      toast.error('Failed to create income record');
      throw error;
    }
  },

  // Update an existing income record
  async updateIncomeRecord(id: string, updates: Partial<IncomeRecord>): Promise<IncomeRecord> {
    try {
      const { data, error } = await supabase
        .from('income_records')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as IncomeRecord;
    } catch (error) {
      console.error('Error updating income record:', error);
      toast.error('Failed to update income record');
      throw error;
    }
  },

  // Delete an income record
  async deleteIncomeRecord(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('income_records')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting income record:', error);
      toast.error('Failed to delete income record');
      throw error;
    }
  },

  // Upload attachment for income record
  async uploadAttachment(file: File, recordId: string): Promise<string> {
    try {
      const fileName = `${recordId}-${Date.now()}-${file.name}`;
      const filePath = `income_attachments/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('attachments')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('attachments')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading attachment:', error);
      toast.error('Failed to upload attachment');
      throw error;
    }
  },

  // Delete attachment
  async deleteAttachment(recordId: string): Promise<void> {
    try {
      // First get the attachment path
      const { data: record, error: fetchError } = await supabase
        .from('income_records')
        .select('attachment')
        .eq('id', recordId)
        .single();

      if (fetchError) throw fetchError;
      if (!record?.attachment) return;

      // Extract the file path from the URL
      const filePath = record.attachment.split('/').slice(3).join('/');

      // Delete from storage
      const { error: deleteError } = await supabase.storage
        .from('attachments')
        .remove([filePath]);

      if (deleteError) throw deleteError;

      // Update the record to remove attachment reference
      await financeService.updateIncomeRecord(recordId, { attachment: null });
    } catch (error) {
      console.error('Error deleting attachment:', error);
      toast.error('Failed to delete attachment');
      throw error;
    }
  }
};
