import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  X, Upload, FileText, User, Phone, Mail, Calendar, MapPin, 
  IdCard, Lock, FileCheck, Users, UserRound, ShieldCheck,
  Briefcase, Loader2
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useTrainers } from '@/hooks/team/use-trainers';
import { useStaff } from '@/hooks/team/use-staff';
import { useUploadImage } from '@/hooks/utils/use-upload-image';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useBranch } from '@/hooks/settings/use-branches';

// Define the team member schema with conditional validation based on role
const teamMemberSchema = z.object({
  // Role selection (required)
  role: z.enum(['staff', 'trainer', 'admin']),
  
  // Basic Info (required for all roles)
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  dateOfBirth: z.string().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  
  // Professional Details
  employeeId: z.string().optional(),
  joiningDate: z.string().optional(),
  department: z.string().optional(),
  position: z.string().optional(),
  
  // Trainer-specific fields
  specializations: z.array(z.string()).optional(),
  experience: z.string().optional(),
  hourlyRate: z.string().optional(),
  monthlySalary: z.string().optional(),
  bio: z.string().optional(),
  
  // Contact Information
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  emergencyContactRelation: z.string().optional(),
  
  // Branch assignment
  branchId: z.string().optional(),
  isBranchManager: z.boolean().default(false),
  
  // Login Credentials
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  sendWelcomeEmail: z.boolean().default(true),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
}).refine(
  (data) => {
    // If role is trainer, specializations must be provided
    if (data.role === 'trainer' && (!data.specializations || data.specializations.length === 0)) {
      return false;
    }
    return true;
  },
  {
    message: "At least one specialization is required for trainers",
    path: ["specializations"],
  }
);

type TeamMemberFormData = z.infer<typeof teamMemberSchema>;

interface CreateTeamMemberFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
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

