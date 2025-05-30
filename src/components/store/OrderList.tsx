
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Order, OrderStatus } from '@/types/features/store/store';
import { 
  Package,
  Search,
  Filter,
  Download,
  ArrowDownUp,
  Eye,
  Printer,
  XCircle
} from 'lucide-react';
import { toast } from 'sonner';

// Mock function to fetch orders
const fetchOrders = async (): Promise<Order[]> => {
  // In a real app, this would be an API call
  return [
    {
      id: "order1",
      memberId: "member1",
      customerName: "John Doe",
      customerEmail: "john@example.com",
      customerPhone: "555-1234",
      items: [
        {
          productId: "prod1",
          product: {
            id: "prod1",
            name: "Whey Protein",
            description: "Premium whey protein isolate",
            price: 49.99,
            category: "supplement",
            status: "in-stock",
            stock: 25,
            sku: "WPI-100",
            images: ["/placeholder.svg"],
            featured: false,
            createdAt: "2023-01-15T00:00:00Z"
          },
          quantity: 2,
          price: 49.99
        }
      ],
      subtotal: 99.98,
      tax: 8.00,
      total: 107.98,
      status: "completed",
      paymentMethod: "card",
      paymentStatus: "paid",
      createdAt: "2023-06-15T14:30:00Z",
      completedAt: "2023-06-15T15:05:00Z"
    },
    {
      id: "order2",
      memberId: "member2",
      customerName: "Jane Smith",
      customerEmail: "jane@example.com",
      items: [
        {
          productId: "prod2",
          product: {
            id: "prod2",
            name: "Resistance Band Set",
            description: "Set of 5 resistance bands",
            price: 29.99,
            category: "equipment",
            status: "in-stock",
            stock: 15,
            sku: "RBS-101",
            images: ["/placeholder.svg"],
            featured: true,
            createdAt: "2023-02-10T00:00:00Z"
          },
          quantity: 1,
          price: 29.99
        }
      ],
      subtotal: 29.99,
      tax: 2.40,
      total: 32.39,
      status: "processing",
      paymentMethod: "cash",
      paymentStatus: "paid",
      createdAt: "2023-06-16T10:15:00Z"
    },
    {
      id: "order3",
      customerName: "Michael Johnson",
      customerPhone: "555-5678",
      items: [
        {
          productId: "prod3",
          product: {
            id: "prod3",
            name: "Gym T-Shirt",
            description: "High-quality gym t-shirt",
            price: 24.99,
            category: "apparel",
            status: "in-stock",
            stock: 30,
            sku: "GTS-102",
            images: ["/placeholder.svg"],
            featured: false,
            createdAt: "2023-03-05T00:00:00Z"
          },
          quantity: 3,
          price: 24.99
        }
      ],
      subtotal: 74.97,
      tax: 6.00,
      total: 80.97,
      status: "pending",
      paymentMethod: "bank-transfer",
      paymentStatus: "pending",
      createdAt: "2023-06-17T16:45:00Z"
    }
  ];
};

const OrderList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders,
  });
  
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      case 'processing':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Processing</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelled</Badge>;
      case 'refunded':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Refunded</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Paid</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      case 'failed':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Failed</Badge>;
      case 'refunded':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Refunded</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const handleViewOrder = (orderId: string) => {
    // In a real app, this would navigate to the order detail page
    toast.info(`Viewing order details for Order #${orderId}`);
  };
  
  const handlePrintOrder = (orderId: string) => {
    toast.info(`Printing invoice for Order #${orderId}`);
  };
  
  const handleCancelOrder = (orderId: string) => {
    toast.success(`Order #${orderId} has been cancelled`);
  };
  
  const filteredOrders = orders?.filter(order => {
    // Filter by search term
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.customerEmail && order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Filter by status
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <CardTitle className="text-2xl">Orders</CardTitle>
            <CardDescription>Manage store orders</CardDescription>
          </div>
          <div className="mt-2 sm:mt-0">
            <Button variant="outline" size="sm" className="mr-2">
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-2 sm:space-y-0">
          <div className="w-full sm:w-auto flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <div className="relative w-full sm:w-[300px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-60">
            <p>Loading orders...</p>
          </div>
        ) : filteredOrders && filteredOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div className="font-medium">{order.id}</div>
                    </TableCell>
                    <TableCell>
                      <div>{order.customerName}</div>
                      <div className="text-sm text-muted-foreground">
                        {order.customerEmail || "No email"}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {format(parseISO(order.createdAt), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ${order.total.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(order.status)}
                    </TableCell>
                    <TableCell>
                      {getPaymentStatusBadge(order.paymentStatus)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-1">
                        <Button variant="ghost" size="icon" onClick={() => handleViewOrder(order.id)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handlePrintOrder(order.id)}>
                          <Printer className="h-4 w-4" />
                        </Button>
                        {order.status !== 'completed' && order.status !== 'cancelled' && (
                          <Button variant="ghost" size="icon" onClick={() => handleCancelOrder(order.id)}>
                            <XCircle className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-60">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No orders found</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {searchTerm || statusFilter !== 'all' 
                ? "Try adjusting your search or filter settings." 
                : "There are no orders in the system yet."}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderList;
