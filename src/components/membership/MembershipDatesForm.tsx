
import React from "react";
import { DatePicker } from "@/components/ui/date-picker";
import { FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface DatesProps {
  control: any;
}

const MembershipDatesForm: React.FC<DatesProps> = ({ control }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <FormField
      control={control}
      name="startDate"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Start Date</FormLabel>
          <DatePicker
            className="rounded-md border"
            onSelect={field.onChange}
            date={field.value}
          />
          <FormDescription>
            The date the membership starts.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
    <FormField
      control={control}
      name="endDate"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>End Date</FormLabel>
          <DatePicker
            className="rounded-md border"
            onSelect={field.onChange}
            date={field.value}
          />
          <FormDescription>The date the membership ends.</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  </div>
);

export default MembershipDatesForm;
