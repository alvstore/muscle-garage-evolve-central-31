
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useBranch } from '@/hooks/settings/use-branches';
import { toast } from 'sonner';
import { Trainer, CreateProfileInput, UserRole } from '@/types/team/trainer';

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
      return { data: [], error: null };
    }

    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Fetching trainers for branch:', currentBranch.id);
      
      try {
        // First, try to get just the user_roles to see if that works
        console.log('Step 1: Fetching user_roles');
        const { data: roles, error: rolesError } = await supabase
          .from('user_roles')
          .select('user_id, role')
          .eq('role', 'trainer');
        
        if (rolesError) throw rolesError;
        console.log('User roles found:', roles);
        
        if (!roles || roles.length === 0) {
          console.log('No trainers found in user_roles');
          setTrainers([]);
          return { data: [], error: null };
        }
        
        // Get the user IDs from the roles
        const userIds = roles.map(role => role.user_id);
        
        // Now fetch profiles for these users
        console.log('Step 2: Fetching profiles for user IDs:', userIds);
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*, trainers(*)')
          .in('id', userIds)
          .eq('branch_id', currentBranch.id)
          .eq('is_active', true);
          
        if (profilesError) throw profilesError;
        console.log('Profiles found:', profiles);
        
        if (!profiles || profiles.length === 0) {
          console.log('No active trainer profiles found for branch:', currentBranch.id);
          setTrainers([]);
          return { data: [], error: null };
        }
        
        // Return the profiles as userRoles for the rest of the function
        const userRoles = profiles.map(profile => ({
          user_id: profile.id,
          role: 'trainer',
          profile
        }));
        
        // Transform the data to match the Trainer type
        const formattedTrainers: Trainer[] = userRoles
          .filter(roleData => roleData.profile && roleData.profile.trainers && roleData.profile.trainers.length > 0)
          .map(roleData => {
            const profile = roleData.profile;
            const trainer = profile.trainers[0]; // Get the first trainer record (should be only one)
            
            return {
              ...trainer,
              id: trainer.id || profile.id,
              profile_id: profile.id,
              full_name: profile.full_name || '',
              email: profile.email || '',
              phone: profile.phone || null,
              is_active: trainer.is_active ?? true,
              profile: {
                ...profile,
                full_name: profile.full_name || '',
                email: profile.email || '',
                phone: profile.phone || null,
                is_active: profile.is_active ?? true,
                role: 'trainer' as UserRole,
                branch_id: profile.branch_id || currentBranch.id
              }
            };
          });
        
        // Update the local state with the fetched trainers
        setTrainers(formattedTrainers);
        return { data: formattedTrainers, error: null };
        
      } catch (err) {
        console.error('Error in fetchTrainers:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch trainers'));
        toast.error('Failed to fetch trainers');
        return { data: [], error: err };
      }
      
    } catch (err) {
      console.error('Error fetching trainers:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch trainers'));
      toast.error('Failed to fetch trainers');
      return { data: [], error: err };
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

  // Create new trainer (creates auth user, profile, trainer record, and user role)
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

      // 1. First, create the auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: trainerData.email,
        password: trainerData.password,
        options: {
          data: {
            full_name: trainerData.name,
            role: 'trainer' // This is just for Auth metadata
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (authError) throw authError;
      if (!authData.user) throw new Error('Failed to create user');

      // 2. Create the profile record
      const profileData = {
        id: authData.user.id,
        full_name: trainerData.name,
        email: trainerData.email,
        phone: trainerData.phone || null,
        branch_id: currentBranch.id, // Ensure branch_id is set
        department: trainerData.specialization,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { error: profileError } = await supabase
        .from('profiles')
        .insert(profileData);
      
      if (profileError) throw profileError;

      // 3. Add the trainer role in user_roles table
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: authData.user.id,
          role: 'trainer'
        });
      
      if (roleError) throw roleError;
      
      // 4. Create the trainer record
      const trainerRecord = {
        profile_id: authData.user.id,
        bio: trainerData.bio || null,
        specializations: trainerData.specialization ? [trainerData.specialization] : null,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data: createdTrainer, error: trainerError } = await supabase
        .from('trainers')
        .insert(trainerRecord)
        .select('*')
        .single();
      
      if (trainerError) throw trainerError;
      if (!createdTrainer) throw new Error('Failed to create trainer record');

      // 5. Fetch the complete trainer with profile data
      const { data: trainerWithRole, error: fetchError } = await supabase
        .from('user_roles')
        .select(`
          user_id,
          role,
          profile:profiles!inner(
            *,
            trainers!inner(*)
          )
        `)
        .eq('user_id', authData.user.id)
        .eq('role', 'trainer')
        .single();
      
      if (fetchError) throw fetchError;
      if (!trainerWithRole || !trainerWithRole.profile || !trainerWithRole.profile.trainers) {
        throw new Error('Failed to fetch created trainer data');
      }

      const profile = trainerWithRole.profile;
      const trainer = profile.trainers[0];

      // Format the new trainer
      const newTrainer: Trainer = {
        ...trainer,
        id: trainer.id || profile.id,
        profile_id: profile.id,
        full_name: profile.full_name || '',
        email: profile.email || '',
        phone: profile.phone || null,
        is_active: trainer.is_active ?? true,
        profile: {
          ...profile,
          role: 'trainer' as UserRole,
          branch_id: profile.branch_id || currentBranch.id
        }
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

  // Delete a trainer (soft delete by setting is_active to false)
  const deleteTrainer = async (id: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Check if the trainer has any active member assignments
      const { data: assignments, error: checkError } = await supabase
        .from('member_trainer_assignments')
        .select('id')
        .eq('trainer_id', id)
        .eq('is_active', true);
      
      if (checkError) throw checkError;
      
      if (assignments && assignments.length > 0) {
        toast.error('Cannot delete trainer with active member assignments');
        return false;
      }
      
      // Start a transaction to update both tables
      const { error: profileError } = await supabase.rpc('delete_trainer', { trainer_id: id });
      
      if (profileError) throw profileError;
      
      // Update local state
      setTrainers(prev => prev.filter(t => t.id !== id));
      
      toast.success('Trainer deleted successfully');
      return true;
    } catch (err: any) {
      console.error('Error deleting trainer:', err);
      toast.error('Failed to delete trainer');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateTrainer = async (id: string, updates: Partial<Trainer>): Promise<Trainer | null> => {
    try {
      setIsLoading(true);
      
      // Prepare profile updates
      const profileUpdates: Partial<CreateProfileInput> = {};
      
      if (updates.full_name) profileUpdates.full_name = updates.full_name;
      if (updates.email) profileUpdates.email = updates.email;
      
      // Handle phone number if it's being updated through the trainer object
      if ('phone' in updates) {
        profileUpdates.phone = updates.phone as string | null;
      }
      
      if (updates.specializations) profileUpdates.department = updates.specializations[0];
      if (updates.is_active !== undefined) profileUpdates.is_active = updates.is_active;
      
      // Update the profile if there are any profile updates
      if (Object.keys(profileUpdates).length > 0) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update(profileUpdates)
          .eq('id', id);
        
        if (profileError) throw profileError;
      }
      
      // Prepare trainer updates
      const trainerUpdates: Partial<Trainer> = {};
      
      if (updates.bio !== undefined) trainerUpdates.bio = updates.bio;
      if (updates.specializations !== undefined) trainerUpdates.specializations = updates.specializations;
      if (updates.is_active !== undefined) trainerUpdates.is_active = updates.is_active;
      
      // Update the trainer record if there are any trainer updates
      if (Object.keys(trainerUpdates).length > 0) {
        const { error: trainerError } = await supabase
          .from('trainers')
          .update(trainerUpdates)
          .eq('profile_id', id);
        
        if (trainerError) throw trainerError;
      }
      
      // Fetch the latest trainer and profile data
      const [
        { data: trainerData, error: trainerFetchError },
        { data: profileData, error: profileFetchError }
      ] = await Promise.all([
        supabase
          .from('trainers')
          .select('*')
          .eq('profile_id', id)
          .single(),
        supabase
          .from('profiles')
          .select('*')
          .eq('id', id)
          .single()
      ]);
      
      if (trainerFetchError) throw trainerFetchError;
      if (profileFetchError) throw profileFetchError;
      if (!trainerData || !profileData) throw new Error('Trainer or profile not found');
      
      // Format the updated trainer
      const formattedTrainer: Trainer = {
        ...trainerData,
        profile_id: id,
        full_name: updates.full_name || profileData.full_name || '',
        email: updates.email || profileData.email || '',
        phone: 'phone' in updates ? updates.phone as string | null : profileData.phone,
        profile: {
          ...profileData,
          role: (profileData.role as UserRole) || 'trainer',
          full_name: updates.full_name || profileData.full_name || '',
          email: updates.email || profileData.email || '',
          phone: 'phone' in updates ? updates.phone as string | null : profileData.phone
        }
      };
      
      // Update local state
      setTrainers(prev => 
        prev.map(trainer => 
          trainer.id === id ? formattedTrainer : trainer
        )
      );
      
      toast.success('Trainer updated successfully');
      return formattedTrainer;
    } catch (err: any) {
      console.error('Error updating trainer:', err);
      toast.error('Failed to update trainer');
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
