
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface InvoiceNotesProps {
  notes: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const InvoiceNotes: React.FC<InvoiceNotesProps> = ({
  notes,
  onChange,
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="notes">Notes</Label>
      <Textarea
        id="notes"
        name="notes"
        value={notes}
        onChange={onChange}
        placeholder="Additional notes..."
        rows={3}
      />
    </div>
  );
};
