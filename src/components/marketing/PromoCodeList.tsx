import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tag,
  MoreVertical,
  Pencil,
  Trash2,
  Copy,
  Download,
  RefreshCw,
  PlusCircle
} from "lucide-react";
import { PromoCode, PromoCodeStatus } from "@/types/marketing";
import { stringToDate, formatDate } from "@/utils/date-utils";
import { toast } from "sonner";

// Mock data for promo codes with proper date handling
const mockPromoCodes: PromoCode[] = [
  {
    id: "1",
    code: "SUMMER25",
    description: "Summer discount 25% off all memberships",
    type: "percentage",
    value: 25,
    minPurchaseAmount: 0,
    start_date: "2023-06-01T00:00:00Z",
    end_date: "2023-08-31T23:59:59Z",
    status: "active",
    usage_limit: 100,
    current_usage: 43,
    applicable_memberships: ["all"],
    createdBy: "Admin",
    createdAt: "2023-05-15T10:00:00Z",
    // UI properties
    startDate: new Date("2023-06-01T00:00:00Z"),
    endDate: new Date("2023-08-31T23:59:59Z")
  },
  {
    id: "2",
    code: "NEWMEMBER",
    description: "New member first month 50% off",
    type: "percentage",
    value: 50,
    minPurchaseAmount: 0,
    start_date: "2023-01-01T00:00:00Z",
    end_date: "2023-12-31T23:59:59Z",
    status: "active",
    usage_limit: 0, // unlimited
    current_usage: 124,
    applicable_memberships: ["basic", "premium"],
    createdBy: "Admin",
    createdAt: "2023-01-01T00:00:00Z"
  },
  {
    id: "3",
    code: "REFER10",
    description: "$10 off for referrals",
    type: "fixed",
    value: 10,
    minPurchaseAmount: 50,
    start_date: "2023-01-01T00:00:00Z",
    end_date: "2023-12-31T23:59:59Z",
    status: "active",
    usage_limit: 0,
    current_usage: 78,
    applicable_memberships: ["all"],
    createdBy: "Admin",
    createdAt: "2023-01-01T00:00:00Z"
  },
  {
    id: "4",
    code: "SPRING2023",
    description: "Spring promotion 15% off",
    type: "percentage",
    value: 15,
    minPurchaseAmount: 0,
    maxDiscountAmount: 50,
    start_date: "2023-03-01T00:00:00Z",
    end_date: "2023-05-31T23:59:59Z",
    status: "expired",
    usage_limit: 200,
    current_usage: 189,
    applicable_memberships: ["all"],
    createdBy: "Admin",
    createdAt: "2023-02-15T00:00:00Z"
  },
  {
    id: "5",
    code: "BLACKFRIDAY",
    description: "Black Friday 30% off all memberships",
    type: "percentage",
    value: 30,
    minPurchaseAmount: 0,
    maxDiscountAmount: 100,
    start_date: "2023-11-24T00:00:00Z",
    end_date: "2023-11-27T23:59:59Z",
    status: "scheduled",
    usage_limit: 500,
    current_usage: 0,
    applicable_memberships: ["all"],
    createdBy: "Admin",
    createdAt: "2023-10-15T00:00:00Z"
  }
];

interface PromoCodeListProps {
  onEdit: (promo: PromoCode) => void;
  onAddNew: () => void;
}

const PromoCodeList = ({ onEdit, onAddNew }: PromoCodeListProps) => {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call and transform string dates to Date objects
    setTimeout(() => {
      const processedCodes = mockPromoCodes.map(code => ({
        ...code,
        startDate: stringToDate(code.start_date),
        endDate: stringToDate(code.end_date)
      }));
      setPromoCodes(processedCodes);
      setLoading(false);
    }, 1000);
  }, []);

  const handleDelete = (id: string) => {
    // In a real app, this would be an API call
    setPromoCodes(promoCodes.filter(promo => promo.id !== id));
    toast.success("Promo code deleted successfully");
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Promo code copied to clipboard");
  };

  // Format date to readable format
  const formatDateDisplay = (dateString: string | Date) => {
    return formatDate(dateString);
  };

  // Promo code status badge color mapping
  const getStatusBadge = (status: PromoCodeStatus) => {
    switch (status) {
      case "active":
        return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Active</Badge>;
      case "inactive":
        return <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">Inactive</Badge>;
      case "expired":
        return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Expired</Badge>;
      case "scheduled":
        return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Scheduled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Get discount text based on promo type and value
  const getDiscountText = (promo: PromoCode) => {
    switch (promo.type) {
      case "percentage":
        return `${promo.value}%`;
      case "fixed":
        return `$${promo.value}`;
      case "free-product":
        return "Free product";
      default:
        return `${promo.value}`;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle>Promotional Codes</CardTitle>
          <Button onClick={onAddNew}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Create New Promo
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Showing {promoCodes.length} promo codes
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                setLoading(true);
                setTimeout(() => {
                  setPromoCodes(mockPromoCodes);
                  setLoading(false);
                }, 1000);
              }}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <div className="h-6 w-6 rounded-full border-2 border-t-primary animate-spin"></div>
              <p className="text-sm text-muted-foreground">Loading promo codes...</p>
            </div>
          </div>
        ) : promoCodes.length === 0 ? (
          <div className="text-center py-10">
            <Tag className="h-10 w-10 mx-auto text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No promo codes found</h3>
            <p className="mt-1 text-sm text-muted-foreground mb-4">
              Start by creating a new promotional code
            </p>
            <Button onClick={onAddNew}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Create New Promo
            </Button>
          </div>
        ) : (
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Validity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {promoCodes.map((promo) => (
                  <TableRow key={promo.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono">{promo.code}</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6" 
                          onClick={() => handleCopyCode(promo.code)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                        {promo.description}
                      </p>
                    </TableCell>
                    <TableCell>{getDiscountText(promo)}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-xs">{formatDateDisplay(promo.start_date)}</span>
                        <span className="text-xs">to</span>
                        <span className="text-xs">{formatDateDisplay(promo.end_date)}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(promo.status)}</TableCell>
                    <TableCell>
                      {promo.usage_limit > 0 ? (
                        <span>{promo.current_usage} / {promo.usage_limit}</span>
                      ) : (
                        <span>{promo.current_usage} / ∞</span>
                      )}
                    </TableCell>
                    <TableCell>{formatDate(promo.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEdit(promo)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleCopyCode(promo.code)}>
                            <Copy className="h-4 w-4 mr-2" />
                            Copy Code
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(promo.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PromoCodeList;
