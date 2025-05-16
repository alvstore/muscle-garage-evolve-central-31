import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Invoice } from '@/types';
import React from 'react';

export interface InvoiceFormDialogProps {
  invoice?: Invoice | null;
  onSave: (invoice: Partial<Invoice>) => Promise<void>;
  onCancel: () => void;
}

const formSchema = z.object({
  invoiceNumber: z.string().min(3, {
    message: "Invoice number must be at least 3 characters.",
  }),
  amount: z.number().min(0, {
    message: "Amount must be a positive number.",
  }),
  dueDate: z.date(),
  status: z.enum(["pending", "paid", "overdue"]),
});

const InvoiceFormDialog: React.FC<InvoiceFormDialogProps> = ({ invoice, onSave, onCancel }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      invoiceNumber: invoice?.invoiceNumber || "",
      amount: invoice?.amount || 0,
      dueDate: invoice?.dueDate ? new Date(invoice.dueDate) : new Date(),
      status: invoice?.status || "pending",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Here, you would typically call your API to save the invoice data.
    // For this example, we'll just log the values to the console.
    console.log(values);
    await onSave(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <DialogHeader>
          <DialogTitle>
            {invoice ? "Edit Invoice" : "Create New Invoice"}
          </DialogTitle>
          <DialogDescription>
            {invoice
              ? "Make changes to your invoice here. Click save when you're done."
              : "Create a new invoice here. Click save when you're done."}
          </DialogDescription>
        </DialogHeader>
        <FormField
          control={form.control}
          name="invoiceNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Invoice Number</FormLabel>
              <FormControl>
                <Input placeholder="INV-0001" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input type="number" placeholder="100.00" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Due Date</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  {...field}
                  value={field.value ? field.value.toISOString().split('T')[0] : ''}
                  onChange={(e) => field.onChange(new Date(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default InvoiceFormDialog;
