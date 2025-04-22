
import { supabase } from '@/services/supabaseClient';
import { Invoice, InvoiceItem, InvoiceStatus } from '@/types/finance';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

/**
 * Service for handling invoice-related operations
 */
export const invoiceService = {
  /**
   * Creates a new invoice
   */
  createInvoice: async (invoiceData: {
    memberId: string;
    memberName: string;
    amount: number;
    description: string;
    dueDate: Date;
    status: InvoiceStatus;
    items: Array<{
      description: string;
      quantity: number;
      unitPrice: number;
      amount: number;
    }>;
  }): Promise<Invoice | null> => {
    try {
      // In a real app, this would save to a database
      console.log('Creating invoice:', invoiceData);
      
      // Mock response
      return {
        id: uuidv4(),
        memberId: invoiceData.memberId,
        memberName: invoiceData.memberName,
        amount: invoiceData.amount,
        status: invoiceData.status,
        issuedDate: new Date().toISOString(),
        dueDate: invoiceData.dueDate.toISOString(),
        paidDate: invoiceData.status === 'paid' ? new Date().toISOString() : null,
        items: invoiceData.items.map(item => ({
          id: uuidv4(),
          name: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice
        }))
      };
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast.error('Failed to create invoice');
      return null;
    }
  },

  /**
   * Generates an invoice automatically when a membership plan is assigned to a member
   */
  generateInvoiceForMembership: async (
    memberId: string,
    memberName: string,
    planId: string,
    planName: string,
    planAmount: number,
    startDate: string,
    createdBy: string,
    branchId: string
  ): Promise<Invoice | null> => {
    try {
      // Create invoice items
      const invoiceItems: InvoiceItem[] = [
        {
          id: uuidv4(),
          name: planName,
          quantity: 1,
          unitPrice: planAmount,
        }
      ];

      // Set due date to 7 days from today
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 7);

      // Create the invoice
      const newInvoice: Omit<Invoice, 'id'> = {
        memberId,
        memberName,
        amount: planAmount,
        status: 'pending',
        dueDate: dueDate.toISOString(),
        issuedDate: new Date().toISOString(),
        items: invoiceItems,
        branchId,
        membershipPlanId: planId,
        paidDate: null,
      };

      // Save to database
      const { data, error } = await supabase
        .from('invoices')
        .insert(newInvoice)
        .select('*')
        .single();

      if (error) {
        throw error;
      }

      // Create transaction record for finance tracking
      await supabase
        .from('transactions')
        .insert({
          type: 'income',
          amount: planAmount,
          transaction_date: new Date().toISOString(),
          category_id: null, // Use appropriate category ID if available
          description: `Invoice generated for ${planName}`,
          reference_id: data.id,
          branch_id: branchId,
          recorded_by: createdBy,
          payment_method: null, // Will be updated when payment is recorded
        });

      console.log('Invoice generated successfully:', data);
      return data as Invoice;
    } catch (error) {
      console.error('Error generating invoice:', error);
      toast.error('Failed to generate invoice');
      return null;
    }
  },

  /**
   * Records payment for an invoice
   */
  recordPayment: async (
    invoiceId: string,
    amount: number,
    paymentMethod: string,
    recordedBy: string,
    branchId: string
  ): Promise<boolean> => {
    try {
      // Get current invoice details
      const { data: invoice, error: fetchError } = await supabase
        .from('invoices')
        .select('*')
        .eq('id', invoiceId)
        .single();

      if (fetchError || !invoice) {
        throw fetchError || new Error('Invoice not found');
      }

      // Calculate remaining amount
      const remainingAmount = invoice.amount - amount;
      let newStatus: 'paid' | 'partial' | 'pending' = 'pending';
      
      if (remainingAmount <= 0) {
        newStatus = 'paid';
      } else if (amount > 0) {
        newStatus = 'partial';
      }

      // Update invoice
      const { error: updateError } = await supabase
        .from('invoices')
        .update({
          status: newStatus,
          paidDate: newStatus === 'paid' ? new Date().toISOString() : null,
          paymentMethod: paymentMethod,
          // Add amount_paid field if it exists in your schema
        })
        .eq('id', invoiceId);

      if (updateError) {
        throw updateError;
      }

      // Record payment transaction
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          type: 'income',
          amount: amount,
          transaction_date: new Date().toISOString(),
          category_id: null, // Use appropriate category ID for membership payments
          description: `Payment received for invoice #${invoiceId}`,
          reference_id: invoiceId,
          branch_id: branchId,
          recorded_by: recordedBy,
          payment_method: paymentMethod,
        });

      if (transactionError) {
        throw transactionError;
      }

      // Update payment records
      const { error: paymentError } = await supabase
        .from('payments')
        .insert({
          member_id: invoice.memberId,
          membership_id: invoice.membershipPlanId,
          amount: amount,
          payment_date: new Date().toISOString(),
          branch_id: branchId,
          staff_id: recordedBy,
          status: 'completed',
          payment_method: paymentMethod,
          notes: `Payment for invoice #${invoiceId}`,
        });

      if (paymentError) {
        throw paymentError;
      }

      console.log('Payment recorded successfully');
      return true;
    } catch (error) {
      console.error('Error recording payment:', error);
      toast.error('Failed to record payment');
      return false;
    }
  },

  /**
   * Generates a payment link for online payments
   */
  generatePaymentLink: async (invoiceId: string): Promise<string | null> => {
    try {
      // In a real application, this would integrate with Razorpay or another payment gateway
      // For now, we'll return a mock payment link
      return `https://payment.example.com/${invoiceId}`;
    } catch (error) {
      console.error('Error generating payment link:', error);
      toast.error('Failed to generate payment link');
      return null;
    }
  }
};
