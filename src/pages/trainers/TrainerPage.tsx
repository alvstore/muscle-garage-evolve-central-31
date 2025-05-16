import React, { useState, useEffect } from 'react';
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { supabase } from "@/services/supabaseClient";
import { PlusCircle, Search, Star, Edit, Trash2, X } from 'lucide-react';

interface Trainer {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  specialization?: string;
  branch_id?: string;
  status?: string;
  branch_name?: string;
  avatar_url?: string;
  rating?: number;
}

const TrainerPage = () => {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTrainers, setFilteredTrainers] = useState<Trainer[]>([]);
  const [formData, setFormData] = useState({
    id: '',
    full_name: '',
    email: '',
    phone: '',
    specialization: '',
    branch_id: '',
    status: 'active'
  });
  const [branches, setBranches] = useState<{id: string, name: string}[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchTrainers();
    fetchBranches();
  }, []);

  useEffect(() => {
    if (trainers) {
      setFilteredTrainers(
        trainers.filter((trainer) =>
          (trainer.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (trainer.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (trainer.specialization || '').toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [trainers, searchTerm]);

  const fetchTrainers = async () => {
    setLoading(true);
    try {
      // Get current branch ID from localStorage - using the correct key
      const currentBranchId = localStorage.getItem('selectedBranchId');
      
      // Build the query
      let query = supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          email,
          phone,
          department,
          branch_id,
          avatar_url,
          rating,
          branches:branch_id (name)
        `)
        .eq('role', 'trainer');
      
      // Filter by branch if a branch is selected
      if (currentBranchId) {
        query = query.eq('branch_id', currentBranchId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      const formattedData = data.map(trainer => ({
        id: trainer.id,
        full_name: trainer.full_name || '',
        email: trainer.email || '',
        phone: trainer.phone || '',
        specialization: trainer.department || '',
        branch_id: trainer.branch_id || '',
        branch_name: trainer.branches ? (trainer.branches as any).name : '',
        status: 'active', // Assuming all fetched trainers are active
        avatar_url: trainer.avatar_url || '',
        rating: trainer.rating || 0
      }));
      
      setTrainers(formattedData);
    } catch (error) {
      console.error('Error fetching trainers:', error);
      toast.error('Failed to fetch trainers');
    } finally {
      setLoading(false);
    }
  };

  const fetchBranches = async () => {
    try {
      const { data, error } = await supabase
        .from('branches')
        .select('id, name')
        .eq('is_active', true);
      
      if (error) throw error;
      setBranches(data || []);
    } catch (error) {
      console.error('Error fetching branches:', error);
    }
  };

  const handleAddTrainer = () => {
    setFormData({
      id: '',
      full_name: '',
      email: '',
      phone: '',
      specialization: '',
      branch_id: '',
      status: 'active'
    });
    setIsEditing(false);
    setDialogOpen(true);
  };

  const handleEditTrainer = (trainer: Trainer) => {
    setFormData({
      id: trainer.id,
      full_name: trainer.full_name,
      email: trainer.email,
      phone: trainer.phone || '',
      specialization: trainer.specialization || '',
      branch_id: trainer.branch_id || '',
      status: trainer.status || 'active'
    });
    setIsEditing(true);
    setDialogOpen(true);
  };

  const handleDeleteTrainer = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this trainer?')) {
      try {
        const { error } = await supabase
          .from('profiles')
          .update({ is_active: false })
          .eq('id', id);
        
        if (error) throw error;
        
        toast.success('Trainer deleted successfully');
        await fetchTrainers();
      } catch (error) {
        console.error('Error deleting trainer:', error);
        toast.error('Failed to delete trainer');
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const handleSubmit = async () => {
    try {
      const { full_name, email, phone, specialization, branch_id, status } = formData;
      
      // Validation
      if (!full_name || !email) {
        toast.error('Name and email are required');
        return;
      }

      if (isEditing) {
        // Update existing trainer
        const { error } = await supabase
          .from('profiles')
          .update({
            full_name,
            email,
            phone,
            department: specialization,
            branch_id,
            role: 'trainer'
          })
          .eq('id', formData.id);

        if (error) throw error;
        toast.success('Trainer updated successfully');
      } else {
        // Create new trainer (create auth user first)
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password: 'Temp1234!', // Temporary password
          options: {
            data: {
              full_name,
              role: 'trainer'
            }
          }
        });

        if (authError) throw authError;

        // Then update the profile with additional details
        if (authData.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .update({
              phone,
              department: specialization,
              branch_id,
              role: 'trainer'
            })
            .eq('id', authData.user.id);

          if (profileError) throw profileError;
        }
        
        toast.success('Trainer added successfully');
      }

      // Refresh the trainer list
      await fetchTrainers();
      setDialogOpen(false);
    } catch (error) {
      console.error('Error saving trainer:', error);
      toast.error('Failed to save trainer');
    }
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
          <Button onClick={handleAddTrainer}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Trainer
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

        {loading ? (
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
                              (trainer.rating || 0) >= star
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
                      {trainer.avatar_url ? (
                        <AvatarImage src={trainer.avatar_url} alt={trainer.full_name} />
                      ) : (
                        <AvatarFallback className="text-lg font-medium">
                          {getInitials(trainer.full_name)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg">{trainer.full_name}</h3>
                      <p className="text-muted-foreground text-sm">
                        {trainer.email}
                      </p>
                      {trainer.phone && (
                        <p className="text-muted-foreground text-sm">
                          {trainer.phone}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {trainer.specialization && (
                        <Badge variant="secondary">{trainer.specialization}</Badge>
                      )}
                      {trainer.branch_name && (
                        <Badge variant="outline">{trainer.branch_name}</Badge>
                      )}
                      <Badge variant="outline" className={trainer.status === 'active' ? 'bg-green-50 text-green-700 border-green-300' : ''}>
                        {trainer.status || 'Active'}
                      </Badge>
                    </div>

                    <div className="pt-2 flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEditTrainer(trainer)}>
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
      </div>

      {/* Add/Edit Trainer Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Trainer' : 'Add Trainer'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  placeholder="Full Name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  disabled={isEditing}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Phone Number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization</Label>
                <Input
                  id="specialization"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleInputChange}
                  placeholder="Specialization"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="branch">Branch</Label>
                <Select
                  value={formData.branch_id}
                  onValueChange={(value) => handleSelectChange('branch_id', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((branch) => (
                      <SelectItem key={branch.id} value={branch.id}>
                        {branch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {isEditing ? 'Update' : 'Add'} Trainer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default TrainerPage;
