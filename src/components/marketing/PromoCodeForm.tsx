
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { PromoCode } from '@/types/marketing';
import { useBranch } from '@/hooks/use-branch';

interface PromoCodeFormProps {
  promoCode: PromoCode | null;
  onSubmit: () => void;
  onCancel: () => void;
}

const PromoCodeForm = ({ promoCode, onSubmit, onCancel }: PromoCodeFormProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { currentBranch } = useBranch();
  const isEditing = !!promoCode;
  
  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage',
    value: '',
    description: '',
    start_date: new Date(),
    end_date: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    usage_limit: '100',
    current_usage: '0',
    applicable_products: ['all'],
    applicable_memberships: ['all'],
    status: 'active',
    min_purchase_amount: '',
    max_discount_amount: '',
  });
  
  useEffect(() => {
    if (promoCode) {
      setFormData({
        code: promoCode.code || '',
        type: promoCode.type || 'percentage',
        value: promoCode.value?.toString() || '',
        description: promoCode.description || '',
        start_date: promoCode.start_date ? new Date(promoCode.start_date) : new Date(),
        end_date: promoCode.end_date ? new Date(promoCode.end_date) : new Date(new Date().setMonth(new Date().getMonth() + 1)),
        usage_limit: promoCode.usage_limit?.toString() || '100',
        current_usage: promoCode.current_usage?.toString() || '0',
        applicable_products: promoCode.applicable_products || ['all'],
        applicable_memberships: promoCode.applicable_memberships || ['all'],
        status: promoCode.status || 'active',
        min_purchase_amount: promoCode.min_purchase_amount?.toString() || '',
        max_discount_amount: promoCode.max_discount_amount?.toString() || '',
      });
    }
  }, [promoCode]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.code || !formData.value) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const promoData = {
        code: formData.code,
        type: formData.type,
        value: parseFloat(formData.value),
        description: formData.description,
        start_date: formData.start_date.toISOString(),
        end_date: formData.end_date.toISOString(),
        usage_limit: parseInt(formData.usage_limit),
        current_usage: parseInt(formData.current_usage),
        applicable_products: formData.applicable_products,
        applicable_memberships: formData.applicable_memberships,
        status: formData.status,
        min_purchase_amount: formData.min_purchase_amount ? parseFloat(formData.min_purchase_amount) : null,
        max_discount_amount: formData.max_discount_amount ? parseFloat(formData.max_discount_amount) : null,
        createdBy: user?.id || null,
        branch_id: currentBranch?.id || null
      };
      
      if (isEditing) {
        const { error } = await supabase
          .from('promo_codes')
          .update(promoData)
          .eq('id', promoCode.id);
          
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Promo code updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('promo_codes')
          .insert(promoData);
          
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Promo code created successfully",
        });
      }
      
      onSubmit();
    } catch (error) {
      console.error('Error saving promo code:', error);
      toast({
        title: "Error",
        description: "Failed to save promo code",
        variant: "destructive",
      });
    }
  };
  
  const handleChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Promo Code' : 'Add New Promo Code'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="code">Code <span className="text-red-500">*</span></Label>
              <Input 
                id="code"
                value={formData.code}
                onChange={(e) => handleChange('code', e.target.value)}
                placeholder="SUMMER20"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input 
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Summer promotion 20% off"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Discount Type <span className="text-red-500">*</span></Label>
              <Select 
                value={formData.type}
                onValueChange={(value) => handleChange('type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select discount type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage</SelectItem>
                  <SelectItem value="fixed">Fixed Amount</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="value">Value <span className="text-red-500">*</span></Label>
              <Input 
                id="value"
                type="number"
                value={formData.value}
                onChange={(e) => handleChange('value', e.target.value)}
                placeholder={formData.type === 'percentage' ? "10" : "100"}
              />
              <p className="text-sm text-muted-foreground">
                {formData.type === 'percentage' ? 'Percentage value (e.g. 10 for 10% off)' : 'Fixed amount in INR'}
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="start-date"
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.start_date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.start_date ? format(formData.start_date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.start_date}
                    onSelect={(date) => date && handleChange('start_date', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="end-date">End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="end-date"
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.end_date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.end_date ? format(formData.end_date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.end_date}
                    onSelect={(date) => date && handleChange('end_date', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="usage-limit">Usage Limit</Label>
              <Input 
                id="usage-limit"
                type="number"
                value={formData.usage_limit}
                onChange={(e) => handleChange('usage_limit', e.target.value)}
                placeholder="100"
              />
            </div>
            
            {isEditing && (
              <div className="space-y-2">
                <Label htmlFor="current-usage">Current Usage</Label>
                <Input 
                  id="current-usage"
                  type="number"
                  value={formData.current_usage}
                  onChange={(e) => handleChange('current_usage', e.target.value)}
                  placeholder="0"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="min-purchase">Minimum Purchase Amount</Label>
              <Input 
                id="min-purchase"
                type="number"
                value={formData.min_purchase_amount}
                onChange={(e) => handleChange('min_purchase_amount', e.target.value)}
                placeholder="0"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="max-discount">Maximum Discount Amount</Label>
              <Input 
                id="max-discount"
                type="number"
                value={formData.max_discount_amount}
                onChange={(e) => handleChange('max_discount_amount', e.target.value)}
                placeholder="1000"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status}
                onValueChange={(value) => handleChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? 'Update' : 'Create'} Promo Code
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PromoCodeForm;
