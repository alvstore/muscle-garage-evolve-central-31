
import React, { useState } from 'react';
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash, DollarSign } from "lucide-react";
import { toast } from "sonner";

interface ExpenseCategory {
  id: string;
  name: string;
  description: string;
  type: 'fixed' | 'variable';
  color: string;
  isActive: boolean;
}

const ExpenseCategoryPage = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<Omit<ExpenseCategory, 'id'>>({
    name: '',
    description: '',
    type: 'variable',
    color: '#4f46e5',
    isActive: true
  });

  // Mock data for expense categories - will be replaced with Supabase data
  const [categories, setCategories] = useState<ExpenseCategory[]>([
    {
      id: '1',
      name: 'Rent',
      description: 'Monthly rent for gym premises',
      type: 'fixed',
      color: '#ef4444',
      isActive: true
    },
    {
      id: '2',
      name: 'Utilities',
      description: 'Electricity, water, internet, etc.',
      type: 'variable',
      color: '#3b82f6',
      isActive: true
    },
    {
      id: '3',
      name: 'Equipment Maintenance',
      description: 'Repair and maintenance of gym equipment',
      type: 'variable',
      color: '#f97316',
      isActive: true
    },
    {
      id: '4',
      name: 'Staff Salaries',
      description: 'Salaries for gym staff and trainers',
      type: 'fixed',
      color: '#8b5cf6',
      isActive: true
    },
    {
      id: '5',
      name: 'Marketing',
      description: 'Advertising and promotional expenses',
      type: 'variable',
      color: '#10b981',
      isActive: true
    },
    {
      id: '6',
      name: 'Insurance',
      description: 'Property and liability insurance',
      type: 'fixed',
      color: '#64748b',
      isActive: true
    },
    {
      id: '7',
      name: 'Cleaning Supplies',
      description: 'Cleaning materials and sanitizers',
      type: 'variable',
      color: '#0ea5e9',
      isActive: true
    }
  ]);

  const handleCreateCategory = () => {
    setFormData({
      name: '',
      description: '',
      type: 'variable',
      color: '#4f46e5',
      isActive: true
    });
    setShowCreateDialog(true);
  };

  const handleEditCategory = (category: ExpenseCategory) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      type: category.type,
      color: category.color,
      isActive: category.isActive
    });
    setShowEditDialog(true);
  };

  const handleDeleteCategory = (id: string) => {
    if (window.confirm('Are you sure you want to delete this expense category?')) {
      setCategories(categories.filter(category => category.id !== id));
      toast.success('Expense category deleted successfully');
    }
  };

  const handleSaveNewCategory = () => {
    if (!formData.name.trim()) {
      toast.error('Category name is required');
      return;
    }
    
    const newCategory = {
      ...formData,
      id: Date.now().toString()
    };
    setCategories([...categories, newCategory]);
    setShowCreateDialog(false);
    toast.success('Expense category created successfully');
  };

  const handleUpdateCategory = () => {
    if (!selectedCategory || !formData.name.trim()) {
      toast.error('Category name is required');
      return;
    }
    
    setCategories(categories.map(category => 
      category.id === selectedCategory.id ? { ...selectedCategory, ...formData } : category
    ));
    setShowEditDialog(false);
    toast.success('Expense category updated successfully');
  };

  const handleToggleStatus = (id: string) => {
    setCategories(categories.map(category => 
      category.id === id ? { ...category, isActive: !category.isActive } : category
    ));
    toast.success('Category status updated');
  };

  return (
    <Container>
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Expense Categories</h1>
            <p className="text-muted-foreground">Manage expense categories for financial tracking</p>
          </div>
          <Button onClick={handleCreateCategory}>
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Expense Categories</CardTitle>
            <CardDescription>
              Categories used to classify gym expenses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead className="hidden md:table-cell">Description</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="font-medium">{category.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {category.description}
                    </TableCell>
                    <TableCell>
                      <Badge variant={category.type === 'fixed' ? 'outline' : 'default'}>
                        {category.type === 'fixed' ? 'Fixed' : 'Variable'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={category.isActive ? 'default' : 'outline'}>
                        {category.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleEditCategory(category)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDeleteCategory(category.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Create Category Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create Expense Category</DialogTitle>
            <DialogDescription>
              Add a new category for tracking expenses
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="categoryName">Category Name</Label>
              <Input 
                id="categoryName" 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="e.g., Utilities, Rent, etc."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="categoryDescription">Description</Label>
              <Input 
                id="categoryDescription" 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})}
                placeholder="What this category covers"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="categoryType">Type</Label>
                <select 
                  id="categoryType" 
                  value={formData.type}
                  onChange={e => setFormData({
                    ...formData, 
                    type: e.target.value as 'fixed' | 'variable'
                  })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="fixed">Fixed</option>
                  <option value="variable">Variable</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="categoryColor">Color</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    id="categoryColor" 
                    type="color" 
                    value={formData.color} 
                    onChange={e => setFormData({...formData, color: e.target.value})}
                    className="w-10 h-10 p-1"
                  />
                  <div 
                    className="w-8 h-8 rounded border" 
                    style={{ backgroundColor: formData.color }}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-center">
              <Label htmlFor="categoryStatus" className="flex items-center cursor-pointer">
                <input
                  id="categoryStatus"
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={() => setFormData({...formData, isActive: !formData.isActive})}
                  className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 mr-2"
                />
                Active
              </Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveNewCategory}>Create Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Expense Category</DialogTitle>
            <DialogDescription>
              Update expense category details
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="editCategoryName">Category Name</Label>
              <Input 
                id="editCategoryName" 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="editCategoryDescription">Description</Label>
              <Input 
                id="editCategoryDescription" 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editCategoryType">Type</Label>
                <select 
                  id="editCategoryType" 
                  value={formData.type}
                  onChange={e => setFormData({
                    ...formData, 
                    type: e.target.value as 'fixed' | 'variable'
                  })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="fixed">Fixed</option>
                  <option value="variable">Variable</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="editCategoryColor">Color</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    id="editCategoryColor" 
                    type="color" 
                    value={formData.color} 
                    onChange={e => setFormData({...formData, color: e.target.value})}
                    className="w-10 h-10 p-1"
                  />
                  <div 
                    className="w-8 h-8 rounded border" 
                    style={{ backgroundColor: formData.color }}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-center">
              <Label htmlFor="editCategoryStatus" className="flex items-center cursor-pointer">
                <input
                  id="editCategoryStatus"
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={() => setFormData({...formData, isActive: !formData.isActive})}
                  className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 mr-2"
                />
                Active
              </Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>Cancel</Button>
            <Button onClick={handleUpdateCategory}>Update Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default ExpenseCategoryPage;
