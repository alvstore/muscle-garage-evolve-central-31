
import React, { useState, useEffect } from 'react';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Plus, Pencil, Trash } from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/services/supabaseClient';
import { useBranch } from '@/hooks/use-branch';

interface ClassType {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
  branch_id: string;
  created_at: string;
  updated_at: string;
}

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
});

const ClassTypesPage = () => {
  const [classTypes, setClassTypes] = useState<ClassType[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingClassType, setEditingClassType] = useState<ClassType | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteClassTypeId, setDeleteClassTypeId] = useState<string | null>(null);
  const { currentBranch } = useBranch();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      is_active: true,
    },
  });

  useEffect(() => {
    loadClassTypes();
  }, [currentBranch]);

  useEffect(() => {
    if (editingClassType) {
      form.reset({
        name: editingClassType.name,
        description: editingClassType.description || '',
        is_active: editingClassType.is_active,
      });
    }
  }, [editingClassType, form]);

  async function loadClassTypes() {
    setLoading(true);
    try {
      let query = supabase.from('class_types').select('*');
      
      if (currentBranch?.id) {
        query = query.eq('branch_id', currentBranch.id);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      setClassTypes(data || []);
    } catch (error) {
      console.error('Error loading class types:', error);
      toast.error('Failed to load class types');
    } finally {
      setLoading(false);
    }
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const classTypeData = {
        ...values,
        branch_id: currentBranch?.id,
        updated_at: new Date().toISOString(),
      };

      if (editingClassType) {
        const { error } = await supabase
          .from('class_types')
          .update(classTypeData)
          .eq('id', editingClassType.id);

        if (error) throw error;
        toast.success('Class type updated successfully');
      } else {
        const { error } = await supabase
          .from('class_types')
          .insert([{
            ...classTypeData,
            created_at: new Date().toISOString(),
          }]);

        if (error) throw error;
        toast.success('Class type created successfully');
      }

      form.reset();
      setOpenDialog(false);
      setEditingClassType(null);
      loadClassTypes();
    } catch (error) {
      console.error('Error saving class type:', error);
      toast.error('Failed to save class type');
    }
  };

  const handleEdit = (classType: ClassType) => {
    setEditingClassType(classType);
    setOpenDialog(true);
  };

  const handleDelete = async () => {
    if (!deleteClassTypeId) return;
    
    try {
      const { error } = await supabase
        .from('class_types')
        .delete()
        .eq('id', deleteClassTypeId);
        
      if (error) throw error;
      
      toast.success('Class type deleted successfully');
      loadClassTypes();
      setDeleteDialogOpen(false);
      setDeleteClassTypeId(null);
    } catch (error) {
      console.error('Error deleting class type:', error);
      toast.error('Failed to delete class type');
    }
  };

  const confirmDelete = (id: string) => {
    setDeleteClassTypeId(id);
    setDeleteDialogOpen(true);
  };

  return (
    <Container>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Class Types</h1>
        <Button onClick={() => {
          form.reset({ name: '', description: '', is_active: true });
          setEditingClassType(null);
          setOpenDialog(true);
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Add Class Type
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Class Types</CardTitle>
          <CardDescription>
            Manage types of classes offered in your gym
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : classTypes.length === 0 ? (
            <div className="text-center py-10">
              <p>No class types found</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  form.reset({ name: '', description: '', is_active: true });
                  setEditingClassType(null);
                  setOpenDialog(true);
                }}
              >
                Create your first class type
              </Button>
            </div>
          ) : (
            <div className="border rounded-md">
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
                  {classTypes.map((classType) => (
                    <TableRow key={classType.id}>
                      <TableCell className="font-medium">{classType.name}</TableCell>
                      <TableCell>
                        {classType.description || "No description"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={classType.is_active ? "success" : "destructive"}>
                          {classType.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(classType)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => confirmDelete(classType.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingClassType ? 'Edit Class Type' : 'Create Class Type'}
            </DialogTitle>
            <DialogDescription>
              {editingClassType 
                ? 'Update the details of this class type' 
                : 'Enter the details for the new class type'}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Class Type Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe this class type" 
                        {...field} 
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    form.reset();
                    setOpenDialog(false);
                    setEditingClassType(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingClassType ? 'Update' : 'Create'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this class type? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setDeleteClassTypeId(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default ClassTypesPage;
