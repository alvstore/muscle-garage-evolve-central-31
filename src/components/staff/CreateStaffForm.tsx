
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';
import { useBranch } from '@/hooks/use-branch';
import { supabase } from '@/services/supabaseClient';

export interface CreateStaffFormProps {
  onSuccess?: () => void;
}

const CreateStaffForm: React.FC<CreateStaffFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    role: 'staff',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { currentBranch } = useBranch();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleRoleChange = (value: string) => {
    setFormData({ ...formData, role: value });
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (!formData.email || !formData.name || !formData.password) {
      toast.error('Please fill in all required fields');
      setIsLoading(false);
      return;
    }
    
    try {
      // Create user with auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: formData.email,
        password: formData.password,
        email_confirm: true,
        user_metadata: {
          full_name: formData.name,
          role: formData.role
        }
      });
      
      if (authError) throw authError;
      
      // Create staff profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: formData.name,
          role: formData.role,
          branch_id: currentBranch?.id,
          email: formData.email,
        })
        .eq('id', authData.user.id);
        
      if (profileError) throw profileError;
      
      toast.success(`Staff member ${formData.name} created successfully`);
      setFormData({
        email: '',
        name: '',
        role: 'staff',
        password: ''
      });
      
      if (onSuccess) {
        onSuccess();
      }
      
    } catch (error: any) {
      console.error('Error creating staff member:', error);
      toast.error(error.message || 'Failed to create staff member');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
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
          <Label htmlFor="password">Password *</Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="role">Role *</Label>
          <Select 
            value={formData.role} 
            onValueChange={handleRoleChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="staff">Staff</SelectItem>
              <SelectItem value="trainer">Trainer</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create Staff Member'}
      </Button>
    </form>
  );
};

export default CreateStaffForm;
