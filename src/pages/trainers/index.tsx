
import React, { useState, useEffect } from 'react';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Edit, PlusCircle, Search, Star, Trash2, UserCheck, X } from 'lucide-react';
import { useTrainers } from '@/hooks/team/use-trainers';
import { toast } from 'sonner';
import { CreateTeamMemberDialog } from '@/components/team/CreateTeamMemberDialog';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Trainer } from '@/types/team/trainer';

const TrainerList = () => {
  const [isCreateMemberDialogOpen, setIsCreateMemberDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTrainers, setFilteredTrainers] = useState<Trainer[]>([]);
  const { trainers, isLoading, refetch, deleteTrainer } = useTrainers();

  useEffect(() => {
    if (trainers) {
      setFilteredTrainers(
        trainers.filter((trainer) =>
          (trainer.name || trainer.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (trainer.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          ((trainer.specialization || (trainer.specializations && trainer.specializations[0]) || '')).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [trainers, searchTerm]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleDeleteTrainer = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this trainer?')) {
      await deleteTrainer(id);
      refetch();
    }
  };

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Container>
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Trainers</h1>
            <p className="text-muted-foreground">
              Manage your gym trainers and their assignments
            </p>
          </div>
          <Button
            onClick={() => setIsCreateMemberDialogOpen(true)}
            className="ml-auto"
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Add Trainer
          </Button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search trainers..."
              className="pl-8"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-32 bg-muted rounded-md"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredTrainers.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
              <X className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No trainers found</h3>
            <p className="text-muted-foreground mt-1">
              {searchTerm ? 'Try adjusting your search' : 'Add a trainer to get started'}
            </p>
            {searchTerm && (
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setSearchTerm('')}
              >
                Clear search
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTrainers.map((trainer) => (
              <Card key={trainer.id} className="overflow-hidden">
                <CardHeader className="p-0">
                  <div className="bg-gradient-to-r from-primary/20 to-primary/10 h-24 flex items-center justify-center">
                    <div className="flex items-center justify-center">
                      <div className="flex space-x-1 mt-12">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              (trainer.ratingValue || trainer.rating || 0) >= star
                                ? 'text-yellow-500 fill-yellow-500'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 pt-14 relative">
                  <div className="absolute -top-10 left-6">
                    <Avatar className="h-16 w-16 border-4 border-background">
                      {trainer.avatar ? (
                        <AvatarImage src={trainer.avatar} alt={trainer.name || trainer.fullName || 'Trainer'} />
                      ) : (
                        <AvatarFallback className="text-lg font-medium">
                          {getInitials(trainer.name || trainer.fullName || 'Trainer')}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg">{trainer.name || trainer.fullName || 'Trainer'}</h3>
                      <p className="text-muted-foreground text-sm">
                        {trainer.email}
                      </p>
                    </div>

                    <div>
                      <Badge variant="secondary">{trainer.specialization || (trainer.specializations && trainer.specializations[0])}</Badge>
                      {trainer.isAvailable && (
                        <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-300">
                          Available
                        </Badge>
                      )}
                    </div>

                    <div className="pt-2 flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-destructive hover:text-destructive"
                        onClick={() => handleDeleteTrainer(trainer.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <CreateTeamMemberDialog
          open={isCreateMemberDialogOpen}
          onOpenChange={setIsCreateMemberDialogOpen}
          onSuccess={refetch}
        />
      </div>
    </Container>
  );
};

export default TrainerList;
