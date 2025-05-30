
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { InvoiceItemListProps, InvoiceItemProps } from "@/types/payment/invoice";
import { InvoiceItem } from "@/types/finance";

const InvoiceItemRow = ({ item, onUpdate, onRemove, canDelete }: InvoiceItemProps) => (
  <div className="grid grid-cols-12 gap-2 mb-2">
    <div className="col-span-6">
      <Input
        placeholder="Item name"
        value={item.name}
        onChange={(e) => onUpdate(item.id, "name", e.target.value)}
        required
      />
    </div>
    <div className="col-span-2">
      <Input
        type="number"
        placeholder="Quantity"
        value={item.quantity}
        onChange={(e) => onUpdate(item.id, "quantity", Number(e.target.value))}
        min="1"
        required
      />
    </div>
    <div className="col-span-3">
      <Input
        type="number"
        placeholder="Unit Price"
        value={item.price}
        onChange={(e) => onUpdate(item.id, "price", Number(e.target.value))}
        min="0"
        required
      />
    </div>
    <div className="col-span-1 flex items-center justify-center">
      <Button 
        type="button" 
        variant="ghost" 
        size="sm"
        onClick={() => onRemove(item.id)}
        disabled={!canDelete}
      >
        <Trash2Icon className="h-4 w-4" />
      </Button>
    </div>
  </div>
);

export const InvoiceItemList = ({ items, onAdd, onUpdate, onRemove }: InvoiceItemListProps) => (
  <div className="mt-4">
    <div className="flex justify-between items-center mb-2">
      <h3 className="text-sm font-medium">Invoice Items</h3>
      <Button 
        type="button" 
        variant="outline" 
        size="sm"
        onClick={onAdd}
        className="flex items-center gap-1"
      >
        <PlusIcon className="h-4 w-4" /> Add Item
      </Button>
    </div>
    {items.map((item) => (
      <InvoiceItemRow 
        key={item.id}
        item={item}
        onUpdate={onUpdate}
        onRemove={onRemove}
        canDelete={items.length > 1}
      />
    ))}
  </div>
);
