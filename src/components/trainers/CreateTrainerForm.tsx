
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Upload, FileText, User, Phone, Mail, Calendar, MapPin, IdCard, Lock, FileCheck } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useTrainers } from '@/hooks/trainers/use-trainers';
import { useUploadImage } from '@/hooks/utils/use-upload-image';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const trainerSchema = z.object({
  // Basic Info
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  dateOfBirth: z.string().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  
  // Professional Details
  employeeId: z.string().optional(),
  joiningDate: z.string().optional(),
  specializations: z.array(z.string()).min(1, 'At least one specialization is required'),
  experience: z.string().optional(),
  hourlyRate: z.string().optional(),
  bio: z.string().optional(),
  
  // Contact Information
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  
  // Login Credentials
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  sendWelcomeEmail: z.boolean().default(true),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type TrainerFormData = z.infer<typeof trainerSchema>;

interface CreateTrainerFormProps {
  onSuccess?: () => void;
}

const availableSpecializations = [
  'Personal Training',
  'Weight Training',
  'Cardio',
  'Yoga',
  'Pilates',
  'CrossFit',
  'Zumba',
  'Boxing',
  'Swimming',
  'Nutrition Counseling',
  'Physiotherapy',
  'Martial Arts'
];

export function CreateTrainerForm({ onSuccess }: CreateTrainerFormProps) {
  const [activeTab, setActiveTab] = useState('basic-info');
  const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>([]);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [documents, setDocuments] = useState<{
    idProof?: File;
    cv?: File;
    certifications?: File[];
    policeVerification?: File;
  }>({});
  
  const { createTrainer } = useTrainers();
  const { uploadImage, isUploading } = useUploadImage();

  const form = useForm<TrainerFormData>({
    resolver: zodResolver(trainerSchema),
    defaultValues: {
      specializations: [],
      sendWelcomeEmail: true,
      gender: 'male',
    },
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleDocumentUpload = (type: keyof typeof documents, file: File | File[]) => {
    setDocuments(prev => ({
      ...prev,
      [type]: file
    }));
  };

  const addSpecialization = (specialization: string) => {
    if (!selectedSpecializations.includes(specialization)) {
      const newSpecs = [...selectedSpecializations, specialization];
      setSelectedSpecializations(newSpecs);
      form.setValue('specializations', newSpecs);
    }
  };

  const removeSpecialization = (specialization: string) => {
    const newSpecs = selectedSpecializations.filter(s => s !== specialization);
    setSelectedSpecializations(newSpecs);
    form.setValue('specializations', newSpecs);
  };

  const onSubmit = async (data: TrainerFormData) => {
    try {
      let avatarUrl = null;
      
      // Upload avatar if provided
      if (avatarFile) {
        const uploadResult = await uploadImage(avatarFile, 'trainer-avatars');
        if (uploadResult?.publicUrl) {
          avatarUrl = uploadResult.publicUrl;
        }
      }

      // Create trainer
      const trainerData = {
        email: data.email,
        password: data.password,
        name: data.fullName,
        phone: data.phone,
        specialization: selectedSpecializations[0], // Primary specialization
        bio: data.bio || '',
      };

      const result = await createTrainer(trainerData);
      
      if (result) {
        toast.success('Trainer created successfully');
        onSuccess?.();
      } else {
        toast.error('Failed to create trainer');
      }
    } catch (error) {
      console.error('Error creating trainer:', error);
      toast.error('An error occurred while creating the trainer');
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basic-info" className="text-xs">
            <User className="h-4 w-4 mr-1" />
            Basic Info
          </TabsTrigger>
          <TabsTrigger value="professional" className="text-xs">
            <IdCard className="h-4 w-4 mr-1" />
            Professional
          </TabsTrigger>
          <TabsTrigger value="contact" className="text-xs">
            <Phone className="h-4 w-4 mr-1" />
            Contact
          </TabsTrigger>
          <TabsTrigger value="credentials" className="text-xs">
            <Lock className="h-4 w-4 mr-1" />
            Credentials
          </TabsTrigger>
          <TabsTrigger value="documents" className="text-xs">
            <FileCheck className="h-4 w-4 mr-1" />
            Documents
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic-info" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Avatar Upload */}
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  {avatarPreview ? (
                    <AvatarImage src={avatarPreview} alt="Avatar preview" />
                  ) : (
                    <AvatarFallback>
                      <User className="h-8 w-8" />
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <Label htmlFor="avatar" className="cursor-pointer">
                    <div className="flex items-center gap-2 text-sm bg-secondary hover:bg-secondary/80 px-3 py-2 rounded-md">
                      <Upload className="h-4 w-4" />
                      Upload Photo
                    </div>
                  </Label>
                  <input
                    id="avatar"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    JPG, PNG up to 5MB
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    {...form.register('fullName')}
                    placeholder="Enter full name"
                  />
                  {form.formState.errors.fullName && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.fullName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...form.register('email')}
                    placeholder="Enter email address"
                  />
                  {form.formState.errors.email && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    {...form.register('phone')}
                    placeholder="Enter phone number"
                  />
                  {form.formState.errors.phone && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.phone.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    {...form.register('dateOfBirth')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select onValueChange={(value) => form.setValue('gender', value as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="professional" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IdCard className="h-5 w-5" />
                Professional Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="employeeId">Employee ID</Label>
                  <Input
                    id="employeeId"
                    {...form.register('employeeId')}
                    placeholder="Auto-generated if empty"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="joiningDate">Joining Date</Label>
                  <Input
                    id="joiningDate"
                    type="date"
                    {...form.register('joiningDate')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Experience (Years)</Label>
                  <Input
                    id="experience"
                    {...form.register('experience')}
                    placeholder="e.g., 3 years"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hourlyRate">Hourly Rate</Label>
                  <Input
                    id="hourlyRate"
                    {...form.register('hourlyRate')}
                    placeholder="e.g., $50/hour"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Specializations *</Label>
                <Select onValueChange={addSpecialization}>
                  <SelectTrigger>
                    <SelectValue placeholder="Add specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSpecializations.map((spec) => (
                      <SelectItem key={spec} value={spec}>
                        {spec}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {selectedSpecializations.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedSpecializations.map((spec) => (
                      <Badge key={spec} variant="secondary" className="flex items-center gap-1">
                        {spec}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => removeSpecialization(spec)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
                
                {form.formState.errors.specializations && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.specializations.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  {...form.register('bio')}
                  placeholder="Brief description about the trainer"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  {...form.register('address')}
                  placeholder="Enter full address"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    {...form.register('city')}
                    placeholder="Enter city"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    {...form.register('state')}
                    placeholder="Enter state"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    {...form.register('country')}
                    placeholder="Enter country"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emergencyContactName">Emergency Contact Name</Label>
                  <Input
                    id="emergencyContactName"
                    {...form.register('emergencyContactName')}
                    placeholder="Enter emergency contact name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergencyContactPhone">Emergency Contact Phone</Label>
                  <Input
                    id="emergencyContactPhone"
                    {...form.register('emergencyContactPhone')}
                    placeholder="Enter emergency contact phone"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="credentials" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Login Credentials
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    {...form.register('password')}
                    placeholder="Enter password"
                  />
                  {form.formState.errors.password && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    {...form.register('confirmPassword')}
                    placeholder="Confirm password"
                  />
                  {form.formState.errors.confirmPassword && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="sendWelcomeEmail"
                  checked={form.watch('sendWelcomeEmail')}
                  onCheckedChange={(checked) => form.setValue('sendWelcomeEmail', checked)}
                />
                <Label htmlFor="sendWelcomeEmail">Send welcome email with login credentials</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Documents
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="idProof">ID Proof</Label>
                  <Input
                    id="idProof"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleDocumentUpload('idProof', file);
                    }}
                  />
                  <p className="text-xs text-muted-foreground">
                    Upload government issued ID (PDF, JPG, PNG)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cv">CV/Resume</Label>
                  <Input
                    id="cv"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleDocumentUpload('cv', file);
                    }}
                  />
                  <p className="text-xs text-muted-foreground">
                    Upload CV or resume (PDF, DOC, DOCX)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="certifications">Certifications</Label>
                  <Input
                    id="certifications"
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      if (files.length > 0) handleDocumentUpload('certifications', files);
                    }}
                  />
                  <p className="text-xs text-muted-foreground">
                    Upload training certifications (Multiple files allowed)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="policeVerification">Police Verification</Label>
                  <Input
                    id="policeVerification"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleDocumentUpload('policeVerification', file);
                    }}
                  />
                  <p className="text-xs text-muted-foreground">
                    Upload police verification document
                  </p>
                </div>
              </div>

              {/* Document preview section */}
              {Object.keys(documents).length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Uploaded Documents:</h4>
                  <div className="space-y-2">
                    {Object.entries(documents).map(([type, file]) => (
                      <div key={type} className="flex items-center gap-2 text-sm">
                        <FileText className="h-4 w-4" />
                        <span className="capitalize">{type.replace(/([A-Z])/g, ' $1')}: </span>
                        <span className="text-muted-foreground">
                          {Array.isArray(file) ? `${file.length} files` : (file as File).name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between pt-6 border-t">
        <Button type="button" variant="outline" onClick={() => {
          const tabs = ['basic-info', 'professional', 'contact', 'credentials', 'documents'];
          const currentIndex = tabs.indexOf(activeTab);
          if (currentIndex > 0) {
            setActiveTab(tabs[currentIndex - 1]);
          }
        }} disabled={activeTab === 'basic-info'}>
          Previous
        </Button>

        <div className="flex gap-2">
          {activeTab !== 'documents' ? (
            <Button type="button" onClick={() => {
              const tabs = ['basic-info', 'professional', 'contact', 'credentials', 'documents'];
              const currentIndex = tabs.indexOf(activeTab);
              if (currentIndex < tabs.length - 1) {
                setActiveTab(tabs[currentIndex + 1]);
              }
            }}>
              Next
            </Button>
          ) : (
            <Button 
              type="submit" 
              disabled={form.formState.isSubmitting || isUploading}
            >
              {form.formState.isSubmitting || isUploading ? 'Creating...' : 'Create Trainer'}
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}
