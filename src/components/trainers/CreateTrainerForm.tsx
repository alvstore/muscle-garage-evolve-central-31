
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/services/supabaseClient';
import { useBranch } from '@/hooks/use-branch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, Upload, Camera, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const specialtyOptions = [
  { value: "strength_training", label: "Strength Training", color: "#FF5733" },
  { value: "weight_loss", label: "Weight Loss", color: "#33FF57" },
  { value: "yoga", label: "Yoga", color: "#3357FF" },
  { value: "cardio", label: "Cardio", color: "#F033FF" },
  { value: "crossfit", label: "CrossFit", color: "#FF3393" },
  { value: "rehabilitation", label: "Rehabilitation", color: "#33FFF3" },
  { value: "nutrition", label: "Nutrition", color: "#FFDD33" },
  { value: "pilates", label: "Pilates", color: "#8C33FF" },
  { value: "martial_arts", label: "Martial Arts", color: "#FF8C33" },
  { value: "functional_training", label: "Functional Training", color: "#33FFAA" }
];

const trainerFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  gender: z.enum(['male', 'female', 'other']),
  specialties: z.array(z.string()).min(1, 'At least one specialty is required'),
  bio: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional()
});

type TrainerFormData = z.infer<typeof trainerFormSchema>;

export function CreateTrainerForm({ onSuccess }: { onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>();
  const [previewImage, setPreviewImage] = useState<string>();
  const [dragActive, setDragActive] = useState(false);
  const { currentBranch } = useBranch();
  const [activeTab, setActiveTab] = useState("basic");

  const form = useForm<TrainerFormData>({
    resolver: zodResolver(trainerFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      gender: 'male',
      specialties: [],
      bio: '',
      address: '',
      city: '',
      state: '',
      country: 'India'
    }
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
      setLoading(true);
      
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
      setLoading(false);
    }
  };

  const onSubmit = async (data: TrainerFormData) => {
    try {
      setLoading(true);
      
      const tempPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: tempPassword,
        options: {
          data: {
            full_name: data.name,
            role: 'trainer'
          }
        }
      });

      if (authError) throw authError;

      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: data.name,
          email: data.email,
          role: 'trainer',
          phone: data.phone,
          gender: data.gender,
          specialty: data.specialties,
          bio: data.bio,
          address: data.address,
          city: data.city,
          state: data.state,
          country: data.country,
          branch_id: currentBranch?.id,
          avatar_url: avatarUrl,
          is_active: true
        })
        .eq('id', authData.user?.id);

      if (profileError) throw profileError;

      toast.success('Trainer created successfully');
      onSuccess();
      form.reset();
      setPreviewImage(undefined);
      setAvatarUrl(undefined);
    } catch (error: any) {
      console.error('Error creating trainer:', error);
      toast.error(error.message || 'Failed to create trainer');
    } finally {
      setLoading(false);
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/20 to-primary/10 pb-8">
            <CardTitle className="text-center">Add New Trainer</CardTitle>
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
                disabled={loading}
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
                    name="name"
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

                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                    name="specialties"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Specialties *</FormLabel>
                        <FormControl>
                          <div className="border border-input rounded-md p-2">
                            <div className="flex flex-wrap gap-2 mb-2">
                              {field.value.map((specialty) => {
                                const option = specialtyOptions.find(opt => opt.value === specialty);
                                return (
                                  <div 
                                    key={specialty}
                                    className="flex items-center gap-1 px-3 py-1 rounded-full text-white text-sm"
                                    style={{ backgroundColor: option?.color || '#888888' }}
                                  >
                                    {option?.label}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        field.onChange(field.value.filter(s => s !== specialty));
                                      }}
                                      className="ml-1 rounded-full hover:bg-white/20 p-1"
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                              {specialtyOptions.filter(option => !field.value.includes(option.value)).map((option) => (
                                <button
                                  key={option.value}
                                  type="button"
                                  onClick={() => {
                                    if (!field.value.includes(option.value)) {
                                      field.onChange([...field.value, option.value]);
                                    }
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
          <Button type="button" variant="outline" onClick={() => onSuccess()}>Cancel</Button>
          <Button 
            type="submit" 
            className="bg-gradient-to-r from-primary to-primary/80 text-white" 
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Trainer'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
