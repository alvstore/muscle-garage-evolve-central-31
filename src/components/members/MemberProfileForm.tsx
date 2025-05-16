import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Member, MembershipPlan } from '@/types';
import ProfileImageUpload from './ProfileImageUpload';
import countries from '@/data/countries';

interface MemberProfileFormProps {
  member: Member | null;
  onSave: (member: Member) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
  membershipPlans: MembershipPlan[];
}

interface FormState extends Omit<Member, 'date_of_birth' | 'membership_id' | 'membership_status'> {
  date_of_birth: string;
  membership_id: string;
  membership_status: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  emergency_contact_relation: string;
}

const initialFormState: FormState = {
  id: '',
  name: '',
  email: '',
  phone: '',
  date_of_birth: '',
  gender: '',
  address: '',
  city: '',
  state: '',
  country: '',
  zip_code: '',
  avatar: '',
  membership_id: '',
  membership_status: '',
  emergency_contact_name: '',
  emergency_contact_phone: '',
  emergency_contact_relation: '',
  created_at: '',
  updated_at: '',
  branch_id: '',
};

const MemberProfileForm: React.FC<MemberProfileFormProps> = ({ member, onSave, onCancel, isLoading, membershipPlans }) => {
  const [formData, setFormData] = useState<FormState>(initialFormState);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  useEffect(() => {
    if (member) {
      setFormData({
        ...member,
        date_of_birth: member.date_of_birth || '',
        membership_id: member.membership_id || '',
        membership_status: member.membership_status || '',
        emergency_contact_name: member.emergency_contact_name || '',
        emergency_contact_phone: member.emergency_contact_phone || '',
        emergency_contact_relation: member.emergency_contact_relation || '',
      });
    }
  }, [member]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = useCallback((file: File) => {
    setSelectedImage(file);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const memberData: Member = {
      ...formData,
      date_of_birth: formData.date_of_birth,
      membership_id: formData.membership_id,
      membership_status: formData.membership_status,
      emergency_contact_name: formData.emergency_contact_name,
      emergency_contact_phone: formData.emergency_contact_phone,
      emergency_contact_relation: formData.emergency_contact_relation,
    };

    await onSave(memberData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Information */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update member's personal details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-none">
              <ProfileImageUpload
                onChange={handleImageChange}
                disabled={isLoading}
                initialImage={member?.avatar || undefined}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select value={formData.gender} onValueChange={(value) => handleSelectChange('gender', value)}>
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
            
            <div className="space-y-2">
              <Label htmlFor="date_of_birth">Date of Birth</Label>
              <Input
                id="date_of_birth"
                name="date_of_birth"
                type="date"
                value={formData.date_of_birth || ''}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State / Province</Label>
              <Input
                id="state"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Address Information */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Address</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="zip_code">Zip / Postal Code</Label>
              <Input
                id="zip_code"
                name="zip_code"
                value={formData.zip_code}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Select value={formData.country} onValueChange={(value) => handleSelectChange('country', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contact */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Emergency Contact</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="emergency_contact_name">Name</Label>
              <Input
                id="emergency_contact_name"
                name="emergency_contact_name"
                value={formData.emergency_contact_name}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergency_contact_phone">Phone</Label>
              <Input
                id="emergency_contact_phone"
                name="emergency_contact_phone"
                value={formData.emergency_contact_phone}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergency_contact_relation">Relation</Label>
              <Input
                id="emergency_contact_relation"
                name="emergency_contact_relation"
                value={formData.emergency_contact_relation}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Membership Details */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Membership Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="membership_id">Membership Plan</Label>
              <Select value={formData.membership_id} onValueChange={(value) => handleSelectChange('membership_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select membership plan" />
                </SelectTrigger>
                <SelectContent>
                  {membershipPlans.map((plan) => (
                    <SelectItem key={plan.id} value={plan.id}>
                      {plan.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="membership_status">Membership Status</Label>
              <Select value={formData.membership_status} onValueChange={(value) => handleSelectChange('membership_status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </form>
  );
};

export default MemberProfileForm;
