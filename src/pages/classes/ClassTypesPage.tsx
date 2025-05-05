
import React, { useEffect, useState } from 'react';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import { Plus, Loader2, RefreshCcw, Search } from 'lucide-react';
import { toast } from 'sonner';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
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

const ClassTypesPage = () => {
  const [classTypes, setClassTypes] = useState<ClassType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { currentBranch } = useBranch();
  const [editingType, setEditingType] = useState<ClassType | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    if (currentBranch?.id) {
      fetchClassTypes();
    }
  }, [currentBranch?.id]);

  const fetchClassTypes = async () => {
    try {
      setIsLoading(true);
      
      let query = supabase
        .from('class_types')
        .select('*');
      
      if (currentBranch?.id) {
        query = query.eq('branch_id', currentBranch.id);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      setClassTypes(data || []);
    } catch (error) {
      console.error('Error fetching class types:', error);
      toast.error('Failed to load class types');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('class_types')
        .update({ is_active: isActive })
        .eq('id', id);

      if (error) throw error;

      setClassTypes(prev => 
        prev.map(type => 
          type.id === id ? { ...type, is_active: isActive } : type
        )
      );
      
      toast.success(`Class type ${isActive ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error('Error updating class type status:', error);
      toast.error('Failed to update class type status');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // Check if this class type is used in any classes
      const { data: classes, error: checkError } = await supabase
        .from('classes')
        .select('id')
        .eq('type', id)
        .limit(1);

      if (checkError) throw checkError;

      if (classes && classes.length > 0) {
        toast.error('Cannot delete class type that is in use');
        return;
      }

      const { error } = await supabase
        .from('class_types')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setClassTypes(prev => prev.filter(type => type.id !== id));
      toast.success('Class type deleted successfully');
    } catch (error) {
      console.error('Error deleting class type:', error);
      toast.error('Failed to delete class type');
    }
  };

  const filteredClassTypes = classTypes.filter(type => 
    type.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    type.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns: ColumnDef<ClassType>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => row.original.description || "-",
    },
    {
      accessorKey: "is_active",
      header: "Status",
      cell: ({ row }) => {
        const isActive = row.original.is_active;
        return (
          <div className="flex items-center">
            <Switch 
              checked={isActive} 
              onCheckedChange={(checked) => handleStatusChange(row.original.id, checked)}
            />
            <Badge className={`ml-2 ${isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        );
      }
    },
    {
      accessorKey: "created_at",
      header: "Created",
      cell: ({ row }) => {
        return new Date(row.original.created_at).toLocaleDateString();
      }
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setEditingType(row.original)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-red-600" 
                onClick={() => handleDelete(row.original.id)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }
    }
  ];

  return (
    <Container>
      <div className="py-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Class Types</h1>
            <p className="text-muted-foreground">Manage your class types</p>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Class Type
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <CardTitle>All Class Types</CardTitle>
              <div className="flex gap-2 w-full sm:w-auto">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search class types..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon" onClick={fetchClassTypes} disabled={isLoading}>
                  <RefreshCcw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <DataTable 
                columns={columns} 
                data={filteredClassTypes} 
              />
            )}
          </CardContent>
        </Card>

        {/* Modal components would go here */}
        {/* For now we'll just show a message that this feature is coming soon */}
        {(isAddModalOpen || editingType) && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-96 max-w-full">
              <h2 className="text-xl font-bold mb-4">
                {editingType ? 'Edit Class Type' : 'Add Class Type'}
              </h2>
              <p>Form implementation coming soon!</p>
              <div className="flex justify-end mt-4">
                <Button variant="outline" className="mr-2" onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingType(null);
                }}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
};

export default ClassTypesPage;
