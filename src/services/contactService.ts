
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  tags?: string[];
  last_contact?: string;
  source?: string;
  branch_id?: string;
  created_at?: string;
  updated_at?: string;
  notes?: string;
}

export const contactService = {
  async getContacts(branchId: string | undefined): Promise<Contact[]> {
    try {
      if (!branchId) {
        console.warn('No branch ID provided for getContacts');
        return [];
      }
      
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('branch_id', branchId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error fetching contacts:', error);
        toast.error('Failed to load contacts');
        return [];
      }
      
      return data as Contact[];
    } catch (error: any) {
      console.error('Error fetching contacts:', error);
      toast.error('Failed to load contacts');
      return [];
    }
  },
  
  async createContact(contact: Omit<Contact, 'id' | 'created_at' | 'updated_at'>): Promise<Contact | null> {
    try {
      if (!contact.branch_id) {
        toast.error('Branch ID is required to create a contact');
        return null;
      }
      
      const { data, error } = await supabase
        .from('contacts')
        .insert([contact])
        .select()
        .single();

      if (error) {
        console.error('Error creating contact:', error);
        toast.error(`Failed to create contact: ${error.message}`);
        return null;
      }
      
      toast.success('Contact created successfully');
      return data as Contact;
    } catch (error: any) {
      console.error('Error creating contact:', error);
      toast.error(`Failed to create contact: ${error.message}`);
      return null;
    }
  },
  
  async updateContact(id: string, updates: Partial<Contact>): Promise<Contact | null> {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .update({...updates, updated_at: new Date().toISOString()})
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating contact:', error);
        toast.error(`Failed to update contact: ${error.message}`);
        return null;
      }
      
      toast.success('Contact updated successfully');
      return data as Contact;
    } catch (error: any) {
      console.error('Error updating contact:', error);
      toast.error(`Failed to update contact: ${error.message}`);
      return null;
    }
  },
  
  async deleteContact(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting contact:', error);
        toast.error(`Failed to delete contact: ${error.message}`);
        return false;
      }
      
      toast.success('Contact deleted successfully');
      return true;
    } catch (error: any) {
      console.error('Error deleting contact:', error);
      toast.error(`Failed to delete contact: ${error.message}`);
      return false;
    }
  }
};
