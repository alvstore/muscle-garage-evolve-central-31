
import { useState } from "react";
import { Container } from "@/components/ui/container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InventoryList from "@/components/inventory/InventoryList";

const InventoryPage = () => {
  const [activeTab, setActiveTab] = useState("inventory");

  return (
    <Container>
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-6">Inventory Management</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="inventory">Inventory Items</TabsTrigger>
            <TabsTrigger value="transactions">Stock Transactions</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
          </TabsList>
          
          <TabsContent value="inventory" className="mt-6">
            <InventoryList />
          </TabsContent>
          
          <TabsContent value="transactions" className="mt-6">
            <div className="h-[400px] w-full bg-muted rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">Stock Transaction History (Coming Soon)</p>
            </div>
          </TabsContent>
          
          <TabsContent value="alerts" className="mt-6">
            <div className="h-[400px] w-full bg-muted rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">Inventory Alerts (Coming Soon)</p>
            </div>
          </TabsContent>
          
          <TabsContent value="suppliers" className="mt-6">
            <div className="h-[400px] w-full bg-muted rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">Supplier Management (Coming Soon)</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
};

export default InventoryPage;
