import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Upload, User, X, Calendar, FileText, Phone, Mail, Lock, MapPin, FileDigit, FileCheck, FileText as FileTextIcon, ShieldAlert } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { useBranch } from '@/hooks/settings/use-branches';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';

// Form Schema
interface FormData {
  // Basic Info
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  role: 'trainer';
  department?: string;
  branch_id?: string;
  employee_id?: string;
  joining_date?: Date;
  
  // Contact
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  
  // Documents
  id_type?: string;
  id_number?: string;
  
  // Trainer specific
  specializations: string[];
  certifications?: string;
  experience?: number;
  hourly_rate?: number;
  bio?: string;
  date_of_birth?: Date;
  gender?: string;
  emergency_contact_name?: string;
  emergency_contact_number?: string;
  emergency_contact_relationship?: string;
  
  // UI State
  send_welcome_email?: boolean;
}

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

interface CreateTrainerFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const CreateTrainerForm = ({ onSuccess, onCancel }: CreateTrainerFormProps) => {
  const { toast } = useToast();
  const { currentBranch, branches } = useBranch();
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: 'trainer',
      specializations: [],
    },
  });

  const { register, handleSubmit, formState: { errors }, reset } = form;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic-info');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [idDocument, setIdDocument] = useState<File | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [policeVerificationFile, setPoliceVerificationFile] = useState<File | null>(null);
  const [certificateFiles, setCertificateFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Initialize form with default values
  const form = useForm<FormData>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      specializations: [],
      bio: '',
      branch_id: currentBranch?.id,
      password: '',
      confirmPassword: '',
      date_of_birth: undefined,
      gender: '',
      employee_id: '',
      joining_date: undefined,
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
      role: 'trainer',
      department: ''
    },
  });
  
  const { register, handleSubmit, watch, reset, formState: { errors }, setValue, control } = form;
  const password = watch('password');
  
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
    
    setIsSubmitting(true);
    
    try {

    setIsSubmitting(true);
    
    try {
      // 1. Upload avatar if exists
      let avatarUrl = '';
      if (avatarFile) {
        try {
          // Validate avatar file
          validateFile(avatarFile, ['image/jpeg', 'image/png', 'image/webp'], 5);
          
          const fileName = `avatar-${uuidv4()}-${avatarFile.name}`;
          const { error: uploadError } = await supabase.storage
            .from('trainer-avatars')
            .upload(fileName, avatarFile, {
              cacheControl: '3600',
              upsert: false
            });
            
          if (uploadError) throw uploadError;
          
          const { data: { publicUrl } } = supabase.storage
            .from('trainer-avatars')
            .getPublicUrl(fileName);
            
          avatarUrl = publicUrl;
        } catch (error: any) {
          throw new Error(`Avatar upload failed: ${error.message}`);
        }
      }
      
      // 2. Upload ID document if exists
      let idDocumentUrl = '';
      if (idDocument) {
        try {
          // Validate ID document
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
      
      // ID proof is already handled in the first upload section
      
      // 3. Upload certificates if any
      const certificateUrls: string[] = [];
      for (const certFile of certificateFiles) {
        try {
          // Validate certificate file
          validateFile(
            certFile,
            ['application/pdf', 'image/jpeg', 'image/png'],
            10 // 10MB max size per file
          );
          
          const fileName = `certificate-${uuidv4()}-${certFile.name}`;
          const { error: uploadError } = await supabase.storage
            .from('trainer-documents')
            .upload(fileName, certFile, {
              cacheControl: '3600',
              upsert: false
            });
            
          if (uploadError) throw uploadError;
          
          const { data: { publicUrl } } = supabase.storage
            .from('trainer-documents')
            .getPublicUrl(fileName);
            
          certificateUrls.push(publicUrl);
        } catch (error: any) {
          throw new Error(`Certificate upload failed for ${certFile.name}: ${error.message}`);
        }
      }

      // 3. Upload CV if exists
      let cvUrl = '';
      if (cvFile) {
        try {
          validateFile(
            cvFile,
            ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
            20 // 20MB max size for CV
          );
          
          const fileName = `cv-${uuidv4()}-${cvFile.name}`;
          const { error: uploadError } = await supabase.storage
            .from('trainer-documents')
            .upload(fileName, cvFile, {
              cacheControl: '3600',
              upsert: false
            });
            
          if (uploadError) throw uploadError;
          
          const { data: { publicUrl } } = supabase.storage
            .from('trainer-documents')
            .getPublicUrl(fileName);
            
          cvUrl = publicUrl;
        } catch (error: any) {
          throw new Error(`CV upload failed: ${error.message}`);
        }
      }
      
      // 4. Upload police verification if exists
      let policeVerificationUrl = '';
      if (policeVerificationFile) {
        try {
          validateFile(
            policeVerificationFile,
            ['application/pdf', 'image/jpeg', 'image/png'],
            10 // 10MB max size
          );
          
          const fileName = `police-verification-${uuidv4()}-${policeVerificationFile.name}`;
          const { error: uploadError } = await supabase.storage
            .from('trainer-documents')
            .upload(fileName, policeVerificationFile, {
              cacheControl: '3600',
              upsert: false
            });
            
          if (uploadError) throw uploadError;
          
          const { data: { publicUrl } } = supabase.storage
            .from('trainer-documents')
            .getPublicUrl(fileName);
            
          policeVerificationUrl = publicUrl;
        } catch (error: any) {
          throw new Error(`Police verification upload failed: ${error.message}`);
        }
      }

      // 5. Create trainer profile
      const trainerData = {
        ...formData,
        avatar_url: avatarPreview, // Using the preview URL for now
        id_proof_url: idDocument ? `id-document-${idDocument.name}` : null,
        cv_url: cvFile ? `cv-${cvFile.name}` : null,
        police_verification_url: policeVerificationFile ? `police-verification-${policeVerificationFile.name}` : null,
        certificate_urls: certificateFiles.map(file => `certificate-${file.name}`),
        branch_id: currentBranch.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('trainers')
        .insert([trainerData]);

      if (error) throw error;

      // 6. Show success message and reset form
      toast({
        title: 'Success',
        description: 'Trainer created successfully!',
      });
      
      // Reset form and states
      reset();
      setAvatarFile(null);
      setAvatarPreview(null);
      setIdDocument(null);
      setCvFile(null);
      setPoliceVerificationFile(null);
      setCertificateFiles([]);
      
      // Call success callback if provided
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error('Error creating trainer:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create trainer',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
            <TabsTrigger value="professional">Professional</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="basic-info" className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="john.doe@example.com" {...field} />
                </FormControl>
                <FormDescription>
                  They will receive login information at this address
                </FormDescription>
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
                value=""
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
                    className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md text-sm"
                  >
                    {spec}
                    <button
                      type="button"
                      onClick={() => {
                        field.onChange(field.value.filter((s: string) => s !== spec));
                      }}
                      className="text-gray-500 hover:text-red-500"
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

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Brief trainer description and experience" 
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

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Create Trainer"
          )}
        </Button>
      </form>
    </Form>
  );
};
