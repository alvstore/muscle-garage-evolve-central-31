
import { useState } from "react";
import { Container } from "@/components/ui/container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InvoiceList from "@/components/finance/InvoiceList";
import WebhookLogs from "@/components/finance/WebhookLogs";
import { useAuth } from "@/hooks/use-auth";

const InvoicePage = () => {
  const { user } = useAuth();
  const isMember = user?.role === "member";
  const [activeTab, setActiveTab] = useState(isMember ? "invoices" : "invoices");

  return (
    <Container>
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-6">
          {isMember ? "My Invoices" : "Invoice Management"}
        </h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            {!isMember && (
              <TabsTrigger value="webhooks">Payment Webhooks</TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="invoices">
            <InvoiceList 
              readonly={isMember} 
              allowPayment={isMember}
              allowDownload={true}
            />
          </TabsContent>
          
          {!isMember && (
            <TabsContent value="webhooks">
              <WebhookLogs />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </Container>
  );
};

export default InvoicePage;
