import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useBranch } from '@/hooks/use-branch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Upload, X } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

// Define department options with colors
const departmentOptions = [
  { value: "reception", label: "Reception", color: "#FF5733" },
  { value: "training", label: "Training", color: "#33FF57" },
  { value: "management", label: "Management", color: "#3357FF" },
  { value: "sales", label: "Sales", color: "#F033FF" },
  { value: "maintenance", label: "Maintenance", color: "#FF3393" },
  { value: "cleaning", label: "Cleaning", color: "#33FFF3" },
  { value: "security", label: "Security", color: "#FFDD33" },
  { value: "nutrition", label: "Nutrition", color: "#8C33FF" },
];

// Define the schema for the staff form - removed role field
const staffSchema = z.object({
  full_name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phone: z.string().min(10, { message: 'Phone number must be at least 10 digits.' }),
  department: z.string().min(1, { message: 'Department is required.' }),
  bio: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().default('India'),
  is_active: z.boolean().default(true),
});

type FormValues = z.infer<typeof staffSchema>;

export interface StaffMember {
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
}

interface CreateStaffFormProps {
  onSuccess?: (data: any) => void;
  onCancel?: () => void;
  staff: StaffMember[];
  refetch: () => Promise<void>;
  handleSubmit?: (staffData: any) => Promise<void>;
}

const CreateStaffForm: React.FC<CreateStaffFormProps> = ({
  onSuccess,
  onCancel,
  refetch,
  handleSubmit
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>();
  const [previewImage, setPreviewImage] = useState<string>();
  const [dragActive, setDragActive] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const { currentBranch } = useBranch();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      full_name: '',
      email: '',
      phone: '',
      department: '',
      bio: '',
      address: '',
      city: '',
      state: '',
      country: 'India',
      is_active: true,
    },
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      setIsLoading(true);
      
      // Create a preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      const fileExt = file.name.split('.').pop();
      const filePath = `${Math.random()}.${fileExt}`;

      // Upload image to Supabase storage
      const { data, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setAvatarUrl(publicUrl);
      toast.success("Image uploaded successfully");
    } catch (error: any) {
      toast.error(error.message || "Error uploading image");
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (name: string): string => {
    if (!name) return "";
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const onSubmit = async (data: FormValues) => {
    if (!currentBranch?.id) {
      toast.error('Please select a branch first');
      return;
    }
    
    setIsLoading(true);
    try {
      if (handleSubmit) {
        await handleSubmit(data);
        return;
      }
      
      // First create the auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: data.email,
        password: 'TemporaryPassword123!', // This should be changed on first login
        email_confirm: true,
        user_metadata: {
          full_name: data.full_name,
          role: 'staff' // Set default role to 'staff'
        }
      });
      
      if (authError) throw authError;
      
      if (!authData.user) {
        throw new Error('Failed to create user');
      }
      
      // Then create the profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: authData.user.id,
          full_name: data.full_name,
          email: data.email,
          phone: data.phone,
          role: 'staff', // Set default role to 'staff'
          department: data.department,
          branch_id: currentBranch.id,
          is_active: data.is_active,
          bio: data.bio,
          address: data.address,
          city: data.city,
          state: data.state,
          country: data.country,
          avatar_url: avatarUrl,
        });
        
      if (profileError) throw profileError;
      
      toast.success('Staff member created successfully');
      await refetch();
      if (onSuccess) onSuccess(data);
    } catch (error: any) {
      console.error('Error creating staff member:', error);
      toast.error(error.message || 'Failed to create staff member');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/20 to-primary/10 pb-8">
            <CardTitle className="text-center">Create New Staff Member</CardTitle>
          </CardHeader>
          
          <div className="flex justify-center -mt-10 relative z-10">
            <div 
              className={`relative group cursor-pointer h-24 w-24 rounded-full border-4 border-background overflow-hidden ${dragActive ? 'ring-2 ring-primary' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => document.getElementById('avatar-upload')?.click()}
            >
              {previewImage ? (
                <>
                  <img 
                    src={previewImage} 
                    alt="Preview" 
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="h-8 w-8 text-white" />
                  </div>
                </>
              ) : (
                <div className="h-full w-full bg-muted flex items-center justify-center">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
              <input
                type="file"
                id="avatar-upload"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={isLoading}
              />
            </div>
          </div>
          
          <CardContent className="p-6 pt-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="additional">Additional Info</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="full_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter full name" {...field} />
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
                        <FormLabel>Email *</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Enter email" {...field} />
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
                        <FormLabel>Phone *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Role field removed */}
                  
                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Department *</FormLabel>
                        <FormControl>
                          <div className="border border-input rounded-md p-2">
                            <div className="flex flex-wrap gap-2 mb-2">
                              {field.value && (
                                <div 
                                  key={field.value}
                                  className="flex items-center gap-1 px-3 py-1 rounded-full text-white text-sm"
                                  style={{ backgroundColor: departmentOptions.find(opt => opt.value === field.value)?.color || '#888888' }}
                                >
                                  {departmentOptions.find(opt => opt.value === field.value)?.label}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      field.onChange('');
                                    }}
                                    className="ml-1 rounded-full hover:bg-white/20 p-1"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </div>
                              )}
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                              {departmentOptions.filter(option => option.value !== field.value).map((option) => (
                                <button
                                  key={option.value}
                                  type="button"
                                  onClick={() => {
                                    field.onChange(option.value);
                                  }}
                                  className="flex items-center justify-between px-3 py-2 rounded-md border border-input hover:bg-accent transition-colors"
                                >
                                  <span>{option.label}</span>
                                  <div 
                                    className="h-4 w-4 rounded-full" 
                                    style={{ backgroundColor: option.color }}
                                  />
                                </button>
                              ))}
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Brief description about experience and qualifications" 
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="additional" className="space-y-6">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder="Enter address" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter city" {...field} />
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
                            <Input placeholder="Enter state" {...field} />
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
                            <Input defaultValue="India" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button 
            type="submit" 
            className="bg-gradient-to-r from-primary to-primary/80 text-white" 
            disabled={isLoading}
          >
            {isLoading ? 'Creating...' : 'Create Staff Member'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateStaffForm;
