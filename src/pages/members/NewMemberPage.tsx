
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

const NewMemberPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentBranch } = useBranch();
  const [loading, setLoading] = useState(false);
  const [memberships, setMemberships] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    goal: "",
    membershipId: "",
    membershipStatus: "active",
  });
  const [initialMeasurements, setInitialMeasurements] = useState<Partial<BodyMeasurement> | null>(null);

  useEffect(() => {
    const fetchMemberships = async () => {
      try {
        const { data, error } = await supabase
          .from('memberships')
          .select('*')
          .eq('is_active', true)
          .eq('branch_id', currentBranch?.id || '');
          
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

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveMeasurements = (measurements: Partial<BodyMeasurement>) => {
    setInitialMeasurements(measurements);
    toast.success("Initial measurements saved. They will be recorded when the member is created.");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // 1. Create member record in the database
      const { data: memberData, error: memberError } = await supabase
        .from('members')
        .insert({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          date_of_birth: formData.dateOfBirth || null,
          goal: formData.goal,
          membership_id: formData.membershipId,
          membership_status: formData.membershipStatus,
          status: 'active',
          branch_id: currentBranch?.id
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
            branch_id: currentBranch?.id
          });
          
        if (measurementError) {
          console.error("Error saving measurements:", measurementError);
          toast.error("Member created but failed to save measurements");
        }
      }
      
      // 3. Create membership assignment
      if (formData.membershipId) {
        const selectedMembership = memberships.find(m => m.id === formData.membershipId);
        if (selectedMembership) {
          const startDate = new Date();
          const endDate = new Date();
          endDate.setDate(endDate.getDate() + selectedMembership.duration_days);
          
          const { error: assignmentError } = await supabase
            .from('member_memberships')
            .insert({
              member_id: memberData.id,
              membership_id: formData.membershipId,
              start_date: startDate.toISOString().split('T')[0],
              end_date: endDate.toISOString().split('T')[0],
              total_amount: selectedMembership.price,
              amount_paid: 0,
              payment_status: 'pending',
              branch_id: currentBranch?.id
            });
            
          if (assignmentError) {
            console.error("Error assigning membership:", assignmentError);
            toast.error("Member created but failed to assign membership");
          }
        }
      }
      
      toast.success("Member created successfully");
      navigate(`/members/${memberData.id}`);
    } catch (error: any) {
      console.error("Error creating member:", error);
      toast.error(`Failed to create member: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

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
                {/* Personal Information */}
                <div className="space-y-4">
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
                </div>
                
                {/* Membership Information */}
                <div className="space-y-4">
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
                  </div>
                </div>
                
                <div className="flex justify-end gap-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate("/members")}
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
