import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const formSchema = z.object({
  invoicePrefix: z.string().min(1, 'Prefix is required'),
  nextInvoiceNumber: z.number().min(1, 'Must be at least 1'),
  defaultDueDays: z.number().min(0, 'Must be 0 or more'),
  defaultCurrency: z.string().min(1, 'Currency is required'),
  defaultNotes: z.string(),
  defaultTerms: z.string()
});

type FormValues = z.infer<typeof formSchema>;

export function GeneralSettingsForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      invoicePrefix: 'INV',
      nextInvoiceNumber: 1001,
      defaultDueDays: 15,
      defaultCurrency: 'INR',
      defaultNotes: '',
      defaultTerms: ''
    }
  });

  function onSubmit(data: FormValues) {
    console.log(data);
    // TODO: Save to database
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>General Settings</CardTitle>
        <CardDescription>Configure basic invoice settings</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="invoicePrefix"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Invoice Prefix</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="INV" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nextInvoiceNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Next Invoice Number</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="defaultDueDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Default Due Days</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="defaultCurrency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Default Currency</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="INR">Indian Rupee (₹)</SelectItem>
                      <SelectItem value="USD">US Dollar ($)</SelectItem>
                      <SelectItem value="EUR">Euro (€)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="defaultNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Default Notes</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter default invoice notes" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="defaultTerms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Default Terms & Conditions</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter default terms & conditions" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Save Changes</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
