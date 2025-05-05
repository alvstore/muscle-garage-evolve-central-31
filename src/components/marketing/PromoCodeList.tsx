
import { useState } from "react";
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
import { PromoCode } from "@/types/marketing";
import { formatDate } from "@/utils/date-utils";
import { toast } from "sonner";

interface PromoCodeListProps {
  promoCodes: PromoCode[];
  isLoading: boolean;
  onEdit: (promo: PromoCode) => void;
  onDelete: (id: string) => void;
  onRefresh: () => void;
  onAddNew: () => void;
}

const PromoCodeList = ({ 
  promoCodes, 
  isLoading, 
  onEdit, 
  onDelete, 
  onRefresh, 
  onAddNew 
}: PromoCodeListProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Promo code copied to clipboard");
  };

  // Filter promo codes by search term
  const filteredPromoCodes = searchTerm
    ? promoCodes.filter(promo => 
        promo.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        promo.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : promoCodes;

  // Promo code status badge color mapping
  const getStatusBadge = (status: string) => {
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
      case "membership_extension":
        return `${promo.value} days`;
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
            Showing {filteredPromoCodes.length} promo codes
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <div className="h-6 w-6 rounded-full border-2 border-t-primary animate-spin"></div>
              <p className="text-sm text-muted-foreground">Loading promo codes...</p>
            </div>
          </div>
        ) : filteredPromoCodes.length === 0 ? (
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
                {filteredPromoCodes.map((promo) => (
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
                        <span className="text-xs">{formatDate(promo.start_date)}</span>
                        <span className="text-xs">to</span>
                        <span className="text-xs">{formatDate(promo.end_date)}</span>
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
                            onClick={() => onDelete(promo.id)}
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
