
import { useState } from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Member } from "@/types/member"; // Ensure correct import
import { useAuth } from "@/hooks/use-auth";
import MemberBodyMeasurements from "@/components/fitness/MemberBodyMeasurements";
import { BodyMeasurement } from "@/types/measurements";
import MemberBasicDetailsForm from "@/components/members/MemberBasicDetailsForm";
import MemberMembershipForm from "@/components/members/MemberMembershipForm";
import { format } from "date-fns";

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
      dateOfBirth: date ? format(date, "dd/MM/yyyy") : "",
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
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender || undefined, // Use optional chaining or undefined
        bloodGroup: formData.bloodGroup || undefined,
        occupation: formData.occupation,
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
                <MemberBasicDetailsForm
                  formData={formData}
                  dob={dob}
                  onChange={handleChange}
                  onSelectChange={handleSelectChange}
                  onDobChange={handleDobChange}
                />

                {/* Membership Information */}
                <MemberMembershipForm
                  formData={formData}
                  onSelectChange={handleSelectChange}
                />

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
