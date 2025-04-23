
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

const GENDERS = ["Male", "Female", "Other"] as const;
const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"] as const;

const NewMemberPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "" as "" | typeof GENDERS[number],
    bloodGroup: "" as "" | typeof BLOOD_GROUPS[number],
    occupation: "",
    dateOfBirth: "" as string,
    goal: "",
    membershipId: "gold-6m",
    membershipStatus: "active",
  });
  const [dob, setDob] = useState<Date | undefined>(undefined);
  const [initialMeasurements, setInitialMeasurements] = useState<Partial<BodyMeasurement> | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDobChange = (date?: Date) => {
    setDob(date);
    setFormData(prev => ({
      ...prev,
      dateOfBirth: date ? date.toISOString().split("T")[0] : "",
    }));
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
        date_of_birth: formData.dateOfBirth,
        gender: formData.gender || undefined,
        bloodGroup: formData.bloodGroup || undefined,
        occupation: formData.occupation,
        goal: formData.goal,
        trainerId: "trainer-123", // Default trainer
        membershipId: formData.membershipId,
        membershipStatus: formData.membershipStatus as "active" | "inactive" | "expired",
        membershipStartDate: new Date().toISOString(),
        membershipEndDate: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString(),
        status: "active",
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
                  <h3 className="text-lg font-medium">Basic Details</h3>

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
                      <Label htmlFor="gender">Gender</Label>
                      <Select
                        value={formData.gender}
                        onValueChange={(value) => handleSelectChange("gender", value)}
                      >
                        <SelectTrigger id="gender">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          {GENDERS.map((gender) => (
                            <SelectItem key={gender} value={gender}>
                              {gender}
                            </SelectItem>
                          ))}
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
                          {BLOOD_GROUPS.map((bg) => (
                            <SelectItem key={bg} value={bg}>
                              {bg}
                            </SelectItem>
                          ))}
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

                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <DatePicker
                        id="dateOfBirth"
                        date={dob}
                        onSelect={handleDobChange}
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

