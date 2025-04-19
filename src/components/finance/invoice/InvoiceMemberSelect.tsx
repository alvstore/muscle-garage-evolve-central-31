
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InvoiceMemberSelectProps } from "@/types/invoice";

// Mock data - should be moved to a data file or API call
const mockMembers = [
  { id: "member-1", name: "John Doe" },
  { id: "member-2", name: "Jane Smith" },
  { id: "member-3", name: "Alex Johnson" },
];

export const InvoiceMemberSelect = ({ memberId, onMemberSelect }: InvoiceMemberSelectProps) => (
  <div className="space-y-2">
    <Label htmlFor="memberId">Member</Label>
    <Select
      value={memberId}
      onValueChange={onMemberSelect}
      required
    >
      <SelectTrigger>
        <SelectValue placeholder="Select member" />
      </SelectTrigger>
      <SelectContent>
        {mockMembers.map(member => (
          <SelectItem key={member.id} value={member.id}>
            {member.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

