
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMembership } from '@/hooks/use-membership'; // Corrected import
import { toast } from 'sonner';
import { DatePicker } from '@/components/ui/date-picker';
import { Textarea } from '@/components/ui/textarea';
import { Membership } from '@/types';

interface LeadConversionProps {
  lead: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  onConvert: (data: any) => void;
  onCancel: () => void;
}

const LeadConversion: React.FC<LeadConversionProps> = ({ lead, onConvert, onCancel }) => {
  const [membershipId, setMembershipId] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date(new Date().setMonth(new Date().getMonth() + 1)));
  const [notes, setNotes] = useState('');
  const [additionalDetail, setAdditionalDetail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [paymentAmount, setPaymentAmount] = useState<string>('0');
  const { memberships, isLoading } = useMembership();
  
  // Handle membership selection change
  const handleMembershipChange = (value: string) => {
    setMembershipId(value);
    
    // Find selected membership
    const selectedMembership = memberships?.find(m => m.id === value);
    
    if (selectedMembership) {
      // Set payment amount to membership price
      setPaymentAmount(selectedMembership.price.toString());
      
      // Calculate end date based on membership duration if available
      if (selectedMembership.duration_days && startDate) {
        const newEndDate = new Date(startDate);
        newEndDate.setDate(newEndDate.getDate() + selectedMembership.duration_days);
        setEndDate(newEndDate);
      }
    }
  };
  
  const validateForm = () => {
    if (!membershipId) {
      toast.error('Please select a membership plan');
      return false;
    }
    
    if (!startDate) {
      toast.error('Please select a start date');
      return false;
    }
    
    if (!endDate) {
      toast.error('Please select an end date');
      return false;
    }
    
    if (isNaN(parseFloat(paymentAmount))) {
      toast.error('Please enter a valid payment amount');
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const conversionData = {
      leadId: lead.id,
      membershipId,
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString(),
      paymentMethod,
      paymentAmount: parseFloat(paymentAmount),
      notes,
      additionalDetail,
    };
    
    onConvert(conversionData);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Convert Lead to Member</CardTitle>
        <CardDescription>
          Convert {lead.name} from lead to active member
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Lead Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Name</Label>
                <Input value={lead.name} disabled />
              </div>
              <div>
                <Label>Email</Label>
                <Input value={lead.email} disabled />
              </div>
              <div>
                <Label>Phone</Label>
                <Input value={lead.phone} disabled />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Membership Details</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="membership">Membership Plan</Label>
                <Select onValueChange={handleMembershipChange} value={membershipId || ""}>
                  <SelectTrigger id="membership">
                    <SelectValue placeholder="Select membership plan" />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoading ? (
                      <SelectItem value="loading" disabled>Loading...</SelectItem>
                    ) : (
                      memberships?.map(plan => (
                        <SelectItem key={plan.id} value={plan.id}>
                          {plan.name} - {plan.price}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Start Date</Label>
                  <DatePicker 
                    date={startDate} 
                    setDate={setStartDate} 
                    className="w-full" 
                  />
                </div>
                <div>
                  <Label>End Date</Label>
                  <DatePicker 
                    date={endDate} 
                    setDate={setEndDate} 
                    className="w-full" 
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea 
                  id="notes" 
                  value={notes} 
                  onChange={(e) => setNotes(e.target.value)} 
                  placeholder="Additional notes about this membership"
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Payment Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="payment-method">Payment Method</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger id="payment-method">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="payment-amount">Payment Amount</Label>
                <Input 
                  id="payment-amount" 
                  type="number" 
                  value={paymentAmount} 
                  onChange={(e) => setPaymentAmount(e.target.value)}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="additional-detail">Additional Payment Details</Label>
                <Textarea 
                  id="additional-detail" 
                  value={additionalDetail} 
                  onChange={(e) => setAdditionalDetail(e.target.value)} 
                  placeholder="Transaction ID, receipt number, etc."
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Convert to Member</Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default LeadConversion;
