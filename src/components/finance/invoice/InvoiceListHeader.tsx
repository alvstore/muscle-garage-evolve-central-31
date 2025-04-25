
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

interface InvoiceListHeaderProps {
  readOnly?: boolean;
  onAdd?: () => void;
}

export const InvoiceListHeader = ({ readOnly, onAdd }: InvoiceListHeaderProps) => (
  <CardHeader className="flex flex-row items-center justify-between">
    <CardTitle>Invoices</CardTitle>
    {!readOnly && (
      <Button onClick={onAdd} className="flex items-center gap-1">
        <PlusIcon className="h-4 w-4" /> Create Invoice
      </Button>
    )}
  </CardHeader>
);
