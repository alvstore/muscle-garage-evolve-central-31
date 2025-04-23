
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";

const GENDERS = ["Male", "Female", "Other"] as const;
const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"] as const;

type MemberBasicDetailsFormProps = {
  formData: {
    name: string;
    email: string;
    phone: string;
    gender: "" | typeof GENDERS[number];
    bloodGroup: "" | typeof BLOOD_GROUPS[number];
    occupation: string;
    dateOfBirth: string;
    goal: string;
  };
  dob: Date | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (name: string, value: string) => void;
  onDobChange: (date?: Date) => void;
};

export default function MemberBasicDetailsForm({
  formData,
  dob,
  onChange,
  onSelectChange,
  onDobChange
}: MemberBasicDetailsFormProps) {
  return (
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
            onChange={onChange}
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
            onChange={onChange}
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
            onChange={onChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Select
            value={formData.gender}
            onValueChange={(value) => onSelectChange("gender", value)}
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
            onValueChange={(value) => onSelectChange("bloodGroup", value)}
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
            onChange={onChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date of Birth</Label>
          <DatePicker
            id="dateOfBirth"
            date={dob}
            onSelect={onDobChange}
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
          onChange={onChange}
          rows={3}
        />
      </div>
    </div>
  );
}
