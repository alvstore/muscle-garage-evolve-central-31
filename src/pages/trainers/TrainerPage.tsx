
// Partial file update to fix the property issues in TrainerPage.tsx
// We'll update just the sections where we use the missing properties

// Add import for TrainerProfile
import { TrainerProfile } from '@/types/trainer';

// Update the transformation function to handle the profile type properly
const transformTrainerData = (profiles: any[]) => {
  return profiles.map(profile => {
    const trainerProfile = profile as TrainerProfile;
    return {
      id: trainerProfile.id,
      fullName: trainerProfile.full_name,
      email: trainerProfile.email,
      phone: trainerProfile.phone,
      specialty: trainerProfile.specialty || 'General Fitness',
      bio: trainerProfile.bio || 'No bio provided',
      rating: trainerProfile.rating || 0,
      is_active: trainerProfile.is_active !== undefined ? trainerProfile.is_active : true,
      branchId: trainerProfile.branch_id,
      avatar_url: trainerProfile.avatar_url
    };
  });
};

// For the updateTrainer function, add the is_active property correctly
const updateTrainer = async (id: string, data: Partial<TrainerProfile>) => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: data.full_name,
        email: data.email,
        phone: data.phone,
        specialty: data.specialty,
        bio: data.bio,
        is_active: data.is_active,
        branch_id: data.branch_id,
      })
      .eq('id', id);

    if (error) throw error;
    fetchTrainers();
    return true;
  } catch (error) {
    console.error('Error updating trainer:', error);
    toast.error('Failed to update trainer');
    return false;
  }
};
