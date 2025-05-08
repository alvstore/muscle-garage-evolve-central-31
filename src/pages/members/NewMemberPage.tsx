
import { useState, useEffect } from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Member } from "@/types";
import { useAuth } from "@/hooks/use-auth";
import MemberBodyMeasurements from "@/components/fitness/MemberBodyMeasurements";
import { BodyMeasurement } from "@/types/measurements";
import { supabase } from "@/services/supabaseClient";
import { useBranch } from "@/hooks/use-branch";
import { AvatarUpload } from "@/components/ui/avatar-upload";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { registerMemberInBiometricDevice } from "@/services/biometricService";

const NewMemberPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentBranch } = useBranch();
  const [loading, setLoading] = useState(false);
  const [memberships, setMemberships] = useState<any[]>([]);
  const [profilePicture, setProfilePicture] = useState<string>("");
  const [activeTab, setActiveTab] = useState("personal");

  const [formData, setFormData] = useState({
    // Personal Information
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    bloodGroup: "",
    occupation: "",
    goal: "",
    
    // Address Information
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India", // Default value
    
    // ID Information
    idType: "",
    idNumber: "",
    
    // Membership Information
    membershipId: "",
    membershipStatus: "active",

    // Payment Information
    amountPaid: 0,
    paymentMethod: "cash",
  });
  
  const [initialMeasurements, setInitialMeasurements] = useState<Partial<BodyMeasurement> | null>(null);

  useEffect(() => {
    const fetchMemberships = async () => {
      try {
        if (!currentBranch?.id) {
          toast.error("Please select a branch first");
          return;
        }
        
        const { data, error } = await supabase
          .from('memberships')
          .select('*')
          .eq('is_active', true)
          .eq('branch_id', currentBranch.id);
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          setMemberships(data);
          setFormData(prev => ({
            ...prev,
            membershipId: data[0].id
          }));
        }
      } catch (err) {
        console.error("Error fetching memberships:", err);
        toast.error("Failed to load membership plans");
      }
    };
    
    fetchMemberships();
  }, [currentBranch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumericChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value) || 0;
    setFormData(prev => ({ ...prev, [name]: numValue }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleImageUploaded = (url: string) => {
    setProfilePicture(url);
    toast.success("Profile picture uploaded successfully!");
  };

  const handleSaveMeasurements = (measurements: Partial<BodyMeasurement>) => {
    setInitialMeasurements(measurements);
    toast.success("Initial measurements saved. They will be recorded when the member is created.");
  };

  const createInvoice = async (memberId: string, membershipData: any, amountPaid: number) => {
    try {
      // Calculate payment status
      const totalAmount = membershipData.price;
      let paymentStatus: 'pending' | 'partial' | 'paid' = 'pending';
      
      if (amountPaid >= totalAmount) {
        paymentStatus = 'paid';
      } else if (amountPaid > 0) {
        paymentStatus = 'partial';
      }
      
      // Create invoice items
      const invoiceItem = {
        id: crypto.randomUUID(),
        name: membershipData.name,
        description: `Membership for ${membershipData.duration_days} days`,
        quantity: 1,
        price: membershipData.price
      };

      // Create the invoice record
      const { data: invoiceData, error: invoiceError } = await supabase
        .from('invoices')
        .insert({
          member_id: memberId,
          amount: totalAmount,
          status: paymentStatus,
          issued_date: new Date().toISOString(),
          due_date: new Date().toISOString(),
          paid_date: paymentStatus === 'paid' ? new Date().toISOString() : null,
          payment_method: formData.paymentMethod,
          branch_id: currentBranch?.id,
          items: [invoiceItem],
          description: `Invoice for ${membershipData.name} membership`,
          membership_plan_id: membershipData.id
        })
        .select()
        .single();
        
      if (invoiceError) throw invoiceError;
      
      return invoiceData;
    } catch (error) {
      console.error("Error creating invoice:", error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (!currentBranch?.id) {
        throw new Error("No branch selected");
      }
      
      // 1. Create member record in the database
      const { data: memberData, error: memberError } = await supabase
        .from('members')
        .insert({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          date_of_birth: formData.dateOfBirth || null,
          gender: formData.gender || null,
          blood_group: formData.bloodGroup || null,
          occupation: formData.occupation || null,
          goal: formData.goal,
          membership_id: formData.membershipId,
          membership_status: formData.membershipStatus,
          status: 'active',
          branch_id: currentBranch.id,
          
          // New fields
          address: formData.address || null,
          city: formData.city || null,
          state: formData.state || null,
          zip_code: formData.zipCode || null,
          country: formData.country || 'India',
          id_type: formData.idType || null,
          id_number: formData.idNumber || null,
          profile_picture: profilePicture || null
        })
        .select()
        .single();
        
      if (memberError) throw memberError;
      
      console.log("Member created:", memberData);
      
      // 2. If there are initial measurements, save them too
      if (initialMeasurements && memberData.id) {
        const { error: measurementError } = await supabase
          .from('body_measurements')
          .insert({
            ...initialMeasurements,
            member_id: memberData.id,
            recorded_by: user?.id,
            branch_id: currentBranch.id
          });
          
        if (measurementError) {
          console.error("Error saving measurements:", measurementError);
          toast.error("Member created but failed to save measurements");
        }
      }
      
      // 3. Get selected membership details
      let selectedMembership = null;
      let invoiceData = null;
      let membershipAssignmentData = null;
      
      if (formData.membershipId) {
        selectedMembership = memberships.find(m => m.id === formData.membershipId);
        if (selectedMembership) {
          // 4. Auto-calculate membership dates
          const startDate = new Date();
          const endDate = new Date();
          endDate.setDate(endDate.getDate() + selectedMembership.duration_days);
          
          // 5. Create membership assignment
          const { data: assignmentData, error: assignmentError } = await supabase
            .from('member_memberships')
            .insert({
              member_id: memberData.id,
              membership_id: formData.membershipId,
              start_date: startDate.toISOString().split('T')[0],
              end_date: endDate.toISOString().split('T')[0],
              total_amount: selectedMembership.price,
              amount_paid: formData.amountPaid,
              payment_status: formData.amountPaid >= selectedMembership.price ? 'paid' : 
                             formData.amountPaid > 0 ? 'partial' : 'pending',
              branch_id: currentBranch.id
            })
            .select()
            .single();
            
          if (assignmentError) {
            console.error("Error assigning membership:", assignmentError);
            toast.error("Member created but failed to assign membership");
          } else {
            membershipAssignmentData = assignmentData;
            
            // 6. Auto-generate invoice for the membership
            try {
              invoiceData = await createInvoice(
                memberData.id, 
                selectedMembership, 
                formData.amountPaid
              );
            } catch (invoiceError) {
              console.error("Error creating invoice:", invoiceError);
              toast.error("Member created but failed to generate invoice");
            }
          }
        }
      }
      
      // 7. Register member in biometric device if applicable
      try {
        const { data: settings } = await supabase
          .from('attendance_settings')
          .select('*')
          .eq('branch_id', currentBranch.id)
          .single();
        
        if (settings && (settings.hikvision_enabled || settings.essl_enabled)) {
          const result = await registerMemberInBiometricDevice({
            memberId: memberData.id,
            name: formData.name,
            phone: formData.phone || '',
            branchId: currentBranch.id,
            deviceType: settings.hikvision_enabled ? 'hikvision' : 'essl'
          });
          
          if (!result.success) {
            console.warn("Biometric registration warning:", result.message);
            toast.warning(`Note: ${result.message}`);
          } else {
            toast.success("Member registered in biometric system");
          }
        }
      } catch (biometricError) {
        console.error("Biometric registration error:", biometricError);
        toast.error("Member created but could not register in biometric system");
      }
      
      toast.success("Member created successfully");
      
      // 8. Redirect to the invoice page if we have one, otherwise to the member profile
      if (invoiceData) {
        navigate(`/admin/invoices/${invoiceData.id}`);
      } else {
        navigate(`/admin/members/${memberData.id}`);
      }
      
    } catch (error: any) {
      console.error("Error creating member:", error);
      toast.error(`Failed to create member: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!currentBranch?.id) {
    return (
      <Container>
        <div className="py-6">
          <Card>
            <CardContent className="flex items-center justify-center py-10">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">No Branch Selected</h2>
                <p className="text-muted-foreground">Please select a branch to add a new member</p>
                <Button 
                  className="mt-4" 
                  onClick={() => navigate('/select-branch')}
                >
                  Select Branch
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-6">Add New Member</h1>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Member Information</CardTitle>
              <CardDescription>Enter the details of the new member</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Profile Picture Upload */}
                <div className="flex justify-center mb-6">
                  <AvatarUpload onImageUploaded={handleImageUploaded} />
                </div>
                
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="personal">Personal</TabsTrigger>
                    <TabsTrigger value="address">Address</TabsTrigger>
                    <TabsTrigger value="identification">Identification</TabsTrigger>
                    <TabsTrigger value="membership">Membership</TabsTrigger>
                    <TabsTrigger value="payment">Payment</TabsTrigger>
                  </TabsList>
                
                  {/* Personal Information Tab */}
                  <TabsContent value="personal" className="space-y-4 pt-4">
                    <h3 className="text-lg font-medium">Personal Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input 
                          id="name" 
                          name="name" 
                          placeholder="John Doe" 
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
                          placeholder="john.doe@example.com" 
                          value={formData.email} 
                          onChange={handleChange} 
                          required 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input 
                          id="phone" 
                          name="phone" 
                          placeholder="+1 (555) 123-4567" 
                          value={formData.phone} 
                          onChange={handleChange} 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                        <Input 
                          id="dateOfBirth" 
                          name="dateOfBirth" 
                          type="date" 
                          value={formData.dateOfBirth} 
                          onChange={handleChange} 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="gender">Gender</Label>
                        <Select 
                          value={formData.gender} 
                          onValueChange={(value) => handleSelectChange("gender", value)}
                        >
                          <SelectTrigger id="gender">
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
                        <Label htmlFor="bloodGroup">Blood Group</Label>
                        <Select 
                          value={formData.bloodGroup} 
                          onValueChange={(value) => handleSelectChange("bloodGroup", value)}
                        >
                          <SelectTrigger id="bloodGroup">
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
                        <Label htmlFor="occupation">Occupation</Label>
                        <Input 
                          id="occupation" 
                          name="occupation" 
                          placeholder="Software Engineer" 
                          value={formData.occupation} 
                          onChange={handleChange} 
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="goal">Fitness Goal</Label>
                      <Textarea 
                        id="goal" 
                        name="goal" 
                        placeholder="Build muscle and improve overall fitness" 
                        value={formData.goal} 
                        onChange={handleChange} 
                        rows={3} 
                      />
                    </div>
                  </TabsContent>
                
                  {/* Address Information Tab */}
                  <TabsContent value="address" className="space-y-4 pt-4">
                    <h3 className="text-lg font-medium">Address Information</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address">Street Address</Label>
                      <Input 
                        id="address" 
                        name="address" 
                        placeholder="123 Gym Street" 
                        value={formData.address} 
                        onChange={handleChange} 
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input 
                          id="city" 
                          name="city" 
                          placeholder="Mumbai" 
                          value={formData.city} 
                          onChange={handleChange} 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input 
                          id="state" 
                          name="state" 
                          placeholder="Maharashtra" 
                          value={formData.state} 
                          onChange={handleChange} 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="zipCode">Zip Code</Label>
                        <Input 
                          id="zipCode" 
                          name="zipCode" 
                          placeholder="400001" 
                          value={formData.zipCode} 
                          onChange={handleChange} 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Input 
                          id="country" 
                          name="country" 
                          placeholder="India" 
                          value={formData.country} 
                          onChange={handleChange} 
                        />
                      </div>
                    </div>
                  </TabsContent>
                
                  {/* Identification Tab */}
                  <TabsContent value="identification" className="space-y-4 pt-4">
                    <h3 className="text-lg font-medium">Government ID Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="idType">ID Type</Label>
                        <Select 
                          value={formData.idType} 
                          onValueChange={(value) => handleSelectChange("idType", value)}
                        >
                          <SelectTrigger id="idType">
                            <SelectValue placeholder="Select ID type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="aadhar">Aadhar Card</SelectItem>
                            <SelectItem value="pan">PAN Card</SelectItem>
                            <SelectItem value="driving_license">Driving License</SelectItem>
                            <SelectItem value="voter_id">Voter ID</SelectItem>
                            <SelectItem value="passport">Passport</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="idNumber">ID Number</Label>
                        <Input 
                          id="idNumber" 
                          name="idNumber" 
                          placeholder="XXXXXXXXXXXXXXXX" 
                          value={formData.idNumber} 
                          onChange={handleChange} 
                        />
                      </div>
                    </div>
                  </TabsContent>
                
                  {/* Membership Information Tab */}
                  <TabsContent value="membership" className="space-y-4 pt-4">
                    <h3 className="text-lg font-medium">Membership Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="membershipId">Membership Type *</Label>
                        <Select 
                          value={formData.membershipId} 
                          onValueChange={(value) => handleSelectChange("membershipId", value)}
                        >
                          <SelectTrigger id="membershipId">
                            <SelectValue placeholder="Select membership type" />
                          </SelectTrigger>
                          <SelectContent>
                            {memberships.length > 0 ? (
                              memberships.map(membership => (
                                <SelectItem key={membership.id} value={membership.id}>
                                  {membership.name} ({formatCurrency(membership.price)})
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="no-memberships" disabled>No membership plans available</SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="membershipStatus">Membership Status *</Label>
                        <Select 
                          value={formData.membershipStatus} 
                          onValueChange={(value) => handleSelectChange("membershipStatus", value)}
                        >
                          <SelectTrigger id="membershipStatus">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="expired">Expired</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {formData.membershipId && (
                        <div className="col-span-2">
                          <div className="border rounded-lg p-4 bg-muted/50">
                            <h4 className="font-medium mb-2">Selected Membership Details</h4>
                            {(() => {
                              const selectedMembership = memberships.find(m => m.id === formData.membershipId);
                              return selectedMembership ? (
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                  <div>Membership:</div>
                                  <div className="font-medium">{selectedMembership.name}</div>
                                  <div>Price:</div>
                                  <div className="font-medium">{formatCurrency(selectedMembership.price)}</div>
                                  <div>Duration:</div>
                                  <div className="font-medium">{selectedMembership.duration_days} days</div>
                                </div>
                              ) : (
                                <p className="text-sm text-muted-foreground">No membership selected</p>
                              );
                            })()}
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  {/* Payment Tab */}
                  <TabsContent value="payment" className="space-y-4 pt-4">
                    <h3 className="text-lg font-medium">Payment Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="amountPaid">Amount Paid</Label>
                        <Input 
                          id="amountPaid" 
                          name="amountPaid" 
                          type="number"
                          min="0" 
                          step="0.01"
                          value={formData.amountPaid} 
                          onChange={handleNumericChange} 
                        />
                        {formData.membershipId && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {(() => {
                              const selectedMembership = memberships.find(m => m.id === formData.membershipId);
                              if (selectedMembership) {
                                const remaining = selectedMembership.price - formData.amountPaid;
                                return remaining > 0 
                                  ? `Remaining: ${formatCurrency(remaining)}` 
                                  : remaining < 0
                                    ? `Overpaid: ${formatCurrency(Math.abs(remaining))}`
                                    : "Fully paid";
                              }
                              return "";
                            })()}
                          </p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="paymentMethod">Payment Method</Label>
                        <Select 
                          value={formData.paymentMethod} 
                          onValueChange={(value) => handleSelectChange("paymentMethod", value)}
                        >
                          <SelectTrigger id="paymentMethod">
                            <SelectValue placeholder="Select payment method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cash">Cash</SelectItem>
                            <SelectItem value="card">Card</SelectItem>
                            <SelectItem value="upi">UPI</SelectItem>
                            <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                            <SelectItem value="cheque">Cheque</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="p-4 border rounded bg-yellow-50 border-yellow-200">
                      <p className="text-sm text-yellow-800">
                        <strong>Note:</strong> After creating the member, you'll be redirected to the invoice page where you can complete the payment process.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
                
                <div className="flex justify-end gap-3 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate("/admin/members")}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Creating..." : "Create Member"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          
          {/* Body Measurements Section */}
          <MemberBodyMeasurements 
            currentUser={user!} 
            onSaveMeasurements={handleSaveMeasurements}
          />
        </div>
      </div>
    </Container>
  );
};

// Helper function to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount);
};

export default NewMemberPage;
