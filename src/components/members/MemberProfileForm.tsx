import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Member } from '@/types/member';
import { useToast } from "@/components/ui/use-toast"

interface MemberProfileFormProps {
  member: Member | null;
  onSubmit: (data: Member) => Promise<void>;
  disabled?: boolean;
}

const MemberProfileForm: React.FC<MemberProfileFormProps> = ({ member, onSubmit, disabled = false }) => {
  const [formData, setFormData] = useState<Partial<Member>>({});
  const [date, setDate] = useState<Date>();
  const { toast } = useToast()

  useEffect(() => {
    if (member) {
      setDate(member.dateOfBirth ? new Date(member.dateOfBirth) : undefined);
    }
  }, [member]);

  const initialFormData = {
    name: member?.name || '',
    email: member?.email || '',
    phone: member?.phone || '',
    address: member?.address || '',
    city: member?.city || '',
    state: member?.state || '',
    zipCode: member?.zipCode || '',
    country: member?.country || 'India',
    gender: member?.gender || 'male',
    dateOfBirth: member?.dateOfBirth || '',
    goal: member?.goal || '',
    avatar: member?.avatar || '',
    emergency_contact_name: member?.emergency_contact_name || '',
    emergency_contact_phone: member?.emergency_contact_phone || '',
    emergency_contact_relation: member?.emergency_contact_relation || '',
  };

  useEffect(() => {
    setFormData(initialFormData);
  }, [member]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = useCallback((date: Date | undefined) => {
    setDate(date);
    if (date) {
      const formattedDate = format(date, 'yyyy-MM-dd');
      setFormData(prev => ({ ...prev, dateOfBirth: formattedDate }));
    }
  }, [setFormData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (onSubmit) {
        await onSubmit({ ...formData } as Member);
        toast({
          title: "Success!",
          description: "Member profile updated successfully.",
        })
      }
    } catch (error) {
      console.error("Error updating member profile:", error);
      toast({
        variant: "destructive",
        title: "Error!",
        description: "Failed to update member profile.",
      })
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
            value={formData.gender as string || 'male'}
            onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
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
          <Label htmlFor="zipCode">Zip Code</Label>
          <Input
            id="zipCode"
            name="zipCode"
            value={formData.zipCode || ''}
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
        <Label htmlFor="dateOfBirth">Date of Birth</Label>
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
          <Label htmlFor="emergency_contact_name">Emergency Contact Name</Label>
          <Input
            id="emergency_contact_name"
            value={formData.emergency_contact_name}
            onChange={handleInputChange}
            disabled={disabled}
          />
        </div>
        <div>
          <Label htmlFor="emergency_contact_phone">Emergency Contact Phone</Label>
          <Input
            id="emergency_contact_phone"
            value={formData.emergency_contact_phone}
            onChange={handleInputChange}
            disabled={disabled}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="emergency_contact_relation">Relationship</Label>
        <Input
          id="emergency_contact_relation"
          value={formData.emergency_contact_relation}
          onChange={handleInputChange}
          disabled={disabled}
        />
      </div>

      <Button type="submit" disabled={disabled}>
        Update Profile
      </Button>
    </form>
  );
};

export default MemberProfileForm;
