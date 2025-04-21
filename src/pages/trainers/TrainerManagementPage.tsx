
import React, { useState, useEffect } from 'react';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Search, Filter, MoreVertical, Mail, Calendar, Users } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Trainer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  avatar?: string;
  specialization?: string;
  status: 'active' | 'inactive';
  memberCount: number;
  rating?: number;
}

const TrainerManagementPage = () => {
  const navigate = useNavigate();
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Simulate API call to fetch trainers
    setTimeout(() => {
      const mockTrainers: Trainer[] = [
        {
          id: 'trainer-123',
          name: 'Alex Johnson',
          email: 'alex.johnson@example.com',
          phone: '+1 (555) 123-4567',
          bio: 'Certified personal trainer with 5 years of experience in strength training and weight management.',
          specialization: 'Strength Training',
          status: 'active',
          memberCount: 15,
          rating: 4.8
        },
        {
          id: 'trainer-456',
          name: 'Maria Rodriguez',
          email: 'maria.rodriguez@example.com',
          phone: '+1 (555) 987-6543',
          bio: 'Yoga instructor and nutrition coach with expertise in holistic wellness.',
          specialization: 'Yoga & Nutrition',
          status: 'active',
          memberCount: 12,
          rating: 4.9
        },
        {
          id: 'trainer-789',
          name: 'David Chen',
          email: 'david.chen@example.com',
          phone: '+1 (555) 456-7890',
          bio: 'Sports rehabilitation and functional training specialist.',
          specialization: 'Rehabilitation',
          status: 'inactive',
          memberCount: 8,
          rating: 4.7
        }
      ];
      setTrainers(mockTrainers);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredTrainers = trainers.filter(trainer => 
    trainer.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    trainer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trainer.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const handleQuickAction = (trainerId: string, action: string) => {
    const trainer = trainers.find(t => t.id === trainerId);
    if (!trainer) return;

    switch (action) {
      case 'message':
        toast.success(`Sending message to ${trainer.name}`);
        break;
      case 'schedule':
        navigate(`/trainers/schedule?trainerId=${trainerId}`);
        break;
      case 'members':
        navigate(`/trainers/allocation?trainerId=${trainerId}`);
        break;
      case 'edit':
        navigate(`/trainers/profile?trainerId=${trainerId}`);
        break;
      default:
        toast.error('Action not implemented');
    }
  };

  return (
    <Container>
      <div className="py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl font-bold">Trainers</h1>
          
          <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0 w-full md:w-auto">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search trainers..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <Button onClick={() => navigate('/trainers/new')}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Trainer
            </Button>
          </div>
        </div>

        <Tabs defaultValue="active">
          <TabsList className="mb-6">
            <TabsTrigger value="active">Active Trainers</TabsTrigger>
            <TabsTrigger value="inactive">Inactive Trainers</TabsTrigger>
            <TabsTrigger value="all">All Trainers</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active">
            {renderTrainerList(filteredTrainers.filter(t => t.status === 'active'))}
          </TabsContent>
          
          <TabsContent value="inactive">
            {renderTrainerList(filteredTrainers.filter(t => t.status === 'inactive'))}
          </TabsContent>
          
          <TabsContent value="all">
            {renderTrainerList(filteredTrainers)}
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );

  function renderTrainerList(trainersList: Trainer[]) {
    if (loading) {
      return (
        <div className="flex justify-center py-20">
          <div className="h-10 w-10 rounded-full border-4 border-t-accent animate-spin"></div>
        </div>
      );
    }

    if (trainersList.length === 0) {
      return (
        <div className="text-center py-12 border rounded-lg">
          <p className="text-muted-foreground">No trainers found matching your search criteria</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {trainersList.map(trainer => (
          <Card key={trainer.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-0">
              <div className="p-4">
                <div className="flex justify-between">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={trainer.avatar} alt={trainer.name} />
                    <AvatarFallback>{getInitials(trainer.name)}</AvatarFallback>
                  </Avatar>
                  <Badge className={trainer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                    {trainer.status.charAt(0).toUpperCase() + trainer.status.slice(1)}
                  </Badge>
                </div>
                
                <h3 className="font-medium text-lg mt-3">{trainer.name}</h3>
                <div className="text-sm text-muted-foreground">{trainer.email}</div>
                {trainer.phone && (
                  <div className="text-sm text-muted-foreground">{trainer.phone}</div>
                )}
                
                <div className="mt-3 text-sm">
                  {trainer.specialization && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Specialization:</span>
                      <span>{trainer.specialization}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Members:</span>
                    <span>{trainer.memberCount}</span>
                  </div>
                  {trainer.rating && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Rating:</span>
                      <span>⭐ {trainer.rating}/5</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex border-t">
                <Button 
                  variant="ghost" 
                  className="flex-1 rounded-none py-2 h-auto font-normal text-xs"
                  onClick={() => navigate(`/trainers/profile?trainerId=${trainer.id}`)}
                >
                  View Profile
                </Button>
                <div className="border-r"></div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex-1 rounded-none py-2 h-auto font-normal text-xs"
                    >
                      Quick Actions
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Trainer Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleQuickAction(trainer.id, 'message')}>
                      <Mail className="h-4 w-4 mr-2" /> 
                      Send Message
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleQuickAction(trainer.id, 'members')}>
                      <Users className="h-4 w-4 mr-2" />
                      Manage Members
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleQuickAction(trainer.id, 'edit')}>
                      <MoreVertical className="h-4 w-4 mr-2" />
                      Edit Profile
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <div className="border-r"></div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-none h-auto py-2"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleQuickAction(trainer.id, 'edit')}>
                      Edit Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleQuickAction(trainer.id, 'members')}>
                      View Assigned Members
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toast.info("Feature coming soon")}>
                      View Performance
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
};

export default TrainerManagementPage;
