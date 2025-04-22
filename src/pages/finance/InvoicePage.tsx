
import { useState } from "react";
import { Container } from "@/components/ui/container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InvoiceList from "@/components/finance/InvoiceList";
import MemberInvoiceList from "@/components/finance/MemberInvoiceList";
import WebhookLogs from "@/components/finance/WebhookLogs";
import { useAuth } from "@/hooks/use-auth";

const InvoicePage = () => {
  const { user } = useAuth();
  const isMember = user?.role === "member";
  const [activeTab, setActiveTab] = useState(isMember ? "invoices" : "all-invoices");

  if (isMember) {
    return (
      <Container>
        <div className="py-6">
          <h1 className="text-2xl font-bold mb-6">My Invoices</h1>
          <MemberInvoiceList />
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-6">Invoice Management</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all-invoices">All Invoices</TabsTrigger>
            <TabsTrigger value="invoices">Pending Invoices</TabsTrigger>
            <TabsTrigger value="paid">Paid Invoices</TabsTrigger>
            <TabsTrigger value="overdue">Overdue Invoices</TabsTrigger>
            <TabsTrigger value="webhooks">Payment Webhooks</TabsTrigger>
          </TabsList>
          
          {!isMember && (
            <TabsContent value="all-invoices">
              <InvoiceList 
                readonly={false} 
                allowPayment={true}
                allowDownload={true}
              />
            </TabsContent>
          )}
          
          <TabsContent value="invoices">
            <InvoiceList 
              readonly={isMember} 
              allowPayment={isMember}
              allowDownload={true}
            />
          </TabsContent>
          
          {!isMember && (
            <TabsContent value="paid">
              <InvoiceList 
                readonly={false}
                allowPayment={false}
                allowDownload={true}
              />
            </TabsContent>
          )}
          
          {!isMember && (
            <TabsContent value="overdue">
              <InvoiceList 
                readonly={false}
                allowPayment={true}
                allowDownload={true}
              />
            </TabsContent>
          )}
          
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
