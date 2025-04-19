
import { useState } from "react";
import { Container } from "@/components/ui/container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TransactionList from "@/components/finance/TransactionList";
import WebhookLogs from "@/components/finance/WebhookLogs";

const TransactionPage = () => {
  const [activeTab, setActiveTab] = useState("transactions");

  return (
    <Container>
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-6">Financial Transactions</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="transactions">All Transactions</TabsTrigger>
            <TabsTrigger value="income">Income</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="webhook-transactions">Webhook Transactions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="transactions">
            <TransactionList />
          </TabsContent>
          
          <TabsContent value="income">
            <TransactionList transactionType="income" />
          </TabsContent>
          
          <TabsContent value="expenses">
            <TransactionList transactionType="expense" />
          </TabsContent>
          
          <TabsContent value="webhook-transactions">
            <div className="space-y-6">
              <p className="text-muted-foreground">
                These transactions were automatically created or updated by Razorpay webhooks.
              </p>
              <TransactionList webhookOnly={true} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
};

export default TransactionPage;
