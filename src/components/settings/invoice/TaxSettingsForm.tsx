import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Plus } from 'lucide-react';

// Tax Profile Schema
const taxProfileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  hsnCode: z.string().min(1, 'HSN code is required'),
  cgst: z.number().min(0, 'Must be 0 or more').max(100, 'Must be 100 or less'),
  sgst: z.number().min(0, 'Must be 0 or more').max(100, 'Must be 100 or less'),
  igst: z.number().min(0, 'Must be 0 or more').max(100, 'Must be 100 or less'),
  isDefault: z.boolean().default(false)
});

type TaxProfile = z.infer<typeof taxProfileSchema>;

const columns: ColumnDef<TaxProfile>[] = [
  {
    accessorKey: 'name',
    header: 'Name'
  },
  {
    accessorKey: 'hsnCode',
    header: 'HSN Code'
  },
  {
    accessorKey: 'cgst',
    header: 'CGST %'
  },
  {
    accessorKey: 'sgst',
    header: 'SGST %'
  },
  {
    accessorKey: 'igst',
    header: 'IGST %'
  },
  {
    accessorKey: 'isDefault',
    header: 'Default',
    cell: ({ row }) => row.getValue('isDefault') ? 'Yes' : 'No'
  }
];

const dummyData: TaxProfile[] = [
  {
    name: 'Standard GST',
    hsnCode: '998599',
    cgst: 9,
    sgst: 9,
    igst: 18,
    isDefault: true
  },
  {
    name: 'Low GST',
    hsnCode: '998596',
    cgst: 6,
    sgst: 6,
    igst: 12,
    isDefault: false
  }
];

export function TaxSettingsForm() {
  const form = useForm<TaxProfile>({
    resolver: zodResolver(taxProfileSchema),
    defaultValues: {
      name: '',
      hsnCode: '',
      cgst: 0,
      sgst: 0,
      igst: 0,
      isDefault: false
    }
  });

  function onSubmit(data: TaxProfile) {
    console.log(data);
    // TODO: Save to database
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tax Profiles</CardTitle>
          <CardDescription>Manage GST rates and HSN codes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Tax Profile
            </Button>
          </div>
          <DataTable columns={columns} data={dummyData} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add/Edit Tax Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., Standard GST" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hsnCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>HSN/SAC Code</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., 998599" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="cgst"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CGST %</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sgst"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SGST %</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="igst"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>IGST %</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit">Save Tax Profile</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
