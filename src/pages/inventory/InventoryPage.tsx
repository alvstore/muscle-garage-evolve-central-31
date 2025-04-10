
import { useState } from "react";
import { Container } from "@/components/ui/container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InventoryList from "@/components/inventory/InventoryList";
import StockTransactionsList from "@/components/inventory/StockTransactionsList";
import InventoryAlertsList from "@/components/inventory/InventoryAlertsList";
import SuppliersList from "@/components/inventory/SuppliersList";

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
            <StockTransactionsList />
          </TabsContent>
          
          <TabsContent value="alerts" className="mt-6">
            <InventoryAlertsList />
          </TabsContent>
          
          <TabsContent value="suppliers" className="mt-6">
            <SuppliersList />
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
};

export default InventoryPage;
