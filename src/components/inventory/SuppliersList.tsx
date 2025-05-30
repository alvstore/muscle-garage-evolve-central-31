
import { useState } from "react";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  Card, CardContent, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuLabel, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  SearchIcon, PlusIcon, MoreVerticalIcon, Building2Icon, 
  PhoneIcon, MailIcon, ExternalLinkIcon, PackageIcon
} from "lucide-react";
import { Supplier } from "@/types/store/inventory";
import { toast } from "sonner";

// Mock data for suppliers
const mockSuppliers: Supplier[] = [
  {
    id: "sup-1",
    name: "NutriBulk Supplements",
    contactPerson: "John Smith",
    email: "john@nutribulk.com",
    phone: "+1 (555) 123-4567",
    address: "123 Nutrition Ave, Health City, HC 12345",
    items: ["inv-1", "inv-4"],
    paymentTerms: "Net 30",
    status: "active",
    notes: "Preferred supplier for all protein supplements",
  },
  {
    id: "sup-2",
    name: "GymEquip Pro",
    contactPerson: "Emma Johnson",
    email: "sales@gymequippro.com",
    phone: "+1 (555) 987-6543",
    address: "456 Fitness Blvd, Strength Town, ST 67890",
    items: ["inv-2", "inv-5"],
    paymentTerms: "Net 45",
    status: "active",
    notes: "Equipment repairs available",
  },
  {
    id: "sup-3",
    name: "FitWear Apparel",
    contactPerson: "Michael Brown",
    email: "michael@fitwear.com",
    phone: "+1 (555) 567-8901",
    address: "789 Fashion St, Style City, SC 23456",
    items: ["inv-3"],
    paymentTerms: "COD",
    status: "active",
  },
  {
    id: "sup-4",
    name: "VitaminWorld",
    contactPerson: "Sarah Wilson",
    email: "sarah@vitaminworld.com",
    phone: "+1 (555) 234-5678",
    address: "321 Health Dr, Vitamin Valley, VV 45678",
    items: [],
    status: "inactive",
    notes: "Previous supplement supplier, discontinued due to quality issues",
  }
];

interface SupplierFormData {
  id?: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  paymentTerms: string;
  status: "active" | "inactive";
  notes: string;
}

