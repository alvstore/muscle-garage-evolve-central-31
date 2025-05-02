
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useInventoryAlerts } from '@/hooks/use-stats';
import { AlertTriangle, Package } from 'lucide-react';

const InventoryAlertsList: React.FC = () => {
  const { alerts, isLoading, error } = useInventoryAlerts();

  const getStockBadge = (status: string) => {
    switch (status) {
      case 'out_of_stock':
        return <Badge variant="destructive">Out of Stock</Badge>;
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>;
      case 'low':
        return <Badge variant="outline" className="text-amber-500 border-amber-500">Low Stock</Badge>;
      default:
        return <Badge variant="outline">Normal</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-medium flex items-center">
              <Package className="h-5 w-5 mr-2" /> Inventory Alerts
            </CardTitle>
            <CardDescription>Items that need attention</CardDescription>
          </div>
          {alerts && alerts.length > 0 && (
            <Badge variant="destructive" className="flex items-center">
              <AlertTriangle className="h-3 w-3 mr-1" /> {alerts.length} alerts
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex justify-between">
                <Skeleton className="h-5 w-[200px]" />
                <Skeleton className="h-5 w-[100px]" />
              </div>
            ))}
          </div>
        ) : error ? (
          <p className="text-destructive">Error loading inventory alerts</p>
        ) : alerts.length === 0 ? (
          <div className="text-center py-6">
            <Package className="h-8 w-8 mx-auto text-muted-foreground" />
            <p className="mt-2 text-muted-foreground">All inventory levels are normal</p>
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.slice(0, 5).map((alert) => (
              <div key={alert.id} className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{alert.name}</h3>
                  <p className="text-xs text-muted-foreground">{alert.quantity} in stock / {alert.reorder_level} minimum</p>
                </div>
                {getStockBadge(alert.stock_status)}
              </div>
            ))}
            {alerts.length > 5 && (
              <p className="text-xs text-muted-foreground text-center pt-2">
                + {alerts.length - 5} more items need attention
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InventoryAlertsList;
