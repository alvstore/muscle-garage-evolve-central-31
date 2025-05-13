import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Switch } from '@/components/ui/switch';

const formSchema = z.object({
  headerLogo: z.string().url().optional(),
  footerText: z.string(),
  showPaymentQR: z.boolean(),
  showBranchDetails: z.boolean(),
  showGSTIN: z.boolean(),
  customCSS: z.string(),
  emailTemplate: z.string(),
  whatsappTemplate: z.string()
});

type FormValues = z.infer<typeof formSchema>;

export function TemplateSettingsForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      headerLogo: '',
      footerText: 'Thank you for your business!',
      showPaymentQR: true,
      showBranchDetails: true,
      showGSTIN: true,
      customCSS: '',
      emailTemplate: '',
      whatsappTemplate: ''
    }
  });

  function onSubmit(data: FormValues) {
    console.log(data);
    // TODO: Save to database
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Invoice Template Settings</CardTitle>
          <CardDescription>Customize the appearance of your invoices</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="headerLogo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Header Logo URL</FormLabel>
                    <FormControl>
                      <Input {...field} type="url" placeholder="https://example.com/logo.png" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="footerText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Footer Text</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Enter footer text" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="showPaymentQR"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between space-x-2">
                      <FormLabel>Show Payment QR</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="showBranchDetails"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between space-x-2">
                      <FormLabel>Show Branch Details</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="showGSTIN"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between space-x-2">
                      <FormLabel>Show GSTIN</FormLabel>
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
                name="customCSS"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Custom CSS</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Enter custom CSS" className="font-mono" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="emailTemplate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Template</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Enter email template" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="whatsappTemplate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>WhatsApp Template</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Enter WhatsApp template" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">Save Template Settings</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
