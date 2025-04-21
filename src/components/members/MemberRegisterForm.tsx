
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { registerMember } from "@/lib/supabase/profileService";
import { User } from "@/types/user";

interface MemberRegisterFormProps {
  onSuccess?: () => void;
  defaultBranchId?: string;
}

const MemberRegisterForm = ({ onSuccess, defaultBranchId }: MemberRegisterFormProps) => {
  const [loading, setLoading] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(undefined);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    try {
      // Prepare user data
      const userData: Partial<User> & { password?: string } = {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        password: formData.get('password') as string,
        role: 'member',
        branchId: defaultBranchId || formData.get('branchId') as string,
        address: formData.get('address') as string,
        city: formData.get('city') as string,
        state: formData.get('state') as string,
        zipCode: formData.get('zipCode') as string,
        country: formData.get('country') as string || 'India',
      };

      if (dateOfBirth) {
        userData.dateOfBirth = dateOfBirth.toISOString().split('T')[0];
      }

      await registerMember(userData);
      toast.success("Member registered successfully!");
      e.currentTarget.reset();
      setDateOfBirth(undefined);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to register member");
      console.error("Registration error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Basic Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" name="name" required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" name="phone" required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            <DatePicker 
              id="dateOfBirth"
              date={dateOfBirth} 
              onSelect={setDateOfBirth} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required />
          </div>
        </div>
      </div>
      
      {/* Address Information */}
      <div className="space-y-4 pt-4 border-t">
        <h3 className="text-lg font-medium">Address Information</h3>
        
        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Textarea id="address" name="address" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input id="city" name="city" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Input id="state" name="state" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="zipCode">Postal Code</Label>
            <Input id="zipCode" name="zipCode" />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input id="country" name="country" defaultValue="India" />
        </div>
      </div>
      
      <div className="pt-4 flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register Member"}
        </Button>
      </div>
    </form>
  );
};

export default MemberRegisterForm;
