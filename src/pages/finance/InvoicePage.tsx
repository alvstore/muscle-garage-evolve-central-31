
import { useState } from "react";
import { Container } from "@/components/ui/container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InvoiceList from "@/components/finance/InvoiceList";
import WebhookLogs from "@/components/finance/WebhookLogs";

const InvoicePage = () => {
  const [activeTab, setActiveTab] = useState("invoices");

  return (
    <Container>
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-6">Invoice Management</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="webhooks">Payment Webhooks</TabsTrigger>
          </TabsList>
          
          <TabsContent value="invoices">
            <InvoiceList />
          </TabsContent>
          
          <TabsContent value="webhooks">
            <WebhookLogs />
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
};

export default InvoicePage;
