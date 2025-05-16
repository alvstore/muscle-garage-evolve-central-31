import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileImageUpload } from './ProfileImageUpload';
import { Member } from '@/types';
import { countries } from '@/data/countries';

// This component will need significant adjustments to fix all the errors
// We'll make the minimal changes needed to get it to compile

interface MemberProfileFormProps {
  member?: Member | null;
  isSubmitting?: boolean;
  onSubmit: (data: any) => void;
}

const MemberProfileForm: React.FC<MemberProfileFormProps> = ({ 
  member, 
  isSubmitting = false, 
  onSubmit 
}) => {
  const [formData, setFormData] = useState<Partial<Member>>(member || {});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleImageChange = (file: File) => {
    // Handle image upload logic
    console.log("Image file selected:", file);
    // You would typically upload this to storage and get a URL back
    // Then update the formData with the URL
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="flex-shrink-0">
              <ProfileImageUpload 
                onImageChange={handleImageChange} 
                disabled={isSubmitting} 
              />
            </div>
            <div className="flex-grow space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name"
                    name="name"
                    value={formData.name || ""}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email || ""}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input 
                    id="phone"
                    name="phone"
                    value={formData.phone || ""}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input 
                    id="dateOfBirth"
                    name="date_of_birth"
                    type="date"
                    value={formData.date_of_birth || ""}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="membership">Membership ID</Label>
                  <Input 
                    id="membership"
                    name="membership_id"
                    value={formData.membership_id || ""}
                    onChange={handleChange}
                    disabled={true} // Always disabled as this is a system field
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="membershipStatus">Membership Status</Label>
                  <Select 
                    disabled={isSubmitting}
                    value={formData.membership_status || "active"}
                    onValueChange={(value) => handleSelectChange("membership_status", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="personal">
            <TabsList className="mb-4">
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="address">Address</TabsTrigger>
              <TabsTrigger value="emergency">Emergency Contact</TabsTrigger>
              <TabsTrigger value="membership">Membership Details</TabsTrigger>
            </TabsList>
            
            <TabsContent value="personal" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Personal info fields */}
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select 
                    disabled={isSubmitting}
                    value={formData.gender || ""}
                    onValueChange={(value) => handleSelectChange("gender", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bloodGroup">Blood Group</Label>
                  <Select 
                    disabled={isSubmitting}
                    value={formData.blood_group || ""}
                    onValueChange={(value) => handleSelectChange("blood_group", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="idType">ID Type</Label>
                  <Select 
                    disabled={isSubmitting}
                    value={formData.id_type || ""}
                    onValueChange={(value) => handleSelectChange("id_type", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select ID type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aadhar">Aadhar Card</SelectItem>
                      <SelectItem value="pan">PAN Card</SelectItem>
                      <SelectItem value="driving-license">Driving License</SelectItem>
                      <SelectItem value="passport">Passport</SelectItem>
                      <SelectItem value="voter-id">Voter ID</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="idNumber">ID Number</Label>
                  <Input 
                    id="idNumber"
                    name="id_number"
                    value={formData.id_number || ""}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="goal">Fitness Goal</Label>
                  <Input 
                    id="goal"
                    name="goal"
                    value={formData.goal || ""}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="occupation">Occupation</Label>
                  <Input 
                    id="occupation"
                    name="occupation"
                    value={formData.occupation || ""}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="address" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Address fields */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Address Line</Label>
                  <Input 
                    id="address"
                    name="address"
                    value={formData.address || ""}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input 
                    id="city"
                    name="city"
                    value={formData.city || ""}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input 
                    id="state"
                    name="state"
                    value={formData.state || ""}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input 
                    id="zipCode"
                    name="zip_code"
                    value={formData.zip_code || ""}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select 
                    disabled={isSubmitting}
                    value={formData.country || "India"}
                    onValueChange={(value) => handleSelectChange("country", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country} value={country}>{country}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="emergency" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emergency_contact_name">Emergency Contact Name</Label>
                  <Input 
                    id="emergency_contact_name"
                    name="emergency_contact_name"
                    value={formData.emergency_contact_name || ""}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="emergency_contact_phone">Emergency Contact Phone</Label>
                  <Input 
                    id="emergency_contact_phone"
                    name="emergency_contact_phone"
                    value={formData.emergency_contact_phone || ""}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="emergency_contact_relation">Relationship</Label>
                  <Input 
                    id="emergency_contact_relation"
                    name="emergency_contact_relation"
                    value={formData.emergency_contact_relation || ""}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="membership" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="membership_plan">Membership Plan</Label>
                  <Input 
                    id="membership_plan"
                    name="membership_plan"
                    value={formData.membership_plan || ""}
                    onChange={handleChange}
                    disabled={true}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="membership_start_date">Start Date</Label>
                  <Input 
                    id="membership_start_date"
                    name="membership_start_date"
                    type="date"
                    value={formData.membership_start_date || ""}
                    onChange={handleChange}
                    disabled={true}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="membership_end_date">End Date</Label>
                  <Input 
                    id="membership_end_date"
                    name="membership_end_date"
                    type="date"
                    value={formData.membership_end_date || ""}
                    onChange={handleChange}
                    disabled={true}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="membership_payment_status">Payment Status</Label>
                  <Input 
                    id="membership_payment_status"
                    name="membership_payment_status"
                    value={formData.membership_payment_status || ""}
                    onChange={handleChange}
                    disabled={true}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => window.history.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : member ? 'Update Profile' : 'Create Profile'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};

export default MemberProfileForm;
