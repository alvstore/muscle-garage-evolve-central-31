import { Trainer, TrainerDocument, TrainerSchedule, CreateTrainerInput, UpdateTrainerInput } from '@/types/team/trainer';

export const trainersService = {
  // Get all trainers with their user information
  async getTrainers(options: { 
    activeOnly?: boolean;
    branchId?: string; 
  } = { activeOnly: true }) {
    const { activeOnly = true, branchId } = options;
    let query = supabase
      .from('trainers_with_users')
      .select('*')
      .order('created_at', { ascending: false });

    if (activeOnly) {
      query = query.eq('is_active', true);
    }

    if (branchId) {
      query = query.eq('branch_id', branchId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching trainers:', error);
      throw error;
    }

    // Transform the data to match the Trainer interface
    const trainers = data.map(trainer => ({
      ...trainer,
      // Add computed fields from user data
      full_name: trainer.full_name,
      email: trainer.email,
      role: 'trainer'
    }));

    return trainers as Trainer[];
  },

  // Get a single trainer by ID with full user information
  async getTrainerById(id: string) {
    const { data, error } = await supabase
      .from('trainers_with_users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching trainer:', error);
      throw error;
    }
    
    // Transform the data to match the Trainer interface
    const trainer = {
      ...data,
      // Add computed fields from user data
      full_name: data.full_name,
      email: data.email,
      role: 'trainer'
    };

    return trainer as Trainer;
  },

  // Create a new trainer
  async createTrainer(trainerData: CreateTrainerInput) {
    // Extract the bio from trainerData if it exists
    const { bio, ...trainerDataWithoutBio } = trainerData;
    
    const { data, error } = await supabase
      .from('trainers')
      .insert({
        ...trainerDataWithoutBio,
        bio: bio || null,
        is_active: trainerData.is_active ?? true,
        specializations: trainerData.specializations ?? [],
        certifications: trainerData.certifications ?? [],
        emergency_contact: trainerData.emergency_contact ?? null,
        bank_details: trainerData.bank_details ?? null
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating trainer:', error);
      throw error;
    }
    
    // Fetch the complete trainer data with user information
    return this.getTrainerById(data.id);
  },

  // Update a trainer
  async updateTrainer(id: string, updates: UpdateTrainerInput) {
    // Extract the bio from updates if it exists
    const { bio, ...updatesWithoutBio } = updates;
    
    const updateData: any = {
      ...updatesWithoutBio,
      updated_at: new Date().toISOString()
    };
    
    // Only include bio in the update if it was provided
    if (bio !== undefined) {
      updateData.bio = bio;
    }
    
    const { data, error } = await supabase
      .from('trainers')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating trainer:', error);
      throw error;
    }
    
    // Fetch the complete trainer data with user information
    return this.getTrainerById(id);
  },

  // Rate a trainer
  async rateTrainer(trainerId: string, rating: number) {
    if (rating < 0 || rating > 5) {
      throw new Error('Rating must be between 0 and 5');
    }

    const { data, error } = await supabase
      .rpc('update_trainer_rating', {
        p_trainer_id: trainerId,
        new_rating: rating
      })
      .single();

    if (error) {
      console.error('Error rating trainer:', error);
      throw error;
    }

    return data;
  },

  // Get trainer documents
  async getTrainerDocuments(trainerId: string) {
    const { data, error } = await supabase
      .from('trainer_documents')
      .select('*')
      .eq('trainer_id', trainerId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching trainer documents:', error);
      throw error;
    }

    return data as TrainerDocument[];
  },

  // Upload trainer document
  async uploadDocument(
    trainerId: string, 
    file: File, 
    documentType: string
  ) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${trainerId}/${documentType}_${Date.now()}.${fileExt}`;
    const filePath = `trainer-documents/${fileName}`;

    // Upload to storage
    const { error: uploadError } = await supabase.storage
      .from('trainer-documents')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading document:', uploadError);
      throw uploadError;
    }

    // Save document reference
    const { data, error } = await supabase
      .from('trainer_documents')
      .insert({
        trainer_id: trainerId,
        document_type: documentType,
        file_name: file.name,
        file_path: filePath,
        mime_type: file.type,
        file_size: file.size
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving document reference:', error);
      throw error;
    }

    return data as TrainerDocument;
  },

  // Get trainer schedule
  async getTrainerSchedule(trainerId: string) {
    const { data, error } = await supabase
      .from('trainer_schedule')
      .select('*')
      .eq('trainer_id', trainerId)
      .order('day_of_week')
      .order('start_time');

    if (error) {
      console.error('Error fetching trainer schedule:', error);
      throw error;
    }

    return data as TrainerSchedule[];
  },

  // Update trainer schedule
  async updateTrainerSchedule(
    trainerId: string, 
    schedule: Omit<TrainerSchedule, 'id' | 'trainer_id' | 'created_at' | 'updated_at'>[]
  ) {
    // Delete existing schedule
    const { error: deleteError } = await supabase
      .from('trainer_schedule')
      .delete()
      .eq('trainer_id', trainerId);

    if (deleteError) {
      console.error('Error deleting old schedule:', deleteError);
      throw deleteError;
    }

    // Insert new schedule
    const scheduleWithTimestamps = schedule.map(item => ({
      ...item,
      trainer_id: trainerId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));

    const { data, error } = await supabase
      .from('trainer_schedule')
      .insert(scheduleWithTimestamps)
      .select();

    if (error) {
      console.error('Error updating schedule:', error);
      throw error;
    }

    return data as TrainerSchedule[];
  },
  // Toggle trainer active status
  async toggleActiveStatus(trainerId: string, isActive: boolean) {
    const { data, error } = await supabase
      .from('trainers')
      .update({ 
        is_active: isActive,
        updated_at: new Date().toISOString()
      })
      .eq('id', trainerId)
      .select()
      .single();

    if (error) {
      console.error('Error updating trainer status:', error);
      throw error;
    }

    return data as Trainer;
  },

  // Delete a document
  async deleteDocument(documentId: string) {
    const { error } = await supabase
      .from('trainer_documents')
      .delete()
      .eq('id', documentId);

    if (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  }
};