export function CreateTeamMemberForm({ onSuccess, onCancel }: CreateTeamMemberFormProps) {
  // State management
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Hooks
  const { createTrainer } = useTrainers();
  const { createStaffMember } = useStaff();
  const { uploadImage, isUploading } = useUploadImage();
  const { branches, currentBranch } = useBranch();

  // Form setup with zod validation
  const form = useForm<TeamMemberFormData>({
    resolver: zodResolver(teamMemberSchema),
    defaultValues: {
      role: 'staff',
      specializations: [],
      sendWelcomeEmail: true,
      gender: 'male',
      isBranchManager: false,
      branchId: currentBranch?.id,
    },
  });

  // Watch for role changes to conditionally display fields
  const selectedRole = form.watch('role');

  // Handle avatar file selection
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle document file selection
  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === 'certifications') {
        setDocuments(prev => ({
          ...prev,
          certifications: [...(prev.certifications || []), file]
        }));
      } else {
        setDocuments(prev => ({
          ...prev,
          [type]: file
        }));
      }
    }
  };

  // Remove a certification file
  const removeCertification = (index: number) => {
    setDocuments(prev => {
      const certs = [...(prev.certifications || [])];
      certs.splice(index, 1);
      return {
        ...prev,
        certifications: certs
      };
    });
  };

  // Handle specialization selection
  const handleSpecializationToggle = (specialization: string) => {
    const isSelected = selectedSpecializations.includes(specialization);
    let newSpecializations: string[];
    
    if (isSelected) {
      newSpecializations = selectedSpecializations.filter(s => s !== specialization);
    } else {
      newSpecializations = [...selectedSpecializations, specialization];
    }
    
    setSelectedSpecializations(newSpecializations);
    form.setValue('specializations', newSpecializations);
  };

  // Form submission handler
  const onSubmit = async (data: TeamMemberFormData) => {
    try {
      setIsSubmitting(true);
      
      // Upload avatar if provided
      let avatarUrl = null;
      if (avatarFile) {
        const uploadData = await uploadImage({
          file: avatarFile,
          folder: 'avatars'
        });
        if (uploadData) {
          avatarUrl = uploadData;
        }
      }
      
      // Prepare emergency contact data if provided
      const emergencyContact = data.emergencyContactName ? {
        name: data.emergencyContactName,
        phone: data.emergencyContactPhone || '',
        relation: data.emergencyContactRelation || '',
      } : undefined;
      
      // Handle based on selected role
      if (data.role === 'trainer') {
        // Create trainer
        const trainerInput = {
          user_id: '', // This will be generated on the server
          full_name: data.fullName,
          email: data.email,
          phone: data.phone || '',
          gender: data.gender,
          date_of_birth: data.dateOfBirth || '',
          address: data.address || '',
          city: data.city || '',
          state: data.state || '',
          country: data.country || '',
          branch_id: data.branchId || currentBranch?.id || '',
          avatar_url: avatarUrl || '',
          is_branch_manager: data.isBranchManager || false,
          employee_id: data.employeeId || '',
          hire_date: data.joiningDate || '',
          experience_years: data.experience ? Number(data.experience) : 0,
          monthly_salary: data.monthlySalary ? Number(data.monthlySalary) : 0,
          hourly_rate: data.hourlyRate ? Number(data.hourlyRate) : 0,
          specializations: selectedSpecializations,
          bio: data.bio || '',
          emergency_contact: emergencyContact,
          password: data.password
        };
        
        await createTrainer(trainerInput);
        toast.success('Trainer created successfully');
      } else {
        // Create staff or admin
        await createStaffMember({
          email: data.email,
          password: data.password,
          name: data.fullName,
          role: data.role,
          branch_id: data.branchId || currentBranch?.id,
          department: data.department,
          phone: data.phone,
          id_type: '', // Not included in our form but required by the API
          id_number: '',
        });
        
        toast.success(`${data.role === 'admin' ? 'Administrator' : 'Staff member'} created successfully`);
      }
      
      // Reset form and state
      form.reset();
      setSelectedSpecializations([]);
      setAvatarFile(null);
      setAvatarPreview(null);
      setDocuments({});
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error creating team member:', error);
      toast.error('Failed to create team member');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cancel handler
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Role Selection */}
      <div className="mb-6">
        <Label className="text-base font-semibold">Team Member Role *</Label>
        <div className="mt-2">
          <RadioGroup
            defaultValue="staff"
            value={selectedRole}
            onValueChange={(value) => form.setValue('role', value as 'staff' | 'trainer' | 'admin')}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="staff" id="role-staff" />
              <Label htmlFor="role-staff" className="flex items-center cursor-pointer">
                <Users className="h-4 w-4 mr-2" />
                Staff
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="trainer" id="role-trainer" />
              <Label htmlFor="role-trainer" className="flex items-center cursor-pointer">
                <UserRound className="h-4 w-4 mr-2" />
                Trainer
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="admin" id="role-admin" />
              <Label htmlFor="role-admin" className="flex items-center cursor-pointer">
                <ShieldCheck className="h-4 w-4 mr-2" />
                Administrator
              </Label>
            </div>
          </RadioGroup>
        </div>
      </div>
      
      {/* Form Tabs */}
      <Tabs defaultValue="basic-info" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="basic-info" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Basic Info</span>
          </TabsTrigger>
          <TabsTrigger value="professional" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            <span>Professional</span>
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            <span>Contact</span>
          </TabsTrigger>
          <TabsTrigger value="credentials" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <span>Credentials</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Basic Info Tab */}
        <TabsContent value="basic-info" className="mt-4 space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              {/* Avatar Upload */}
              <div className="flex flex-col items-center justify-center mb-6">
                <div className="relative">
                  <Avatar className="h-24 w-24 cursor-pointer border-2 border-border hover:border-primary">
                    {avatarPreview ? (
                      <AvatarImage src={avatarPreview} alt="Avatar preview" />
                    ) : (
                      <AvatarFallback>
                        <User className="h-12 w-12 text-muted-foreground" />
                      </AvatarFallback>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={handleAvatarChange}
                    />
                  </Avatar>
                  <div className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-1 shadow-sm">
                    <Upload className="h-4 w-4" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">Upload profile picture</p>
              </div>
              
              {/* Basic Info Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <Label htmlFor="email">Email Address *</Label>
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
                  <Select
                    onValueChange={(value) => form.setValue('gender', value as 'male' | 'female' | 'other')}
                    defaultValue={form.getValues('gender')}
                  >
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="branchId">Branch</Label>
                  <Select
                    onValueChange={(value) => form.setValue('branchId', value)}
                    defaultValue={form.getValues('branchId') || currentBranch?.id}
                  >
                    <SelectTrigger id="branchId">
                      <SelectValue placeholder="Select branch" />
                    </SelectTrigger>
                    <SelectContent>
                      {branches?.map((branch) => (
                        <SelectItem key={branch.id} value={branch.id}>
                          {branch.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2 pt-6">
                  <Switch
                    id="isBranchManager"
                    checked={form.watch('isBranchManager')}
                    onCheckedChange={(checked) => form.setValue('isBranchManager', checked)}
                  />
                  <Label htmlFor="isBranchManager">Branch Manager</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Professional Details Tab */}
        <TabsContent value="professional" className="mt-4 space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="employeeId">Employee ID</Label>
                  <Input
                    id="employeeId"
                    {...form.register('employeeId')}
                    placeholder="Enter employee ID"
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
                
                {selectedRole !== 'trainer' ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Select
                        onValueChange={(value) => form.setValue('department', value)}
                        defaultValue={form.getValues('department')}
                      >
                        <SelectTrigger id="department">
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
                    
                    <div className="space-y-2">
                      <Label htmlFor="position">Position</Label>
                      <Input
                        id="position"
                        {...form.register('position')}
                        placeholder="Enter position"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="experience">Experience (Years)</Label>
                      <Input
                        id="experience"
                        type="number"
                        {...form.register('experience')}
                        placeholder="Enter years of experience"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="hourlyRate">Hourly Rate</Label>
                      <Input
                        id="hourlyRate"
                        type="number"
                        {...form.register('hourlyRate')}
                        placeholder="Enter hourly rate"
                      />
                    </div>
                  </>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="monthlySalary">Monthly Salary</Label>
                  <Input
                    id="monthlySalary"
                    type="number"
                    {...form.register('monthlySalary')}
                    placeholder="Enter monthly salary"
                  />
                </div>
              </div>
              
              {selectedRole === 'trainer' && (
                <>
                  <div className="space-y-2 mt-4">
                    <Label>Specializations {selectedRole === 'trainer' && '*'}</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {availableSpecializations.map((specialization) => {
                        const isSelected = selectedSpecializations.includes(specialization);
                        return (
                          <Badge
                            key={specialization}
                            variant={isSelected ? 'default' : 'outline'}
                            className="cursor-pointer"
                            onClick={() => handleSpecializationToggle(specialization)}
                          >
                            {specialization}
                            {isSelected && <X className="ml-1 h-3 w-3" />}
                          </Badge>
                        );
                      })}
                    </div>
                    {form.formState.errors.specializations && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.specializations.message}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2 mt-4">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      {...form.register('bio')}
                      placeholder="Enter professional bio"
                      className="min-h-[100px]"
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Contact Information Tab */}
        <TabsContent value="contact" className="mt-4 space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    {...form.register('address')}
                    placeholder="Enter address"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    {...form.register('city')}
                    placeholder="Enter city"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="state">State/Province</Label>
                  <Input
                    id="state"
                    {...form.register('state')}
                    placeholder="Enter state/province"
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
              
              <div className="mt-6">
                <h3 className="text-base font-medium mb-4">Emergency Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContactName">Name</Label>
                    <Input
                      id="emergencyContactName"
                      {...form.register('emergencyContactName')}
                      placeholder="Enter emergency contact name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContactPhone">Phone</Label>
                    <Input
                      id="emergencyContactPhone"
                      {...form.register('emergencyContactPhone')}
                      placeholder="Enter emergency contact phone"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContactRelation">Relationship</Label>
                    <Input
                      id="emergencyContactRelation"
                      {...form.register('emergencyContactRelation')}
                      placeholder="Enter relationship"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Credentials Tab */}
        <TabsContent value="credentials" className="mt-4 space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="new-password"
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
                    autoComplete="new-password"
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
              
              <div className="flex items-center space-x-2 mt-4">
                <Switch
                  id="sendWelcomeEmail"
                  checked={form.watch('sendWelcomeEmail')}
                  onCheckedChange={(checked) => form.setValue('sendWelcomeEmail', checked)}
                />
                <Label htmlFor="sendWelcomeEmail">Send welcome email with login details</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end space-x-2 mt-6">
        <Button type="button" variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            <>Save Team Member</>
          )}
        </Button>
      </div>
    </form>
  );
}

export default CreateTeamMemberForm;
