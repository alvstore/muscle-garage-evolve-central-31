import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { Lead } from '@/types/crm';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { leadConversionService } from '@/services/leadConversionService';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { format, addMonths } from 'date-fns';
import { useMemberships } from '@/hooks/use-memberships';

interface LeadConversionProps {
  lead: Lead;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const LeadConversion: React.FC<LeadConversionProps> = ({ lead, onSuccess, onCancel }) => {
  const queryClient = useQueryClient();
  const { memberships, isLoading: loadingMemberships } = useMemberships();
  
  const [formData, setFormData] = useState({
    email: lead.email || '',
    full_name: lead.name,
    phone: lead.phone || '',
    branch_id: lead.branch_id || '',
    membership_id: '',
    membership_start_date: format(new Date(), 'yyyy-MM-dd'),
    membership_end_date: format(addMonths(new Date(), 1), 'yyyy-MM-dd'),
    membership_status: 'active',
    address: '',
    emergency_contact: '',
    notes: lead.notes || '',
    password: '',
  });

  const convertMutation = useMutation({
    mutationFn: () => leadConversionService.convertLeadToMember(lead.id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['members'] });
      toast.success('Lead successfully converted to member');
      if (onSuccess) onSuccess();
    },
    onError: (error: any) => {
      toast.error(`Failed to convert lead: ${error.message}`);
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // If membership changed, update end date based on duration
    if (name === 'membership_id' && memberships) {
      const selectedMembership = memberships.find(m => m.id === value);
      if (selectedMembership && selectedMembership.duration_days) {
        const startDate = new Date(formData.membership_start_date);
        const endDate = calculateEndDate(startDate, selectedMembership);
        setFormData(prev => ({
          ...prev,
          membership_end_date: format(endDate, 'yyyy-MM-dd')
        }));
      }
    }
  };

  const handleDateChange = (name: string, date: Date | undefined) => {
    if (date) {
      setFormData(prev => ({ ...prev, [name]: format(date, 'yyyy-MM-dd') }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    convertMutation.mutate();
  };

  const calculateEndDate = (startDate: Date, membership: Membership | null) => {
    if (!membership) return startDate;
    
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + (membership.duration_days || 30));
    return endDate;
  };

  const formattedPlanDuration = (membership: Membership | null) => {
    if (!membership) return '';
    
    const days = membership.duration_days || 0;
    const months = Math.floor(days / 30);
    
    return months <= 1 ? `${days} days` : `${months} months`;
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Convert Lead to Member</CardTitle>
        <CardDescription>
          Create a new gym membership for {lead.name}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                name="full_name"
                value={formData.full_name}
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Temporary Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Leave empty for auto-generated password"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="membership_id">Membership Plan</Label>
            <Select
              value={formData.membership_id}
              onValueChange={(value) => handleSelectChange('membership_id', value)}
              disabled={loadingMemberships}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a membership plan" />
              </SelectTrigger>
              <SelectContent>
                {memberships?.map(membership => (
                  <SelectItem key={membership.id} value={membership.id}>
                    {membership.name} - {membership.price}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <DatePicker
                date={new Date(formData.membership_start_date)}
                setDate={(date) => handleDateChange('membership_start_date', date)}
              />
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <DatePicker
                date={new Date(formData.membership_end_date)}
                setDate={(date) => handleDateChange('membership_end_date', date)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="emergency_contact">Emergency Contact</Label>
            <Input
              id="emergency_contact"
              name="emergency_contact"
              value={formData.emergency_contact}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
            />
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={convertMutation.isPending || !formData.membership_id}
        >
          {convertMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Converting...
            </>
          ) : (
            'Convert to Member'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LeadConversion;
