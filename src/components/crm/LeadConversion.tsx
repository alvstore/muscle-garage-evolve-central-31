
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { useToast } from "@/hooks/use-toast";
import { Lead } from '@/types/crm';
import { Membership } from '@/types';
import { format } from 'date-fns';

interface LeadConversionProps {
  lead: Lead | null;
  onConvert?: (conversionData: any) => Promise<void>;
  onClose: () => void;
}

// Mock memberships for demonstration
const mockMemberships = [
  {
    id: '1',
    name: 'Basic',
    price: '49.99',
    duration_days: 30,
    duration_months: 1
  },
  {
    id: '2',
    name: 'Premium',
    price: '89.99',
    duration_days: 30,
    duration_months: 1
  },
  {
    id: '3',
    name: 'Gold',
    price: '149.99',
    duration_days: 30,
    duration_months: 1
  },
  {
    id: '4',
    name: 'Platinum',
    price: '199.99',
    duration_days: 30,
    duration_months: 1
  },
];

const LeadConversion: React.FC<LeadConversionProps> = ({ lead, onConvert, onClose }) => {
  const [conversionData, setConversionData] = useState({
    membershipId: '',
    startDate: new Date(),
    notes: '',
    paymentMethod: 'cash',
    paymentAmount: '',
    paymentDate: new Date()
  });
  
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [selectedMembership, setSelectedMembership] = useState<Membership | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // In a real app, fetch memberships from your API
    setMemberships(mockMemberships as unknown as Membership[]);
  }, []);

  const handleMembershipChange = (membershipId: string) => {
    const membership = memberships.find(m => m.id === membershipId);
    if (membership) {
      setSelectedMembership(membership);
      setConversionData({
        ...conversionData,
        membershipId,
        paymentAmount: membership.price.toString()
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lead) return;
    
    try {
      // Prepare data for submission
      const dataToSubmit = {
        leadId: lead.id,
        membershipId: conversionData.membershipId,
        startDate: format(conversionData.startDate, "yyyy-MM-dd"),
        notes: conversionData.notes,
        payment: {
          method: conversionData.paymentMethod,
          amount: parseFloat(conversionData.paymentAmount),
          date: format(conversionData.paymentDate, "yyyy-MM-dd")
        },
        convertedAt: new Date().toISOString()
      };
      
      // Submit conversion data
      if (onConvert) {
        await onConvert(dataToSubmit);
      }
      
      toast({
        title: "Success",
        description: "Lead converted to member successfully"
      });
      
      onClose();
    } catch (error) {
      console.error('Error converting lead:', error);
      toast({
        title: "Error",
        description: "Failed to convert lead to member",
        variant: "destructive"
      });
    }
  };

  if (!lead) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Convert Lead to Member</CardTitle>
        <CardDescription>
          Convert {lead.first_name} {lead.last_name} to a member
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="membership">Membership Plan</Label>
            <Select 
              value={conversionData.membershipId} 
              onValueChange={handleMembershipChange}
            >
              <SelectTrigger id="membership">
                <SelectValue placeholder="Select a membership plan" />
              </SelectTrigger>
              <SelectContent>
                {memberships.map((membership) => (
                  <SelectItem key={membership.id} value={membership.id}>
                    {membership.name} (${membership.price})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <DatePicker 
                date={conversionData.startDate} 
                setDate={(date) => date && setConversionData({...conversionData, startDate: date})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="payment-method">Payment Method</Label>
              <Select 
                value={conversionData.paymentMethod} 
                onValueChange={(value) => setConversionData({...conversionData, paymentMethod: value})}
              >
                <SelectTrigger id="payment-method">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="card">Credit/Debit Card</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="online">Online Payment</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="payment-amount">Payment Amount</Label>
              <Input
                id="payment-amount"
                type="number"
                step="0.01"
                value={conversionData.paymentAmount}
                onChange={(e) => setConversionData({...conversionData, paymentAmount: e.target.value})}
                placeholder="0.00"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="payment-date">Payment Date</Label>
              <DatePicker 
                date={conversionData.paymentDate} 
                setDate={(date) => date && setConversionData({...conversionData, paymentDate: date})}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={conversionData.notes}
              onChange={(e) => setConversionData({...conversionData, notes: e.target.value})}
              placeholder="Any additional notes about this conversion"
              rows={3}
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Convert to Member</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default LeadConversion;
