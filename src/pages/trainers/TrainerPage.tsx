
import { useEffect, useState } from "react";
import { Container } from "@/components/ui/container";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { DumbbellIcon, Calendar, Mail, Phone, MoreHorizontal, Star, Plus } from "lucide-react";
import { supabase } from "@/services/supabaseClient";
import { toast } from "sonner";
import { CreateTrainerDialog } from "@/components/trainers/CreateTrainerDialog";
import { useBranch } from "@/hooks/use-branch";

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
  const { currentBranch } = useBranch();

  const fetchTrainers = async () => {
    try {
      setLoading(true);
      const { data: trainersData, error: trainersError } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'trainer');

      if (trainersError) throw trainersError;

      // Get counts of members for each trainer (optional)
      const formatTrainerData = trainersData.map(async (trainer) => {
        // Get member count
        const { count: membersCount } = await supabase
          .from('members')
          .select('*', { count: 'exact', head: true })
          .eq('trainer_id', trainer.id);
        
        // Get class count
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
          status: trainer.is_active !== false ? 'active' : 'inactive',
          membersCount: membersCount || 0,
          classesCount: classesCount || 0
        };
      });
      
      const formattedTrainers = await Promise.all(formatTrainerData);
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

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
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
              <Card key={trainer.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle>{trainer.name}</CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>Edit Details</DropdownMenuItem>
                        <DropdownMenuItem>View Schedule</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          Deactivate
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardDescription>{trainer.specialty}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4 mb-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={trainer.avatar} alt={trainer.name} />
                      <AvatarFallback>{getInitials(trainer.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                        <span className="font-medium">{trainer.rating}</span>
                        <span className="text-sm text-muted-foreground ml-1">rating</span>
                      </div>
                      <div className="flex space-x-2 mt-1">
                        <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                          <DumbbellIcon className="mr-1 h-3 w-3" />
                          {trainer.classesCount} Classes
                        </Badge>
                        <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                          {trainer.membersCount} Members
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">{trainer.bio || 'No bio available.'}</p>
                  
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{trainer.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{trainer.phone || 'No phone number'}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                  <div className="flex justify-between w-full">
                    <Button variant="outline" size="sm">
                      <Calendar className="mr-2 h-4 w-4" />
                      Schedule
                    </Button>
                    <Button size="sm">View Profile</Button>
                  </div>
                </CardFooter>
              </Card>
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
