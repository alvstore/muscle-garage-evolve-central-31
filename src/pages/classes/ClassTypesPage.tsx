import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useBranch } from '@/hooks/use-branch';
import { ClassType } from '@/types/classes';
import { classTypesService } from '@/services/class-types-service';

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Class type name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
});

const ClassTypesPage = () => {
  const [classTypes, setClassTypes] = useState<ClassType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedClassTypeId, setSelectedClassTypeId] = useState<string | null>(null);
  const { currentBranch } = useBranch();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      is_active: true,
    },
  });

  const fetchClassTypes = useCallback(async () => {
    setIsLoading(true);
    try {
      // Use the service instead of direct Supabase calls
      const classTypes = await classTypesService.fetchClassTypes();
      setClassTypes(classTypes);
    } catch (error) {
      console.error("Error fetching class types:", error);
      toast.error("Could not load class types");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClassTypes();
  }, [fetchClassTypes]);

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedClassTypeId(null);
    form.reset();
  };

  const handleCreateClassType = async (data: {
    name: string;
    description: string;
    is_active: boolean;
  }) => {
    try {
      setIsCreating(true);
      // Use the service instead of direct Supabase calls
      const newClassType = await classTypesService.createClassType({
        ...data,
        branch_id: currentBranch?.id
      });
      
      setClassTypes([...classTypes, newClassType]);
      toast.success("Class type created successfully");
      setIsDialogOpen(false);
      form.reset();
    } catch (error) {
      console.error("Error creating class type:", error);
      toast.error("Failed to create class type");
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateClassType = async (id: string, data: Partial<ClassType>) => {
    try {
      setIsUpdating(true);
      // Use the service instead of direct Supabase calls
      const updatedClassType = await classTypesService.updateClassType(id, data);
      
      setClassTypes(
        classTypes.map((type) =>
          type.id === id ? updatedClassType : type
        )
      );
      toast.success("Class type updated successfully");
      return true;
    } catch (error) {
      console.error("Error updating class type:", error);
      toast.error("Failed to update class type");
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteClassType = async (id: string) => {
    try {
      setIsDeleting(true);
      // Use the service instead of direct Supabase calls
      await classTypesService.deleteClassType(id);
      
      setClassTypes(classTypes.filter((type) => type.id !== id));
      toast.success("Class type deleted successfully");
    } catch (error) {
      console.error("Error deleting class type:", error);
      toast.error("Failed to delete class type");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Class Types</h1>
        <Button onClick={handleOpenDialog}>Add Class Type</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Class Types</CardTitle>
          <CardDescription>
            Manage and view different types of classes offered.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
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
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">Loading class types...</TableCell>
                  </TableRow>
                ) : classTypes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">No class types found.</TableCell>
                  </TableRow>
                ) : (
                  classTypes.map((classType) => (
                    <TableRow key={classType.id}>
                      <TableCell className="font-medium">{classType.name}</TableCell>
                      <TableCell>{classType.description}</TableCell>
                      <TableCell>{classType.is_active ? "Active" : "Inactive"}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedClassTypeId(classType.id);
                            form.setValue("name", classType.name);
                            form.setValue("description", classType.description || "");
                            form.setValue("is_active", classType.is_active);
                            setIsDialogOpen(true);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteClassType(classType.id)}
                          disabled={isDeleting}
                        >
                          {isDeleting ? "Deleting..." : "Delete"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>{selectedClassTypeId ? "Edit Class Type" : "Create Class Type"}</DialogTitle>
            <DialogDescription>
              {selectedClassTypeId ? "Update class type details." : "Create a new class type."}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(selectedClassTypeId ? (data) => handleUpdateClassType(selectedClassTypeId, data) : handleCreateClassType)} className="space-y-4">
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
                      <Input placeholder="Class Type Description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active</FormLabel>
                      <FormDescription>
                        Set class type as active or inactive
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isCreating || isUpdating}>
                  {isCreating ? "Creating..." : isUpdating ? "Updating..." : "Save changes"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClassTypesPage;
