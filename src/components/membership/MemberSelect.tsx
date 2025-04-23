
import React from "react";
import { Member } from "@/types/member";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface MemberSelectProps {
  members: Member[];
  control: any;
  onChange: (memberId: string) => void;
}

const MemberSelect: React.FC<MemberSelectProps> = ({ members, control, onChange }) => (
  <FormField
    control={control}
    name="memberId"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Member</FormLabel>
        <Select
          onValueChange={(value) => {
            field.onChange(value);
            onChange(value);
          }}
        >
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="Select a member" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            {members.map((member) => (
              <SelectItem key={member.id} value={member.id}>
                {member.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FormDescription>
          Select the member to assign the membership to.
        </FormDescription>
        <FormMessage />
      </FormItem>
    )}
  />
);

export default MemberSelect;
