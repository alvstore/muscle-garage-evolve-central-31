
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Member } from '@/types/members/member';
import { toast } from "sonner";
import { useUploadImage } from '@/hooks/utils/use-upload-image';
import AvatarUpload from '@/components/AVATAR/AvatarUpload';

interface MemberProfileFormProps {
  member: Member | null;
  onSubmit: (data: Member) => Promise<void>;
  disabled?: boolean;
}

const MemberProfileForm: React.FC<MemberProfileFormProps> = ({ member, onSubmit, disabled = false }) => {
  const [formData, setFormData] = useState<Partial<Member>>({});
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [date, setDate] = useState<Date | undefined>();
  const { uploadImage, isUploading } = useUploadImage();

  // Initialize form with member data
  useEffect(() => {
    if (member) {
      // Handle date of birth conversion
      let dob = member.date_of_birth ? new Date(member.date_of_birth) : 
              (member.dateOfBirth ? new Date(member.dateOfBirth) : undefined);
              
      setDate(dob);

      // Set initial form data
      setFormData({
        ...member,
        // Ensure all potential field variations are considered
        name: member.name || '',
        email: member.email || '',
        phone: member.phone || '',
        address: member.address || '',
        city: member.city || '',
        state: member.state || '',
        zipCode: member.zipCode || member.zip_code || '',
        country: member.country || 'India',
        gender: member.gender || 'male',
        date_of_birth: member.date_of_birth || member.dateOfBirth || '',
        goal: member.goal || '',
        avatar: member.avatar || member.profile_picture || '',
        occupation: member.occupation || '',
        blood_group: member.blood_group || '',
        id_type: member.id_type || '',
        id_number: member.id_number || ''
      });
    }
  }, [member]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | undefined) => {
    setDate(date);
    if (date) {
      const formattedDate = format(date, 'yyyy-MM-dd');
      setFormData(prev => ({ 
        ...prev, 
        date_of_birth: formattedDate,
        dateOfBirth: formattedDate // For backward compatibility
      }));
    }
  };

  const handleImageChange = (file: File | null) => {
    setProfileImage(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Upload profile image if selected
      let avatarUrl = formData.avatar;
      
      if (profileImage) {
        const uploadedUrl = await uploadImage({ file: profileImage, folder: 'avatars' });
        if (uploadedUrl) {
          avatarUrl = uploadedUrl;
        }
      }

      // Update the member with all the collected data
      const updatedMember: Member = {
        ...formData,
        avatar: avatarUrl,
        profile_picture: avatarUrl, // Ensure both fields are updated for compatibility
        id: member?.id || '', // Ensure ID is preserved
      } as Member;

      await onSubmit(updatedMember);
      toast.success("Member profile updated successfully.");
    } catch (error) {
      console.error("Error updating member profile:", error);
      toast.error("Failed to update member profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // If there's no member data and not in creation mode, show loading
  if (!member && !disabled) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Avatar Upload Section */}
      <div className="flex justify-center mb-8">
        <AvatarUpload
          initialImageUrl={formData.avatar}
          onImageChange={handleImageChange}
          disabled={disabled || isSubmitting}
          name={formData.name || ''}
          size="xl"
        />
      </div>

      {/* Basic Info Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
          <Input
            id="name"
            name="name"
            value={formData.name || ''}
            onChange={handleInputChange}
            disabled={disabled || isSubmitting}
            required
          />
        </div>
        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input
            type="email"
            id="email"
            name="email"
            value={formData.email || ''}
            onChange={handleInputChange}
            disabled={disabled || isSubmitting}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone || ''}
            onChange={handleInputChange}
            disabled={disabled || isSubmitting}
          />
        </div>
        <div>
          <Label htmlFor="gender">Gender</Label>
          <Select
            value={formData.gender as string || 'male'}
            onValueChange={(value) => handleSelectChange('gender', value)}
            disabled={disabled || isSubmitting}
          >
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

      <div>
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          name="address"
          value={formData.address || ''}
          onChange={handleInputChange}
          disabled={disabled || isSubmitting}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            name="city"
            value={formData.city || ''}
            onChange={handleInputChange}
            disabled={disabled || isSubmitting}
          />
        </div>
        <div>
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            name="state"
            value={formData.state || ''}
            onChange={handleInputChange}
            disabled={disabled || isSubmitting}
          />
        </div>
        <div>
          <Label htmlFor="zipCode">Zip Code</Label>
          <Input
            id="zipCode"
            name="zipCode"
            value={formData.zipCode || ''}
            onChange={handleInputChange}
            disabled={disabled || isSubmitting}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="country">Country</Label>
        <Input
          id="country"
          name="country"
          value={formData.country || ''}
          onChange={handleInputChange}
          disabled={disabled || isSubmitting}
        />
      </div>

      <div>
        <Label htmlFor="date_of_birth">Date of Birth</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
              disabled={disabled || isSubmitting}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Select date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateChange}
              disabled={disabled || isSubmitting || ((date) => date > new Date())}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Additional Info Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="goal">Fitness Goal</Label>
          <Input
            id="goal"
            name="goal"
            value={formData.goal || ''}
            onChange={handleInputChange}
            disabled={disabled || isSubmitting}
          />
        </div>
        <div>
          <Label htmlFor="occupation">Occupation</Label>
          <Input
            id="occupation"
            name="occupation"
            value={formData.occupation || ''}
            onChange={handleInputChange}
            disabled={disabled || isSubmitting}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="blood_group">Blood Group</Label>
          <Input
            id="blood_group"
            name="blood_group"
            value={formData.blood_group || ''}
            onChange={handleInputChange}
            disabled={disabled || isSubmitting}
          />
        </div>
        <div>
          <Label htmlFor="id_type">ID Type</Label>
          <Input
            id="id_type"
            name="id_type"
            value={formData.id_type || ''}
            onChange={handleInputChange}
            disabled={disabled || isSubmitting}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="id_number">ID Number</Label>
        <Input
          id="id_number"
          name="id_number"
          value={formData.id_number || ''}
          onChange={handleInputChange}
          disabled={disabled || isSubmitting}
        />
      </div>

      <Button 
        type="submit" 
        disabled={disabled || isSubmitting || isUploading}
        className="w-full sm:w-auto"
      >
        {isSubmitting || isUploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Updating...
          </>
        ) : (
          'Update Profile'
        )}
      </Button>
    </form>
  );
};

export default MemberProfileForm;
