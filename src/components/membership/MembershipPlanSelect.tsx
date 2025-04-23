
import React from "react";
import { MembershipPlan } from "@/types/membership";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface MembershipPlanSelectProps {
  plans: MembershipPlan[];
  control: any;
  onChange: (planId: string) => void;
}

const MembershipPlanSelect: React.FC<MembershipPlanSelectProps> = ({ plans, control, onChange }) => (
  <FormField
    control={control}
    name="planId"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Membership Plan</FormLabel>
        <Select
          onValueChange={(value) => {
            field.onChange(value);
            onChange(value);
          }}
        >
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="Select a plan" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            {plans.map((plan) => (
              <SelectItem key={plan.id} value={plan.id}>
                {plan.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FormDescription>
          Select the membership plan to assign.
        </FormDescription>
        <FormMessage />
      </FormItem>
    )}
  />
);

export default MembershipPlanSelect;
