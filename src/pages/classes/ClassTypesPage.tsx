
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, MoreVertical, Search, Edit, Trash2, AlertCircle } from 'lucide-react';
import { useClassTypes, useCreateClassType, useUpdateClassType, useDeleteClassType } from '@/hooks/classes/use-class-types';
import { useBranch } from '@/hooks/settings/use-branches';
import { ClassType } from '@/types/classes';
import ClassTypeForm from '@/components/classes/ClassTypeForm';
import { format, parseISO } from 'date-fns';
import { toast } from 'sonner';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';

interface ClassTypesPageProps {
  hideHeader?: boolean;
}

const ClassTypesPage: React.FC<ClassTypesPageProps> = ({ hideHeader = false }) => {
  // State for managing the form dialog
  const [formOpen, setFormOpen] = useState(false);
  const [selectedClassType, setSelectedClassType] = useState<ClassType | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [classTypeToDelete, setClassTypeToDelete] = useState<ClassType | null>(null);

  // Get current branch
  const { currentBranch } = useBranch();
  const branchId = currentBranch?.id;
  
  // Fetch class types for the current branch
  const { data: classTypes = [], isLoading, isError } = useClassTypes(branchId);
  
  // Mutations
  const { mutate: createClassType, isPending: isCreating } = useCreateClassType();
  const { mutate: updateClassType, isPending: isUpdating } = useUpdateClassType();
  const { mutate: deleteClassType, isPending: isDeleting } = useDeleteClassType();

  // Filter class types based on search query
  const filteredClassTypes = classTypes.filter(classType => 
    classType.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (classType.description && classType.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Handle form submission
  const handleSubmit = (data: Partial<ClassType>) => {
    if (selectedClassType) {
      // Update existing class type
      updateClassType({ 
        id: selectedClassType.id, 
        updates: data 
      }, {
        onSuccess: () => {
          setFormOpen(false);
          setSelectedClassType(null);
        }
      });
    } else {
      // Create new class type
      createClassType(data, {
        onSuccess: () => {
          setFormOpen(false);
        }
      });
    }
  };

  // Handle edit button click
  const handleEdit = (classType: ClassType) => {
    setSelectedClassType(classType);
    setFormOpen(true);
  };

  // Handle delete button click
  const handleDeleteClick = (classType: ClassType) => {
    setClassTypeToDelete(classType);
    setDeleteDialogOpen(true);
  };

  // Handle confirm delete
  const handleConfirmDelete = () => {
    if (classTypeToDelete) {
      deleteClassType(classTypeToDelete.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setClassTypeToDelete(null);
        }
      });
    }
  };

  // Create new class type
  const handleCreateNew = () => {
    setSelectedClassType(null);
    setFormOpen(true);
  };

  return (
    <div>
      {!hideHeader && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>Class Types</CardTitle>
              <CardDescription>
                Manage your gym class types
              </CardDescription>
            </div>
            <Button onClick={handleCreateNew} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Class Type
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex items-center py-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search class types..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : isError ? (
              <div className="flex justify-center items-center h-64 text-destructive">
                <AlertCircle className="mr-2 h-5 w-5" />
                Error loading class types
              </div>
            ) : filteredClassTypes.length === 0 ? (
              <div className="flex flex-col justify-center items-center h-64 text-muted-foreground">
                <div className="text-lg font-medium">No class types found</div>
                <p className="text-sm mt-1">
                  {searchQuery ? "Try a different search term" : "Create your first class type to get started"}
                </p>
                {!searchQuery && (
                  <Button onClick={handleCreateNew} variant="outline" className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Class Type
                  </Button>
                )}
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="w-[80px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClassTypes.map((classType) => (
                      <TableRow key={classType.id}>
                        <TableCell className="font-medium">{classType.name}</TableCell>
                        <TableCell className="max-w-xs truncate">
                          {classType.description || "No description"}
                        </TableCell>
                        <TableCell>
                          <Badge variant={classType.is_active ? "default" : "secondary"}>
                            {classType.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {classType.created_at 
                            ? format(parseISO(classType.created_at), 'MMM d, yyyy')
                            : "N/A"}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEdit(classType)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDeleteClick(classType)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
      
      {hideHeader && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Class Types</h2>
            <Button onClick={handleCreateNew} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Class Type
            </Button>
          </div>
          
          {/* Same table content as above, just without the card wrapper */}
          {/* This is for when the component is used inside another card */}
          {/* ... */}
        </div>
      )}
      
      {/* Class Type Form Dialog */}
      <ClassTypeForm
        open={formOpen}
        onOpenChange={setFormOpen}
        initialData={selectedClassType}
        onSubmit={handleSubmit}
        isSubmitting={isCreating || isUpdating}
      />
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the class type "{classTypeToDelete?.name}".
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ClassTypesPage;
