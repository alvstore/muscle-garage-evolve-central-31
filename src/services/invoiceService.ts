
import { Invoice } from '@/types/finance';
import { supabase } from '@/integrations/supabase/client';

export class InvoiceService {
  static async createInvoice(invoiceData: Omit<Invoice, 'id' | 'created_at' | 'updated_at'>): Promise<Invoice | null> {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .insert([{
          member_id: invoiceData.member_id,
          amount: invoiceData.amount,
          status: invoiceData.status,
          due_date: invoiceData.due_date,
          issued_date: invoiceData.issued_date,
          paid_date: invoiceData.paid_date,
          payment_method: invoiceData.payment_method,
          items: invoiceData.items,
          razorpay_order_id: invoiceData.razorpay_order_id,
          razorpay_payment_id: invoiceData.razorpay_payment_id,
          notes: invoiceData.notes,
          description: invoiceData.description,
          branch_id: invoiceData.branch_id
        }])
        .select()
        .single();

      if (error) throw error;
      
      return data as Invoice;
    } catch (error) {
      console.error('Error creating invoice:', error);
      return null;
    }
  }

  static async getInvoices(branchId?: string): Promise<Invoice[]> {
    try {
      let query = supabase
        .from('invoices')
        .select('*, members(name)')
        .order('issued_date', { ascending: false });
        
      if (branchId) {
        query = query.eq('branch_id', branchId);
      }
      
      const { data, error } = await query;

      if (error) throw error;
      
      // Transform to Invoice type with memberName
      const invoices: Invoice[] = (data || []).map(item => ({
        ...item,
        memberName: item.members?.name || 'Unknown'
      }));
      
      return invoices;
    } catch (error) {
      console.error('Error fetching invoices:', error);
      return [];
    }
  }

  static async getInvoiceById(id: string): Promise<Invoice | null> {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*, members(name)')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      if (!data) return null;
      
      // Transform to Invoice type with memberName
      const invoice: Invoice = {
        ...data,
        memberName: data.members?.name || 'Unknown'
      };
      
      return invoice;
    } catch (error) {
      console.error('Error fetching invoice:', error);
      return null;
    }
  }

  static async updateInvoice(id: string, updates: Partial<Invoice>): Promise<boolean> {
    try {
      // Remove any UI-specific fields that don't exist in the database
      const { memberName, ...dbUpdates } = updates;
      
      const { error } = await supabase
        .from('invoices')
        .update(dbUpdates)
        .eq('id', id);

      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error updating invoice:', error);
      return false;
    }
  }

  static async deleteInvoice(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error deleting invoice:', error);
      return false;
    }
  }

  static async generateInvoicePdf(invoice: Invoice): Promise<Blob | null> {
    // This would typically connect to an API endpoint or use a PDF generation library
    // For now, just a stub function
    try {
      // Mock implementation - in a real app, implement PDF generation logic
      const pdfBlob = new Blob(['Invoice PDF content'], { type: 'application/pdf' });
      return pdfBlob;
    } catch (error) {
      console.error('Error generating PDF:', error);
      return null;
    }
  }

  static async sendInvoiceByEmail(invoiceId: string, email: string): Promise<boolean> {
    try {
      // In a real implementation, call a server function or API to send the email
      console.log(`Sending invoice ${invoiceId} to ${email}`);
      return true;
    } catch (error) {
      console.error('Error sending invoice:', error);
      return false;
    }
  }
}
