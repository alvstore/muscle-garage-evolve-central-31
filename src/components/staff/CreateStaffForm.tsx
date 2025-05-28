
import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Upload, User, X } from 'lucide-react';
import { useToast } from '@/hooks/ui/use-toast';
import { useStaff } from '@/hooks/team/use-staff';
import { useBranch } from '@/hooks/settings/use-branches';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

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
  const { register, handleSubmit, watch, reset, formState: { errors }, setValue } = useForm<FormData>();
  const { toast } = useToast();
  const { createStaffMember } = useStaff();
  const { branches, currentBranch } = useBranch();
  
  const departmentOptions = [
    'Administration',
    'Fitness',
    'Yoga',
    'CrossFit',
    'Maintenance',
    'Front Desk',
    'Management',
    'Other'
  ];
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('basic-info');
  const [idDocument, setIdDocument] = useState<File | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [showCustomDepartment, setShowCustomDepartment] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
          // Upload avatar if provided
      let avatarUrl = null;
      if (avatarFile) {
        try {
          setIsUploading(true);
          const fileExt = avatarFile.name.split('.').pop();
          const fileName = `${uuidv4()}.${fileExt}`;
          const filePath = `avatars/${fileName}`;
          
          const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, avatarFile, {
              cacheControl: '3600',
              upsert: false
            });
          
          if (uploadError) throw uploadError;
          
          // Get the public URL
          const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(filePath);
            
          avatarUrl = publicUrl;
        } catch (error) {
          console.error('Error uploading avatar:', error);
          toast({
            title: 'Warning',
            description: 'Avatar upload failed. You can update it later.',
            variant: 'destructive',
          });
        } finally {
          setIsUploading(false);
        }
      }

      // Create the staff member auth user
      const { data: authData, error } = await createStaffMember({
        email: data.email,
        password: data.password,
        name: data.name,
        role: data.role,
      });
      
      // Store the avatar URL in the profile if available
      if (avatarUrl && authData?.id) {
        await supabase
          .from('profiles')
          .update({ avatar_url: avatarUrl })
          .eq('id', authData.id);
      }

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'id' | 'avatar' = 'id') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'id') {
      setIdDocument(file);
    } else if (type === 'avatar') {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAvatarFile(null);
    setAvatarPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Avatar Upload Section */}
      <div className="flex flex-col items-center justify-center mb-6">
        <div className="relative group">
          <div className="relative h-24 w-24 rounded-full bg-muted flex items-center justify-center overflow-hidden">
            {avatarPreview ? (
              <img 
                src={avatarPreview} 
                alt="Profile preview" 
                className="h-full w-full object-cover"
              />
            ) : (
              <User className="h-12 w-12 text-muted-foreground" />
            )}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <Upload className="h-6 w-6 text-white" />
            </div>
          </div>
          {avatarPreview && (
            <button
              type="button"
              onClick={handleRemoveAvatar}
              className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1 hover:bg-destructive/90 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, 'avatar')}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
        <p className="text-sm text-muted-foreground mt-2">Click to upload profile picture</p>
      </div>

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
              <input type="hidden" {...register('role', { required: 'Role is required' })} />
              {errors.role && <p className="text-sm text-red-500">{errors.role.message}</p>}
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
              <Select
                onValueChange={(value) => setValue('department', value as any)}
                defaultValue={watch('department')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departmentOptions.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                  <SelectItem value="aadhar">Aadhar Card</SelectItem>
                  <SelectItem value="passport">Passport</SelectItem>
                  <SelectItem value="driving_license">Driving License</SelectItem>
                  <SelectItem value="voter_id">Voter ID</SelectItem>
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
            <Label>ID Document (Optional)</Label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="id-document"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                  >
                    <span>Upload a file</span>
                    <input
                      id="id-document"
                      name="id-document"
                      type="file"
                      className="sr-only"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={(e) => handleFileChange(e, 'id')}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                {idDocument && (
                  <p className="text-sm text-gray-900">
                    Selected: {idDocument.name}
                  </p>
                )}
              </div>
            </div>
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
