
import React, { useState } from 'react';
import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EnhancedInvoiceList from '@/components/finance/invoice/EnhancedInvoiceList';
import { InvoiceStatsOverview } from '@/components/finance/invoice/InvoiceStatsOverview';
import { usePermissions } from '@/hooks/use-permissions';

const InvoicePage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const { can } = usePermissions();
  
  const isReadOnly = !can('create', 'invoices');

  return (
    <Container>
      <div className="space-y-6 py-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Invoices</h1>
          <p className="text-muted-foreground">
            Create and manage invoices for gym members.
          </p>
        </div>

        <InvoiceStatsOverview />

        <Card>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="p-4">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="paid">Paid</TabsTrigger>
              <TabsTrigger value="overdue">Overdue</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="p-0 pt-4">
              <EnhancedInvoiceList 
                readOnly={isReadOnly}
                allowPayment={true}
                allowDownload={true}
                filter="all"
              />
            </TabsContent>
            
            <TabsContent value="pending" className="p-0 pt-4">
              <EnhancedInvoiceList 
                readOnly={isReadOnly}
                allowPayment={true}
                allowDownload={true}
                filter="pending"
              />
            </TabsContent>
            
            <TabsContent value="paid" className="p-0 pt-4">
              <EnhancedInvoiceList 
                readOnly={isReadOnly}
                allowPayment={true}
                allowDownload={true}
                filter="paid"
              />
            </TabsContent>
            
            <TabsContent value="overdue" className="p-0 pt-4">
              <EnhancedInvoiceList 
                readOnly={isReadOnly}
                allowPayment={true}
                allowDownload={true}
                filter="overdue"
              />
            </TabsContent>
            
            <TabsContent value="cancelled" className="p-0 pt-4">
              <EnhancedInvoiceList 
                readOnly={isReadOnly}
                allowPayment={false}
                allowDownload={true}
                filter="cancelled"
              />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </Container>
  );
};

export default InvoicePage;
