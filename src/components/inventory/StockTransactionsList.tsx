import { useState } from "react";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  Card, CardContent, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { SearchIcon, PlusIcon, ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { InventoryTransaction, StockTransactionType } from "@/types/store/inventory";
import { format } from "date-fns";
import { toast } from "sonner";

// Mock data for transactions
const mockTransactions: InventoryTransaction[] = [
  {
    id: "tx-1",
    itemId: "inv-1",
    item_id: "inv-1",
    itemName: "Whey Protein",
    item_name: "Whey Protein",
    type: "stock-in",
    quantity: 10,
    previousQuantity: 15,
    previous_quantity: 15,
    newQuantity: 25,
    new_quantity: 25,
    notes: "Regular monthly restock",
    conductedBy: "staff-1",
    conducted_by: "staff-1",
    conductedAt: "2023-06-01T10:00:00Z",
    conducted_at: "2023-06-01T10:00:00Z",
    batchNumber: "WP-B123",
    batch_number: "WP-B123",
    date: "2023-06-01T10:00:00Z"
  },
  {
    id: "tx-2",
    itemId: "inv-4",
    item_id: "inv-4",
    itemName: "Pre-Workout Mix",
    item_name: "Pre-Workout Mix",
    type: "stock-out",
    quantity: 2,
    previousQuantity: 10,
    previous_quantity: 10,
    newQuantity: 8,
    new_quantity: 8,
    notes: "Sold to customer",
    conductedBy: "staff-2",
    conducted_by: "staff-2",
    conductedAt: "2023-05-20T13:15:00Z",
    conducted_at: "2023-05-20T13:15:00Z",
    relatedInvoiceId: "inv-124",
    related_invoice_id: "inv-124",
    date: "2023-05-20T13:15:00Z"
  },
  {
    id: "tx-3",
    itemId: "inv-2",
    item_id: "inv-2",
    itemName: "Dumbbell Set (5-30kg)",
    item_name: "Dumbbell Set (5-30kg)",
    type: "damaged",
    quantity: 1,
    previousQuantity: 4,
    previous_quantity: 4,
    newQuantity: 3,
    new_quantity: 3,
    notes: "One set damaged during delivery",
    conductedBy: "staff-1",
    conducted_by: "staff-1",
    conductedAt: "2023-05-15T14:00:00Z",
    conducted_at: "2023-05-15T14:00:00Z",
    date: "2023-05-15T14:00:00Z"
  },
  {
    id: "tx-4",
    itemId: "inv-5",
    item_id: "inv-5",
    itemName: "Resistance Bands",
    item_name: "Resistance Bands",
    type: "stock-out",
    quantity: 5,
    previousQuantity: 5,
    previous_quantity: 5,
    newQuantity: 0,
    new_quantity: 0,
    notes: "Last items sold",
    conductedBy: "staff-3",
    conducted_by: "staff-3",
    conductedAt: "2023-06-05T16:45:00Z",
    conducted_at: "2023-06-05T16:45:00Z",
    relatedInvoiceId: "inv-126",
    related_invoice_id: "inv-126",
    date: "2023-06-05T16:45:00Z"
  },
  {
    id: "tx-5",
    itemId: "inv-1",
    item_id: "inv-1",
    itemName: "Whey Protein",
    item_name: "Whey Protein",
    type: "return",
    quantity: 1,
    previousQuantity: 24,
    previous_quantity: 24,
    newQuantity: 25,
    new_quantity: 25,
    notes: "Customer return - unopened",
    conductedBy: "staff-2",
    conducted_by: "staff-2",
    conductedAt: "2023-06-03T11:30:00Z",
    conducted_at: "2023-06-03T11:30:00Z",
    relatedInvoiceId: "inv-123",
    related_invoice_id: "inv-123",
    date: "2023-06-03T11:30:00Z"
  }
];

interface TransactionFormData {
  itemId: string;
  itemName: string;
  type: StockTransactionType;
  quantity: number;
  notes?: string;
  batchNumber?: string;
  relatedInvoiceId?: string;
}

const StockTransactionsList = () => {
  const [transactions, setTransactions] = useState<InventoryTransaction[]>(mockTransactions);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState<TransactionFormData>({
    itemId: "",
    itemName: "",
    type: "stock-in",
    quantity: 1,
    notes: "",
  });

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = (tx.itemName || tx.item_name || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || tx.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: parseInt(value, 10) || 0 });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleAddTransaction = () => {
    // In a real app, you would call an API to add a transaction
    // For this demo, we'll just add it to our local state
    
    const previousQuantity = 20; // This would come from your inventory API
    const newQuantity = formData.type === "stock-in" || formData.type === "return" 
      ? previousQuantity + formData.quantity 
      : previousQuantity - formData.quantity;
    
    const newTransaction: InventoryTransaction = {
      id: `tx-${Date.now()}`,
      item_id: formData.itemId || `item-${Date.now()}`,
      itemId: formData.itemId || `item-${Date.now()}`,
      item_name: formData.itemName,
      itemName: formData.itemName,
      type: formData.type,
      quantity: formData.quantity,
      previous_quantity: previousQuantity,
      previousQuantity: previousQuantity,
      new_quantity: newQuantity,
      newQuantity: newQuantity,
      notes: formData.notes,
      batch_number: formData.batchNumber,
      batchNumber: formData.batchNumber,
      related_invoice_id: formData.relatedInvoiceId,
      relatedInvoiceId: formData.relatedInvoiceId,
      conducted_by: "current-user", // In a real app, this would be the logged-in user
      conductedBy: "current-user",
      conducted_at: new Date().toISOString(),
      conductedAt: new Date().toISOString(),
      date: new Date().toISOString(), // Required by type
    };
    
    setTransactions([newTransaction, ...transactions]);
    setIsFormOpen(false);
    toast.success("Transaction recorded successfully");
    
    // Reset form
    setFormData({
      itemId: "",
      itemName: "",
      type: "stock-in",
      quantity: 1,
      notes: "",
    });
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case "stock-in":
        return <ArrowUpIcon className="h-4 w-4 text-green-500" />;
      case "stock-out":
        return <ArrowDownIcon className="h-4 w-4 text-red-500" />;
      case "return":
        return <ArrowUpIcon className="h-4 w-4 text-blue-500" />;
      case "damaged":
        return <ArrowDownIcon className="h-4 w-4 text-orange-500" />;
      case "adjustment":
        return <ArrowUpIcon className="h-4 w-4 text-purple-500" />;
      default:
        return null;
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch(type) {
      case "stock-in":
        return "bg-green-100 text-green-800";
      case "stock-out":
        return "bg-red-100 text-red-800";
      case "return":
        return "bg-blue-100 text-blue-800";
      case "damaged":
        return "bg-orange-100 text-orange-800";
      case "adjustment":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Stock Transactions</CardTitle>
          <Button onClick={() => setIsFormOpen(true)} className="flex items-center gap-1">
            <PlusIcon className="h-4 w-4" /> Add Transaction
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by item name..." 
                className="pl-8" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="stock-in">Stock In</SelectItem>
                  <SelectItem value="stock-out">Stock Out</SelectItem>
                  <SelectItem value="return">Return</SelectItem>
                  <SelectItem value="damaged">Damaged</SelectItem>
                  <SelectItem value="adjustment">Adjustment</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Previous Qty</TableHead>
                  <TableHead>New Qty</TableHead>
                  <TableHead>Conducted By</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                      No transactions found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell>{format(new Date(tx.conductedAt || tx.conducted_at || tx.date), "MMM d, yyyy h:mm a")}</TableCell>
                      <TableCell className="font-medium">{tx.itemName || tx.item_name}</TableCell>
                      <TableCell>
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeBadgeColor(tx.type)}`}>
                          {getTypeIcon(tx.type)}
                          <span className="ml-1 capitalize">
                            {tx.type.replace('-', ' ')}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{tx.quantity}</TableCell>
                      <TableCell>{tx.previousQuantity || tx.previous_quantity}</TableCell>
                      <TableCell>{tx.newQuantity || tx.new_quantity}</TableCell>
                      <TableCell>Staff #{(tx.conductedBy || tx.conducted_by || "").split('-')[1]}</TableCell>
                      <TableCell>
                        <span className="line-clamp-1">{tx.notes || '-'}</span>
                        {(tx.relatedInvoiceId || tx.related_invoice_id) && (
                          <div className="text-xs text-blue-600">
                            Invoice: {tx.relatedInvoiceId || tx.related_invoice_id}
                          </div>
                        )}
                        {(tx.batchNumber || tx.batch_number) && (
                          <div className="text-xs text-gray-500">
                            Batch: {tx.batchNumber || tx.batch_number}
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

      {/* Transaction Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Stock Transaction</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="itemName" className="text-right">
                Item Name
              </Label>
              <Input
                id="itemName"
                name="itemName"
                value={formData.itemName}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Transaction Type
              </Label>
              <Select 
                name="type" 
                value={formData.type} 
                onValueChange={(value) => handleSelectChange("type", value as StockTransactionType)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stock-in">Stock In</SelectItem>
                  <SelectItem value="stock-out">Stock Out</SelectItem>
                  <SelectItem value="return">Return</SelectItem>
                  <SelectItem value="damaged">Damaged</SelectItem>
                  <SelectItem value="adjustment">Adjustment</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">
                Quantity
              </Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={handleNumberChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">
                Notes
              </Label>
              <Input
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            
            {(formData.type === "stock-in") && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="batchNumber" className="text-right">
                  Batch Number
                </Label>
                <Input
                  id="batchNumber"
                  name="batchNumber"
                  value={formData.batchNumber || ""}
                  onChange={handleChange}
                  className="col-span-3"
                />
              </div>
            )}
            
            {(formData.type === "stock-out" || formData.type === "return") && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="relatedInvoiceId" className="text-right">
                  Invoice ID
                </Label>
                <Input
                  id="relatedInvoiceId"
                  name="relatedInvoiceId"
                  value={formData.relatedInvoiceId || ""}
                  onChange={handleChange}
                  className="col-span-3"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddTransaction}>Save Transaction</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default StockTransactionsList;