const SuppliersList = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState<Supplier | null>(null);
  const [formData, setFormData] = useState<SupplierFormData>({
    name: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    paymentTerms: "",
    status: "active",
    notes: "",
  });

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = 
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || supplier.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleStatusChange = (checked: boolean) => {
    setFormData({ ...formData, status: checked ? "active" : "inactive" });
  };

  const handleAddSupplier = () => {
    setCurrentSupplier(null);
    setFormData({
      name: "",
      contactPerson: "",
      email: "",
      phone: "",
      address: "",
      paymentTerms: "",
      status: "active",
      notes: "",
    });
    setIsFormOpen(true);
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setCurrentSupplier(supplier);
    setFormData({
      id: supplier.id,
      name: supplier.name,
      contactPerson: supplier.contactPerson,
      email: supplier.email || "",
      phone: supplier.phone,
      address: supplier.address || "",
      paymentTerms: supplier.paymentTerms || "",
      status: supplier.status,
      notes: supplier.notes || "",
    });
    setIsFormOpen(true);
  };

  const handleViewSupplier = (supplier: Supplier) => {
    setCurrentSupplier(supplier);
    setIsViewOpen(true);
  };

  const handleSubmit = () => {
    if (formData.id) {
      // Update existing supplier
      setSuppliers(suppliers.map(s => 
        s.id === formData.id ? { ...s, ...formData, items: s.items } : s
      ));
      toast.success("Supplier updated successfully");
    } else {
      // Add new supplier
      const newSupplier: Supplier = {
        ...formData,
        id: `sup-${Date.now()}`,
        items: [], // New suppliers start with no items
      };
      setSuppliers([...suppliers, newSupplier]);
      toast.success("Supplier added successfully");
    }
    setIsFormOpen(false);
  };

  const handleToggleStatus = (supplierId: string) => {
    setSuppliers(suppliers.map(s => {
      if (s.id === supplierId) {
        const newStatus = s.status === "active" ? "inactive" : "active";
        toast.success(`Supplier marked as ${newStatus}`);
        return { ...s, status: newStatus };
      }
      return s;
    }));
  };

  // Mock function to get items for a supplier
  const getSupplierItems = (supplierId: string) => {
    // In a real app, this would fetch from your database
    const mockItems = [
      { id: "inv-1", name: "Whey Protein" },
      { id: "inv-4", name: "Pre-Workout Mix" },
      { id: "inv-2", name: "Dumbbell Set (5-30kg)" },
      { id: "inv-5", name: "Resistance Bands" },
      { id: "inv-3", name: "Muscle Garage T-Shirt" },
    ];
    
    const supplier = suppliers.find(s => s.id === supplierId);
    if (!supplier) return [];
    
    return mockItems.filter(item => supplier.items.includes(item.id));
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Building2Icon className="h-5 w-5" />
            Suppliers
          </CardTitle>
          <Button onClick={handleAddSupplier} className="flex items-center gap-1">
            <PlusIcon className="h-4 w-4" /> Add Supplier
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by name or contact person..." 
                className="pl-8" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex">
              <Button 
                variant={statusFilter === "all" ? "default" : "outline"} 
                className="rounded-r-none"
                onClick={() => setStatusFilter("all")}
              >
                All
              </Button>
              <Button 
                variant={statusFilter === "active" ? "default" : "outline"}
                className="rounded-none border-x-0"
                onClick={() => setStatusFilter("active")}
              >
                Active
              </Button>
              <Button 
                variant={statusFilter === "inactive" ? "default" : "outline"}
                className="rounded-l-none"
                onClick={() => setStatusFilter("inactive")}
              >
                Inactive
              </Button>
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact Person</TableHead>
                  <TableHead>Contact Info</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSuppliers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      No suppliers found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSuppliers.map((supplier) => (
                    <TableRow key={supplier.id}>
                      <TableCell className="font-medium">{supplier.name}</TableCell>
                      <TableCell>{supplier.contactPerson}</TableCell>
                      <TableCell>
                        <div className="flex flex-col text-sm">
                          {supplier.email && (
                            <div className="flex items-center gap-1">
                              <MailIcon className="h-3 w-3 text-gray-500" />
                              <span>{supplier.email}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <PhoneIcon className="h-3 w-3 text-gray-500" />
                            <span>{supplier.phone}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {supplier.items.length} items
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {supplier.status === "active" ? (
                          <Badge variant="outline" className="bg-green-100 text-green-800">Active</Badge>
                        ) : (
                          <Badge variant="outline" className="bg-gray-100 text-gray-800">Inactive</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVerticalIcon className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleViewSupplier(supplier)}>
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditSupplier(supplier)}>
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleStatus(supplier.id)}>
                              {supplier.status === "active" ? "Mark as Inactive" : "Mark as Active"}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Supplier Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{formData.id ? "Edit Supplier" : "Add New Supplier"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Supplier Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPerson">Contact Person *</Label>
                <Input
                  id="contactPerson"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="paymentTerms">Payment Terms</Label>
                <Input
                  id="paymentTerms"
                  name="paymentTerms"
                  value={formData.paymentTerms}
                  onChange={handleChange}
                  placeholder="e.g., Net 30"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status" className="block mb-2">Status</Label>
                <div className="flex items-center space-x-2 mt-2">
                  <Switch
                    id="status"
                    checked={formData.status === "active"}
                    onCheckedChange={handleStatusChange}
                  />
                  <Label htmlFor="status" className="mt-0">
                    {formData.status === "active" ? "Active" : "Inactive"}
                  </Label>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {formData.id ? "Update Supplier" : "Add Supplier"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Supplier Dialog */}
      {currentSupplier && (
        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Building2Icon className="h-5 w-5" />
                {currentSupplier.name}
              </DialogTitle>
              <DialogDescription>
                Supplier ID: {currentSupplier.id}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Contact Person</h3>
                  <p>{currentSupplier.contactPerson}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Status</h3>
                  <Badge variant="outline" className={`${
                    currentSupplier.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                  }`}>
                    {currentSupplier.status.charAt(0).toUpperCase() + currentSupplier.status.slice(1)}
                  </Badge>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Contact Information</h3>
                <div className="flex flex-col space-y-1">
                  {currentSupplier.email && (
                    <div className="flex items-center gap-2">
                      <MailIcon className="h-4 w-4 text-gray-500" />
                      <span>{currentSupplier.email}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <PhoneIcon className="h-4 w-4 text-gray-500" />
                    <span>{currentSupplier.phone}</span>
                  </div>
                  {currentSupplier.address && (
                    <div className="flex items-start gap-2">
                      <ExternalLinkIcon className="h-4 w-4 text-gray-500 mt-0.5" />
                      <span>{currentSupplier.address}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {currentSupplier.paymentTerms && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Payment Terms</h3>
                  <p>{currentSupplier.paymentTerms}</p>
                </div>
              )}
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Supplied Items</h3>
                {getSupplierItems(currentSupplier.id).length === 0 ? (
                  <p className="text-muted-foreground text-sm">No items from this supplier</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {getSupplierItems(currentSupplier.id).map(item => (
                      <div key={item.id} className="flex items-center gap-1 bg-blue-50 text-blue-700 py-1 px-2 rounded-full text-xs">
                        <PackageIcon className="h-3 w-3" />
                        <span>{item.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {currentSupplier.notes && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Notes</h3>
                  <p className="text-sm">{currentSupplier.notes}</p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button onClick={() => setIsViewOpen(false)}>Close</Button>
              <Button variant="outline" onClick={() => {
                setIsViewOpen(false);
                handleEditSupplier(currentSupplier);
              }}>
                Edit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default SuppliersList;
