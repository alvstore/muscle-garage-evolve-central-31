
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription as DD,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { InventoryItem, InventoryCategory } from "@/types/inventory";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Item name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  category: z.string().min(2, {
    message: "Category must be at least 2 characters.",
  }),
  quantity: z.number().min(0, {
    message: "Quantity must be zero or more.",
  }),
  reorderLevel: z.number().min(0, {
    message: "Reorder level must be zero or more.",
  }),
  costPrice: z.number().min(0, {
    message: "Cost price must be zero or more.",
  }),
  price: z.number().min(0, {
    message: "Selling price must be zero or more.",
  }),
});

// Update the InventoryFormProps to include onClose
export interface InventoryFormProps {
  item?: InventoryItem;
  onSave: (item: InventoryItem) => Promise<void>;
  onClose?: () => void;
}

const InventoryForm: React.FC<InventoryFormProps> = ({ 
  item, 
  onSave,
  onClose 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: item?.name || "",
      description: item?.description || "",
      category: item?.category || "",
      quantity: item?.quantity || 0,
      reorderLevel: item?.reorderLevel || 0,
      costPrice: item?.costPrice || 0,
      price: item?.price || 0,
    },
  });
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      // Convert form values to InventoryItem
      const inventoryData: InventoryItem = {
        id: item?.id || '',
        name: values.name,
        sku: item?.sku || `SKU-${Date.now()}`,
        category: values.category as InventoryCategory,
        description: values.description,
        quantity: values.quantity,
        reorderLevel: values.reorderLevel,
        costPrice: values.costPrice,
        price: values.price,
        barcode: item?.barcode || '',
        image: item?.image || '',
        supplier: item?.supplier || '',
        supplierContact: item?.supplierContact || '',
        location: item?.location || '',
        manufactureDate: item?.manufactureDate || undefined,
        expiryDate: item?.expiryDate || undefined,
        lastStockUpdate: new Date().toISOString(),
        status: item?.status || 'in-stock',
        createdAt: item?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      await onSave(inventoryData);
      // Use optional chaining for onClose
      onClose?.();
    } catch (error) {
      console.error("Error saving inventory item:", error);
      toast.error("Failed to save inventory item");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Item Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter item name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Enter item description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="supplement">Supplement</SelectItem>
                    <SelectItem value="equipment">Equipment</SelectItem>
                    <SelectItem value="merchandise">Merchandise</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col md:flex-row gap-4">
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter quantity"
                    {...field}
                    onChange={(e) =>
                      field.onChange(Number(e.target.value))
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="reorderLevel"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Reorder Level</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter reorder level"
                    {...field}
                    onChange={(e) =>
                      field.onChange(Number(e.target.value))
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <FormField
            control={form.control}
            name="costPrice"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Cost Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter cost price"
                    {...field}
                    onChange={(e) =>
                      field.onChange(Number(e.target.value))
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Selling Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter selling price"
                    {...field}
                    onChange={(e) =>
                      field.onChange(Number(e.target.value))
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Item"}
        </Button>
      </form>
    </Form>
  );
};

export default InventoryForm;
