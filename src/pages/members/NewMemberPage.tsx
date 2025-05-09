
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Container } from '@/components/ui/container';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, CalendarIcon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { useMemberships } from '@/hooks/use-memberships';
import { useTrainers } from '@/hooks/use-trainers';
import { useBranch } from '@/hooks/use-branch';
import { membershipService } from '@/services/membershipService';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';

// Form schema for the member form
const memberFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }).optional().or(z.literal('')),
  phone: z.string().min(10, { message: 'Please enter a valid phone number.' }).optional().or(z.literal('')),
  gender: z.string().optional(),
  date_of_birth: z.date().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
  goal: z.string().optional(),
  occupation: z.string().optional(),
  blood_group: z.string().optional(),
  // ID fields for biometric registration
  id_type: z.string().optional(),
  id_number: z.string().optional(),
  
  // Membership fields
  assign_membership: z.boolean().default(false),
  membership_id: z.string().optional(),
  trainer_id: z.string().optional(),
  payment_status: z.enum(['pending', 'paid', 'partial']).optional(),
  payment_method: z.string().optional(),
  amount_paid: z.number().optional(),
  start_date: z.date().optional(),
});

type MemberFormValues = z.infer<typeof memberFormSchema>;

const NewMemberPage: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { currentBranch } = useBranch();
  const { memberships, isLoading: isLoadingMemberships } = useMemberships();
  const { trainers, isLoading: isLoadingTrainers } = useTrainers();
  const [activeTab, setActiveTab] = useState('basic');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedMembership, setSelectedMembership] = useState<any>(null);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [biometricEnabled, setBiometricEnabled] = useState<boolean>(false);

  // Check if biometric devices are configured
  useEffect(() => {
    const checkBiometricStatus = async () => {
      if (currentBranch?.id) {
        try {
          const { data: hikvisionData } = await supabase
            .from('hikvision_api_settings')
            .select('is_active')
            .eq('branch_id', currentBranch.id)
            .single();
            
          const { data: esslData } = await supabase
            .from('essl_device_settings')
            .select('is_active')
            .eq('branch_id', currentBranch.id)
            .single();
            
          setBiometricEnabled(
            (hikvisionData && hikvisionData.is_active) || 
            (esslData && esslData.is_active)
          );
        } catch (error) {
          console.error('Error checking biometric status:', error);
        }
      }
    };
    
    checkBiometricStatus();
  }, [currentBranch?.id]);

  const form = useForm<MemberFormValues>({
    resolver: zodResolver(memberFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      gender: 'male',
      address: '',
      goal: '',
      assign_membership: false,
      payment_status: 'pending',
      start_date: new Date(),
    },
  });

  // Watch for membership selection changes
  const watchAssignMembership = form.watch('assign_membership');
  const watchMembershipId = form.watch('membership_id');
  const watchPaymentStatus = form.watch('payment_status');
  
  // Get membership details when selected
  useEffect(() => {
    if (watchMembershipId && memberships) {
      const membership = memberships.find(m => m.id === watchMembershipId);
      if (membership) {
        setSelectedMembership(membership);
        setTotalAmount(membership.price);
        
        // Set default start date to today
        const startDate = new Date();
        form.setValue('start_date', startDate);
      }
    }
  }, [watchMembershipId, memberships, form]);
  
  // Update amount paid based on payment status
  useEffect(() => {
    if (watchPaymentStatus === 'paid') {
      form.setValue('amount_paid', totalAmount);
    } else if (watchPaymentStatus === 'pending') {
      form.setValue('amount_paid', 0);
    }
  }, [watchPaymentStatus, totalAmount, form]);
  
  // Conditionally require membership fields
  useEffect(() => {
    const { assign_membership, payment_status } = form.getValues();
    
    if (assign_membership) {
      form.register('membership_id', { required: 'Membership plan is required' });
      form.register('start_date', { required: 'Start date is required' });
      
      if (payment_status === 'paid' || payment_status === 'partial') {
        form.register('payment_method', { required: 'Payment method is required' });
      }
      
      if (payment_status === 'partial') {
        form.register('amount_paid', { 
          required: 'Amount paid is required',
          validate: (value) => {
            if (!value || value <= 0) return 'Amount must be greater than 0';
            if (value >= totalAmount) return 'For full payment, select "Paid" status';
            return true;
          }
        });
      }
    }
  }, [form, watchAssignMembership, watchPaymentStatus, totalAmount]);

  const onSubmit = async (values: MemberFormValues) => {
    if (!currentBranch?.id) {
      toast({
        title: "Error",
        description: "No branch selected",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // 1. Create the member
      const { data: memberData, error: memberError } = await supabase
        .from('members')
        .insert({
          name: values.name,
          email: values.email || null,
          phone: values.phone || null,
          gender: values.gender || null,
          date_of_birth: values.date_of_birth ? values.date_of_birth.toISOString().split('T')[0] : null,
          address: values.address || null,
          city: values.city || null,
          state: values.state || null,
          zipCode: values.zipCode || null,
          country: values.country || 'India',
          goal: values.goal || null,
          occupation: values.occupation || null,
          blood_group: values.blood_group || null,
          id_type: values.id_type || null,
          id_number: values.id_number || null,
          branch_id: currentBranch.id,
          status: 'active',
          membership_status: values.assign_membership ? 'active' : 'none',
        })
        .select()
        .single();

      if (memberError) {
        throw new Error(`Failed to create member: ${memberError.message}`);
      }

      // 2. If assign_membership is true, assign membership and create invoice
      let invoiceId: string | undefined;
      
      if (values.assign_membership && values.membership_id && values.start_date) {
        const membership = memberships?.find(m => m.id === values.membership_id);
        
        if (membership) {
          // Calculate end date
          const endDate = new Date(values.start_date);
          endDate.setDate(endDate.getDate() + membership.duration_days);
          
          const membershipResult = await membershipService.assignMembership({
            memberId: memberData.id,
            membershipId: values.membership_id,
            startDate: values.start_date,
            endDate,
            amount: totalAmount,
            amountPaid: values.amount_paid || 0,
            paymentStatus: values.payment_status || 'pending',
            paymentMethod: values.payment_method,
            branchId: currentBranch.id,
            trainerId: values.trainer_id,
          });
          
          if (!membershipResult.success) {
            throw new Error(`Failed to assign membership: ${membershipResult.error}`);
          }
          
          invoiceId = membershipResult.invoiceId;
        }
      }
      
      // 3. If biometric integration is enabled, register member in the device
      if (biometricEnabled) {
        const biometricResult = await membershipService.registerInBiometricDevices(
          memberData,
          currentBranch.id
        );
        
        // Biometric registration failure is non-critical, just show a warning toast
        if (!biometricResult.success) {
          toast({
            title: "Biometric Registration Warning",
            description: biometricResult.message,
            variant: "warning",
          });
        } else {
          toast({
            description: biometricResult.message,
          });
        }
      }

      // 4. Show success message
      toast({
        title: "Member Created",
        description: "Member has been created successfully",
      });
      
      // 5. Redirect to appropriate page
      if (invoiceId) {
        navigate(`/finance/invoices/${invoiceId}`);
      } else {
        navigate(`/members/${memberData.id}`);
      }
    } catch (error: any) {
      console.error('Error creating member:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create member",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextTab = () => {
    if (activeTab === 'basic') {
      // Validate basic fields before moving to next tab
      const basicFields = ['name', 'phone'];
      const isValid = basicFields.every(field => {
        const result = form.trigger(field as any);
        return result;
      });
      
      if (isValid) {
        setActiveTab('details');
      }
    } else if (activeTab === 'details') {
      setActiveTab('membership');
    }
  };

  const prevTab = () => {
    if (activeTab === 'details') {
      setActiveTab('basic');
    } else if (activeTab === 'membership') {
      setActiveTab('details');
    }
  };

  return (
    <Container>
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-6">Add New Member</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Member Registration Form</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="basic">Basic Info</TabsTrigger>
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="membership">Membership</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="basic" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name*</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number*</FormLabel>
                            <FormControl>
                              <Input placeholder="10-digit number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="john@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Gender</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="date_of_birth"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Date of Birth</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) =>
                                    date > new Date() || date < new Date("1900-01-01")
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="mt-6 flex justify-end">
                      <Button type="button" onClick={nextTab}>Next</Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="details" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Input placeholder="Street address" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input placeholder="City" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State</FormLabel>
                            <FormControl>
                              <Input placeholder="State" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="zipCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ZIP/Postal Code</FormLabel>
                            <FormControl>
                              <Input placeholder="ZIP code" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country</FormLabel>
                            <FormControl>
                              <Input placeholder="Country" defaultValue="India" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="occupation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Occupation</FormLabel>
                            <FormControl>
                              <Input placeholder="Occupation" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="blood_group"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Blood Group</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select blood group" />
                                </SelectTrigger>
                              </FormControl>
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
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="goal"
                        render={({ field }) => (
                          <FormItem className="col-span-2">
                            <FormLabel>Fitness Goal</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="What does the member want to achieve?" 
                                className="resize-none" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {biometricEnabled && (
                        <>
                          <FormField
                            control={form.control}
                            name="id_type"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>ID Type (For Biometric)</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select ID type" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="aadhar">Aadhar Card</SelectItem>
                                    <SelectItem value="pan">PAN Card</SelectItem>
                                    <SelectItem value="dl">Driving License</SelectItem>
                                    <SelectItem value="voter">Voter ID</SelectItem>
                                    <SelectItem value="passport">Passport</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="id_number"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>ID Number (For Biometric)</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter ID number" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </>
                      )}
                    </div>
                    
                    <div className="mt-6 flex justify-between">
                      <Button type="button" variant="outline" onClick={prevTab}>Back</Button>
                      <Button type="button" onClick={nextTab}>Next</Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="membership" className="mt-6">
                    <FormField
                      control={form.control}
                      name="assign_membership"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 mb-6">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Assign Membership</FormLabel>
                            <FormDescription>
                              Would you like to assign a membership plan now?
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    {form.watch('assign_membership') && (
                      <div className="space-y-6">
                        <FormField
                          control={form.control}
                          name="membership_id"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Membership Plan*</FormLabel>
                              <Select 
                                disabled={isLoadingMemberships} 
                                onValueChange={field.onChange} 
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a membership plan" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {memberships?.map((membership) => (
                                    <SelectItem key={membership.id} value={membership.id}>
                                      {membership.name} - {membership.price} for {membership.duration_days} days
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="start_date"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Start Date*</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {field.value ? (
                                        format(field.value, "PPP")
                                      ) : (
                                        <span>Pick a date</span>
                                      )}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) =>
                                      date < new Date("1900-01-01")
                                    }
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="trainer_id"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Assign Trainer (Optional)</FormLabel>
                              <Select 
                                disabled={isLoadingTrainers} 
                                onValueChange={field.onChange} 
                                value={field.value || ""}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a trainer" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="">No trainer</SelectItem>
                                  {trainers?.map((trainer) => (
                                    <SelectItem key={trainer.id} value={trainer.id}>
                                      {trainer.name || trainer.fullName || "Unnamed Trainer"}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="payment_status"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Payment Status*</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value || 'pending'}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select payment status" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="paid">Paid (Full payment)</SelectItem>
                                  <SelectItem value="partial">Partial Payment</SelectItem>
                                  <SelectItem value="pending">Pending (No payment now)</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        {(form.watch('payment_status') === 'paid' || form.watch('payment_status') === 'partial') && (
                          <FormField
                            control={form.control}
                            name="payment_method"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Payment Method*</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select payment method" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="cash">Cash</SelectItem>
                                    <SelectItem value="card">Card</SelectItem>
                                    <SelectItem value="upi">UPI</SelectItem>
                                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                                    <SelectItem value="cheque">Cheque</SelectItem>
                                    <SelectItem value="online">Online</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                        
                        {form.watch('payment_status') === 'partial' && (
                          <FormField
                            control={form.control}
                            name="amount_paid"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Amount Paid*</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="Enter amount paid"
                                    {...field}
                                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                        
                        {selectedMembership && (
                          <Alert>
                            <AlertTitle>Membership Summary</AlertTitle>
                            <AlertDescription>
                              <div className="grid grid-cols-2 gap-2 mt-2">
                                <div>
                                  <p className="text-xs text-muted-foreground">Plan</p>
                                  <p>{selectedMembership.name}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">Duration</p>
                                  <p>{selectedMembership.duration_days} days</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">Total Amount</p>
                                  <p>{selectedMembership.price}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">Amount to Pay Now</p>
                                  <p>
                                    {form.watch('payment_status') === 'paid' ? selectedMembership.price : 
                                     form.watch('payment_status') === 'partial' ? form.watch('amount_paid') || 0 : 0}
                                  </p>
                                </div>
                              </div>
                            </AlertDescription>
                          </Alert>
                        )}
                        
                        {biometricEnabled && (
                          <Alert>
                            <AlertTitle>Biometric Registration</AlertTitle>
                            <AlertDescription>
                              Member will be automatically registered in the biometric system upon creation.
                              Ensure ID details are entered correctly.
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    )}
                    
                    <div className="mt-6 flex justify-between">
                      <Button type="button" variant="outline" onClick={prevTab}>Back</Button>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          'Create Member'
                        )}
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
};

export default NewMemberPage;
