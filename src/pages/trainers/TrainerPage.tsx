
import { useEffect, useState } from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { supabase } from "@/services/supabaseClient";
import { toast } from "sonner";
import { CreateTrainerDialog } from "@/components/trainers/CreateTrainerDialog";
import { PersonCard } from "@/components/shared/PersonCard";

interface Trainer {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialty: string;
  bio: string;
  rating: number;
  avatar: string;
  status: 'active' | 'inactive';
  membersCount: number;
  classesCount: number;
}

const TrainerPage = () => {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const fetchTrainers = async () => {
    try {
      setLoading(true);
      const { data: trainersData, error: trainersError } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'trainer');

      if (trainersError) throw trainersError;

      // Get counts of members for each trainer
      const formattedTrainers = await Promise.all(trainersData.map(async (trainer) => {
        const { count: membersCount } = await supabase
          .from('members')
          .select('*', { count: 'exact', head: true })
          .eq('trainer_id', trainer.id);
        
        const { count: classesCount } = await supabase
          .from('class_schedules')
          .select('*', { count: 'exact', head: true })
          .eq('trainer_id', trainer.id);

        return {
          id: trainer.id,
          name: trainer.full_name || '',
          email: trainer.email || '',
          phone: trainer.phone || '',
          specialty: trainer.specialty || '',
          bio: trainer.bio || '',
          rating: trainer.rating || 0,
          avatar: trainer.avatar_url || '',
          status: trainer.is_active !== false ? 'active' as const : 'inactive' as const,
          membersCount: membersCount || 0,
          classesCount: classesCount || 0
        };
      }));
      
      setTrainers(formattedTrainers);
    } catch (error) {
      console.error('Error fetching trainers:', error);
      toast.error('Failed to load trainers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainers();
  }, []);

  const handleEdit = (id: string) => {
    toast.info(`Edit trainer ${id} - coming soon`);
  };

  const handleDelete = (id: string) => {
    toast.info(`Delete trainer ${id} - coming soon`);
  };

  const handleViewProfile = (id: string) => {
    toast.info(`View profile ${id} - coming soon`);
  };

  return (
    <Container>
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Trainer Management</h1>
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
            <p>No trainers found. Click "Add Trainer" to create one.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trainers.map((trainer) => (
              <PersonCard
                key={trainer.id}
                {...trainer}
                role="Trainer"
                stats={[
                  { label: 'Classes', value: trainer.classesCount },
                  { label: 'Members', value: trainer.membersCount }
                ]}
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
