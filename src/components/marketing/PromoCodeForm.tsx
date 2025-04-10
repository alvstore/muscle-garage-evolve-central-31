
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
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { PromoCode, PromoCodeType, PromoCodeStatus } from "@/types/marketing";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

interface PromoCodeFormProps {
  promoCode?: PromoCode;
  onComplete: () => void;
}

const promoCodeSchema = z.object({
  code: z.string().min(3, { message: "Code must be at least 3 characters" }),
  description: z.string().min(5, { message: "Description must be at least 5 characters" }),
  type: z.enum(["percentage", "fixed", "free-product"]),
  value: z.coerce.number().positive({ message: "Value must be positive" }),
  minPurchaseAmount: z.coerce.number().nonnegative().optional(),
  maxDiscountAmount: z.coerce.number().nonnegative().optional(),
  startDate: z.date(),
  endDate: z.date(),
  status: z.enum(["active", "inactive", "expired", "scheduled"]),
  usageLimit: z.coerce.number().nonnegative().optional(),
  applicableToAll: z.boolean().default(true),
});

const PromoCodeForm: React.FC<PromoCodeFormProps> = ({ promoCode, onComplete }) => {
  const form = useForm<z.infer<typeof promoCodeSchema>>({
    resolver: zodResolver(promoCodeSchema),
    defaultValues: {
      code: promoCode?.code || "",
      description: promoCode?.description || "",
      type: promoCode?.type || "percentage",
      value: promoCode?.value || 10,
      minPurchaseAmount: promoCode?.minPurchaseAmount || 0,
      maxDiscountAmount: promoCode?.maxDiscountAmount || 0,
      startDate: promoCode?.startDate ? new Date(promoCode.startDate) : new Date(),
      endDate: promoCode?.endDate ? new Date(promoCode.endDate) : new Date(new Date().setDate(new Date().getDate() + 30)),
      status: promoCode?.status || "active",
      usageLimit: promoCode?.usageLimit || 0,
      applicableToAll: promoCode?.applicableProducts === undefined || promoCode.applicableProducts.includes("all"),
    },
  });

  const onSubmit = (values: z.infer<typeof promoCodeSchema>) => {
    try {
      const newPromoCode: PromoCode = {
        id: promoCode?.id || uuidv4(),
        code: values.code.toUpperCase(),
        description: values.description,
        type: values.type as PromoCodeType,
        value: values.value,
        minPurchaseAmount: values.minPurchaseAmount && values.minPurchaseAmount > 0 ? values.minPurchaseAmount : undefined,
        maxDiscountAmount: values.maxDiscountAmount && values.maxDiscountAmount > 0 ? values.maxDiscountAmount : undefined,
        startDate: values.startDate.toISOString(),
        endDate: values.endDate.toISOString(),
        status: values.status as PromoCodeStatus,
        usageLimit: values.usageLimit && values.usageLimit > 0 ? values.usageLimit : undefined,
        currentUsage: promoCode?.currentUsage || 0,
        applicableProducts: values.applicableToAll ? ["all"] : promoCode?.applicableProducts || [],
        applicableMemberships: promoCode?.applicableMemberships || ["all"],
        createdBy: promoCode?.createdBy || "current-user-id",
        createdAt: promoCode?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // In a real app, this would be an API call
      console.log("Promo code data:", newPromoCode);
      toast.success(`Promo code ${promoCode ? "updated" : "created"} successfully`);
      onComplete();
    } catch (error) {
      console.error("Error saving promo code:", error);
      toast.error("Error saving promo code");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{promoCode ? "Edit" : "Create"} Promo Code</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Promo Code</FormLabel>
                    <FormControl>
                      <Input placeholder="SALE10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select discount type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage</SelectItem>
                        <SelectItem value="fixed">Fixed Amount</SelectItem>
                        <SelectItem value="free-product">Free Product</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {form.watch("type") === "percentage" ? "Percentage Value" : "Discount Amount"}
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        min="0"
                        step={form.watch("type") === "percentage" ? "1" : "0.01"}
                        placeholder={form.watch("type") === "percentage" ? "10" : "10.00"}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="expired">Expired</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="minPurchaseAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Purchase Amount (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="maxDiscountAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum Discount Amount (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="usageLimit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Usage Limit (0 for unlimited)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        min="0"
                        placeholder="0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
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
                    <FormLabel>End Date</FormLabel>
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
                          disabled={(date) => date < form.watch("startDate")}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
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
                      placeholder="Describe the promo code..."
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
              name="applicableToAll"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Apply to all products</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      If unchecked, you'll need to specify applicable products elsewhere.
                    </p>
                  </div>
                </FormItem>
              )}
            />
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" type="button" onClick={onComplete}>
                Cancel
              </Button>
              <Button type="submit">
                {promoCode ? "Update" : "Create"} Promo Code
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PromoCodeForm;
