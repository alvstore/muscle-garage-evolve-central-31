
import { useState } from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Member } from "@/types/member";
import { useAuth } from "@/hooks/use-auth";
import MemberBodyMeasurements from "@/components/fitness/MemberBodyMeasurements";
import { BodyMeasurement } from "@/types/measurements";
import MemberBasicDetailsForm from "@/components/members/MemberBasicDetailsForm";
import MemberMembershipForm from "@/components/members/MemberMembershipForm";
import { format } from "date-fns";
import { supabase } from "@/services/supabaseClient";

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
      dateOfBirth: date ? format(date, "yyyy-MM-dd") : "",
    }));
  };

  const handleSaveMeasurements = (measurements: Partial<BodyMeasurement>) => {
    setInitialMeasurements(measurements);
    toast.success("Initial measurements saved. They will be recorded when the member is created.");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Find default branch for now
      const { data: branches } = await supabase
        .from("branches")
        .select("id")
        .order("created_at", { ascending: true })
        .limit(1);

      const branchId = branches?.[0]?.id;
      if (!branchId) throw new Error("No branch found.");

      // Insert member
      const { data: inserted, error } = await supabase
        .from("members")
        .insert([
          {
            user_id: user?.id,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            gender: formData.gender,
            blood_group: formData.bloodGroup,
            occupation: formData.occupation,
            date_of_birth: formData.dateOfBirth ? formData.dateOfBirth : null,
            goal: formData.goal,
            membership_id: formData.membershipId,
            membership_status: formData.membershipStatus,
            branch_id: branchId,
            status: "active",
          },
        ])
        .select()
        .single();

      if (error || !inserted) throw new Error(error?.message || "Failed to add member");

      const memberId = inserted.id;

      // Save measurements if exists
      if (initialMeasurements) {
        await supabase.from("body_measurements").insert([
          {
            member_id: memberId,
            ...initialMeasurements,
            branch_id: branchId,
            recorded_by: user?.id,
          },
        ]);
      }

      setLoading(false);
      toast.success("✅ Member profile created successfully!");
      navigate(`/members/${memberId}`);
    } catch (err: any) {
      setLoading(false);
      toast.error(err?.message || "Could not create member.");
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
                <MemberBasicDetailsForm
                  formData={formData}
                  dob={dob}
                  onChange={handleChange}
                  onSelectChange={handleSelectChange}
                  onDobChange={handleDobChange}
                />
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
