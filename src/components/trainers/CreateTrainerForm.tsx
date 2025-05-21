
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useTrainers } from '@/hooks/classes/use-trainers';
import { useUploadImage } from '@/hooks/utils/use-upload-image';
import { useBranch } from '@/hooks/settings/use-branches';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarIcon, Loader2, Trash2, Upload } from 'lucide-react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  LocalTabs,
  LocalTabsContent,
  LocalTabsList,
  LocalTabsTrigger,
} from '@/components/ui/local-tabs';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';

// Specialization options for trainers
const SPECIALIZATIONS = [
  'Strength Training',
  'Cardio',
  'Yoga',
  'Pilates',
  'CrossFit',
  'Functional Training',
  'HIIT',
  'Bodybuilding',
  'Weight Loss',
  'Nutrition',
  'Sports Conditioning',
  'Rehabilitation',
  'Senior Fitness',
  'Group Exercise',
  'Personal Training',
  'Mixed Martial Arts',
];

// Form validation schema
const formSchema = z.object({
  // Basic Information
  name: z.string().min(3, { message: 'Name must be at least 3 characters' }),
  email: z.string().email({ message: 'Invalid email address' }),
  phone: z.string().min(10, { message: 'Phone number is required' }).optional(),
  gender: z.string().optional(),
  dateOfBirth: z.date().optional(),
  
  // Professional Details
  employeeId: z.string().optional(),
  joiningDate: z.date().optional(),
  specialization: z.string().min(1, { message: 'Specialization is required' }),
  experience: z.string().optional(),
  bio: z.string().optional(),
  hourlyRate: z.string().optional().transform(val => val === '' ? null : val),
  
  // Contact Information
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  emergencyContactRelation: z.string().optional(),
  
  // Login Credentials
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
  confirmPassword: z.string(),
  sendWelcomeEmail: z.boolean().default(true),
  
  // Branch details
  branchId: z.string().optional(),
  status: z.string().default('active'),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type FormValues = z.infer<typeof formSchema>;

interface CreateTrainerFormProps {
  onSuccess?: () => void;
}

export function CreateTrainerForm({ onSuccess }: CreateTrainerFormProps) {
  const { createTrainer } = useTrainers();
  const { uploadImage, isUploading } = useUploadImage();
  const { branches, currentBranch } = useBranch();
  
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [documentFiles, setDocumentFiles] = useState<Record<string, File | null>>({
    idProof: null,
    certifications: null,
    resume: null,
    policeVerification: null,
  });
  const [documentPreviews, setDocumentPreviews] = useState<Record<string, string | null>>({
    idProof: null,
    certifications: null,
    resume: null,
    policeVerification: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      gender: '',
      specialization: '',
      bio: '',
      address: '',
      city: '',
      state: '',
      country: '',
      branchId: currentBranch?.id || '',
      status: 'active',
      password: '',
      confirmPassword: '',
      sendWelcomeEmail: true,
    },
  });

  // Handle avatar file change
  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const fileUrl = URL.createObjectURL(file);
      setAvatarPreview(fileUrl);
    }
  };

  // Handle document file change
  const handleDocumentChange = (type: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setDocumentFiles(prev => ({ ...prev, [type]: file }));
      const fileUrl = URL.createObjectURL(file);
      setDocumentPreviews(prev => ({ ...prev, [type]: fileUrl }));
    }
  };

  // Remove avatar
  const removeAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  // Remove document
  const removeDocument = (type: string) => {
    setDocumentFiles(prev => ({ ...prev, [type]: null }));
    setDocumentPreviews(prev => ({ ...prev, [type]: null }));
  };

  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);
      
      // Upload avatar if available
      let avatarUrl = null;
      if (avatarFile) {
        avatarUrl = await uploadImage({
          file: avatarFile,
          folder: 'trainers/avatars',
        });
      }
      
      // Upload documents if available
      const uploadedDocuments: Record<string, string | null> = {};
      for (const [type, file] of Object.entries(documentFiles)) {
        if (file) {
          const documentUrl = await uploadImage({
            file,
            folder: `trainers/documents/${type}`,
          });
          uploadedDocuments[type] = documentUrl;
        }
      }
      
      // Create trainer profile
      const result = await createTrainer({
        name: values.name,
        email: values.email,
        password: values.password,
        phone: values.phone,
        specialization: values.specialization,
        bio: values.bio || '',
      });
      
      if (result) {
        toast.success('Trainer created successfully');
        if (onSuccess) onSuccess();
      }
    } catch (error: any) {
      console.error('Error creating trainer:', error);
      toast.error(error.message || 'Failed to create trainer');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <LocalTabs defaultValue="basic-info" className="w-full">
          <LocalTabsList className="grid grid-cols-5 mb-6">
            <LocalTabsTrigger value="basic-info">Basic Info</LocalTabsTrigger>
            <LocalTabsTrigger value="professional">Professional</LocalTabsTrigger>
            <LocalTabsTrigger value="contact">Contact</LocalTabsTrigger>
            <LocalTabsTrigger value="login">Login Credentials</LocalTabsTrigger>
            <LocalTabsTrigger value="documents">Documents</LocalTabsTrigger>
          </LocalTabsList>
          
          {/* Basic Information Tab */}
          <LocalTabsContent value="basic-info" className="space-y-4">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 relative">
                <Avatar className="h-24 w-24">
                  {avatarPreview ? (
                    <AvatarImage src={avatarPreview} alt="Avatar" />
                  ) : (
                    <AvatarFallback className="text-lg">
                      {form.watch('name') ? form.watch('name').charAt(0).toUpperCase() : 'T'}
                    </AvatarFallback>
                  )}
                </Avatar>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                <div className="absolute -bottom-2 -right-2 flex gap-1">
                  <Button
                    type="button"
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8 rounded-full"
                    onClick={() => document.getElementById('avatar-upload')?.click()}
                  >
                    <Upload className="h-4 w-4" />
                  </Button>
                  {avatarPreview && (
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      className="h-8 w-8 rounded-full"
                      onClick={removeAvatar}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium">Profile Picture</h3>
                <p className="text-sm text-muted-foreground">
                  Upload a profile picture for the trainer
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
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
                    <FormLabel>Gender</FormLabel>
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
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Select date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select branch" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {branches?.map(branch => (
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

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </LocalTabsContent>
          
          {/* Professional Details Tab */}
          <LocalTabsContent value="professional" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="employeeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employee ID</FormLabel>
                    <FormControl>
                      <Input placeholder="EMP-1234" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="joiningDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Joining Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Select date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date()}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="specialization"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Specialization *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select specialization" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {SPECIALIZATIONS.map(specialization => (
                          <SelectItem key={specialization} value={specialization}>
                            {specialization}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Experience (Years)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="2" 
                        {...field} 
                        onChange={(e) => field.onChange(e.target.value || '')}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hourlyRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hourly Rate</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="₹500" 
                        {...field} 
                        onChange={(e) => field.onChange(e.target.value || '')}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Trainer bio and professional details..." 
                      className="min-h-[150px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </LocalTabsContent>
          
          {/* Contact Information Tab */}
          <LocalTabsContent value="contact" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="trainer@example.com" {...field} />
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
                      <Input placeholder="+91 9876543210" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="1234 Main St" {...field} />
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

            <h3 className="text-lg font-medium pt-4">Emergency Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="emergencyContactName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Jane Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="emergencyContactPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="+91 9876543210" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="emergencyContactRelation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Relationship</FormLabel>
                    <FormControl>
                      <Input placeholder="Spouse" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </LocalTabsContent>
          
          {/* Login Credentials Tab */}
          <LocalTabsContent value="login" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password *</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="********" {...field} />
                    </FormControl>
                    <FormDescription>
                      Must be at least 8 characters
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password *</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="********" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="sendWelcomeEmail"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm mt-4">
                  <div className="space-y-0.5">
                    <FormLabel>Send Welcome Email</FormLabel>
                    <FormDescription>
                      Send a welcome email with login instructions to the trainer
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
          </LocalTabsContent>
          
          {/* Documents Tab */}
          <LocalTabsContent value="documents" className="space-y-4">
            <Card className="p-4">
              <h3 className="font-medium mb-2">ID Proof</h3>
              <div className="flex items-center gap-4 mb-4">
                <input
                  id="id-proof-upload"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleDocumentChange('idProof')}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('id-proof-upload')?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload ID Proof
                </Button>
                {documentPreviews.idProof && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground truncate max-w-[200px]">
                      {documentFiles.idProof?.name}
                    </span>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-destructive"
                      onClick={() => removeDocument('idProof')}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              <h3 className="font-medium mb-2">Certifications</h3>
              <div className="flex items-center gap-4 mb-4">
                <input
                  id="certifications-upload"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleDocumentChange('certifications')}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('certifications-upload')?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Certifications
                </Button>
                {documentPreviews.certifications && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground truncate max-w-[200px]">
                      {documentFiles.certifications?.name}
                    </span>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-destructive"
                      onClick={() => removeDocument('certifications')}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              <h3 className="font-medium mb-2">Resume/CV</h3>
              <div className="flex items-center gap-4 mb-4">
                <input
                  id="resume-upload"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleDocumentChange('resume')}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('resume-upload')?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Resume/CV
                </Button>
                {documentPreviews.resume && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground truncate max-w-[200px]">
                      {documentFiles.resume?.name}
                    </span>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-destructive"
                      onClick={() => removeDocument('resume')}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              <h3 className="font-medium mb-2">Police Verification</h3>
              <div className="flex items-center gap-4">
                <input
                  id="police-verification-upload"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleDocumentChange('policeVerification')}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('police-verification-upload')?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Verification
                </Button>
                {documentPreviews.policeVerification && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground truncate max-w-[200px]">
                      {documentFiles.policeVerification?.name}
                    </span>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-destructive"
                      onClick={() => removeDocument('policeVerification')}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </LocalTabsContent>
        </LocalTabs>

        <div className="flex justify-end gap-2 mt-6">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="px-6"
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Trainer
          </Button>
        </div>
      </form>
    </Form>
  );
}
