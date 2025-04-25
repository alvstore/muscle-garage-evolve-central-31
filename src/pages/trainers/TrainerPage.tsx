
import React, { useState, useEffect } from 'react';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DataTable } from '@/components/ui/data-table';
import { PlusCircle, Search } from 'lucide-react';
import { supabase } from '@/services/supabaseClient';
import { toast } from 'sonner';

// Define profile type from Supabase
interface TrainerProfile {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  role: string;
  branch_id?: string;
  avatar_url?: string;
  department?: string;
  specialty?: string;  // Add these fields for trainers
  bio?: string;
  rating?: number;
  is_active?: boolean;
}

const TrainerPage = () => {
  const [trainers, setTrainers] = useState<TrainerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  
  // Add trainer fetch function
  const fetchTrainers = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('profiles')
        .select('*')
        .eq('role', 'trainer');
        
      if (selectedBranch !== 'all') {
        query = query.eq('branch_id', selectedBranch);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      setTrainers(data || []);
    } catch (error) {
      toast.error('Failed to fetch trainers');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainers();
  }, [selectedBranch]);

  // Filter trainers based on search term
  const filteredTrainers = trainers.filter(trainer => 
    trainer.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trainer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trainer.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Toggle trainer active status
  const toggleTrainerStatus = async (trainerId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          is_active: !currentStatus 
        })
        .eq('id', trainerId);
        
      if (error) throw error;
      
      // Update local state
      setTrainers(trainers.map(trainer => 
        trainer.id === trainerId 
          ? { ...trainer, is_active: !currentStatus }
          : trainer
      ));
      
      toast.success(`Trainer ${currentStatus ? 'deactivated' : 'activated'} successfully`);
    } catch (error) {
      toast.error('Failed to update trainer status');
      console.error(error);
    }
  };

  // Mock branches data - replace with actual data
  const branches = [
    { id: 'branch1', name: 'Downtown Branch' },
    { id: 'branch2', name: 'Westside Branch' },
    { id: 'branch3', name: 'North Branch' },
  ];

  return (
    <Container>
      <div className="py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Trainer Management</h1>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Trainer
          </Button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search trainers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          
          <div className="flex-1">
            <Select 
              defaultValue="all" 
              value={selectedBranch}
              onValueChange={setSelectedBranch}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by branch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Branches</SelectItem>
                {branches.map(branch => (
                  <SelectItem key={branch.id} value={branch.id}>
                    {branch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : filteredTrainers.length > 0 ? (
            filteredTrainers.map(trainer => (
              <Card key={trainer.id} className="overflow-hidden">
                <CardHeader className="bg-primary/5 pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 border-2 border-primary/20">
                        <AvatarImage src={trainer.avatar_url || ''} alt={trainer.full_name} />
                        <AvatarFallback>{trainer.full_name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{trainer.full_name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{trainer.specialty || 'General Fitness'}</p>
                      </div>
                    </div>
                    <Badge variant={trainer.is_active ? "success" : "secondary"}>
                      {trainer.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <Label className="text-xs font-medium">Email</Label>
                      <p className="text-sm">{trainer.email}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <Label className="text-xs font-medium">Phone</Label>
                      <p className="text-sm">{trainer.phone || 'Not provided'}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <Label className="text-xs font-medium">Department</Label>
                      <p className="text-sm">{trainer.department || 'General'}</p>
                    </div>
                    
                    <div className="flex justify-between items-center pt-2">
                      <Button variant="outline" size="sm">Edit Details</Button>
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`active-${trainer.id}`} className="text-xs">
                          {trainer.is_active ? 'Active' : 'Inactive'}
                        </Label>
                        <Switch 
                          id={`active-${trainer.id}`}
                          checked={trainer.is_active}
                          onCheckedChange={() => toggleTrainerStatus(trainer.id, !!trainer.is_active)}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No trainers found</p>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
};

export default TrainerPage;
