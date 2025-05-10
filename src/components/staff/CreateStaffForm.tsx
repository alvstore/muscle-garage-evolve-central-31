
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { useStaff } from "@/hooks/use-staff";
import { useBranch } from "@/hooks/use-branch";
import generatePassword from "@/lib/generatePassword";
import ProfileImageUpload from "@/components/members/ProfileImageUpload";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

// Define the staff member type
export type StaffMember = {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  role: 'staff' | 'trainer' | 'admin';
  department?: string;
  branch_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  gender?: string;
  id_type?: string;
  id_number?: string;
  id_document_url?: string;
};

// Define the form schema
const formSchema = z.object({
  fullName: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(6, {
    message: "Phone number must be at least 6 characters.",
  }).optional(),
  role: z.enum(['staff', 'trainer', 'admin'], {
    required_error: "You need to select a role.",
  }),
  department: z.string().min(2, {
    message: "Department must be at least 2 characters.",
  }).optional(),
  gender: z.enum(['male', 'female', 'other'], {
    required_error: "Please select a gender.",
  }).optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  id_type: z.string().optional(),
  id_number: z.string().optional(),
  branchId: z.string().optional(),
  isActive: z.boolean().default(true),
  isBranchManager: z.boolean().default(false),
});

interface CreateStaffFormProps {
  staff: StaffMember[];
  refetch: () => void;
  onSuccess?: () => void;
  onCancel?: () => void;
  initialData?: Partial<StaffMember>;
}

