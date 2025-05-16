
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface InvoiceMemberFieldsProps {
  memberId: string;
  memberName: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectMember?: (id: string, name: string) => void; // Added this prop
}

export const InvoiceMemberFields: React.FC<InvoiceMemberFieldsProps> = ({
  memberId,
  memberName,
  onChange,
  onSelectMember,
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="member_id">Member ID</Label>
        <Input
          id="member_id"
          name="member_id"
          value={memberId}
          onChange={onChange}
          placeholder="Member ID"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="member_name">Member Name</Label>
        <Input
          id="member_name"
          name="member_name"
          value={memberName}
          onChange={onChange}
          placeholder="Member Name"
        />
      </div>
    </div>
  );
};
