
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { Member } from "@/types";
import { toast } from "sonner";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Upload } from "lucide-react";

interface MemberProfileFormProps {
  member: Member;
  onSave: (updatedMember: Member) => void;
  onCancel: () => void;
}

const MemberProfileForm = ({ member, onSave, onCancel }: MemberProfileFormProps) => {
  const [formData, setFormData] = useState<Member>({ ...member });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(member.avatar);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name: string, date: Date | undefined) => {
    setFormData(prev => ({ 
      ...prev, 
      [name]: date ? date.toISOString() : undefined 
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, this would upload to a server and return a URL
      // For now, we'll use a local URL for the preview
      const imageUrl = URL.createObjectURL(file);
      setAvatarPreview(imageUrl);
      setFormData(prev => ({ ...prev, avatar: imageUrl }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      onSave(formData);
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
        <CardContent className="space-y-4">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={avatarPreview} alt={formData.name} />
                <AvatarFallback>{formData.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="absolute bottom-0 right-0">
                <Label htmlFor="avatar" className="cursor-pointer">
                  <div className="bg-primary text-primary-foreground rounded-full p-2 hover:bg-primary/90 transition-colors">
                    <Upload className="h-4 w-4" />
                  </div>
                </Label>
                <Input 
                  id="avatar" 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleFileChange}
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
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
            
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address || ""}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <DatePicker
                id="dateOfBirth"
                date={formData.dateOfBirth ? new Date(formData.dateOfBirth) : undefined}
                onSelect={(date) => handleDateChange("dateOfBirth", date)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="membershipStatus">Membership Status</Label>
              <Select 
                value={formData.membershipStatus} 
                onValueChange={(value) => handleSelectChange("membershipStatus", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="membershipId">Membership ID</Label>
              <Input
                id="membershipId"
                name="membershipId"
                value={formData.membershipId || ""}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="membershipStartDate">Start Date</Label>
              <DatePicker
                id="membershipStartDate"
                date={formData.membershipStartDate ? new Date(formData.membershipStartDate) : undefined}
                onSelect={(date) => handleDateChange("membershipStartDate", date)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="membershipEndDate">End Date</Label>
              <DatePicker
                id="membershipEndDate"
                date={formData.membershipEndDate ? new Date(formData.membershipEndDate) : undefined}
                onSelect={(date) => handleDateChange("membershipEndDate", date)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="trainerId">Assigned Trainer ID</Label>
              <Input
                id="trainerId"
                name="trainerId"
                value={formData.trainerId || ""}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="goal">Fitness Goal</Label>
              <Textarea
                id="goal"
                name="goal"
                value={formData.goal || ""}
                onChange={handleChange}
                className="min-h-[80px]"
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
