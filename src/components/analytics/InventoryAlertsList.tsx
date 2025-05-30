
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { inventoryService } from '@/services/store/inventoryService';
import { useBranch } from '@/hooks/settings/use-branches';
import { InventoryItem } from '@/types/store/inventory';
import { Loader2 } from 'lucide-react';

const InventoryAlertsList = () => {
  const [lowStockItems, setLowStockItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentBranch } = useBranch();

  useEffect(() => {
    fetchLowStockItems();
  }, [currentBranch?.id]);

  const fetchLowStockItems = async () => {
    setIsLoading(true);
    try {
      const items = await inventoryService.getLowStockItems(currentBranch?.id);
      setLowStockItems(items);
    } catch (error) {
      console.error('Error fetching low stock items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to determine stock status
  const getStockStatus = (item: InventoryItem) => {
    if (item.quantity <= 0) {
      return { label: 'Out of Stock', variant: 'destructive' };
    } else if (item.quantity <= item.reorder_level / 2) {
      return { label: 'Critical', variant: 'destructive' };
    } else if (item.quantity <= item.reorder_level) {
      return { label: 'Low', variant: 'warning' };
    } else {
      return { label: 'OK', variant: 'outline' };
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory Alerts</CardTitle>
        <CardDescription>Products that need to be restocked</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !currentBranch?.id ? (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">Please select a branch to view inventory alerts</p>
          </div>
        ) : lowStockItems.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">No low stock items found</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-center">Stock</TableHead>
                <TableHead className="text-center">Reorder Level</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lowStockItems.map((item) => {
                const status = getStockStatus(item);
                
                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell className="text-center">{item.quantity}</TableCell>
                    <TableCell className="text-center">{item.reorder_level}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant={status.variant as any}>{status.label}</Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default InventoryAlertsList;
