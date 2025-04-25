
import React, { useState, useEffect } from 'react';
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/services/supabaseClient";

interface Trainer {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  specialization?: string;
  branch_id?: string;
  status?: string;
  branch_name?: string;
}

const TrainerPage = () => {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
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

  const fetchTrainers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          email,
          phone,
          department,
          branch_id,
          branches:branch_id (name)
        `)
        .eq('role', 'trainer');
      
      if (error) throw error;
      
      const formattedData = data.map(trainer => ({
        id: trainer.id,
        full_name: trainer.full_name || '',
        email: trainer.email || '',
        phone: trainer.phone || '',
        specialization: trainer.department || '',
        branch_id: trainer.branch_id || '',
        branch_name: trainer.branches?.name || '',
        status: 'active' // Assuming all fetched trainers are active
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
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
          <h1 className="text-2xl font-bold">Trainer Management</h1>
          <Button onClick={handleAddTrainer}>Add Trainer</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Trainers List</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading trainers...</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Specialization</TableHead>
                    <TableHead>Branch</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trainers.map((trainer) => (
                    <TableRow key={trainer.id}>
                      <TableCell className="font-medium">{trainer.full_name}</TableCell>
                      <TableCell>{trainer.email}</TableCell>
                      <TableCell>{trainer.phone || '-'}</TableCell>
                      <TableCell>{trainer.specialization || '-'}</TableCell>
                      <TableCell>{trainer.branch_name || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={trainer.status === 'active' ? 'default' : 'secondary'}>
                          {trainer.status || 'Active'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" onClick={() => handleEditTrainer(trainer)}>
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {trainers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">
                        No trainers found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
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
