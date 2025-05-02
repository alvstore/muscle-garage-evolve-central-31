
import React, { useState, useEffect } from 'react';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPlus, Search, Phone, Mail, Star, MapPin } from 'lucide-react';
import { useTrainers } from '@/hooks/use-trainers';
import { useBranch } from '@/hooks/use-branch';
import { toast } from 'sonner';

const TrainersPage = () => {
  const { trainers, isLoading, fetchTrainers } = useTrainers();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddTrainerDialog, setShowAddTrainerDialog] = useState(false);
  const { currentBranch } = useBranch();
  
  const [newTrainer, setNewTrainer] = useState({
    name: '',
    email: '',
    phone: '',
    specializations: [''],
    bio: ''
  });

  // Filter trainers based on search query
  const filteredTrainers = trainers.filter(trainer => 
    trainer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (trainer.email && trainer.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (trainer.specializations && trainer.specializations.some(s => 
      s.toLowerCase().includes(searchQuery.toLowerCase())
    ))
  );

  // Function to handle adding a new trainer
  const handleAddTrainer = async () => {
    try {
      // Add trainer logic would go here
      // For now just mock it with a toast
      toast.success(`Added trainer ${newTrainer.name}`);
      setShowAddTrainerDialog(false);
      setNewTrainer({
        name: '',
        email: '',
        phone: '',
        specializations: [''],
        bio: ''
      });
    } catch (error) {
      console.error('Error adding trainer:', error);
      toast.error('Failed to add trainer');
    }
  };

  // Function to get initials from name
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Container>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gym Trainers</h1>
        <Button onClick={() => setShowAddTrainerDialog(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Trainer
        </Button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search trainers..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-muted-foreground">Loading trainers...</div>
        </div>
      ) : filteredTrainers.length === 0 ? (
        <div className="flex flex-col justify-center items-center h-64 border border-dashed rounded-lg">
          <div className="text-lg text-muted-foreground">No trainers found</div>
          <Button variant="outline" className="mt-4" onClick={() => setShowAddTrainerDialog(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Your First Trainer
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrainers.map((trainer) => (
            <Card key={trainer.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={trainer.image_url} alt={trainer.name} />
                      <AvatarFallback>{getInitials(trainer.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-xl">{trainer.name}</CardTitle>
                      <div className="flex mt-1">
                        {Array(5).fill(0).map((_, i) => (
                          <Star key={i} 
                            className={`h-4 w-4 ${i < (trainer.rating || 0) ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"}`} 
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <Badge variant={trainer.status === 'active' ? 'default' : 'secondary'}>
                    {trainer.status || 'Active'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                {trainer.specializations && trainer.specializations.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {trainer.specializations.map((spec, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                )}
                <div className="text-sm text-muted-foreground">
                  {trainer.bio || "No bio available for this trainer."}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col items-start pt-2">
                {trainer.phone && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Phone className="h-3.5 w-3.5" />
                    <span>{trainer.phone}</span>
                  </div>
                )}
                {trainer.email && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Mail className="h-3.5 w-3.5" />
                    <span>{trainer.email}</span>
                  </div>
                )}
                {currentBranch && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{currentBranch.name}</span>
                  </div>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showAddTrainerDialog} onOpenChange={setShowAddTrainerDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Trainer</DialogTitle>
            <DialogDescription>
              Enter the details to add a new trainer to your gym.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newTrainer.name}
                onChange={(e) => setNewTrainer({...newTrainer, name: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={newTrainer.email}
                onChange={(e) => setNewTrainer({...newTrainer, email: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone
              </Label>
              <Input
                id="phone"
                value={newTrainer.phone}
                onChange={(e) => setNewTrainer({...newTrainer, phone: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="specialization" className="text-right">
                Specialization
              </Label>
              <Select onValueChange={(value) => setNewTrainer({...newTrainer, specializations: [value]})}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select specialization" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weight-training">Weight Training</SelectItem>
                  <SelectItem value="cardio">Cardio</SelectItem>
                  <SelectItem value="yoga">Yoga</SelectItem>
                  <SelectItem value="crossfit">CrossFit</SelectItem>
                  <SelectItem value="nutrition">Nutrition</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bio" className="text-right">
                Bio
              </Label>
              <Input
                id="bio"
                value={newTrainer.bio}
                onChange={(e) => setNewTrainer({...newTrainer, bio: e.target.value})}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleAddTrainer}>Add Trainer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default TrainersPage;
