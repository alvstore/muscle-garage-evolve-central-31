import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { StaffMember } from '@/types';

interface EditStaffFormProps {
  staff: StaffMember;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const EditStaffForm: React.FC<EditStaffFormProps> = ({ 
  staff, 
  onSubmit, 
  onCancel, 
  isSubmitting = false 
}) => {
  const [formData, setFormData] = useState({
    id: staff.id || '',
    name: staff.name || '',
    email: staff.email || '',
    phone: staff.phone || '',
    role: staff.role || '',
    department: staff.department || '',
    address: staff.address || '',
    city: staff.city || '',
    state: staff.state || '',
    country: staff.country || '',
    id_type: staff.id_type || '',
    id_number: staff.id_number || '',
    gender: staff.gender || '',
    is_branch_manager: staff.is_branch_manager || false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prevData => ({
      ...prevData,
      is_branch_manager: checked
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Form>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter full name"
          />
        </div>
        
        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email address"
          />
        </div>

        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
          />
        </div>

        <div>
          <Label htmlFor="role">Role</Label>
          <Input
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            placeholder="Enter role"
          />
        </div>

        <div>
          <Label htmlFor="department">Department</Label>
          <Input
            id="department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            placeholder="Enter department"
          />
        </div>

        <div>
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter address"
          />
        </div>

        <div>
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Enter city"
          />
        </div>

        <div>
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
            placeholder="Enter state"
          />
        </div>

        <div>
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="Enter country"
          />
        </div>

        <div>
          <Label htmlFor="id_type">ID Type</Label>
          <Input
            id="id_type"
            name="id_type"
            value={formData.id_type}
            onChange={handleChange}
            placeholder="Enter ID Type"
          />
        </div>

        <div>
          <Label htmlFor="id_number">ID Number</Label>
          <Input
            id="id_number"
            name="id_number"
            value={formData.id_number}
            onChange={handleChange}
            placeholder="Enter ID Number"
          />
        </div>

        <div>
          <Label htmlFor="gender">Gender</Label>
          <Input
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            placeholder="Enter Gender"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Label htmlFor="is_branch_manager">Is Branch Manager</Label>
          <Switch
            id="is_branch_manager"
            checked={formData.is_branch_manager || false}
            onCheckedChange={handleSwitchChange}
          />
        </div>

        <div className="flex justify-end">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditStaffForm;
