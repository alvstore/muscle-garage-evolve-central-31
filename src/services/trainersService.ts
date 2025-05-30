
// Trainer service (temporary compatibility file)
import { supabase } from '@/integrations/supabase/client';

interface Trainer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  specialization?: string;
  branch_id?: string;
  is_active: boolean;
}

const trainersService = {
  async getTrainers(): Promise<Trainer[]> {
    try {
      const { data, error } = await supabase
        .from('trainers')
        .select(`
          id,
          specialization,
          is_active,
          profile:profiles(
            id,
            full_name,
            email,
            phone
          )
        `)
        .eq('is_active', true);

      if (error) throw error;

      return (data || []).map((trainer: any) => ({
        id: trainer.id,
        name: trainer.profile?.full_name || 'Unknown',
        email: trainer.profile?.email,
        phone: trainer.profile?.phone,
        specialization: trainer.specialization,
        is_active: trainer.is_active
      }));
    } catch (error) {
      console.error('Error fetching trainers:', error);
      return [];
    }
  }
};

export default trainersService;
