
import React from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReferralProgram } from "@/types/marketing";
import { stringToDate, dateToString } from "@/utils/date-utils";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

interface ReferralProgramFormProps {
  program?: ReferralProgram;
  onComplete: () => void;
}

const programSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  rewardType: z.enum(["fixed", "percentage", "product", "membership-extension"]),
  rewardValue: z.coerce.number().positive({ message: "Reward value must be positive" }),
  extensionDays: z.coerce.number().nonnegative().optional(),
  isActive: z.boolean().default(true),
  startDate: z.date(),
  endDate: z.date().optional(),
  terms: z.string().optional(),
});

const ReferralProgramForm: React.FC<ReferralProgramFormProps> = ({ program, onComplete }) => {
  const form = useForm<z.infer<typeof programSchema>>({
    resolver: zodResolver(programSchema),
    defaultValues: {
      name: program?.name || "",
      description: program?.description || "",
      rewardType: (program?.rewardType || program?.reward_type || "fixed") as "fixed" | "percentage" | "product" | "membership-extension",
      rewardValue: program?.rewardValue || program?.reward_value || 10,
      extensionDays: program?.extensionDays || 0,
      isActive: program?.isActive ?? program?.is_active ?? true,
      startDate: program?.startDate || stringToDate(program?.start_date) || new Date(),
      endDate: program?.endDate || stringToDate(program?.end_date),
      terms: program?.terms || "",
    },
  });

  const onSubmit = (values: z.infer<typeof programSchema>) => {
    try {
      const newProgram: ReferralProgram = {
        id: program?.id || uuidv4(),
        name: values.name,
        description: values.description,
        reward_type: values.rewardType === "membership-extension" ? "membership_extension" : values.rewardType,
        reward_value: values.rewardValue,
        extensionDays: values.extensionDays,
        is_active: values.isActive,
        start_date: dateToString(values.startDate) || new Date().toISOString(),
        end_date: values.endDate ? dateToString(values.endDate) : undefined,
        terms: values.terms,
        createdBy: program?.createdBy || "current-user-id",
        createdAt: program?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        // UI properties
        rewardType: values.rewardType,
        rewardValue: values.rewardValue,
        startDate: values.startDate,
        endDate: values.endDate,
        isActive: values.isActive
      };
      
      // In a real app, this would be an API call
      console.log("Referral program data:", newProgram);
      toast.success(`Referral program ${program ? "updated" : "created"} successfully`);
      onComplete();
    } catch (error) {
      console.error("Error saving referral program:", error);
      toast.error("Error saving referral program");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{program ? "Edit" : "Create"} Referral Program</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Program Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Summer Referral Program" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="rewardType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reward Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select reward type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="fixed">Fixed Amount</SelectItem>
                        <SelectItem value="percentage">Percentage Discount</SelectItem>
                        <SelectItem value="product">Free Product</SelectItem>
                        <SelectItem value="membership-extension">Membership Extension</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="rewardValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {form.watch("rewardType") === "percentage" 
                        ? "Percentage Value" 
                        : form.watch("rewardType") === "fixed" 
                          ? "Fixed Amount" 
                          : form.watch("rewardType") === "product"
                            ? "Product Value"
                            : "Reward Value"}
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        min="0"
                        step={form.watch("rewardType") === "percentage" ? "1" : "0.01"}
                        placeholder={form.watch("rewardType") === "percentage" ? "10" : "10.00"}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {form.watch("rewardType") === "membership-extension" && (
                <FormField
                  control={form.control}
                  name="extensionDays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Extension Days</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          min="1"
                          placeholder="30"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Date (Optional)</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>No end date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          disabled={(date) => date < form.watch("startDate")}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active Status</FormLabel>
                      <FormDescription>
                        Enable or disable this referral program
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the referral program..."
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="terms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Terms & Conditions (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter the terms and conditions..."
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" type="button" onClick={onComplete}>
                Cancel
              </Button>
              <Button type="submit">
                {program ? "Update" : "Create"} Program
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
});
FormDescription.displayName = "FormDescription";

export default ReferralProgramForm;
