
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const InventoryAlertsList = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory Alerts</CardTitle>
        <CardDescription>Products that need to be restocked</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground py-8 text-center">
          Inventory alerts will be displayed here once available
        </p>
      </CardContent>
    </Card>
  );
};

export default InventoryAlertsList;
