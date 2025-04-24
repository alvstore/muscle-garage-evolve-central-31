
import { useState } from "react";
import { Container } from "@/components/ui/container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MemberInvoiceList from "@/components/finance/MemberInvoiceList";
import WebhookLogs from "@/components/finance/WebhookLogs";
import { useAuth } from "@/hooks/use-auth";
import EnhancedInvoiceList from "@/components/finance/invoice/EnhancedInvoiceList";

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
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="paid">Paid</TabsTrigger>
            <TabsTrigger value="overdue">Overdue</TabsTrigger>
            <TabsTrigger value="webhooks">Payment Webhooks</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all-invoices">
            <EnhancedInvoiceList 
              readonly={false} 
              allowPayment={true}
              allowDownload={true}
              filter="all"
            />
          </TabsContent>
          
          <TabsContent value="pending">
            <EnhancedInvoiceList 
              readonly={false} 
              allowPayment={true}
              allowDownload={true}
              filter="pending"
            />
          </TabsContent>
          
          <TabsContent value="paid">
            <EnhancedInvoiceList 
              readonly={false}
              allowPayment={false}
              allowDownload={true}
              filter="paid"
            />
          </TabsContent>
          
          <TabsContent value="overdue">
            <EnhancedInvoiceList 
              readonly={false}
              allowPayment={true}
              allowDownload={true}
              filter="overdue"
            />
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
