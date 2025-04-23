
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type MemberMembershipFormProps = {
  formData: {
    membershipId: string;
    membershipStatus: string;
  };
  onSelectChange: (name: string, value: string) => void;
};

export default function MemberMembershipForm({
  formData,
  onSelectChange
}: MemberMembershipFormProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Membership Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="membershipId">Membership Type *</Label>
          <Select
            value={formData.membershipId}
            onValueChange={(value) => onSelectChange("membershipId", value)}
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
            onValueChange={(value) => onSelectChange("membershipStatus", value)}
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
  );
}
