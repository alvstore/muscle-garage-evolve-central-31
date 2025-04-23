
import { useState } from "react";
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
import { DatePicker } from "@/components/ui/date-picker";
import { Users, Briefcase, Droplet } from "lucide-react";

const NewMemberPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    goal: "",
    membershipId: "gold-6m",
    membershipStatus: "active",
    gender: "",
    bloodGroup: "",
    occupation: "",
  });
  const [birthDate, setBirthDate] = useState<Date | undefined>(undefined);
  const [initialMeasurements, setInitialMeasurements] = useState<Partial<BodyMeasurement> | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | undefined) => {
    setBirthDate(date);
    if (date) {
      const dateString = date.toISOString().split('T')[0];
      setFormData(prev => ({ ...prev, dateOfBirth: dateString }));
    } else {
      setFormData(prev => ({ ...prev, dateOfBirth: "" }));
    }
  };

  const handleSaveMeasurements = (measurements: Partial<BodyMeasurement>) => {
    setInitialMeasurements(measurements);
    toast.success("Initial measurements saved. They will be recorded when the member is created.");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call to create a new member
    setTimeout(() => {
      const newMember: Member = {
        id: `member-${Date.now()}`,
        email: formData.email,
        name: formData.name,
        role: "member",
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        goal: formData.goal,
        gender: formData.gender as 'male' | 'female' | 'other',
        bloodGroup: formData.bloodGroup as 'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-',
        occupation: formData.occupation,
        membershipId: formData.membershipId,
        membershipStatus: formData.membershipStatus as "active" | "inactive" | "expired",
        membershipStartDate: new Date(),
        membershipEndDate: new Date(new Date().setMonth(new Date().getMonth() + 6)),
        status: formData.membershipStatus as "active" | "inactive" | "pending",
      };
      
      // If there are initial measurements, save them too
      if (initialMeasurements) {
        console.log("Saving initial measurements:", initialMeasurements);
        // In a real app, this would be an API call to save the measurements
      }
      
      setLoading(false);
      toast.success("Member created successfully");
      navigate(`/members/${newMember.id}`);
    }, 1500);
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
                      <DatePicker
                        id="dateOfBirth"
                        date={birthDate}
                        onSelect={handleDateChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select 
                        value={formData.gender} 
                        onValueChange={(value) => handleSelectChange("gender", value)}
                      >
                        <SelectTrigger id="gender" className="w-full">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <SelectValue placeholder="Select gender" />
                          </div>
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
                        <SelectTrigger id="bloodGroup" className="w-full">
                          <div className="flex items-center gap-2">
                            <Droplet className="h-4 w-4 text-muted-foreground" />
                            <SelectValue placeholder="Select blood group" />
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A+">A+</SelectItem>
                          <SelectItem value="A-">A-</SelectItem>
                          <SelectItem value="B+">B+</SelectItem>
                          <SelectItem value="B-">B-</SelectItem>
                          <SelectItem value="O+">O+</SelectItem>
                          <SelectItem value="O-">O-</SelectItem>
                          <SelectItem value="AB+">AB+</SelectItem>
                          <SelectItem value="AB-">AB-</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="occupation">Occupation</Label>
                      <div className="flex items-center space-x-2 border rounded-md">
                        <Briefcase className="h-4 w-4 text-muted-foreground ml-3" />
                        <Input 
                          id="occupation" 
                          name="occupation" 
                          placeholder="Software Developer" 
                          value={formData.occupation} 
                          onChange={handleChange}
                          className="border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </div>
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
                          <SelectItem value="platinum-12m">Platinum (12 Months)</SelectItem>
                          <SelectItem value="gold-6m">Gold (6 Months)</SelectItem>
                          <SelectItem value="silver-3m">Silver (3 Months)</SelectItem>
                          <SelectItem value="basic-1m">Basic (1 Month)</SelectItem>
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

export default NewMemberPage;
