
import React, { useState, useRef } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/ui/use-toast';
import { User, Phone, Mail, CalendarIcon, MapPin, FileText, Lock, Upload, X, Briefcase, Award, FileCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { useBranch } from '@/hooks/settings/use-branches';
import { useStaff } from '@/hooks/members/use-staff';
import { useUploadImage } from '@/hooks/utils/use-upload-image';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';

// Form schema for validation
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  confirmPassword: z.string(),
  phone: z.string().optional(),
  role: z.literal('trainer'),
  department: z.string().optional(),
  branch_id: z.string().optional(),
  employee_id: z.string().optional(),
  joining_date: z.date().optional(),
  date_of_birth: z.date().optional(),
  gender: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  id_type: z.string().optional(),
  id_number: z.string().optional(),
  specializations: z.array(z.string()),
  certifications: z.string().optional(),
  experience: z.number().optional(),
  hourly_rate: z.number().optional(),
  bio: z.string().optional(),
  emergency_contact_name: z.string().optional(),
  emergency_contact_number: z.string().optional(),
  emergency_contact_relationship: z.string().optional(),
  send_welcome_email: z.boolean().optional()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof formSchema>;

// Specialization options
const SPECIALIZATIONS = [
  'HIIT',
  'Gym Training',
  'Yoga',
  'Pilates',
  'CrossFit',
  'Zumba',
  'Personal Training',
  'Weight Training',
  'Cardio',
  'Functional Training',
  'Other'
];

// ID Proof Types
const ID_PROOF_TYPES = [
  'Aadhar Card',
  'Passport',
  "Driver's License",
  'Voter ID',
  'National ID'
];

// Department options
const DEPARTMENT_OPTIONS = [
  'Fitness',
  'Yoga',
  'CrossFit',
  'Personal Training',
  'Group Classes',
  'Other'
];

// Gender options
const GENDER_OPTIONS = [
  'Male',
  'Female',
  'Other',
  'Prefer not to say'
];

interface CreateTrainerFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const CreateTrainerForm = ({ onSuccess, onCancel }: CreateTrainerFormProps) => {
  const { toast } = useToast();
  const { currentBranch, branches } = useBranch();
  const { createStaffMember } = useStaff();
  const { uploadImage, isUploading } = useUploadImage();
  
  const [activeTab, setActiveTab] = useState('basic-info');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [idDocument, setIdDocument] = useState<File | null>(null);
  const [idDocumentName, setIdDocumentName] = useState<string | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvFileName, setCvFileName] = useState<string | null>(null);
  const [policeVerificationFile, setPoliceVerificationFile] = useState<File | null>(null);
  const [policeFileName, setPoliceFileName] = useState<string | null>(null);
  const [certificateFiles, setCertificateFiles] = useState<File[]>([]);
  const [certificateNames, setCertificateNames] = useState<string[]>([]);
  
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const idDocumentRef = useRef<HTMLInputElement>(null);
  const cvFileRef = useRef<HTMLInputElement>(null);
  const policeVerificationRef = useRef<HTMLInputElement>(null);
  const certificateFilesRef = useRef<HTMLInputElement>(null);
  
  // Initialize form with default values
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      specializations: [],
      bio: '',
      branch_id: currentBranch?.id,
      role: 'trainer',
      department: 'Fitness',
      date_of_birth: undefined,
      gender: '',
      employee_id: '',
      joining_date: new Date(),
      certifications: '',
      experience: 0,
      hourly_rate: 0,
      address: '',
      city: '',
      state: '',
      country: 'India',
      id_type: '',
      id_number: '',
      emergency_contact_name: '',
      emergency_contact_number: '',
      emergency_contact_relationship: '',
      send_welcome_email: true
    },
  });
  
  const { formState: { isSubmitting, errors } } = form;

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>, 
    type: 'avatar' | 'id' | 'cv' | 'police' | 'certificate'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    switch (type) {
      case 'avatar':
        setAvatarFile(file);
        reader.onloadend = () => {
          setAvatarPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
        break;
        
      case 'id':
        setIdDocument(file);
        setIdDocumentName(file.name);
        break;
        
      case 'cv':
        setCvFile(file);
        setCvFileName(file.name);
        break;
        
      case 'police':
        setPoliceVerificationFile(file);
        setPoliceFileName(file.name);
        break;
        
      case 'certificate':
        const newFiles = Array.from(e.target.files || []);
        const newNames = newFiles.map(file => file.name);
        setCertificateFiles(prev => [...prev, ...newFiles]);
        setCertificateNames(prev => [...prev, ...newNames]);
        break;
    }
  };

  const handleRemoveFile = (
    type: 'avatar' | 'id' | 'cv' | 'police', 
    index?: number
  ) => {
    switch (type) {
      case 'avatar':
        setAvatarFile(null);
        setAvatarPreview(null);
        if (avatarInputRef.current) avatarInputRef.current.value = '';
        break;
        
      case 'id':
        setIdDocument(null);
        setIdDocumentName(null);
        if (idDocumentRef.current) idDocumentRef.current.value = '';
        break;
        
      case 'cv':
        setCvFile(null);
        setCvFileName(null);
        if (cvFileRef.current) cvFileRef.current.value = '';
        break;
        
      case 'police':
        setPoliceVerificationFile(null);
        setPoliceFileName(null);
        if (policeVerificationRef.current) policeVerificationRef.current.value = '';
        break;
        
      default:
        if (typeof index === 'number') {
          setCertificateFiles(prev => prev.filter((_, i) => i !== index));
          setCertificateNames(prev => prev.filter((_, i) => i !== index));
          if (certificateFilesRef.current) certificateFilesRef.current.value = '';
        }
        break;
    }
  };
  
  const validateFile = (file: File, allowedTypes: string[], maxSizeMB: number) => {
    if (!allowedTypes.some(type => file.type.includes(type.replace('*', '')))) {
      throw new Error(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`);
    }
    
    const maxSize = maxSizeMB * 1024 * 1024; // Convert MB to bytes
    if (file.size > maxSize) {
      throw new Error(`File is too large. Maximum size is ${maxSizeMB}MB`);
    }
    
    return true;
  };

  const onSubmit = async (formData: FormData) => {
    if (!currentBranch?.id) {
      toast({
        title: 'Error',
        description: 'Please select a branch first',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      // Upload avatar if exists
      let avatarUrl = '';
      if (avatarFile) {
        try {
          validateFile(avatarFile, ['image/jpeg', 'image/png', 'image/webp'], 5);
          avatarUrl = await uploadImage({
            file: avatarFile,
            folder: 'trainers'
          }) || '';
        } catch (error: any) {
          throw new Error(`Avatar upload failed: ${error.message}`);
        }
      }
      
      // Upload ID document if exists
      let idDocumentUrl = '';
      if (idDocument) {
        try {
          validateFile(idDocument, ['application/pdf', 'image/jpeg', 'image/png'], 10);
          
          const fileName = `id-document-${uuidv4()}-${idDocument.name}`;
          const { error: uploadError } = await supabase.storage
            .from('trainer-documents')
            .upload(fileName, idDocument);
            
          if (uploadError) throw uploadError;
          
          const { data: { publicUrl } } = supabase.storage
            .from('trainer-documents')
            .getPublicUrl(fileName);
            
          idDocumentUrl = publicUrl;
        } catch (error: any) {
          throw new Error(`ID document upload failed: ${error.message}`);
        }
      }
      
      // Upload CV if exists
      let cvUrl = '';
      if (cvFile) {
        try {
          validateFile(
            cvFile,
            ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
            20
          );
          
          const fileName = `cv-${uuidv4()}-${cvFile.name}`;
          const { error: uploadError } = await supabase.storage
            .from('trainer-documents')
            .upload(fileName, cvFile);
            
          if (uploadError) throw uploadError;
          
          const { data: { publicUrl } } = supabase.storage
            .from('trainer-documents')
            .getPublicUrl(fileName);
            
          cvUrl = publicUrl;
        } catch (error: any) {
          throw new Error(`CV upload failed: ${error.message}`);
        }
      }
      
      // Upload police verification if exists
      let policeVerificationUrl = '';
      if (policeVerificationFile) {
        try {
          validateFile(
            policeVerificationFile,
            ['application/pdf', 'image/jpeg', 'image/png'],
            10
          );
          
          const fileName = `police-verification-${uuidv4()}-${policeVerificationFile.name}`;
          const { error: uploadError } = await supabase.storage
            .from('trainer-documents')
            .upload(fileName, policeVerificationFile);
            
          if (uploadError) throw uploadError;
          
          const { data: { publicUrl } } = supabase.storage
            .from('trainer-documents')
            .getPublicUrl(fileName);
            
          policeVerificationUrl = publicUrl;
        } catch (error: any) {
          throw new Error(`Police verification upload failed: ${error.message}`);
        }
      }
      
      // Upload certificates if any
      const certificateUrls: string[] = [];
      for (const certFile of certificateFiles) {
        try {
          validateFile(
            certFile,
            ['application/pdf', 'image/jpeg', 'image/png'],
            10
          );
          
          const fileName = `certificate-${uuidv4()}-${certFile.name}`;
          const { error: uploadError } = await supabase.storage
            .from('trainer-documents')
            .upload(fileName, certFile);
            
          if (uploadError) throw uploadError;
          
          const { data: { publicUrl } } = supabase.storage
            .from('trainer-documents')
            .getPublicUrl(fileName);
            
          certificateUrls.push(publicUrl);
        } catch (error: any) {
          throw new Error(`Certificate upload failed for ${certFile.name}: ${error.message}`);
        }
      }

      // Create trainer profile through staff creation
      const { data, error } = await createStaffMember({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        role: 'trainer',
        branch_id: formData.branch_id,
        department: formData.department,
        phone: formData.phone,
        id_type: formData.id_type,
        id_number: formData.id_number
      });

      if (error) throw new Error(error);
      
      if (data) {
        // Create additional trainer-specific data
        const trainerData = {
          id: data.id,
          full_name: formData.name, 
          email: formData.email,
          phone: formData.phone,
          specialty: formData.department,
          bio: formData.bio,
          specializations: formData.specializations,
          experience: formData.experience,
          hourly_rate: formData.hourly_rate,
          avatar_url: avatarUrl,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          gender: formData.gender,
          date_of_birth: formData.date_of_birth ? format(formData.date_of_birth, 'yyyy-MM-dd') : null,
          employee_id: formData.employee_id,
          joining_date: formData.joining_date ? format(formData.joining_date, 'yyyy-MM-dd') : null,
          emergency_contact_name: formData.emergency_contact_name,
          emergency_contact_number: formData.emergency_contact_number,
          emergency_contact_relationship: formData.emergency_contact_relationship,
          id_document_url: idDocumentUrl,
          cv_url: cvUrl,
          police_verification_url: policeVerificationUrl,
          certification_urls: certificateUrls,
          is_active: true,
          branch_id: formData.branch_id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        // Update trainer profile with additional data
        const { error: trainerError } = await supabase
          .from('profiles')
          .update({
            avatar_url: avatarUrl,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            country: formData.country,
            gender: formData.gender,
            date_of_birth: formData.date_of_birth,
            department: formData.department,
            id_document_url: idDocumentUrl,
            cv_url: cvUrl,
            police_verification_url: policeVerificationUrl,
            certification_urls: certificateUrls
          })
          .eq('id', data.id);

        if (trainerError) throw trainerError;

        toast({
          title: 'Success',
          description: 'Trainer created successfully!',
        });
        
        // Reset form and states
        form.reset();
        setAvatarFile(null);
        setAvatarPreview(null);
        setIdDocument(null);
        setCvFile(null);
        setPoliceVerificationFile(null);
        setCertificateFiles([]);
        setIdDocumentName(null);
        setCvFileName(null);
        setPoliceFileName(null);
        setCertificateNames([]);
        
        // Call success callback if provided
        if (onSuccess) onSuccess();
      }
    } catch (error: any) {
      console.error('Error creating trainer:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create trainer',
        variant: 'destructive',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="basic-info" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Basic Info</span>
            </TabsTrigger>
            <TabsTrigger value="professional" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              <span className="hidden sm:inline">Professional</span>
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline">Contact</span>
            </TabsTrigger>
            <TabsTrigger value="credentials" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <span className="hidden sm:inline">Login</span>
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Documents</span>
            </TabsTrigger>
          </TabsList>

          {/* Basic Info Tab */}
          <TabsContent value="basic-info" className="space-y-4">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-2/3 space-y-4">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {GENDER_OPTIONS.map(gender => (
                              <SelectItem key={gender} value={gender}>
                                {gender}
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
                    name="date_of_birth"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
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
                                  <span>Pick a date</span>
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
                              disabled={(date) =>
                                date > new Date() || date < new Date("1940-01-01")
                              }
                              initialFocus
                              className="pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="w-full md:w-1/3 flex flex-col items-center justify-start space-y-4">
                <div className="text-center">
                  <FormLabel className="block mb-2">Profile Photo</FormLabel>
                  <div 
                    className="w-32 h-32 mx-auto relative border-2 border-dashed rounded-full flex items-center justify-center overflow-hidden bg-muted"
                    onClick={() => avatarInputRef.current?.click()}
                  >
                    {avatarPreview ? (
                      <>
                        <img 
                          src={avatarPreview} 
                          alt="Avatar preview" 
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFile('avatar');
                          }}
                          className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/80"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      <div className="text-center cursor-pointer">
                        <Upload className="h-6 w-6 mx-auto text-muted-foreground" />
                        <span className="text-xs text-muted-foreground mt-1 block">Upload</span>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={avatarInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'avatar')}
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Click to upload (Max: 5MB)
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Professional Details Tab */}
          <TabsContent value="professional" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="employee_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employee ID</FormLabel>
                    <FormControl>
                      <Input placeholder="TRN-0001" {...field} />
                    </FormControl>
                    <FormDescription>
                      A unique identifier for the trainer
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="joining_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
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
                              <span>Pick a date</span>
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
                          disabled={(date) =>
                            date > new Date()
                          }
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="branch_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Branch</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
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

              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {DEPARTMENT_OPTIONS.map(dept => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="specializations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specializations</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      const currentValues = field.value || [];
                      if (!currentValues.includes(value)) {
                        field.onChange([...currentValues, value]);
                      }
                    }}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Add specializations" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {SPECIALIZATIONS.map((spec) => (
                        <SelectItem key={spec} value={spec}>
                          {spec}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {field.value?.map((spec: string) => (
                      <div 
                        key={spec} 
                        className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-md text-sm"
                      >
                        {spec}
                        <button
                          type="button"
                          onClick={() => {
                            field.onChange(field.value.filter((s: string) => s !== spec));
                          }}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Experience (years)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={e => field.onChange(parseInt(e.target.value) || 0)} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hourly_rate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hourly Rate</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={e => field.onChange(parseFloat(e.target.value) || 0)} 
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
                      placeholder="Brief trainer description and experience" 
                      className="resize-none" 
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Briefly describe the trainer's experience and expertise.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          {/* Contact Info Tab */}
          <TabsContent value="contact" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
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
                    <FormLabel>Phone Number</FormLabel>
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
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="123 Main St" {...field} />
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
                      <Input placeholder="New York" {...field} />
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
                    <FormLabel>State/Province</FormLabel>
                    <FormControl>
                      <Input placeholder="NY" {...field} />
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
                      <Input placeholder="United States" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4 border-t pt-4 mt-4">
              <h3 className="text-sm font-medium">Emergency Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="emergency_contact_name"
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
                  name="emergency_contact_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Number</FormLabel>
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
                name="emergency_contact_relationship"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Relationship</FormLabel>
                    <FormControl>
                      <Input placeholder="Spouse, Parent, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>

          {/* Login Credentials Tab */}
          <TabsContent value="credentials" className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email/Username *</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="john.doe@example.com" 
                      {...field}
                      disabled={true} 
                    />
                  </FormControl>
                  <FormDescription>
                    This email will be used to log in
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                      At least 8 characters
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
              name="send_welcome_email"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Send welcome email
                    </FormLabel>
                    <FormDescription>
                      An email will be sent with login credentials
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-4">
            <div className="space-y-4">
              <div>
                <FormLabel>ID Proof</FormLabel>
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center justify-between p-4 border border-dashed rounded-md">
                    <div className="flex items-center space-x-2">
                      <FileCheck className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{idDocumentName || "No file selected"}</p>
                        <p className="text-xs text-muted-foreground">
                          PDF, JPG or PNG (max 10MB)
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {idDocument && (
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleRemoveFile('id')}
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      )}
                      <Button 
                        type="button" 
                        variant="secondary" 
                        size="sm" 
                        onClick={() => idDocumentRef.current?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        <span>Upload</span>
                      </Button>
                    </div>
                  </div>
                  <input
                    type="file"
                    ref={idDocumentRef}
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange(e, 'id')}
                  />

                  <FormField
                    control={form.control}
                    name="id_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ID Type</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select ID type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {ID_PROOF_TYPES.map(type => (
                              <SelectItem key={type} value={type}>
                                {type}
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
                    name="id_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ID Number</FormLabel>
                        <FormControl>
                          <Input placeholder="ID Number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div>
                <FormLabel>CV / Resume</FormLabel>
                <div className="flex items-center justify-between p-4 border border-dashed rounded-md">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{cvFileName || "No file selected"}</p>
                      <p className="text-xs text-muted-foreground">
                        PDF, DOC or DOCX (max 20MB)
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {cvFile && (
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleRemoveFile('cv')}
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    )}
                    <Button 
                      type="button" 
                      variant="secondary" 
                      size="sm" 
                      onClick={() => cvFileRef.current?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      <span>Upload</span>
                    </Button>
                  </div>
                </div>
                <input
                  type="file"
                  ref={cvFileRef}
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileChange(e, 'cv')}
                />
              </div>

              <div>
                <FormLabel>Certifications</FormLabel>
                <div className="flex items-center justify-between p-4 border border-dashed rounded-md">
                  <div className="flex items-center space-x-2">
                    <Award className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">
                        {certificateNames.length > 0 
                          ? `${certificateNames.length} file(s) selected` 
                          : "No files selected"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PDF, JPG or PNG (max 10MB each)
                      </p>
                    </div>
                  </div>
                  <Button 
                    type="button" 
                    variant="secondary" 
                    size="sm" 
                    onClick={() => certificateFilesRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    <span>Upload</span>
                  </Button>
                </div>
                {certificateNames.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {certificateNames.map((name, index) => (
                      <div key={index} className="flex items-center justify-between bg-secondary/50 rounded-md p-2">
                        <span className="text-sm truncate max-w-[80%]">{name}</span>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleRemoveFile('police', index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                <input
                  type="file"
                  ref={certificateFilesRef}
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange(e, 'certificate')}
                  multiple
                />
              </div>

              <div>
                <FormLabel>Police Verification</FormLabel>
                <div className="flex items-center justify-between p-4 border border-dashed rounded-md">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{policeFileName || "No file selected"}</p>
                      <p className="text-xs text-muted-foreground">
                        PDF, JPG or PNG (max 10MB)
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {policeVerificationFile && (
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleRemoveFile('police')}
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    )}
                    <Button 
                      type="button" 
                      variant="secondary" 
                      size="sm" 
                      onClick={() => policeVerificationRef.current?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      <span>Upload</span>
                    </Button>
                  </div>
                </div>
                <input
                  type="file"
                  ref={policeVerificationRef}
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange(e, 'police')}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting || isUploading}>
            {isSubmitting || isUploading ? (
              <>
                <span className="animate-spin mr-2">◌</span>
                Creating...
              </>
            ) : (
              "Create Trainer"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
