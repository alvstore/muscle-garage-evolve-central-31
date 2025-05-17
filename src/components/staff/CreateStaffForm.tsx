
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Upload } from 'lucide-react';
import { useToast } from '@/hooks/ui/use-toast';
import { useStaff } from '@/hooks/staff/use-staff';
import { useBranch } from '@/hooks/settings/use-branches';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  role: 'staff' | 'trainer' | 'admin';
  department?: string;
  branch_id?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  id_type?: string;
  id_number?: string;
}

export interface CreateStaffFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  staff?: StaffMember[];
  refetch?: () => Promise<void>;
}

export interface StaffMember {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  role: 'staff' | 'trainer' | 'admin';
  department?: string;
  branch_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const CreateStaffForm = ({ onSuccess, onCancel }: CreateStaffFormProps) => {
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<FormData>();
  const { toast } = useToast();
  const { createStaffMember } = useStaff();
  const { branches, currentBranch } = useBranch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('basic-info');
  const [idDocument, setIdDocument] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  
  const password = watch('password');

  const onSubmit = async (data: FormData) => {
    if (data.password !== data.confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create the staff member auth user
      const { data: authData, error } = await createStaffMember({
        email: data.email,
        password: data.password,
        name: data.name,
        role: data.role,
      });

      if (error) {
        throw new Error(error);
      }

      if (!authData?.id) {
        throw new Error('Failed to create staff member');
      }

      // Default branch to current branch if not specified
      const branchId = data.branch_id || currentBranch?.id;

      // Create or update the profile with additional information
      const profileUpdate = {
        full_name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role,
        department: data.department,
        branch_id: branchId,
        address: data.address,
        city: data.city,
        state: data.state,
        country: data.country,
        id_type: data.id_type,
        id_number: data.id_number,
        is_branch_manager: false,
      };

      const { error: profileError } = await supabase
        .from('profiles')
        .update(profileUpdate)
        .eq('id', authData.id);

      if (profileError) {
        throw new Error(profileError.message);
      }

      // Upload ID document if provided
      if (idDocument && authData.id) {
        setIsUploading(true);
        const fileExt = idDocument.name.split('.').pop();
        const filePath = `documents/${authData.id}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('documents')
          .upload(filePath, idDocument, {
            cacheControl: '3600',
            upsert: true
          });

        if (uploadError) {
          console.error('Error uploading document:', uploadError);
          toast({
            title: 'Warning',
            description: 'Staff member created but document upload failed',
            variant: 'destructive',
          });
        }
        
        setIsUploading(false);
      }

      toast({
        title: 'Success',
        description: 'Staff member created successfully',
      });

      reset();
      if (onSuccess) {
        onSuccess();
      }

    } catch (error: any) {
      console.error('Error creating staff member:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create staff member',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIdDocument(e.target.files[0]);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic-info" className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                {...register('name', { required: 'Name is required' })}
                placeholder="Full name"
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Invalid email address',
                  },
                })}
                placeholder="Email address"
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                {...register('password', { 
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
                placeholder="Password"
              />
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <Input
                id="confirmPassword"
                type="password"
                {...register('confirmPassword', {
                  required: 'Please confirm password',
                  validate: value => value === password || 'Passwords do not match',
                })}
                placeholder="Confirm password"
              />
              {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Select
                onValueChange={(value) => {
                  const event = {
                    target: {
                      name: 'role',
                      value
                    }
                  };
                  register('role').onChange(event);
                }}
                defaultValue="staff"
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="trainer">Trainer</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <input type="hidden" {...register('role', { required: true })} defaultValue="staff" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="branch_id">Branch</Label>
              <Select
                onValueChange={(value) => {
                  const event = {
                    target: {
                      name: 'branch_id',
                      value
                    }
                  };
                  register('branch_id').onChange(event);
                }}
                defaultValue={currentBranch?.id}
              >
                <SelectTrigger id="branch_id">
                  <SelectValue placeholder="Select branch" />
                </SelectTrigger>
                <SelectContent>
                  {branches.map(branch => (
                    <SelectItem key={branch.id} value={branch.id}>{branch.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input type="hidden" {...register('branch_id')} defaultValue={currentBranch?.id} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                {...register('phone')}
                placeholder="Phone number"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                {...register('department')}
                placeholder="Department"
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="contact" className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              {...register('address')}
              placeholder="Street address"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                {...register('city')}
                placeholder="City"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                {...register('state')}
                placeholder="State"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              {...register('country')}
              defaultValue="India"
              placeholder="Country"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="documents" className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="id_type">ID Type</Label>
              <Select
                onValueChange={(value) => {
                  const event = {
                    target: {
                      name: 'id_type',
                      value
                    }
                  };
                  register('id_type').onChange(event);
                }}
              >
                <SelectTrigger id="id_type">
                  <SelectValue placeholder="Select ID type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="passport">Passport</SelectItem>
                  <SelectItem value="drivers_license">Driver's License</SelectItem>
                  <SelectItem value="national_id">National ID</SelectItem>
                  <SelectItem value="aadhar">Aadhar Card</SelectItem>
                  <SelectItem value="pan">PAN Card</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <input type="hidden" {...register('id_type')} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="id_number">ID Number</Label>
              <Input
                id="id_number"
                {...register('id_number')}
                placeholder="ID number"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="id_document">Upload ID Document</Label>
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="flex items-center justify-center w-full">
                    <label 
                      htmlFor="id_document"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-3 text-gray-500 dark:text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          {idDocument ? idDocument.name : 'Click to upload or drag and drop'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG or PDF (MAX. 5MB)</p>
                      </div>
                      <input 
                        id="id_document" 
                        type="file" 
                        className="hidden" 
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                  {uploadProgress > 0 && isUploading && (
                    <div className="w-full mt-2">
                      <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700">
                        <div 
                          className="h-2 bg-blue-600 rounded-full" 
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-right mt-1">{uploadProgress}%</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between pt-4">
        {onCancel ? (
          <Button 
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        ) : (
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => {
              if (activeTab === 'basic-info') {
                setActiveTab('contact');
              } else if (activeTab === 'contact') {
                setActiveTab('documents');
              }
            }}
            disabled={activeTab === 'documents' || isSubmitting}
          >
            Next
          </Button>
        )}
        
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Staff Member
        </Button>
      </div>
    </form>
  );
};

export default CreateStaffForm;
