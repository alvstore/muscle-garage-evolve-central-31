import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusIcon, Loader2, Pencil, Trash2, CheckCircle, XCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRealtimeBranches } from "@/hooks/use-realtime-settings";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Branch } from "@/types/branch";

// Define the branch form schema
const branchFormSchema = z.object({
  name: z.string().min(1, { message: "Branch name is required." }),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().default("India"),
  phone: z.string().optional(),
  email: z.string().email({ message: "Invalid email address." }).optional().or(z.literal('')),
  is_active: z.boolean().default(true),
});

type BranchFormValues = z.infer<typeof branchFormSchema>;

const BranchForm = ({ 
  branch, 
  onSave, 
  onCancel 
}: { 
  branch?: Branch; 
  onSave: (data: BranchFormValues) => void; 
  onCancel: () => void;
}) => {
  const isEditing = !!branch?.id;
  
  const form = useForm<BranchFormValues>({
    resolver: zodResolver(branchFormSchema),
    defaultValues: branch ? {
      name: branch.name,
      address: branch.address || "",
      city: branch.city || "",
      state: branch.state || "",
      country: branch.country || "India",
      phone: branch.phone || "",
      email: branch.email || "",
      is_active: branch.is_active
    } : {
      name: "",
      address: "",
      city: "",
      state: "",
      country: "India",
      phone: "",
      email: "",
      is_active: true
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSave)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Branch Name *</FormLabel>
              <FormControl>
                <Input placeholder="Main Branch" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="123 Gym Street" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="Mumbai" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Input placeholder="Maharashtra" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input placeholder="India" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="+91 1234567890" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="branch@gym.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <DialogFooter className="pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">{isEditing ? "Update Branch" : "Create Branch"}</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

const BranchesSettings = () => {
  const { data: branches, isLoading } = useRealtimeBranches();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleNewBranch = () => {
    setSelectedBranch(undefined);
    setOpenDialog(true);
  };

  const handleEditBranch = (branch: Branch) => {
    setSelectedBranch(branch);
    setOpenDialog(true);
  };

  const handleSaveBranch = async (data: BranchFormValues) => {
    try {
      setIsSaving(true);
      
      if (selectedBranch?.id) {
        // Update existing branch
        const { error } = await supabase
          .from('branches')
          .update({
            ...data,
            updated_at: new Date().toISOString()
          })
          .eq('id', selectedBranch.id);
          
        if (error) throw error;
        
        toast.success("Branch updated successfully");
      } else {
        // Create new branch
        const { error } = await supabase
          .from('branches')
          .insert([{
            ...data,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }]);
          
        if (error) throw error;
        
        toast.success("Branch created successfully");
      }
      
      setOpenDialog(false);
    } catch (error: any) {
      toast.error(`Error saving branch: ${error.message}`);
      console.error("Error saving branch:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteBranch = async (id: string) => {
    try {
      setIsSaving(true);
      
      const { error } = await supabase
        .from('branches')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast.success("Branch deleted successfully");
      setDeleteConfirm(null);
    } catch (error: any) {
      toast.error(`Error deleting branch: ${error.message}`);
      console.error("Error deleting branch:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Branch Management</CardTitle>
            <CardDescription>Manage your gym locations</CardDescription>
          </div>
          <Button onClick={handleNewBranch}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Branch
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : branches.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No branches found. Click "Add Branch" to create your first branch.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Branch Name</TableHead>
                  <TableHead className="hidden sm:table-cell">Location</TableHead>
                  <TableHead className="hidden md:table-cell">Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {branches.map((branch) => (
                  <TableRow key={branch.id}>
                    <TableCell className="font-medium">{branch.name}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {[branch.city, branch.state].filter(Boolean).join(', ')}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {branch.phone || branch.email || 'N/A'}
                    </TableCell>
                    <TableCell>
                      {branch.is_active || branch.is_active ? (
                        <span className="flex items-center text-green-600">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Active
                        </span>
                      ) : (
                        <span className="flex items-center text-red-600">
                          <XCircle className="h-4 w-4 mr-1" />
                          Inactive
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditBranch(branch)}
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        
                        {deleteConfirm === branch.id ? (
                          <div className="flex items-center gap-1">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteBranch(branch.id)}
                              disabled={isSaving}
                              className="h-8"
                            >
                              {isSaving ? <Loader2 className="h-3 w-3 animate-spin" /> : "Confirm"}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteConfirm(null)}
                              className="h-8"
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteConfirm(branch.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedBranch ? "Edit Branch" : "Add New Branch"}</DialogTitle>
            <DialogDescription>
              {selectedBranch
                ? "Update the details of your existing branch."
                : "Create a new branch for your gym chain."}
            </DialogDescription>
          </DialogHeader>
          <BranchForm
            branch={selectedBranch}
            onSave={handleSaveBranch}
            onCancel={() => setOpenDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BranchesSettings;
