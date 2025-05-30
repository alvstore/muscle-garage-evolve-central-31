import { useState } from "react";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  Card, CardContent, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { 
  AlertCircleIcon, CheckCircleIcon, MinusCircleIcon, 
  PackageIcon, CalendarIcon
} from "lucide-react";
import { InventoryAlert } from "@/types/store/inventory";
import { format } from "date-fns";
import { toast } from "sonner";

// Mock data for inventory alerts
const mockAlerts: InventoryAlert[] = [
  {
    id: "alert-1",
    item_id: "inv-2",
    itemId: "inv-2",
    name: "Dumbbell Set (5-30kg)",
    itemName: "Dumbbell Set (5-30kg)",
    type: "low-stock",
    message: "Item quantity (3) is below the reorder level (5)",
    status: "active",
    created_at: "2023-05-15T14:00:00Z",
    createdAt: "2023-05-15T14:00:00Z",
    quantity: 3,
    reorder_level: 5,
    reorderLevel: 5,
    stock_status: "low-stock",
    is_low_stock: true,
    isLowStock: true,
    stockStatus: "low-stock"
  },
  {
    id: "alert-2",
    item_id: "inv-4",
    itemId: "inv-4",
    name: "Pre-Workout Mix",
    itemName: "Pre-Workout Mix",
    type: "low-stock",
    message: "Item quantity (8) is below the reorder level (10)",
    status: "acknowledged",
    created_at: "2023-05-20T13:15:00Z",
    createdAt: "2023-05-20T13:15:00Z",
    acknowledgedBy: "staff-1",
    acknowledgedAt: "2023-05-21T09:00:00Z",
    quantity: 8,
    reorder_level: 10,
    reorderLevel: 10,
    stock_status: "low-stock",
    is_low_stock: true,
    isLowStock: true,
    stockStatus: "low-stock"
  },
  {
    id: "alert-3",
    item_id: "inv-4",
    itemId: "inv-4",
    name: "Pre-Workout Mix",
    itemName: "Pre-Workout Mix",
    type: "expiring-soon",
    message: "Item is expiring in 30 days (2023-08-01)",
    status: "active",
    created_at: "2023-07-01T08:00:00Z",
    createdAt: "2023-07-01T08:00:00Z",
    quantity: 8,
    reorder_level: 10,
    reorderLevel: 10,
    stock_status: "ok",
    is_low_stock: false,
    isLowStock: false,
    stockStatus: "ok"
  },
  {
    id: "alert-4",
    item_id: "inv-5",
    itemId: "inv-5",
    name: "Resistance Bands",
    itemName: "Resistance Bands",
    type: "out-of-stock",
    message: "Item is out of stock (quantity: 0)",
    status: "resolved",
    created_at: "2023-06-05T16:45:00Z",
    createdAt: "2023-06-05T16:45:00Z",
    acknowledgedBy: "staff-3",
    acknowledgedAt: "2023-06-06T09:30:00Z",
    resolvedBy: "staff-3",
    resolvedAt: "2023-06-15T14:00:00Z",
    quantity: 0,
    reorder_level: 10,
    reorderLevel: 10,
    stock_status: "out-of-stock",
    is_low_stock: true,
    isLowStock: true,
    stockStatus: "out-of-stock"
  },
  {
    id: "alert-5",
    item_id: "inv-6",
    itemId: "inv-6",
    name: "Protein Bars",
    itemName: "Protein Bars",
    type: "expired",
    message: "Item has expired on 2023-06-30",
    status: "active",
    created_at: "2023-07-01T08:00:00Z",
    createdAt: "2023-07-01T08:00:00Z",
    quantity: 15,
    reorder_level: 20,
    reorderLevel: 20,
    stock_status: "low-stock",
    is_low_stock: true,
    isLowStock: true,
    stockStatus: "low-stock"
  }
];

const InventoryAlertsList = () => {
  const [alerts, setAlerts] = useState<InventoryAlert[]>(mockAlerts);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("active");

  const filteredAlerts = alerts.filter(alert => {
    const matchesType = typeFilter === "all" || alert.type === typeFilter;
    const matchesStatus = statusFilter === "all" || alert.status === statusFilter;
    return matchesType && matchesStatus;
  });

  const handleAcknowledgeAlert = (alertId: string) => {
    setAlerts(alerts.map(alert => {
      if (alert.id === alertId) {
        return {
          ...alert,
          status: "acknowledged",
          acknowledgedBy: "current-user", // This would be the logged-in user in a real app
          acknowledgedAt: new Date().toISOString(),
        };
      }
      return alert;
    }));
    toast.success("Alert acknowledged");
  };

  const handleResolveAlert = (alertId: string) => {
    setAlerts(alerts.map(alert => {
      if (alert.id === alertId) {
        return {
          ...alert,
          status: "resolved",
          resolvedBy: "current-user", // This would be the logged-in user in a real app
          resolvedAt: new Date().toISOString(),
        };
      }
      return alert;
    }));
    toast.success("Alert marked as resolved");
  };

  const getAlertTypeIcon = (type: string) => {
    switch(type) {
      case "low-stock":
        return <MinusCircleIcon className="h-4 w-4 text-yellow-500" />;
      case "out-of-stock":
        return <AlertCircleIcon className="h-4 w-4 text-red-500" />;
      case "expiring-soon":
        return <CalendarIcon className="h-4 w-4 text-orange-500" />;
      case "expired":
        return <AlertCircleIcon className="h-4 w-4 text-purple-500" />;
      default:
        return null;
    }
  };

  const getAlertStatusBadge = (status: string) => {
    switch(status) {
      case "active":
        return <Badge variant="outline" className="bg-red-100 text-red-800">Active</Badge>;
      case "acknowledged":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Acknowledged</Badge>;
      case "resolved":
        return <Badge variant="outline" className="bg-green-100 text-green-800">Resolved</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <AlertCircleIcon className="h-5 w-5 text-red-500" />
          Inventory Alerts
        </CardTitle>
        <div className="flex gap-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Alert Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="low-stock">Low Stock</SelectItem>
              <SelectItem value="out-of-stock">Out of Stock</SelectItem>
              <SelectItem value="expiring-soon">Expiring Soon</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="acknowledged">Acknowledged</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAlerts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                    No alerts found
                  </TableCell>
                </TableRow>
              ) : (
                filteredAlerts.map((alert) => (
                  <TableRow key={alert.id}>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {getAlertTypeIcon(alert.type)}
                        <span className="capitalize">{alert.type.replace('-', ' ')}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-1">
                        <PackageIcon className="h-4 w-4 text-gray-500" />
                        {alert.itemName}
                      </div>
                    </TableCell>
                    <TableCell>{alert.message}</TableCell>
                    <TableCell>{getAlertStatusBadge(alert.status)}</TableCell>
                    <TableCell>{format(new Date(alert.createdAt), "MMM d, yyyy")}</TableCell>
                    <TableCell className="text-right">
                      {alert.status === "active" && (
                        <div className="flex justify-end gap-1">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleAcknowledgeAlert(alert.id)}
                          >
                            Acknowledge
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleResolveAlert(alert.id)}
                          >
                            Resolve
                          </Button>
                        </div>
                      )}
                      {alert.status === "acknowledged" && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleResolveAlert(alert.id)}
                        >
                          Resolve
                        </Button>
                      )}
                      {alert.status === "resolved" && (
                        <div className="flex items-center justify-end gap-1 text-sm text-green-600">
                          <CheckCircleIcon className="h-4 w-4" />
                          <span>Resolved</span>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default InventoryAlertsList;
