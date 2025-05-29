
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InvoiceMemberFieldsProps } from "@/types/invoice";

export const InvoiceMemberFields = ({ 
  member_id, 
  member_name, 
  onChange, 
  onSelectMember 
}: InvoiceMemberFieldsProps) => (
  <div className="grid grid-cols-2 gap-4">
    <div className="space-y-2">
      <Label htmlFor="member_id">Member ID</Label>
      <Input
        id="member_id"
        name="member_id"
        value={member_id}
        onChange={onChange}
        placeholder="Member ID"
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="member_name">Member Name</Label>
      <Input
        id="member_name"
        name="member_name"
        value={member_name}
        onChange={onChange}
        placeholder="Member Name"
      />
    </div>
  </div>
);
