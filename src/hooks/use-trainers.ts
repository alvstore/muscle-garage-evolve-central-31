
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useBranch } from '@/hooks/use-branch';
import { toast } from 'sonner';
import { Trainer } from '@/types/trainer';

export const useTrainers = () => {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { currentBranch } = useBranch();

  const fetchTrainers = useCallback(async () => {
    if (!currentBranch?.id) {
      console.log('No branch selected, cannot fetch trainers');
      setTrainers([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'trainer')
        .eq('branch_id', currentBranch.id);
      
      if (error) {
        throw error;
      }
      
      if (data) {
        const formattedTrainers: Trainer[] = data.map(item => ({
          id: item.id,
          name: item.full_name || '',
          fullName: item.full_name,
          email: item.email,
          phone: item.phone,
          specializations: item.department ? [item.department] : [],
          specialization: item.department, // For backwards compatibility
          bio: item.bio || '',
          isAvailable: item.is_active !== false,
          branchId: item.branch_id,
          avatar: item.avatar_url,
          ratingValue: item.rating || 0,
          rating: item.rating || 0
        }));
        
        setTrainers(formattedTrainers);
      }
    } catch (err: any) {
      console.error('Error fetching trainers:', err);
      setError(err);
      toast.error('Failed to fetch trainers');
    } finally {
      setIsLoading(false);
    }
  }, [currentBranch?.id]);

  useEffect(() => {
    if (currentBranch?.id) {
      fetchTrainers();
    } else {
      // Clear trainers if no branch selected
      setTrainers([]);
      setIsLoading(false);
    }
  }, [fetchTrainers, currentBranch?.id]);

  // Create new trainer (this actually creates a profile with trainer role)
  const createTrainer = async (trainerData: { 
    email: string;
    password: string;
    name: string;
    phone?: string;
    specialization?: string;
    bio?: string;
  }): Promise<Trainer | null> => {
    try {
      setIsLoading(true);
      
      if (!currentBranch?.id) {
        toast.error('No branch selected');
        return null;
      }
      
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: trainerData.email,
        password: trainerData.password,
        options: {
          data: {
            full_name: trainerData.name,
            role: 'trainer'
          }
        }
      });
      
      if (authError) throw authError;
      if (!authData.user) throw new Error('Failed to create user');
      
      // Update profile with additional information
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: trainerData.name,
          role: 'trainer',
          branch_id: currentBranch.id,
          phone: trainerData.phone,
          department: trainerData.specialization,
          bio: trainerData.bio,
          is_active: true
        })
        .eq('id', authData.user.id);
      
      if (profileError) throw profileError;
      
      // Format the new trainer
      const newTrainer: Trainer = {
        id: authData.user.id,
        name: trainerData.name,
        fullName: trainerData.name,
        email: trainerData.email,
        phone: trainerData.phone,
        specializations: trainerData.specialization ? [trainerData.specialization] : [],
        specialization: trainerData.specialization,
        bio: trainerData.bio || '',
        isAvailable: true,
        branchId: currentBranch.id,
        avatar: null,
        ratingValue: 0,
        rating: 0
      };
      
      // Update local state
      setTrainers(prev => [...prev, newTrainer]);
      
      toast.success('Trainer created successfully');
      return newTrainer;
    } catch (err: any) {
      console.error('Error creating trainer:', err);
      toast.error('Failed to create trainer');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTrainer = async (id: string) => {
    try {
      setIsLoading(true);
      
      // First check if the trainer has any active assignments
      const { data: assignments, error: checkError } = await supabase
        .from('trainer_assignments')
        .select('id')
        .eq('trainer_id', id)
        .eq('is_active', true);
      
      if (checkError) throw checkError;
      
      if (assignments && assignments.length > 0) {
        toast.error('Cannot delete trainer with active member assignments');
        return false;
      }
      
      // Delete the trainer profile
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: false })
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setTrainers(prev => prev.filter(t => t.id !== id));
      
      toast.success('Trainer deleted successfully');
      return true;
    } catch (err: any) {
      console.error('Error deleting trainer:', err);
      toast.error(err.message || 'Failed to delete trainer');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateTrainer = async (id: string, updates: Partial<Trainer>): Promise<Trainer | null> => {
    try {
      setIsLoading(true);
      
      // Prepare profile updates
      const profileUpdates: any = {};
      if (updates.name) profileUpdates.full_name = updates.name;
      if (updates.email) profileUpdates.email = updates.email;
      if (updates.phone) profileUpdates.phone = updates.phone;
      if (updates.specialization) profileUpdates.department = updates.specialization;
      if (updates.bio) profileUpdates.bio = updates.bio;
      if (updates.isAvailable !== undefined) profileUpdates.is_active = updates.isAvailable;
      if (updates.rating !== undefined) profileUpdates.rating = updates.rating;
      
      // Don't allow branch ID changes to prevent cross-branch issues
      delete profileUpdates.branch_id;
      
      const { data, error } = await supabase
        .from('profiles')
        .update(profileUpdates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      // Update local state
      const updatedTrainer = {
        ...trainers.find(t => t.id === id),
        ...updates,
        fullName: updates.name || trainers.find(t => t.id === id)?.fullName || '',
        specializations: updates.specialization 
          ? [updates.specialization] 
          : trainers.find(t => t.id === id)?.specializations || []
      } as Trainer;
      
      setTrainers(prev => prev.map(t => t.id === id ? updatedTrainer : t));
      
      toast.success('Trainer updated successfully');
      return updatedTrainer;
    } catch (err: any) {
      console.error('Error updating trainer:', err);
      toast.error(err.message || 'Failed to update trainer');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    trainers,
    isLoading,
    error,
    fetchTrainers,
    refetch: fetchTrainers,
    deleteTrainer,
    createTrainer,
    updateTrainer
  };
};