export default function CreateStaffForm({
  staff,
  refetch,
  onSuccess,
  onCancel,
  initialData
}: CreateStaffFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [idDocumentFile, setIdDocumentFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | undefined>(initialData?.id_document_url);
  const { createStaffMember, updateStaffMember } = useStaff();
  const { branches, currentBranch } = useBranch();
  const [tempUserId, setTempUserId] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: initialData?.full_name || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      role: (initialData?.role as 'staff' | 'trainer' | 'admin') || 'staff',
      department: initialData?.department || "",
      gender: initialData?.gender as 'male' | 'female' | 'other' | undefined,
      address: initialData?.address || "",
      city: initialData?.city || "",
      state: initialData?.state || "",
      country: initialData?.country || "India",
      id_type: initialData?.id_type || "",
      id_number: initialData?.id_number || "",
      branchId: initialData?.branch_id || currentBranch?.id || "",
      isActive: initialData?.is_active !== undefined ? initialData.is_active : true,
      isBranchManager: false,
    },
  });

  useEffect(() => {
    // Set branch ID if current branch is available and no initialData
    if (currentBranch?.id && !initialData?.branch_id) {
      form.setValue('branchId', currentBranch.id);
    }
  }, [currentBranch, form, initialData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIdDocumentFile(file);
      
      // Create a preview URL
      const objectUrl = URL.createObjectURL(file);
      setPreviewImage(objectUrl);
      
      return () => URL.revokeObjectURL(objectUrl);
    }
  };

  const uploadIdDocument = async (userId: string): Promise<string | null> => {
    if (!idDocumentFile) return null;
    
    try {
      const fileExt = idDocumentFile.name.split('.').pop();
      const filePath = `staff-documents/${userId}-${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('documents')
        .upload(filePath, idDocumentFile);
      
      if (error) throw error;
      
      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);
      
      return publicUrlData.publicUrl;
    } catch (error) {
      console.error('Error uploading ID document:', error);
      return null;
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!values.branchId && !currentBranch?.id) {
      toast.error("Please select a branch");
      return;
    }
    
    const branchId = values.branchId || currentBranch?.id;
    
    setIsSubmitting(true);
    
    try {
      // Generate a secure random password for new users
      const password = generatePassword(12);
      
      let userId;
      let documentUrl: string | null = null;
      
      if (initialData?.id) {
        // Update existing staff member
        await updateStaffMember(initialData.id, {
          name: values.fullName,
          email: values.email,
          phone: values.phone || '',
          role: values.role,
          department: values.department || '',
          branch_id: branchId,
          address: values.address,
          city: values.city,
          state: values.state,
          country: values.country,
          gender: values.gender,
          id_type: values.id_type,
          id_number: values.id_number,
          is_active: values.isActive,
          is_branch_manager: values.isBranchManager,
        });
        
        userId = initialData.id;
      } else {
        // Create new staff member
        const result = await createStaffMember({
          email: values.email,
          password,
          name: values.fullName,
          role: values.role,
        });
        
        if (result.error) {
          toast.error(`Failed to create staff member: ${result.error}`);
          setIsSubmitting(false);
          return;
        }
        
        userId = result.data?.id;
        setTempUserId(userId);
        
        // Update the profile with additional information
        if (userId) {
          await supabase
            .from('profiles')
            .update({
              full_name: values.fullName,
              phone: values.phone || null,
              role: values.role,
              department: values.department || null,
              branch_id: branchId,
              address: values.address || null,
              city: values.city || null,
              state: values.state || null,
              country: values.country || 'India',
              gender: values.gender || null,
              id_type: values.id_type || null,
              id_number: values.id_number || null,
              is_active: values.isActive,
              is_branch_manager: values.isBranchManager,
            })
            .eq('id', userId);
        }
        
        // Temporary password notification
        toast.info(`Temporary password: ${password}`, {
          duration: 10000,
          action: {
            label: 'Copy',
            onClick: () => {
              navigator.clipboard.writeText(password);
              toast.success('Password copied to clipboard');
            }
          }
        });
      }
      
      // Upload ID document if provided
      if (idDocumentFile && userId) {
        documentUrl = await uploadIdDocument(userId);
        
        if (documentUrl) {
          await supabase
            .from('profiles')
            .update({ id_document_url: documentUrl })
            .eq('id', userId);
        }
      }
      
      toast.success(`Staff member ${initialData ? 'updated' : 'created'} successfully`);
      
      if (onSuccess) {
        onSuccess();
      }
      
      refetch();
    } catch (error: any) {
      toast.error(`An error occurred: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john.doe@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="+1234567890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="staff" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Staff
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="trainer" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Trainer
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="admin" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Admin
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                  <FormControl>
                    <Input placeholder="Front Desk / Fitness / Management" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="branchId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Branch</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select branch" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {branches.map(branch => (
                        <SelectItem key={branch.id} value={branch.id}>
                          {branch.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-6">
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="City" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input placeholder="State" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input placeholder="Country" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Card className="border border-gray-200">
              <CardContent className="pt-4">
                <FormLabel className="mb-2 block">ID Document</FormLabel>
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="id_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ID Type</FormLabel>
                          <FormControl>
                            <Input placeholder="Passport, Driver's license, etc." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="id_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ID Number</FormLabel>
                          <FormControl>
                            <Input placeholder="ID number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="mt-4">
                    <FormLabel>Upload ID Document</FormLabel>
                    <div className="mt-2">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          {previewImage ? (
                            <div className="w-full h-full overflow-hidden relative">
                              <img 
                                src={previewImage} 
                                alt="ID Document Preview" 
                                className="w-full h-full object-contain" 
                              />
                            </div>
                          ) : (
                            <>
                              <Upload className="w-8 h-8 mb-2 text-gray-500" />
                              <p className="mb-2 text-sm text-gray-500">
                                <span className="font-semibold">Click to upload</span> or drag and drop
                              </p>
                              <p className="text-xs text-gray-500">
                                PNG, JPG, PDF (MAX. 5MB)
                              </p>
                            </>
                          )}
                        </div>
                        <input 
                          type="file" 
                          className="hidden" 
                          accept=".jpg,.jpeg,.png,.pdf" 
                          onChange={handleFileChange}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <FormField
          control={form.control}
          name="isBranchManager"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  Branch Manager
                </FormLabel>
                <FormDescription>
                  Branch managers have additional permissions.
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

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  Active
                </FormLabel>
                <FormDescription>
                  Inactive staff members cannot log in.
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

        <div className="flex gap-2 justify-end">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {initialData ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              initialData ? 'Update Staff Member' : 'Create Staff Member'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
