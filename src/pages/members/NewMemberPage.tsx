
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
import { useBranch } from "@/hooks/use-branch";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const GENDERS = ["Male", "Female", "Other"] as const;
const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"] as const;

const NewMemberPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentBranch } = useBranch();
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
      // Verify we have a branch selected
      const branchId = currentBranch?.id;
      if (!branchId) {
        toast.error("Please select a branch before creating a member");
        setLoading(false);
        return;
      }

      // Insert member with branch_id from selected branch
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
        
        {!currentBranch && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No branch selected</AlertTitle>
            <AlertDescription>
              Please select a branch from the sidebar dropdown before creating a member.
            </AlertDescription>
          </Alert>
        )}
        
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
                {currentBranch && (
                  <div className="bg-muted/50 p-3 rounded-md mb-3">
                    <p className="text-sm font-medium">
                      Branch: <span className="font-normal">{currentBranch.name}</span>
                    </p>
                  </div>
                )}
                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/members")}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading || !currentBranch}>
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
