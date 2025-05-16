
// We need to create a minimal version to fix the issues
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Member } from '@/types';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { membersService } from '@/services';
import ProfileImageUpload from './ProfileImageUpload';

interface MemberProfileFormProps {
  member?: Partial<Member>;
  onSave?: (member: Partial<Member>) => Promise<void>;
  onClose?: () => void;
  isReadOnly?: boolean;
}

const MemberProfileForm: React.FC<MemberProfileFormProps> = ({
  member,
  onSave,
  onClose,
  isReadOnly = false
}) => {
  // Form state
  const [formData, setFormData] = useState<Partial<Member>>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: 'India',
    zip_code: '',
    date_of_birth: '',
    gender: '',
    goal: '',
    membership_id: '',
    membership_status: 'active',
    trainer_id: '',
    occupation: '',
    blood_group: '',
    ...member
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [countries, setCountries] = useState<{[key: string]: {name: string}}>({"IN": {name: "India"}});
  const [states, setStates] = useState<Array<{name: string}>>([]);

  // Mock country data
  const mockCountries = {
    "US": { name: "United States" },
    "IN": { name: "India" },
    "GB": { name: "United Kingdom" },
    "CA": { name: "Canada" },
    "AU": { name: "Australia" }
  };

  // Mock states data
  const mockStates = [
    { name: "Maharashtra" },
    { name: "Karnataka" },
    { name: "Tamil Nadu" },
    { name: "Delhi" },
    { name: "Uttar Pradesh" },
    { name: "Gujarat" }
  ];

  useEffect(() => {
    // Set mock data instead of importing countries-list and country-state-city
    setCountries(mockCountries);
    setStates(mockStates);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error('Name is required');
      return;
    }

    setIsSubmitting(true);
    try {
      if (onSave) {
        const memberData = { ...formData };
        await onSave(memberData);
      } else {
        // If no onSave prop, use service directly
        const memberData = {
          ...formData
        };
        
        if (member?.id) {
          await membersService.updateMember(member.id, memberData);
          toast.success('Member profile updated successfully');
        } else {
          await membersService.createMember(memberData);
          toast.success('Member profile created successfully');
        }

        // Close form after successful save
        if (onClose) onClose();
      }
    } catch (error) {
      console.error('Error saving member profile:', error);
      toast.error('Failed to save member profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{member?.id ? 'Edit Member' : 'Add New Member'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Basic Information */}
            <div className="col-span-1 sm:col-span-2">
              <h3 className="text-lg font-semibold mb-3">Basic Information</h3>
            </div>
            
            <div className="col-span-1 sm:col-span-2 flex justify-center mb-4">
              <ProfileImageUpload
                initialImage={formData.avatar || ''}
                onChange={(file) => setProfileImage(file)}
                disabled={isReadOnly}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name">Name*</Label>
              <Input
                id="name"
                name="name"
                value={formData.name || ''}
                onChange={handleInputChange}
                disabled={isReadOnly}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email || ''}
                onChange={handleInputChange}
                disabled={isReadOnly}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone || ''}
                onChange={handleInputChange}
                disabled={isReadOnly}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date_of_birth">Date of Birth</Label>
              <Input
                id="date_of_birth"
                name="date_of_birth"
                type="date"
                value={formData.date_of_birth ? formData.date_of_birth.toString().substring(0, 10) : ''}
                onChange={handleInputChange}
                disabled={isReadOnly}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select
                value={formData.gender || ''}
                onValueChange={(value) => handleSelectChange('gender', value)}
                disabled={isReadOnly}
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
            
            <div className="space-y-2">
              <Label htmlFor="blood_group">Blood Group</Label>
              <Input
                id="blood_group"
                name="blood_group"
                value={formData.blood_group || ''}
                onChange={handleInputChange}
                disabled={isReadOnly}
              />
            </div>

            {/* Location Information */}
            <div className="col-span-1 sm:col-span-2 mt-4">
              <h3 className="text-lg font-semibold mb-3">Location Information</h3>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                name="address"
                value={formData.address || ''}
                onChange={handleInputChange}
                disabled={isReadOnly}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city || ''}
                    onChange={handleInputChange}
                    disabled={isReadOnly}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="zip_code">Postal Code</Label>
                  <Input
                    id="zip_code"
                    name="zip_code"
                    value={formData.zip_code || ''}
                    onChange={handleInputChange}
                    disabled={isReadOnly}
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="state">State/Province</Label>
              <Select
                value={formData.state || ''}
                onValueChange={(value) => handleSelectChange('state', value)}
                disabled={isReadOnly}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {states.map((state) => (
                    <SelectItem key={state.name} value={state.name}>
                      {state.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Select
                value={formData.country || 'India'}
                onValueChange={(value) => handleSelectChange('country', value)}
                disabled={isReadOnly}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(countries).map(([code, country]) => (
                    <SelectItem key={code} value={country.name}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Additional Information */}
            <div className="col-span-1 sm:col-span-2 mt-4">
              <h3 className="text-lg font-semibold mb-3">Additional Information</h3>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="occupation">Occupation</Label>
              <Input
                id="occupation"
                name="occupation"
                value={formData.occupation || ''}
                onChange={handleInputChange}
                disabled={isReadOnly}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="goal">Fitness Goal</Label>
              <Select
                value={formData.goal || ''}
                onValueChange={(value) => handleSelectChange('goal', value)}
                disabled={isReadOnly}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select fitness goal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weight_loss">Weight Loss</SelectItem>
                  <SelectItem value="muscle_gain">Muscle Gain</SelectItem>
                  <SelectItem value="general_fitness">General Fitness</SelectItem>
                  <SelectItem value="strength">Strength</SelectItem>
                  <SelectItem value="endurance">Endurance</SelectItem>
                  <SelectItem value="flexibility">Flexibility</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {!isReadOnly && (
            <div className="flex justify-end gap-2 pt-4">
              {onClose && (
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
              )}
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Member'}
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default MemberProfileForm;
