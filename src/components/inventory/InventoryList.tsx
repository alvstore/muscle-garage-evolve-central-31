import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table, TableHeader, TableRow, TableHead,
  TableBody, TableCell
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import { PlusIcon, EditIcon, TrashIcon } from "lucide-react";
import { toast } from "sonner";
import { useSupabaseQuery } from "@/hooks/use-supabase-query";
import { supabase } from "@/services/supabaseClient";
import { ScrollArea } from "@/components/ui/scroll-area";
import { InventoryItem, InventoryCategory } from "@/types/inventory";
import InventoryForm from "./InventoryForm";
import { useBranch } from "@/hooks/use-branches";

const InventoryList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentItem, setCurrentItem] = useState<InventoryItem | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const { currentBranch } = useBranch();

  const { data: items, isLoading, error, refetch } = useSupabaseQuery<InventoryItem[]>({
    tableName: 'inventory_items',
    select: '*',
    orderBy: sortBy ? { column: sortBy, ascending: sortOrder === "asc" } : { column: 'created_at', ascending: false },
    filters: currentBranch ? [{ column: 'branch_id', operator: 'eq', value: currentBranch.id }] : []
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Get unique categories
        const { data, error } = await supabase
          .from('inventory_items')
          .select('category')
          .order('category');

        if (error) {
          throw error;
        }

        if (data) {
          // Extract unique categories
          const uniqueCategories = [...new Set(data.map(item => item.category))];
          setCategories(uniqueCategories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories");
      }
    };

    fetchCategories();
  }, []);

const handleSaveItem = async (item: InventoryItem) => {
    try {
      // Add branch_id to the item
      const itemWithBranchId = {
        ...item,
        branch_id: currentBranch?.id
      };
      
      if (item.id) {
        const { error } = await supabase
          .from('inventory_items')
          .update(itemWithBranchId)
          .eq('id', item.id);

        if (error) {
          throw error;
        }
        toast.success("Inventory item updated successfully");
      } else {
        const { error } = await supabase
          .from('inventory_items')
          .insert([itemWithBranchId]);

        if (error) {
          throw error;
        }
        toast.success("Inventory item created successfully");
      }
      refetch();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to save inventory item";
      toast.error(errorMsg);
      console.error("Error saving item:", err);
    } finally {
      setShowAddModal(false);
      setShowEditModal(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('inventory_items')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }
      toast.success("Inventory item deleted successfully");
      refetch();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to delete inventory item";
      toast.error(errorMsg);
      console.error("Error deleting item:", err);
    }
  };

  const filteredItems = items?.filter(item => {
    const searchRegex = new RegExp(searchQuery, 'i');
    const matchesSearch = searchRegex.test(item.name) || searchRegex.test(item.description || '');
    const matchesCategory = filterCategory ? item.category === filterCategory : true;

    return matchesSearch && matchesCategory;
  });

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const getSortIcon = (column: string) => {
    if (sortBy === column) {
      return sortOrder === "asc" ? "↑" : "↓";
    }
    return null;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Inventory List</h2>
        <Button onClick={() => setShowAddModal(true)} className="flex items-center gap-1">
          <PlusIcon className="h-4 w-4" /> Add Item
        </Button>
      </div>

      <div className="flex space-x-4 mb-4">
        <Input
          type="text"
          placeholder="Search by name or description"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-9">
              Filter by Category
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuItem onClick={() => setFilterCategory(null)}>
              All Categories
            </DropdownMenuItem>
            {categories.map(category => (
              <DropdownMenuItem key={category} onClick={() => setFilterCategory(category)}>
                {category}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ScrollArea>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => handleSort('name')} className="cursor-pointer">
                Name {getSortIcon('name')}
              </TableHead>
              <TableHead>Description</TableHead>
              <TableHead onClick={() => handleSort('category')} className="cursor-pointer">
                Category {getSortIcon('category')}
              </TableHead>
              <TableHead onClick={() => handleSort('quantity')} className="cursor-pointer">
                Quantity {getSortIcon('quantity')}
              </TableHead>
              <TableHead onClick={() => handleSort('reorderLevel')} className="cursor-pointer">
                Reorder Level {getSortIcon('reorderLevel')}
              </TableHead>
              <TableHead onClick={() => handleSort('costPrice')} className="cursor-pointer">
                Cost Price {getSortIcon('costPrice')}
              </TableHead>
              <TableHead onClick={() => handleSort('price')} className="cursor-pointer">
                Selling Price {getSortIcon('price')}
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={8} className="text-center">Loading inventory items...</TableCell>
              </TableRow>
            )}
            {error && (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-destructive">Error: {error.message}</TableCell>
              </TableRow>
            )}
            {filteredItems?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center">No inventory items found</TableCell>
              </TableRow>
            ) : (
              filteredItems?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.reorder_level}</TableCell>
                  <TableCell>{item.cost_price}</TableCell>
                  <TableCell>{item.price}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <EditIcon className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => {
                          setCurrentItem(item);
                          setShowEditModal(true);
                        }}>
                          <EditIcon className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          if (window.confirm("Are you sure you want to delete this item?")) {
                            handleDeleteItem(item.id);
                          }
                        }}>
                          <TrashIcon className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </ScrollArea>

      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add Inventory Item</DialogTitle>
          </DialogHeader>
          <InventoryForm 
            onSave={handleSaveItem} 
            onClose={() => setShowAddModal(false)}
          />
        </DialogContent>
      </Dialog>

      {showEditModal && currentItem && (
        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Inventory Item</DialogTitle>
            </DialogHeader>
            <InventoryForm 
              item={currentItem} 
              onSave={handleSaveItem}
              onClose={() => setShowEditModal(false)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default InventoryList;
