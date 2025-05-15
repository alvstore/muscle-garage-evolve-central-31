import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Save, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useStaff, StaffMember } from '@/hooks/use-staff';
import { useBranch } from '@/hooks/use-branch';
import { supabase } from '@/integrations/supabase/client';

interface EditFormData {
  name: string;
  email: string;
  phone?: string;
  role: 'staff' | 'trainer' | 'admin';
  department?: string;
  branch_id?: string;
  is_active: boolean;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  id_type?: string;
  id_number?: string;
  gender?: string;
  is_branch_manager?: boolean;
}

export interface EditStaffFormProps {
  staffId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const EditStaffForm = ({ staffId, onSuccess, onCancel }: EditStaffFormProps) => {
  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<EditFormData>();
  const { toast } = useToast();
  const { staff, isLoading: isStaffLoading, fetchStaff, updateStaffMember } = useStaff();
  const { branches, currentBranch } = useBranch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('basic-info');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Load staff member data
  useEffect(() => {
    if (staffId && staff.length > 0) {
      const staffMember = staff.find(member => member.id === staffId);
      if (staffMember) {
        // Populate form with staff member data
        setValue('name', staffMember.name);
        setValue('email', staffMember.email);
        setValue('phone', staffMember.phone || '');
        setValue('role', staffMember.role as 'staff' | 'trainer' | 'admin');
        setValue('department', staffMember.department || '');
        setValue('branch_id', staffMember.branch_id || currentBranch?.id || '');
        setValue('is_active', staffMember.is_active);
        setValue('address', staffMember.address || '');
        setValue('city', staffMember.city || '');
        setValue('state', staffMember.state || '');
        setValue('country', staffMember.country || '');
        setValue('id_type', staffMember.id_type || '');
        setValue('id_number', staffMember.id_number || '');
        setValue('gender', staffMember.gender || '');
        setValue('is_branch_manager', staffMember.is_branch_manager || false);
        
        // Set avatar URL if available
        if (staffMember.avatar_url) {
          setAvatarUrl(staffMember.avatar_url);
        }
        
        setIsLoading(false);
      }
    }
  }, [staffId, staff, setValue, currentBranch]);

  // Fetch staff data if not already loaded
  useEffect(() => {
    if (!staff.length) {
      fetchStaff();
    }
  }, [staff, fetchStaff]);

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      
      // Create a preview URL
      const objectUrl = URL.createObjectURL(file);
      setAvatarUrl(objectUrl);
      
      // Clean up the preview URL when component unmounts
      return () => URL.revokeObjectURL(objectUrl);
    }
  };

  const uploadProfileImage = async (userId: string): Promise<string | null> => {
    if (!profileImage) return null;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // First check if the bucket exists, if not create it
      const { data: buckets } = await supabase.storage.listBuckets();
      const profilesBucketExists = buckets?.some(bucket => bucket.name === 'avatars');
      
      // If bucket doesn't exist, try to create it
      if (!profilesBucketExists) {
        const { error: createBucketError } = await supabase.storage.createBucket('avatars', {
          public: true
        });
        
        if (createBucketError) {
          console.error('Error creating bucket:', createBucketError);
          // If we can't create the bucket, just return the existing avatar URL
          return avatarUrl;
        }
      }
      
      const fileExt = profileImage.name.split('.').pop();
      const filePath = `${userId}/avatar.${fileExt}`;
      
      // Upload the file to the avatars bucket
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, profileImage, {
          upsert: true,
          onUploadProgress: (progress) => {
            const percentage = Math.round((progress.loaded / progress.total) * 100);
            setUploadProgress(percentage);
          }
        });
      
      if (uploadError) {
        console.error('Upload error:', uploadError);
        // If upload fails, return existing avatar URL
        return avatarUrl;
      }
      
      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
      
      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading profile image:', error);
      toast({
        title: 'Upload Failed',
        description: 'Profile image could not be uploaded, but other changes will be saved',
        variant: 'destructive',
      });
      // Return existing avatar URL if there's an error
      return avatarUrl;
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: EditFormData) => {
    if (!staffId) {
      toast({
        title: 'Error',
        description: 'Staff ID is missing',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload profile image if selected
      let profileImageUrl = null;
      if (profileImage) {
        profileImageUrl = await uploadProfileImage(staffId);
      }

      // Update staff member
      const updateData = {
        ...data,
        avatar_url: profileImageUrl || avatarUrl,
        updated_at: new Date().toISOString()
      };

      const { success, error } = await updateStaffMember(staffId, updateData);

      if (!success) {
        throw new Error(error);
      }

      toast({
        title: 'Success',
        description: 'Staff member updated successfully',
      });
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update staff member',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || isStaffLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin mr-2" />
        <p>Loading staff member data...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-full md:max-w-md mb-6 overflow-hidden">
          <TabsTrigger value="basic-info" className="text-xs md:text-sm">Basic Information</TabsTrigger>
          <TabsTrigger value="additional-info" className="text-xs md:text-sm">Additional Details</TabsTrigger>
        </TabsList>

        <TabsContent value="basic-info" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-4">
                {/* Profile Image */}
                <div className="flex flex-col items-center mb-4">
                  <div className="w-24 h-24 rounded-full overflow-hidden mb-2 bg-gray-100 flex items-center justify-center">
                    {avatarUrl ? (
                      <img 
                        src={avatarUrl} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-gray-400 text-4xl font-light">
                        {/* Placeholder for no image */}
                        ?
                      </div>
                    )}
                  </div>
                  <div className="flex items-center">
                    <label htmlFor="profile-image" className="cursor-pointer">
                      <div className="flex items-center text-sm text-primary-600 hover:text-primary-700">
                        <Upload className="h-4 w-4 mr-1" />
                        <span>Upload Photo</span>
                      </div>
                      <input
                        id="profile-image"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleProfileImageChange}
                      />
                    </label>
                  </div>
                  {isUploading && (
                    <div className="w-full mt-2">
                      <div className="h-1 w-full bg-gray-200 rounded">
                        <div 
                          className="h-1 bg-primary-600 rounded" 
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-center mt-1">{uploadProgress}%</p>
                    </div>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    {...register('name', { required: 'Name is required' })}
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm">{errors.name.message}</p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">{errors.email.message}</p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    {...register('phone')}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    defaultValue={staff.find(s => s.id === staffId)?.role || 'staff'}
                    onValueChange={(value) => setValue('role', value as 'staff' | 'trainer' | 'admin')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="staff">Staff</SelectItem>
                      <SelectItem value="trainer">Trainer</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    {...register('department')}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="branch">Branch</Label>
                  <Select
                    defaultValue={staff.find(s => s.id === staffId)?.branch_id || currentBranch?.id}
                    onValueChange={(value) => setValue('branch_id', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select branch" />
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

                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    defaultValue={staff.find(s => s.id === staffId)?.is_active ? 'active' : 'inactive'}
                    onValueChange={(value) => setValue('is_active', value === 'active')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="additional-info" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    {...register('address')}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      {...register('city')}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="state">State/Province</Label>
                    <Input
                      id="state"
                      {...register('state')}
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    {...register('country')}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    defaultValue={staff.find(s => s.id === staffId)?.gender || ''}
                    onValueChange={(value) => setValue('gender', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="id_type">ID Type</Label>
                    <Input
                      id="id_type"
                      {...register('id_type')}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="id_number">ID Number</Label>
                    <Input
                      id="id_number"
                      {...register('id_number')}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex flex-col sm:flex-row justify-center sm:justify-end mt-6 space-y-2 sm:space-y-0 sm:space-x-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default EditStaffForm;
