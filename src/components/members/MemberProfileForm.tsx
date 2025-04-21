
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Member } from "@/types";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface MemberProfileFormProps {
  member: Member;
  onSave: (updatedMember: Member) => void;
  onCancel: () => void;
}

const MemberProfileForm = ({ member, onSave, onCancel }: MemberProfileFormProps) => {
  const { user } = useAuth();
  const isMember = user?.role === 'member';
  
  const [formData, setFormData] = useState<Member & {
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  }>({
    ...member,
    address: member.address || '',
    city: member.city || '',
    state: member.state || '',
    zipCode: member.zipCode || '',
    country: member.country || 'India',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(member.avatar);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const updatedMember = {
        ...member, // Keep original properties
        // Only update editable fields
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country,
        avatar: avatarPreview
      };
      onSave(updatedMember as Member);
      toast.success("Member profile updated successfully");
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Member Profile</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {/* Profile Photo */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={avatarPreview} alt={member.name} />
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {getInitials(member.name)}
                </AvatarFallback>
              </Avatar>
              <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 p-1 bg-primary text-white rounded-full cursor-pointer">
                <Camera className="h-4 w-4" />
                <input 
                  id="avatar-upload" 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
            </div>
            <div className="text-sm text-muted-foreground">
              Click the camera icon to change profile photo
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Read-only fields */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                readOnly={isMember}
                disabled={isMember}
                className={isMember ? "bg-muted" : ""}
              />
            </div>
            
            {/* Editable fields */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone || ""}
                onChange={handleChange}
              />
            </div>
            
            {/* Read-only fields */}
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth ? new Date(formData.dateOfBirth).toLocaleDateString() : ""}
                readOnly
                disabled
                className="bg-muted"
              />
            </div>
            
            {/* Editable address fields */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="zipCode">Postal Code</Label>
              <Input
                id="zipCode"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="India"
              />
            </div>
            
            {/* Read-only membership fields */}
            <div className="space-y-2">
              <Label htmlFor="membershipStatus">Membership Status</Label>
              <Input
                id="membershipStatus"
                name="membershipStatus"
                value={formData.membershipStatus}
                readOnly
                disabled
                className="bg-muted"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="membershipId">Membership ID</Label>
              <Input
                id="membershipId"
                name="membershipId"
                value={formData.membershipId || ""}
                readOnly
                disabled
                className="bg-muted"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="membershipStartDate">Start Date</Label>
              <Input
                id="membershipStartDate"
                name="membershipStartDate"
                value={formData.membershipStartDate ? new Date(formData.membershipStartDate).toLocaleDateString() : ""}
                readOnly
                disabled
                className="bg-muted"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="membershipEndDate">End Date</Label>
              <Input
                id="membershipEndDate"
                name="membershipEndDate"
                value={formData.membershipEndDate ? new Date(formData.membershipEndDate).toLocaleDateString() : ""}
                readOnly
                disabled
                className="bg-muted"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="trainerId">Assigned Trainer</Label>
              <Input
                id="trainerId"
                name="trainerId"
                value={formData.trainerId || ""}
                readOnly
                disabled
                className="bg-muted"
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="goal">Fitness Goal</Label>
              <Input
                id="goal"
                name="goal"
                value={formData.goal || ""}
                readOnly
                disabled
                className="bg-muted"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default MemberProfileForm;
