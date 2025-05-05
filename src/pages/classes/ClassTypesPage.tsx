
import React, { useState, useEffect } from 'react';
import { Container } from '@/components/ui/container';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@/components/ui/breadcrumb';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { ChevronRight, Plus, Edit, Trash2, Search, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useBranch } from '@/hooks/use-branch';

interface ClassType {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  branch_id: string | null;
  created_at: string;
  updated_at: string;
}

const ClassTypesPage: React.FC = () => {
  const { toast } = useToast();
  const { currentBranch } = useBranch();
  const [classTypes, setClassTypes] = useState<ClassType[]>([]);
  const [filteredClassTypes, setFilteredClassTypes] = useState<ClassType[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClassType, setEditingClassType] = useState<ClassType | null>(null);
  
  const [formData, setFormData] = useState<Partial<ClassType>>({
    name: '',
    description: '',
    is_active: true,
  });
  
  useEffect(() => {
    const fetchClassTypes = async () => {
      if (!currentBranch?.id) return;
      
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('class_types')
          .select('*')
          .eq('branch_id', currentBranch.id);
          
        if (error) throw error;
        
        setClassTypes(data || []);
        setFilteredClassTypes(data || []);
      } catch (error: any) {
        console.error('Error fetching class types:', error);
        toast({
          title: 'Error',
          description: 'Failed to load class types',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchClassTypes();
  }, [currentBranch?.id, toast]);
  
  useEffect(() => {
    if (searchQuery) {
      setFilteredClassTypes(
        classTypes.filter(type => 
          type.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (type.description && type.description.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      );
    } else {
      setFilteredClassTypes(classTypes);
    }
  }, [searchQuery, classTypes]);
  
  const handleEditClassType = (classType: ClassType) => {
    setEditingClassType(classType);
    setFormData({
      name: classType.name,
      description: classType.description || '',
      is_active: classType.is_active,
    });
    setIsDialogOpen(true);
  };
  
  const handleAddClassType = () => {
    setEditingClassType(null);
    setFormData({
      name: '',
      description: '',
      is_active: true,
    });
    setIsDialogOpen(true);
  };
  
  const handleSubmit = async () => {
    if (!formData.name || !currentBranch?.id) return;
    
    try {
      setIsSubmitting(true);
      
      if (editingClassType) {
        // Update existing class type
        const { error } = await supabase
          .from('class_types')
          .update({
            name: formData.name,
            description: formData.description,
            is_active: formData.is_active,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingClassType.id);
          
        if (error) throw error;
        
        // Update local state
        setClassTypes(prevTypes => 
          prevTypes.map(type => 
            type.id === editingClassType.id ? 
              { 
                ...type, 
                name: formData.name || type.name, 
                description: formData.description || null,
                is_active: formData.is_active ?? type.is_active,
                updated_at: new Date().toISOString()
              } : 
              type
          )
        );
        
        toast({
          title: 'Class type updated',
          description: 'The class type has been updated successfully',
        });
      } else {
        // Create new class type
        const { data, error } = await supabase
          .from('class_types')
          .insert([{
            name: formData.name,
            description: formData.description,
            is_active: formData.is_active,
            branch_id: currentBranch.id,
          }])
          .select();
          
        if (error) throw error;
        
        // Add to local state
        if (data && data.length > 0) {
          setClassTypes(prevTypes => [...prevTypes, data[0]]);
        }
        
        toast({
          title: 'Class type created',
          description: 'New class type has been created successfully',
        });
      }
      
      // Reset form and close dialog
      setFormData({
        name: '',
        description: '',
        is_active: true,
      });
      setIsDialogOpen(false);
      
    } catch (error: any) {
      console.error('Error saving class type:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save class type',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteClassType = async (id: string) => {
    if (!confirm('Are you sure you want to delete this class type?')) return;
    
    try {
      const { error } = await supabase
        .from('class_types')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      // Update local state
      setClassTypes(prevTypes => prevTypes.filter(type => type.id !== id));
      
      toast({
        title: 'Class type deleted',
        description: 'The class type has been deleted successfully',
      });
    } catch (error: any) {
      console.error('Error deleting class type:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete class type',
        variant: 'destructive',
      });
    }
  };
  
  const handleToggleActive = async (classType: ClassType) => {
    try {
      const newStatus = !classType.is_active;
      
      const { error } = await supabase
        .from('class_types')
        .update({
          is_active: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', classType.id);
        
      if (error) throw error;
      
      // Update local state
      setClassTypes(prevTypes => 
        prevTypes.map(type => 
          type.id === classType.id ? 
            { ...type, is_active: newStatus, updated_at: new Date().toISOString() } : 
            type
        )
      );
      
      toast({
        title: `Class type ${newStatus ? 'activated' : 'deactivated'}`,
        description: `The class type has been ${newStatus ? 'activated' : 'deactivated'} successfully`,
      });
    } catch (error: any) {
      console.error('Error updating class type status:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update class type status',
        variant: 'destructive',
      });
    }
  };
  
  return (
    <Container>
      <div className="py-6">
        <Breadcrumb className="mb-4">
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="/classes">Classes</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="/classes/types" isCurrentPage>Class Types</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0 mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Class Types</h1>
            <p className="text-muted-foreground">
              Manage class categories and types
            </p>
          </div>
          <Button onClick={handleAddClassType}>
            <Plus className="mr-2 h-4 w-4" />
            Add Class Type
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              <div>
                <CardTitle>Class Types</CardTitle>
                <CardDescription>All class types available in your gym</CardDescription>
              </div>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search class types..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-24">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredClassTypes.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClassTypes.map((classType) => (
                    <TableRow key={classType.id}>
                      <TableCell className="font-medium">{classType.name}</TableCell>
                      <TableCell>{classType.description || '-'}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={classType.is_active}
                            onCheckedChange={() => handleToggleActive(classType)}
                          />
                          <span>{classType.is_active ? 'Active' : 'Inactive'}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEditClassType(classType)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDeleteClassType(classType.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-24">
                <p className="text-muted-foreground">
                  {searchQuery ? 'No class types match your search.' : 'No class types found. Create your first class type.'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingClassType ? 'Edit Class Type' : 'Add New Class Type'}
              </DialogTitle>
              <DialogDescription>
                {editingClassType 
                  ? 'Edit the details of this class type.' 
                  : 'Create a new class type for organizing your classes.'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Yoga, Cardio, CrossFit"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of this class type..."
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="is-active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is-active">Active</Label>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={!formData.name || isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingClassType ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Container>
  );
};

export default ClassTypesPage;
