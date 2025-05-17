
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { Invoice, InvoiceItem } from '@/types/finance';

export class InvoiceService {
  static async createInvoiceForMembership(data: {
    memberId: string;
    membershipId: string;
    amount: number;
    dueDate: Date;
    description?: string;
    items?: InvoiceItem[];
  }): Promise<Invoice | null> {
    try {
      const { memberId, membershipId, amount, dueDate, description, items = [] } = data;
      
      const invoiceData = {
        id: uuidv4(),
        member_id: memberId,
        membership_plan_id: membershipId,
        amount,
        status: 'pending',
        issued_date: new Date().toISOString(),
        due_date: dueDate.toISOString(),
        description: description || 'Membership fee',
        items: JSON.stringify(items.length ? items : [
          {
            id: uuidv4(),
            name: 'Membership fee',
            description: 'Standard membership subscription',
            quantity: 1,
            price: amount
          }
        ])
      };
      
      const { data: invoice, error } = await supabase
        .from('invoices')
        .insert([invoiceData])
        .select()
        .single();
        
      if (error) {
        console.error('Error creating invoice:', error);
        return null;
      }
      
      return invoice as unknown as Invoice;
    } catch (error) {
      console.error('Error in createInvoiceForMembership:', error);
      return null;
    }
  }
  
  static async getInvoicesForMember(memberId: string): Promise<Invoice[]> {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('member_id', memberId)
      .order('issued_date', { ascending: false });
      
    if (error) {
      console.error('Error fetching invoices:', error);
      return [];
    }
    
    return data as unknown as Invoice[];
  }
}

