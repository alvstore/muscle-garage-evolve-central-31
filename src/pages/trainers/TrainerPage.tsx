
import React, { useState, useEffect, useCallback } from 'react';
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from '@/services/supabaseClient';
import { TrainerProfile } from '@/types/trainer';
import { toast } from 'sonner';

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

const TrainerPage: React.FC = () => {
  const [trainers, setTrainers] = useState<TrainerProfile[]>([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch trainers
  const fetchTrainers = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'trainer');

      if (error) throw error;
      setTrainers(data || []);
    } catch (error) {
      console.error('Error fetching trainers:', error);
      toast.error('Failed to fetch trainers');
    } finally {
      setLoading(false);
    }
  }, []);

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

  useEffect(() => {
    fetchTrainers();
  }, [fetchTrainers]);

  return (
    <Container>
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-4">Trainer Management</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {loading ? (
            <div>Loading trainers...</div>
          ) : trainers.length === 0 ? (
            <div>No trainers found</div>
          ) : (
            trainers.map((trainer) => (
              <Card key={trainer.id} className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                  <CardTitle>{trainer.full_name}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  <div>
                    <p>Email: {trainer.email}</p>
                    <p>Phone: {trainer.phone}</p>
                    <p>Specialty: {trainer.specialty}</p>
                    <p>Bio: {trainer.bio}</p>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" size="sm">View Details</Button>
                    <Button size="sm">Edit</Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </Container>
  );
};

export default TrainerPage;
