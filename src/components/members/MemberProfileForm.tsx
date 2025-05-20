
import React, { useState, useEffect, useCallback } from 'react';
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
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useUploadImage } from '@/hooks/utils/use-upload-image';

interface MemberProfileFormProps {
  member: Member | null;
  onSubmit: (data: Member) => Promise<void>;
  disabled?: boolean;
  isLoading?: boolean;
}

const MemberProfileForm: React.FC<MemberProfileFormProps> = ({ 
  member, 
  onSubmit, 
  disabled = false,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<Partial<Member>>({});
  const [date, setDate] = useState<Date | undefined>();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();
  const { uploadImage } = useUploadImage();

  useEffect(() => {
    if (member) {
      // Use date_of_birth from member, fallback to dateOfBirth for compatibility
      const birthDate = member.date_of_birth || member.dateOfBirth;
      setDate(birthDate ? new Date(birthDate) : undefined);
      
      // Set avatar preview if available
      if (member.profile_picture || member.avatar) {
        setImagePreview(member.profile_picture || member.avatar || null);
      }
      
      // Initialize form data with member data
      setFormData({
        name: member.name || '',
        email: member.email || '',
        phone: member.phone || '',
        address: member.address || '',
        city: member.city || '',
        state: member.state || '',
        zip_code: member.zipCode || member.zip_code || '',
        country: member.country || 'India',
        gender: member.gender || 'male',
        date_of_birth: member.date_of_birth || member.dateOfBirth || '',
        goal: member.goal || '',
        profile_picture: member.profile_picture || member.avatar || '',
        occupation: member.occupation || '',
        blood_group: member.blood_group || '',
        id_type: member.id_type || '',
        id_number: member.id_number || '',
        status: member.status || 'active',
        // Preserve existing properties
        id: member.id,
        membership_id: member.membership_id,
        trainer_id: member.trainer_id,
        branch_id: member.branch_id
      });
    }
  }, [member]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = useCallback((date: Date | undefined) => {
    setDate(date);
    if (date) {
      const formattedDate = format(date, 'yyyy-MM-dd');
      setFormData(prev => ({ 
        ...prev, 
        date_of_birth: formattedDate,
        dateOfBirth: formattedDate // For backward compatibility
      }));
    }
  }, [setFormData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Upload image if selected
      if (selectedImage) {
        const imageUrl = await uploadImage({
          file: selectedImage,
          folder: 'members'
        });
        if (imageUrl) {
          setFormData(prev => ({ 
            ...prev, 
            profile_picture: imageUrl,
            avatar: imageUrl // For backward compatibility
          }));
        }
      }
      
      // Submit updated form data
      if (onSubmit) {
        await onSubmit({ ...formData } as Member);
        toast({
          title: "Success!",
          description: "Member profile updated successfully.",
        });
      }
    } catch (error) {
      console.error("Error updating member profile:", error);
      toast({
        variant: "destructive",
        title: "Error!",
        description: "Failed to update member profile.",
      });
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Avatar Upload */}
      <div className="flex flex-col items-center justify-center my-6">
        <Avatar className="h-24 w-24">
          <AvatarImage src={imagePreview || ''} alt={formData.name || 'Member'} />
          <AvatarFallback className="text-xl">
            {formData.name ? getInitials(formData.name) : 'M'}
          </AvatarFallback>
        </Avatar>
        <div className="mt-2">
          <input
            type="file"
            id="avatar-upload"
            className="hidden"
            onChange={handleFileChange}
            accept="image/*"
            disabled={disabled}
          />
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => document.getElementById('avatar-upload')?.click()}
            disabled={disabled}
          >
            Change Photo
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name || ''}
            onChange={handleInputChange}
            disabled={disabled}
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
            disabled={disabled}
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
            disabled={disabled}
          />
        </div>
        <div>
          <Label htmlFor="gender">Gender</Label>
          <Select
            value={formData.gender || 'male'}
            onValueChange={(value) => handleSelectChange('gender', value)}
            disabled={disabled}
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
          disabled={disabled}
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
            disabled={disabled}
          />
        </div>
        <div>
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            name="state"
            value={formData.state || ''}
            onChange={handleInputChange}
            disabled={disabled}
          />
        </div>
        <div>
          <Label htmlFor="zip_code">Zip Code</Label>
          <Input
            id="zip_code"
            name="zip_code"
            value={formData.zip_code || ''}
            onChange={handleInputChange}
            disabled={disabled}
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
          disabled={disabled}
        />
      </div>

      <div>
        <Label htmlFor="date_of_birth">Date of Birth</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[240px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
              disabled={disabled}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateChange}
              disabled={disabled}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div>
        <Label htmlFor="goal">Fitness Goal</Label>
        <Input
          id="goal"
          name="goal"
          value={formData.goal || ''}
          onChange={handleInputChange}
          disabled={disabled}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="occupation">Occupation</Label>
          <Input
            id="occupation"
            name="occupation"
            value={formData.occupation || ''}
            onChange={handleInputChange}
            disabled={disabled}
          />
        </div>
        <div>
          <Label htmlFor="blood_group">Blood Group</Label>
          <Input
            id="blood_group"
            name="blood_group"
            value={formData.blood_group || ''}
            onChange={handleInputChange}
            disabled={disabled}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="id_type">ID Type</Label>
          <Input
            id="id_type"
            name="id_type"
            value={formData.id_type || ''}
            onChange={handleInputChange}
            disabled={disabled}
          />
        </div>
        <div>
          <Label htmlFor="id_number">ID Number</Label>
          <Input
            id="id_number"
            name="id_number"
            value={formData.id_number || ''}
            onChange={handleInputChange}
            disabled={disabled}
          />
        </div>
      </div>

      <Button type="submit" disabled={disabled || isLoading}>
        {isLoading ? (
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
