import React, { useState, useEffect } from 'react';
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/services/supabaseClient';
import { CreateTrainerDialog } from '@/components/trainers/CreateTrainerDialog';
import { PersonCard } from '@/components/shared/PersonCard';
import { TrainerProfile } from '@/types/trainer';

const TrainerPage = () => {
  const { user } = useAuth();
  const [trainers, setTrainers] = useState<TrainerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  useEffect(() => {
    fetchTrainers();
  }, []);

  const fetchTrainers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'trainer');

      if (error) throw error;

      // Make sure data is not null before proceeding
      if (data) {
        // Handle the case where profile fields might be missing
        const processedData = data.map(profile => ({
          id: profile.id,
          full_name: profile.full_name || 'No Name',
          email: profile.email || '',
          phone: profile.phone || '',
          avatar_url: profile.avatar_url || '',
          branch_id: profile.branch_id || '',
          department: profile.department || '',
          // Add specific trainer fields with fallbacks
          specialty: profile.specialty || '', // Might be undefined in the database
          bio: profile.bio || '',
          rating: profile.rating || 0,
          is_active: profile.is_active !== false, // Default to true if not specified
          // Include all profile fields for type safety
          accessible_branch_ids: profile.accessible_branch_ids,
          address: profile.address,
          city: profile.city,
          country: profile.country,
          created_at: profile.created_at,
          date_of_birth: profile.date_of_birth,
          gender: profile.gender,
          role: profile.role,
          state: profile.state,
          updated_at: profile.updated_at
        }));

        setTrainers(processedData);
      } else {
        setTrainers([]);
      }
    } catch (error) {
      console.error('Error fetching trainers:', error);
      toast.error('Failed to load trainers');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id: string) => {
    toast.info(`Edit trainer ${id} - coming soon`);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this trainer?')) {
      try {
        const { error } = await supabase
          .from('profiles')
          .update({ is_active: false })
          .eq('id', id);

        if (error) throw error;

        toast.success('Trainer deactivated successfully');
        fetchTrainers();
      } catch (error) {
        console.error('Error deactivating trainer:', error);
        toast.error('Failed to deactivate trainer');
      }
    }
  };

  const handleViewProfile = (id: string) => {
    toast.info(`View trainer profile ${id} - coming soon`);
  };

  return (
    <Container>
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Trainers</h1>
            <p className="text-muted-foreground">Manage gym trainers</p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Trainer
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <p>Loading trainers...</p>
          </div>
        ) : trainers.length === 0 ? (
          <div className="text-center py-10">
            <p>No trainers found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trainers.map((trainer) => (
              <PersonCard
                key={trainer.id}
                id={trainer.id}
                name={trainer.full_name || 'No Name'}
                email={trainer.email || ''}
                phone={trainer.phone || ''}
                avatar={trainer.avatar_url || ''}
                role="Trainer"
                department={trainer.specialty || trainer.department || ''}
                status={trainer.is_active !== false ? 'active' : 'inactive'}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onViewProfile={handleViewProfile}
              />
            ))}
          </div>
        )}
      </div>

      <CreateTrainerDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSuccess={fetchTrainers}
      />
    </Container>
  );
};

export default TrainerPage;
