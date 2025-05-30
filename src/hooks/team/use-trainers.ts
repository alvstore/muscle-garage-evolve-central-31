
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useBranch } from '@/hooks/settings/use-branches';
import { toast } from 'sonner';
import { 
  Trainer, 
  UserRole, 
  CreateUserInput, 
  UpdateUserInput, 
  CreateTrainerInput, 
  UpdateTrainerInput,
  User
} from '@/types/team/trainer';

interface UseTrainersReturn {
  trainers: Trainer[];
  isLoading: boolean;
  error: Error | null;
  fetchTrainers: () => Promise<{ data: Trainer[] | null; error: Error | null }>;
  createTrainer: (input: CreateTrainerInput & { password: string }) => Promise<{ data: Trainer | null; error: Error | null }>;
  updateTrainer: (id: string, updates: UpdateTrainerInput) => Promise<{ data: Trainer | null; error: Error | null }>;
  deleteTrainer: (id: string) => Promise<{ error: Error | null }>;
  refetch: () => Promise<{ data: Trainer[] | null; error: Error | null }>;
}

export const useTrainers = (): UseTrainersReturn => {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { currentBranch } = useBranch();

  // Fetch all trainers
  const fetchTrainers = useCallback(async () => {
    if (!currentBranch?.id) {
      console.log('No branch selected, cannot fetch trainers');
      setTrainers([]);
      setIsLoading(false);
      return { data: [], error: null };
    }

    try {
      setIsLoading(true);
      setError(null);
      
      // First, get all users with the 'trainer' role
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'trainer');
      
      if (rolesError) throw rolesError;
      
      if (!roles || roles.length === 0) {
        setTrainers([]);
        return { data: [], error: null };
      }
      
      // Get the user IDs from the roles
      const userIds = roles.map(role => role.user_id);
      
      // Fetch trainer records and join with auth.users data
      const { data: trainersData, error: trainersError } = await supabase
        .from('trainers')
        .select(`
          *,
          user:user_id (
            id,
            email,
            phone,
            raw_user_meta_data->>'full_name' as full_name,
            raw_user_meta_data->'avatar_url' as avatar_url
          )
        `)
        .in('user_id', userIds)
        .eq('is_active', true);
        
      if (trainersError) throw trainersError;
      
      if (!trainersData) {
        setTrainers([]);
        return { data: [], error: null };
      }
      
      // Transform the data to match the Trainer type
      const formattedTrainers: Trainer[] = trainersData.map(trainer => ({
        ...trainer,
        full_name: trainer.user?.full_name || '',
        email: trainer.user?.email || null,
        phone_number: trainer.user?.phone || null,
        avatar_url: trainer.user?.avatar_url || null,
        role: 'trainer' as UserRole
      }));
      
      setTrainers(formattedTrainers);
      return { data: formattedTrainers, error: null };
      
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch trainers');
      setError(error);
      toast.error('Failed to fetch trainers');
      return { data: null, error };
    } finally {
      setIsLoading(false);
    }
  }, [currentBranch?.id]);

  // Create a new trainer
  const createTrainer = async (input: CreateTrainerInput & { password: string }) => {
    if (!currentBranch?.id) {
      throw new Error('No branch selected');
    }

    try {
      setIsLoading(true);
      setError(null);

      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: input.profile.email,
        password: input.password,
        options: {
          data: {
            full_name: input.profile.full_name,
            phone: input.profile.phone,
            avatar_url: input.profile.avatar_url
          }
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Failed to create user');

      // 2. Assign trainer role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert([
          { 
            user_id: authData.user.id, 
            role: 'trainer',
            branch_id: currentBranch.id
          }
        ]);

      if (roleError) throw roleError;

      // 3. Create trainer record
      const trainerData = {
        user_id: authData.user.id,
        employee_id: input.employee_id,
        hire_date: input.hire_date,
        experience_years: input.experience_years,
        monthly_salary: input.monthly_salary,
        specializations: input.specializations,
        bio: input.bio,
        certifications: input.certifications,
        emergency_contact: input.emergency_contact,
        bank_details: input.bank_details,
        is_active: input.is_active ?? true,
        branch_id: currentBranch.id
      };

      const { data: trainer, error: trainerError } = await supabase
        .from('trainers')
        .insert(trainerData)
        .select()
        .single();

      if (trainerError) throw trainerError;

      // 4. Update local state with the new trainer
      const newTrainer: Trainer = {
        ...trainer,
        user: {
          id: authData.user.id,
          email: input.profile.email,
          phone: input.profile.phone,
          raw_user_meta_data: {
            full_name: input.profile.full_name,
            avatar_url: input.profile.avatar_url
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        role: 'trainer' as UserRole
      };

      setTrainers(prev => [...prev, newTrainer]);
      toast.success('Trainer created successfully');
      return { data: newTrainer, error: null };

    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create trainer');
      setError(error);
      toast.error('Failed to create trainer');
      return { data: null, error };
    } finally {
      setIsLoading(false);
    }
  };

  // Update an existing trainer
  const updateTrainer = async (id: string, updates: UpdateTrainerInput) => {
    try {
      setIsLoading(true);
      setError(null);

      // 1. Find the trainer to get user_id and current data
      const { data: existingTrainer, error: fetchError } = await supabase
        .from('trainers')
        .select('*, user:user_id(*)')
        .eq('id', id)
        .single();

      if (fetchError || !existingTrainer) {
        throw new Error('Trainer not found');
      }

      const userId = existingTrainer.user_id;
      const currentUser = existingTrainer.user as User;

      // 2. Update auth user data if needed
      if (updates.user) {
        const { error: authError } = await supabase.auth.updateUser({
          data: {
            full_name: updates.user.full_name,
            phone: updates.user.phone,
            avatar_url: updates.user.avatar_url
          }
        });

        if (authError) throw authError;
      }

      // 3. Update trainer record
      const trainerUpdates: Partial<UpdateTrainerInput> = { ...updates };
      delete trainerUpdates.user; // Remove user data as it's not part of the trainers table

      const { data: updatedTrainer, error: updateError } = await supabase
        .from('trainers')
        .update({
          ...trainerUpdates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      // 4. Update local state
      setTrainers(prev => 
        prev.map(trainer => {
          if (trainer.id === id) {
            return {
              ...trainer,
              ...trainerUpdates,
              user: updates.user ? {
                ...currentUser,
                ...updates.user,
                updated_at: new Date().toISOString()
              } : currentUser,
              updated_at: updatedTrainer.updated_at
            } as Trainer;
          }
          return trainer;
        })
      );

      toast.success('Trainer updated successfully');
      return { 
        data: {
          ...updatedTrainer,
          user: updates.user 
            ? { ...currentUser, ...updates.user, updated_at: new Date().toISOString() }
            : currentUser
        }, 
        error: null 
      };

    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update trainer');
      setError(error);
      toast.error('Failed to update trainer');
      return { data: null, error };
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a trainer (soft delete)
  const deleteTrainer = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Soft delete by setting is_active to false
      const { error } = await supabase
        .from('trainers')
        .update({ 
          is_active: false,
          updated_at: new Date().toISOString() 
        })
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setTrainers(prev => prev.filter(trainer => trainer.id !== id));
      toast.success('Trainer deleted successfully');
      return { error: null };

    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete trainer');
      setError(error);
      toast.error('Failed to delete trainer');
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchTrainers();
  }, [fetchTrainers]);

  return {
    trainers,
    isLoading,
    error,
    fetchTrainers,
    createTrainer,
    updateTrainer,
    deleteTrainer,
    refetch: fetchTrainers
  };
};
