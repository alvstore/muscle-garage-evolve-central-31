
import { Invoice } from '@/types/finance';
import { supabase } from '@/integrations/supabase/client';

export class InvoiceService {
  /**
   * Fetches all invoices with optional filters
   */
  static async getInvoices(filters: {
    status?: string;
    memberId?: string;
    startDate?: string;
    endDate?: string;
  } = {}): Promise<Invoice[]> {
    try {
      let query = supabase
        .from('invoices')
        .select(`
          *,
          members (
            name,
            email,
            phone,
            profile_picture
          ),
          membership_plans (
            name,
            description,
            duration_days
          )
        `);

      // Apply filters
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.memberId) {
        query = query.eq('member_id', filters.memberId);
      }
      if (filters.startDate) {
        query = query.gte('created_at', filters.startDate);
      }
      if (filters.endDate) {
        query = query.lte('created_at', filters.endDate);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      // Transform the data to flatten member and plan data
      return (data || []).map(invoice => ({
        ...invoice,
        member_name: invoice.members?.name,
        member_email: invoice.members?.email,
        member_phone: invoice.members?.phone,
        member_avatar: invoice.members?.profile_picture,
        plan_name: invoice.membership_plans?.name,
        plan_description: invoice.membership_plans?.description,
      }));
    } catch (error) {
      console.error('Error fetching invoices:', error);
      throw error;
    }
  }

  /**
   * Fetches a single invoice by ID
   */
  static async getInvoiceById(id: string): Promise<Invoice | null> {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          members (
            name,
            email,
            phone,
            profile_picture
          ),
          membership_plans (
            name,
            description,
            duration_days
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) return null;

      // Transform the data to flatten member and plan data
      return {
        ...data,
        member_name: data.members?.name,
        member_email: data.members?.email,
        member_phone: data.members?.phone,
        member_avatar: data.members?.profile_picture,
        plan_name: data.membership_plans?.name,
        plan_description: data.membership_plans?.description,
      };
    } catch (error) {
      console.error('Error fetching invoice:', error);
      throw error;
    }
  }

  /**
   * Creates a new invoice
   */
  static async createInvoice(invoiceData: Omit<Invoice, 'id' | 'created_at' | 'updated_at'>): Promise<Invoice> {
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
      return data;
    } catch (error) {
      console.error('Error creating invoice:', error);
      throw error;
    }
  }

  /**
   * Updates an existing invoice
   */
  static async updateInvoice(id: string, updates: Partial<Invoice>): Promise<Invoice> {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating invoice:', error);
      throw error;
    }
  }

  /**
   * Deletes an invoice
   */
  static async deleteInvoice(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting invoice:', error);
      throw error;
    }
  }

  /**
   * Gets all invoices for a specific member
   */
  static async getInvoicesByMember(memberId: string): Promise<Invoice[]> {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('member_id', memberId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching member invoices:', error);
      throw error;
    }
  }

  /**
   * Sends an invoice by email
   */
  static async sendInvoiceByEmail(invoiceId: string, email: string): Promise<boolean> {
    try {
      // In a real implementation, call a server function or API to send the email
      console.log(`Sending invoice ${invoiceId} to ${email}`);
      return true;
    } catch (error) {
      console.error('Error sending invoice email:', error);
      return false;
    }
  }

  /**
   * Downloads an invoice as PDF
   */
  static async downloadInvoicePdf(invoiceId: string): Promise<Blob | null> {
    try {
      const invoice = await this.getInvoiceById(invoiceId);
      if (!invoice) throw new Error('Invoice not found');
      
      // Generate PDF (this would be implemented with a PDF generation library)
      const pdfBlob = await this.generateInvoicePdf(invoice);
      
      if (!pdfBlob) throw new Error('Failed to generate PDF');
      
      // Create download link
      const url = window.URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${invoiceId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      
      return pdfBlob;
    } catch (error) {
      console.error('Error downloading invoice PDF:', error);
      return null;
    }
  }

  /**
   * Generates a PDF for an invoice
   */
  private static async generateInvoicePdf(invoice: Invoice): Promise<Blob | null> {
    // This would typically connect to an API endpoint or use a PDF generation library
    // For now, just a stub function
    try {
      // Mock implementation - in a real app, implement PDF generation logic
      return new Blob([JSON.stringify(invoice, null, 2)], { type: 'application/pdf' });
    } catch (error) {
      console.error('Error generating PDF:', error);
      return null;
    }
  }
}
