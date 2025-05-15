import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useToast } from '@/hooks/use-toast';
import { useBranch } from '@/hooks/use-branch';
import { supabase } from '@/integrations/supabase/client';
import { InvoiceItem } from '@/types/invoice';

const invoiceFormSchema = z.object({
  member_id: z.string().min(1, {
    message: "Please select a member.",
  }),
  issue_date: z.date(),
  due_date: z.date(),
  status: z.enum(['draft', 'pending', 'paid', 'overdue', 'void']),
  notes: z.string().optional(),
  items: z.array(
    z.object({
      description: z.string().min(1, {
        message: "Description is required.",
      }),
      quantity: z.number().min(1, {
        message: "Quantity must be at least 1.",
      }),
      unit_price: z.number().min(0, {
        message: "Unit price must be at least 0.",
      }),
    })
  ).optional(),
  total_amount: z.number().optional(),
  branch_id: z.string().optional(),
  invoice_number: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
})

export const useInvoiceForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { currentBranch } = useBranch();
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);

  type InvoiceFormType = z.infer<typeof invoiceFormSchema>

  const form = useForm<InvoiceFormType>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      member_id: '',
      issue_date: new Date(),
      due_date: new Date(),
      status: 'draft',
      notes: '',
      items: [],
      total_amount: 0,
      branch_id: currentBranch?.id,
      invoice_number: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  });

  const onSubmit = async (values: InvoiceFormType) => {
    setIsSubmitting(true);
    try {
      const adaptedValues = adaptInvoiceToServerFormat(values);
      const { data, error } = await supabase
        .from('invoices')
        .insert([adaptedValues])
        .select();

      if (error) {
        console.error('Error creating invoice:', error);
        toast({
          title: 'Error',
          description: 'Failed to create invoice',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Success',
          description: 'Invoice created successfully',
        });
        form.reset();
      }
    } catch (error) {
      console.error('Unexpected error creating invoice:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const adaptInvoiceToServerFormat = (invoice: any) => {
    return {
      member_id: invoice.member_id,
      issue_date: invoice.issue_date.toISOString(),
      due_date: invoice.due_date.toISOString(),
      status: invoice.status,
      notes: invoice.notes,
      items: invoice.items,
      total_amount: invoice.total_amount,
      branch_id: currentBranch?.id,
      invoice_number: invoice.invoice_number,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  };

  return { form, onSubmit, isSubmitting, invoiceItems, setInvoiceItems };
};
