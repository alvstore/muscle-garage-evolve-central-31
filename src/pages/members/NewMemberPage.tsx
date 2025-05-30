
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PaymentMethod, PaymentStatus, PAYMENT_METHODS } from "@/types/payment/payment";
import { PaymentMethodSelector } from "@/components/payment/PaymentMethodSelector";
import { useNavigate } from "react-router-dom";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { format, isValid, getYear, getMonth, getDate, setYear, setMonth, setDate } from "date-fns";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useBranch } from "@/hooks/settings/use-branches";
import { useMemberships } from "@/hooks";
import { membershipService } from "@/services/members/membershipService";
import { CalendarIcon, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { MembershipPlan } from "@/types/members/membership";

// Form schema for member creation
const memberFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  gender: z.string().optional(),
  dateOfBirth: z.date().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
  goal: z.string().optional(),
  occupation: z.string().optional(),
  bloodGroup: z.string().optional(),
  idType: z.string().optional(),
  idNumber: z.string().optional(),
  
  // Membership related fields
  createWithMembership: z.boolean().default(false),
  membershipId: z.string().optional(),
  startDate: z.date().optional(),
  membershipStatus: z.string().default("active"),
  paymentStatus: z.string().optional(),
  paymentMethod: z.string().optional(),
  amountPaid: z.number().optional(),
  membershipNotes: z.string().optional(),
  
  // Enhanced payment details
  transactionId: z.string().optional(),
  referenceNumber: z.string().optional(),
});

type MemberFormValues = z.infer<typeof memberFormSchema>;

const NewMemberPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentBranch } = useBranch();
  const { memberships = [], isLoading: isLoadingMemberships } = useMemberships();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedMembership, setSelectedMembership] = useState<MembershipPlan | null>(null);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [registrationError, setRegistrationError] = useState<string | null>(null);
  const [biometricStatus, setBiometricStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'personal' | 'address' | 'membership'>('personal');
  
  const form = useForm<MemberFormValues>({
    resolver: zodResolver(memberFormSchema),
    defaultValues: {
      // Personal Information
      name: "",
      email: "",
      phone: "",
      gender: "male",
      dateOfBirth: undefined,
      occupation: "",
      goal: "",
      bloodGroup: "",
      idType: "",
      idNumber: "",
      
      // Address
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "India",
      
      // Membership
      createWithMembership: false,
      membershipId: "",
      membershipStatus: "active",
      startDate: new Date(),
      
      // Payment
      paymentStatus: "pending",
      paymentMethod: "cash",
      amountPaid: 0,
      membershipNotes: "",
      
      // Enhanced payment details
      transactionId: "",
      referenceNumber: "",
    },
  });
  
  // Update membership details when selected
  React.useEffect(() => {
    const membershipId = form.watch("membershipId");
    if (membershipId && memberships) {
      const membership = memberships.find((m) => m.id === membershipId);
      if (membership) {
        setSelectedMembership(membership);
        setTotalAmount(membership.price);
        
        // Calculate end date based on membership duration
        const startDate = form.watch("startDate") || new Date();
        if (startDate) {
          const endDate = membershipService.calculateEndDate(startDate, membership.duration_days);
          // We don't set endDate in the form as it's calculated value
        }
      }
    }
  }, [form.watch("membershipId"), form.watch("startDate"), memberships]);

  // Handle payment status changes
  React.useEffect(() => {
    const paymentStatus = form.watch("paymentStatus");
    const createWithMembership = form.watch("createWithMembership");
    
    if (createWithMembership) {
      if (paymentStatus === "paid") {
        form.setValue("amountPaid", totalAmount);
      } else if (paymentStatus === "pending") {
        form.setValue("amountPaid", 0);
      }
    }
  }, [form.watch("paymentStatus"), form.watch("createWithMembership"), totalAmount]);

  const onSubmit = async (values: MemberFormValues) => {
    if (!currentBranch?.id) {
      toast({
        title: "Branch not selected",
        description: "Please select a branch to add a member",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    setRegistrationError(null);
    setBiometricStatus(null);
    
    try {
      // 1. Create member record first
      const { data: newMember, error: memberError } = await supabase.from("members").insert({
        name: values.name,
        email: values.email || null,
        phone: values.phone || null,
        gender: values.gender || null,
        date_of_birth: values.dateOfBirth?.toISOString() || null,
        address: values.address || null,
        city: values.city || null,
        state: values.state || null,
        country: values.country || null,
        zip_code: values.zipCode || null,
        goal: values.goal || null,
        occupation: values.occupation || null,
        blood_group: values.bloodGroup || null,
        id_type: values.idType || null,
        id_number: values.idNumber || null,
        branch_id: currentBranch.id,
        status: "active",
        membership_status: values.createWithMembership ? "active" : "none",
      }).select().single();

      if (memberError) {
        throw new Error(`Error creating member: ${memberError.message}`);
      }

      // Member successfully created
      let invoiceId: string | null = null;
      
      // Handle membership assignment if selected
      if (values.createWithMembership && values.membershipId && values.startDate && currentBranch?.id) {
        try {
          // Calculate end date based on membership duration
          const selectedMembership = memberships?.find(m => m.id === values.membershipId);
          if (selectedMembership) {
            const endDate = new Date(values.startDate);
            endDate.setDate(endDate.getDate() + (selectedMembership.duration_days || 30));
            
            const result = await membershipService.assignMembership({
              member_id: newMember.id,
              membership_plan_id: values.membershipId,
              branch_id: currentBranch.id,
              start_date: values.startDate,
              end_date: endDate,
              total_amount: selectedMembership.price || 0,
              payment: {
                method: values.paymentMethod as PaymentMethod || 'cash',
                status: (values.paymentStatus as PaymentStatus) || 'pending',
                amount: selectedMembership.price || 0,
                amount_paid: values.amountPaid || 0,
                transaction_id: values.transactionId || undefined,
                reference_number: values.referenceNumber || undefined,
                payment_date: new Date().toISOString(),
                notes: values.membershipNotes || undefined
              },
              recorded_by: currentBranch.id // Using branch ID as recorded_by since we don't have user ID
            });
            
            if (result.success) {
              // Store the invoice ID from the result
              invoiceId = result.invoice_id || null;
              
              // Show success message with payment details
              toast({
                title: "Membership assigned",
                description: `Membership assigned successfully with ${values.paymentMethod} payment.`,
                variant: "default",
              });
            } else {
              console.error("Error assigning membership:", result.error);
              setRegistrationError(result.error || "Failed to assign membership");
              
              toast({
                title: "Payment processing error",
                description: result.error || "There was an error processing the payment.",
                variant: "destructive",
              });
            }
          }
        } catch (error) {
          console.error("Error assigning membership:", error);
          const errorMessage = error instanceof Error ? error.message : "Failed to assign membership";
          setRegistrationError(errorMessage);
          
          toast({
            title: "Payment processing error",
            description: `There was an error processing the payment: ${errorMessage}`,
            variant: "destructive",
          });
        }
      }
      
      // Set default biometric status (handled in MemberProfile)
      setBiometricStatus({
        success: true,
        message: "Member created successfully"
      });

      // Show success message
      toast({
        title: "Member added successfully",
        description: "The new member has been created",
      });

      // Navigate to invoice if created, otherwise to member profile
      if (invoiceId) {
        navigate(`/finance/invoices/${invoiceId}`);
      } else {
        navigate(`/members/${newMember.id}`);
      }
    } catch (error: any) {
      console.error("Error creating member:", error);
      toast({
        title: "Failed to create member",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      setRegistrationError(error.message || "Failed to create member");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container>
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-6">Add New Member</h1>
        
        {registrationError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{registrationError}</AlertDescription>
          </Alert>
        )}
        
        {biometricStatus && (
          <Alert 
            variant={biometricStatus.success ? "default" : "destructive"} 
            className="mb-6"
          >
            <AlertTitle>Biometric Registration</AlertTitle>
            <AlertDescription>{biometricStatus.message}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'personal' | 'address' | 'membership')} className="w-full">
              <TabsList className="grid grid-cols-3 w-full mb-6">
                <TabsTrigger value="personal">Personal Information</TabsTrigger>
                <TabsTrigger value="address">Address & Contact</TabsTrigger>
                <TabsTrigger value="membership">Membership</TabsTrigger>
              </TabsList>

              <TabsContent value="personal">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>
                      Enter the member's personal details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name*</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter full name" {...field} />
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
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
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
                        name="dateOfBirth"
                        render={({ field }) => {
                          const currentDate = field.value ? new Date(field.value) : new Date();
                          const currentYear = getYear(new Date());
                          
                          const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
                          const months = [
                            { value: 0, label: 'January' },
                            { value: 1, label: 'February' },
                            { value: 2, label: 'March' },
                            { value: 3, label: 'April' },
                            { value: 4, label: 'May' },
                            { value: 5, label: 'June' },
                            { value: 6, label: 'July' },
                            { value: 7, label: 'August' },
                            { value: 8, label: 'September' },
                            { value: 9, label: 'October' },
                            { value: 10, label: 'November' },
                            { value: 11, label: 'December' },
                          ];
                          
                          // Get days in month
                          const daysInMonth = (year: number, month: number) => {
                            return new Date(year, month + 1, 0).getDate();
                          };
                          
                          const days = Array.from(
                            { length: daysInMonth(getYear(currentDate), getMonth(currentDate)) },
                            (_, i) => i + 1
                          );
                          
                          const handleDateChange = (type: 'year' | 'month' | 'day', value: number) => {
                            let newDate = new Date(currentDate);
                            
                            switch (type) {
                              case 'year':
                                newDate = setYear(newDate, value);
                                break;
                              case 'month':
                                newDate = setMonth(newDate, value);
                                // Adjust day if it's no longer valid for the new month
                                const maxDays = daysInMonth(getYear(newDate), value);
                                if (getDate(newDate) > maxDays) {
                                  newDate = setDate(newDate, maxDays);
                                }
                                break;
                              case 'day':
                                newDate = setDate(newDate, value);
                                break;
                            }
                            
                            field.onChange(newDate);
                          };
                          
                          return (
                            <FormItem className="space-y-2">
                              <FormLabel>Date of Birth</FormLabel>
                              <div className="grid grid-cols-3 gap-2">
                                {/* Day Dropdown */}
                                <Select
                                  value={getDate(currentDate).toString()}
                                  onValueChange={(value) => handleDateChange('day', parseInt(value))}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Day" />
                                  </SelectTrigger>
                                  <SelectContent className="max-h-[300px] overflow-y-auto">
                                    {days.map((day) => (
                                      <SelectItem key={day} value={day.toString()}>
                                        {day}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                
                                {/* Month Dropdown */}
                                <Select
                                  value={getMonth(currentDate).toString()}
                                  onValueChange={(value) => handleDateChange('month', parseInt(value))}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Month" />
                                  </SelectTrigger>
                                  <SelectContent className="max-h-[300px] overflow-y-auto">
                                    {months.map((month) => (
                                      <SelectItem key={month.value} value={month.value.toString()}>
                                        {month.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                
                                {/* Year Dropdown */}
                                <Select
                                  value={getYear(currentDate).toString()}
                                  onValueChange={(value) => handleDateChange('year', parseInt(value))}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Year" />
                                  </SelectTrigger>
                                  <SelectContent className="max-h-[300px] overflow-y-auto">
                                    {years.map((year) => (
                                      <SelectItem key={year} value={year.toString()}>
                                        {year}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <FormMessage />
                            </FormItem>
                          );
                        }}
                      />

                      <FormField
                        control={form.control}
                        name="bloodGroup"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Blood Group</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
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
                        name="occupation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Occupation</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter occupation" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="goal"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Fitness Goal</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select fitness goal" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="weight_loss">Weight Loss</SelectItem>
                                <SelectItem value="muscle_gain">Muscle Gain</SelectItem>
                                <SelectItem value="stamina">Stamina Building</SelectItem>
                                <SelectItem value="flexibility">Flexibility</SelectItem>
                                <SelectItem value="strength">Strength Training</SelectItem>
                                <SelectItem value="general_fitness">General Fitness</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-lg font-medium mb-4">ID Proof Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="idType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>ID Type</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select ID type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="aadhar">Aadhar Card</SelectItem>
                                  <SelectItem value="pan">PAN Card</SelectItem>
                                  <SelectItem value="driving_license">Driving License</SelectItem>
                                  <SelectItem value="passport">Passport</SelectItem>
                                  <SelectItem value="voter_id">Voter ID</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="idNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>ID Number</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter ID number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => navigate("/members")}>
                      Cancel
                    </Button>
                    <Button type="button" onClick={async () => {
                      // Validate the required fields in the personal tab
                      const result = await form.trigger(['name', 'gender', 'dateOfBirth']);
                      if (result) {
                        // If validation passes, navigate to the next tab
                        const tabButton = document.querySelector('[data-value="address"]');
                        if (tabButton instanceof HTMLElement) tabButton.click();
                      } else {
                        // Show toast for validation errors
                        toast({
                          title: "Please check the form",
                          description: "Please fill in all required fields before proceeding.",
                          variant: "destructive",
                        });
                      }
                    }}>
                      Next
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="address">
                <Card>
                  <CardHeader>
                    <CardTitle>Address & Contact Information</CardTitle>
                    <CardDescription>
                      Enter the member's contact details and address
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter phone number" {...field} />
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
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter email address" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-lg font-medium mb-4">Address</h3>
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Street Address</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Enter street address"
                                  {...field}
                                  rows={2}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>City</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter city" {...field} />
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
                                  <Input placeholder="Enter state" {...field} />
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
                                <FormLabel>ZIP Code</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter ZIP code" {...field} />
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
                                  <Input placeholder="Enter country" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button 
                      variant="outline" 
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab('personal');
                      }}
                    >
                      Previous
                    </Button>
                    <Button 
                      type="button" 
                      onClick={async (e) => {
                        e.preventDefault();
                        // Force form validation before proceeding
                        const result = await form.trigger(['phone', 'email', 'address', 'city', 'state', 'zipCode', 'country']);
                        
                        // Proceed to next tab - these fields are optional, so we don't need to check the result
                        setActiveTab('membership');
                      }}
                    >
                      Next
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="membership">
                <Card>
                  <CardHeader>
                    <CardTitle>Membership Details</CardTitle>
                    <CardDescription>
                      Assign a membership plan to the new member or add them without one
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="createWithMembership"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Assign Membership</FormLabel>
                            <FormDescription>
                              Create member with an active membership plan
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

                    {form.watch("createWithMembership") && (
                      <>
                        <Separator />
                        
                        <div className="space-y-4">
                          <FormField
                            control={form.control}
                            name="membershipId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Membership Plan*</FormLabel>
                                <Select 
                                  onValueChange={(value) => {
                                    field.onChange(value);
                                    const selected = memberships.find(m => m.id === value);
                                    setSelectedMembership(selected || null);
                                  }} 
                                  value={field.value || ''}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select a membership plan" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {isLoadingMemberships ? (
                                      <SelectItem value="loading" disabled>
                                        Loading...
                                      </SelectItem>
                                    ) : memberships && memberships.length > 0 ? (
                                      memberships.map((membership) => (
                                        <SelectItem key={membership.id} value={membership.id}>
                                          {membership.name} - ₹{membership.price} for {membership.duration_days} days
                                        </SelectItem>
                                      ))
                                    ) : (
                                      <SelectItem value="no-plans" disabled>
                                        No membership plans available
                                      </SelectItem>
                                    )}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="startDate"
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormLabel>Start Date*</FormLabel>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant={"outline"}
                                        className={cn(
                                          "w-full pl-3 text-left font-normal",
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
                                  <PopoverContent className="w-auto p-0">
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
                          
                          {selectedMembership && (
                            <div className="rounded-md border bg-muted p-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm font-medium">Membership</p>
                                  <p className="text-sm">{selectedMembership.name}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">Price</p>
                                  <p className="text-sm">₹{selectedMembership.price}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">Duration</p>
                                  <p className="text-sm">{selectedMembership.duration_days} days</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">End Date</p>
                                  <p className="text-sm">
                                    {form.watch("startDate") && selectedMembership
                                      ? format(
                                          membershipService.calculateEndDate(
                                            form.watch("startDate") as Date,
                                            selectedMembership.duration_days
                                          ),
                                          "PPP"
                                        )
                                      : "-"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          <Separator />
                          
                          <FormField
                            control={form.control}
                            name="paymentStatus"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Payment Status*</FormLabel>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="flex flex-col space-y-1"
                                >
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="paid" />
                                    </FormControl>
                                    <FormLabel className="font-normal cursor-pointer">
                                      Paid (Full payment: ₹{selectedMembership ? selectedMembership.price : 0})
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="partial" />
                                    </FormControl>
                                    <FormLabel className="font-normal cursor-pointer">
                                      Partial Payment
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="pending" />
                                    </FormControl>
                                    <FormLabel className="font-normal cursor-pointer">
                                      Pending (No payment now)
                                    </FormLabel>
                                  </FormItem>
                                </RadioGroup>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          {(form.watch("paymentStatus") === "paid" || form.watch("paymentStatus") === "partial") && (
                            <>
                              <div className="space-y-4">
                                <FormField
                                  control={form.control}
                                  name="paymentMethod"
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
                                          {PAYMENT_METHODS.map((method) => (
                                            <SelectItem key={method.value} value={method.value}>
                                              {method.label}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <FormField
                                    control={form.control}
                                    name="transactionId"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Transaction ID</FormLabel>
                                        <FormControl>
                                          <Input 
                                            placeholder="Enter transaction ID" 
                                            {...field} 
                                          />
                                        </FormControl>
                                        <FormDescription>
                                          For card, UPI, or online payments
                                        </FormDescription>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  
                                  <FormField
                                    control={form.control}
                                    name="referenceNumber"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Reference Number</FormLabel>
                                        <FormControl>
                                          <Input 
                                            placeholder="Enter reference number" 
                                            {...field} 
                                          />
                                        </FormControl>
                                        <FormDescription>
                                          For cheques or bank transfers
                                        </FormDescription>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>
                              </div>
                            </>
                          )}
                          
                          {form.watch("paymentStatus") === "partial" && (
                            <FormField
                              control={form.control}
                              name="amountPaid"
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
                          
                          <FormField
                            control={form.control}
                            name="membershipNotes"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Notes</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Additional notes about this membership assignment"
                                    {...field}
                                    rows={2}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button 
                      variant="outline" 
                      onClick={() => setActiveTab('address')}
                    >
                      Previous
                    </Button>
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
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </form>
        </Form>
      </div>
    </Container>
  );
};

export default NewMemberPage;
