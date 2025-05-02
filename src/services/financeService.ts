
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { FinancialTransaction } from '@/types/finance';

export const financeService = {
  // Get all income records with optional filters
  async getIncomeRecords(
    branchId?: string,
    startDate?: string,
    endDate?: string,
    category?: string
  ): Promise<FinancialTransaction[]> {
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
      
      // Transform to match FinancialTransaction
      const records = data.map(record => ({
        id: record.id,
        type: 'income' as const,
        amount: record.amount,
        description: record.description || '',
        transaction_date: record.date,
        payment_method: record.payment_method,
        source: record.source,
        reference: record.reference,
        reference_id: record.reference,
        category: record.category,
        recurring: false,
        recurring_period: null,
        transaction_id: null,
        branch_id: record.branch_id
      }));
      
      return records;
    } catch (error) {
      console.error('Error fetching income records:', error);
      toast.error('Failed to fetch income records');
      throw error;
    }
  },

  // Create a new income record
  async createIncomeRecord(record: Partial<FinancialTransaction>): Promise<Partial<FinancialTransaction>> {
    try {
      // Transform from FinancialTransaction to income_records schema
      const recordToInsert = {
        date: record.transaction_date || new Date().toISOString(),
        amount: record.amount,
        description: record.description,
        source: record.source,
        payment_method: record.payment_method,
        reference: record.reference || record.reference_id,
        category: record.category,
        branch_id: record.branch_id
      };

      const { data, error } = await supabase
        .from('income_records')
        .insert([recordToInsert])
        .select()
        .single();

      if (error) throw error;
      
      // Transform back to FinancialTransaction format
      const transformedRecord: Partial<FinancialTransaction> = {
        id: data.id,
        type: 'income',
        amount: data.amount,
        description: data.description,
        transaction_date: data.date,
        payment_method: data.payment_method,
        source: data.source,
        reference: data.reference,
        reference_id: data.reference,
        category: data.category,
        recurring: false,
        recurring_period: null,
        branch_id: data.branch_id
      };
      
      return transformedRecord;
    } catch (error) {
      console.error('Error creating income record:', error);
      toast.error('Failed to create income record');
      throw error;
    }
  },

  // Update an existing income record
  async updateIncomeRecord(id: string, updates: Partial<FinancialTransaction>): Promise<Partial<FinancialTransaction>> {
    try {
      // Transform from FinancialTransaction to income_records schema
      const recordToUpdate = {
        date: updates.transaction_date,
        amount: updates.amount,
        description: updates.description,
        source: updates.source,
        payment_method: updates.payment_method,
        reference: updates.reference || updates.reference_id,
        category: updates.category,
        branch_id: updates.branch_id
      };

      const { data, error } = await supabase
        .from('income_records')
        .update(recordToUpdate)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      // Transform back to FinancialTransaction format
      const transformedRecord: Partial<FinancialTransaction> = {
        id: data.id,
        type: 'income',
        amount: data.amount,
        description: data.description,
        transaction_date: data.date,
        payment_method: data.payment_method,
        source: data.source,
        reference: data.reference,
        reference_id: data.reference,
        category: data.category,
        recurring: false,
        recurring_period: null,
        branch_id: data.branch_id
      };
      
      return transformedRecord;
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
      await this.updateIncomeRecord(recordId, { attachment: undefined });
    } catch (error) {
      console.error('Error deleting attachment:', error);
      toast.error('Failed to delete attachment');
      throw error;
    }
  }
};
