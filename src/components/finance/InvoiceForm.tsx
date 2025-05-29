
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { InvoiceFormHeader } from "@/components/finance/invoice/InvoiceFormHeader";
import { InvoiceMemberFields } from "@/components/finance/invoice/InvoiceMemberFields";
import { InvoiceDetailsFields } from "@/components/finance/invoice/InvoiceDetailsFields";
import { InvoiceItemList } from "@/components/finance/invoice/InvoiceItemList";
import { v4 as uuidv4 } from 'uuid';
import { Invoice, InvoiceItem, InvoiceStatus } from "@/types/finance";

interface InvoiceFormProps {
  invoice: Invoice | null;
  onComplete: (invoice?: Invoice) => void;
  onCancel: () => void;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({
  invoice = null,
  onComplete,
  onCancel
}) => {
  const [invoiceData, setInvoiceData] = useState<Invoice>({
    id: invoice?.id || uuidv4(),
    member_id: invoice?.member_id || '',
    member_name: invoice?.member_name || '',
    description: invoice?.description || '',
    amount: invoice?.amount || 0,
    status: invoice?.status || 'pending',
    due_date: invoice?.due_date || new Date().toISOString().split('T')[0],
    payment_method: invoice?.payment_method || 'cash',
    items: invoice?.items || [{
      id: uuidv4(),
      name: 'Service',
      description: 'Default service item',
      quantity: 1,
      price: 100,
      total: 100
    }],
    created_at: invoice?.created_at || new Date().toISOString()
  });

  useEffect(() => {
    if (invoice) {
      setInvoiceData(invoice);
    }
  }, [invoice]);

  const handleAddItem = () => {
    const newItem: InvoiceItem = {
      id: uuidv4(),
      name: 'New Item',
      description: 'Item description',
      quantity: 1,
      price: 0,
      total: 0
    };
    setInvoiceData(prev => ({
      ...prev,
      items: [...(prev.items || []), newItem],
    }));
  };

  const handleUpdateItem = (id: string, field: string, value: any) => {
    setInvoiceData(prev => ({
      ...prev,
      items: prev.items?.map(item =>
        item.id === id ? { 
          ...item, 
          [field]: value,
          // Update total when price or quantity changes
          ...(field === 'price' || field === 'quantity' ? {
            total: field === 'price' ? value * item.quantity : item.quantity * value
          } : {})
        } : item
      ) || [],
    }));
  };

  const handleRemoveItem = (id: string) => {
    setInvoiceData(prev => ({
      ...prev,
      items: prev.items?.filter(item => item.id !== id) || [],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(invoiceData);
  };

  // Modified updateField to accept either event or direct value
  const updateField = (field: string, value: any) => {
    setInvoiceData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Create a handler for input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateField(name, value);
  };

  const onSelectMember = (id: string, name: string) => {
    updateField('member_id', id);
    updateField('member_name', name);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <InvoiceFormHeader isEdit={!!invoice} />
      
      <Card>
        <CardContent className="space-y-4">
          <InvoiceMemberFields
            member_id={invoiceData.member_id || ''}
            member_name={invoiceData.member_name || ''}
            onChange={handleInputChange}
            onSelectMember={onSelectMember}
          />
          
          <InvoiceDetailsFields
            description={invoiceData.description}
            amount={invoiceData.amount}
            status={invoiceData.status as InvoiceStatus}
            dueDate={invoiceData.due_date}
            paymentMethod={invoiceData.payment_method}
            onChange={handleInputChange}
            onStatusChange={(value) => updateField("status", value)}
            onPaymentMethodChange={(value) => updateField("payment_method", value)}
          />
          
          <InvoiceItemList
            items={invoiceData.items || []}
            onAdd={handleAddItem}
            onUpdate={handleUpdateItem}
            onRemove={handleRemoveItem}
          />
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {invoice ? 'Update Invoice' : 'Create Invoice'}
        </Button>
      </div>
    </form>
  );
};

export default InvoiceForm;
