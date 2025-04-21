
import React, { useState } from 'react';
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash, Copy } from "lucide-react";
import { toast } from "sonner";

// Define the class type interface (would normally be imported from types)
interface ClassType {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  capacity: number;
  category: string;
  color: string;
  active: boolean;
}

const ClassTypesPage = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ClassType | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<Omit<ClassType, 'id'>>({
    name: '',
    description: '',
    duration: 60,
    capacity: 10,
    category: 'fitness',
    color: '#4f46e5',
    active: true
  });

  // Mock data for class types - will be replaced with Supabase data
  const [classTypes, setClassTypes] = useState<ClassType[]>([
    {
      id: '1',
      name: 'Yoga',
      description: 'A relaxing session focused on flexibility and mindfulness',
      duration: 60,
      capacity: 15,
      category: 'wellness',
      color: '#8b5cf6',
      active: true
    },
    {
      id: '2',
      name: 'HIIT',
      description: 'High-intensity interval training for maximum calorie burn',
      duration: 45,
      capacity: 12,
      category: 'fitness',
      color: '#ef4444',
      active: true
    },
    {
      id: '3',
      name: 'Pilates',
      description: 'Core-strengthening exercises that improve posture and balance',
      duration: 60,
      capacity: 10,
      category: 'wellness',
      color: '#10b981',
      active: true
    },
    {
      id: '4',
      name: 'Spin',
      description: 'High-energy indoor cycling class with motivating music',
      duration: 50,
      capacity: 20,
      category: 'cardio',
      color: '#f97316',
      active: true
    },
    {
      id: '5',
      name: 'Boxing',
      description: 'Learn boxing techniques with cardio and strength elements',
      duration: 75,
      capacity: 8,
      category: 'combat',
      color: '#64748b',
      active: false
    }
  ]);

  const handleCreateClass = () => {
    setFormData({
      name: '',
      description: '',
      duration: 60,
      capacity: 10,
      category: 'fitness',
      color: '#4f46e5',
      active: true
    });
    setShowCreateDialog(true);
  };

  const handleEditClass = (classType: ClassType) => {
    setSelectedClass(classType);
    setFormData({
      name: classType.name,
      description: classType.description,
      duration: classType.duration,
      capacity: classType.capacity,
      category: classType.category,
      color: classType.color,
      active: classType.active
    });
    setShowEditDialog(true);
  };

  const handleDuplicateClass = (classType: ClassType) => {
    const newClassType = {
      ...classType,
      id: Date.now().toString(),
      name: `${classType.name} (Copy)`,
    };
    setClassTypes([...classTypes, newClassType]);
    toast.success(`Duplicated ${classType.name}`);
  };

  const handleDeleteClass = (id: string) => {
    if (window.confirm('Are you sure you want to delete this class type?')) {
      setClassTypes(classTypes.filter(classType => classType.id !== id));
      toast.success('Class type deleted successfully');
    }
  };

  const handleSaveNewClass = () => {
    const newClassType = {
      ...formData,
      id: Date.now().toString()
    };
    setClassTypes([...classTypes, newClassType]);
    setShowCreateDialog(false);
    toast.success('Class type created successfully');
  };

  const handleUpdateClass = () => {
    if (!selectedClass) return;
    
    setClassTypes(classTypes.map(classType => 
      classType.id === selectedClass.id ? { ...selectedClass, ...formData } : classType
    ));
    setShowEditDialog(false);
    toast.success('Class type updated successfully');
  };

  const handleToggleActiveStatus = (id: string) => {
    setClassTypes(classTypes.map(classType => 
      classType.id === id ? { ...classType, active: !classType.active } : classType
    ));
    toast.success('Class status updated');
  };

  return (
    <Container>
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Class Types</h1>
            <p className="text-muted-foreground">Manage class categories and configurations</p>
          </div>
          <Button onClick={handleCreateClass}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Class Type
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Available Class Types</CardTitle>
            <CardDescription>
              Configure class types that can be used when scheduling classes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Category</TableHead>
                  <TableHead className="hidden md:table-cell">Duration</TableHead>
                  <TableHead className="hidden md:table-cell">Capacity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classTypes.map((classType) => (
                  <TableRow key={classType.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: classType.color }}
                        />
                        <span className="font-medium">{classType.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell capitalize">
                      {classType.category}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {classType.duration} mins
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {classType.capacity} people
                    </TableCell>
                    <TableCell>
                      <Badge variant={classType.active ? "default" : "outline"}>
                        {classType.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleEditClass(classType)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDuplicateClass(classType)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDeleteClass(classType.id)}
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

      {/* Create Class Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Class Type</DialogTitle>
            <DialogDescription>
              Add a new class type to your scheduling system
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="className">Class Name</Label>
                <Input 
                  id="className" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g., Yoga, HIIT, etc."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="classCategory">Category</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={value => setFormData({...formData, category: value})}
                >
                  <SelectTrigger id="classCategory">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fitness">Fitness</SelectItem>
                    <SelectItem value="cardio">Cardio</SelectItem>
                    <SelectItem value="strength">Strength</SelectItem>
                    <SelectItem value="wellness">Wellness</SelectItem>
                    <SelectItem value="combat">Combat</SelectItem>
                    <SelectItem value="aquatic">Aquatic</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="classDescription">Description</Label>
              <Textarea 
                id="classDescription" 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})}
                placeholder="Describe what this class offers..."
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="classDuration">Duration (minutes)</Label>
                <Input 
                  id="classDuration" 
                  type="number" 
                  value={formData.duration} 
                  onChange={e => setFormData({...formData, duration: parseInt(e.target.value) || 30})}
                  min={15}
                  step={5}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="classCapacity">Max Capacity</Label>
                <Input 
                  id="classCapacity" 
                  type="number" 
                  value={formData.capacity} 
                  onChange={e => setFormData({...formData, capacity: parseInt(e.target.value) || 1})}
                  min={1}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="classColor">Color</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    id="classColor" 
                    type="color" 
                    value={formData.color} 
                    onChange={e => setFormData({...formData, color: e.target.value})}
                    className="w-12 h-12 p-1"
                  />
                  <div 
                    className="w-10 h-10 rounded border" 
                    style={{ backgroundColor: formData.color }}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-center">
              <Label htmlFor="classStatus" className="flex items-center cursor-pointer">
                <input
                  id="classStatus"
                  type="checkbox"
                  checked={formData.active}
                  onChange={() => setFormData({...formData, active: !formData.active})}
                  className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 mr-2"
                />
                Active
              </Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
            <Button type="submit" onClick={handleSaveNewClass}>Create Class Type</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Class Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Class Type</DialogTitle>
            <DialogDescription>
              Modify the details of this class type
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editClassName">Class Name</Label>
                <Input 
                  id="editClassName" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="editClassCategory">Category</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={value => setFormData({...formData, category: value})}
                >
                  <SelectTrigger id="editClassCategory">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fitness">Fitness</SelectItem>
                    <SelectItem value="cardio">Cardio</SelectItem>
                    <SelectItem value="strength">Strength</SelectItem>
                    <SelectItem value="wellness">Wellness</SelectItem>
                    <SelectItem value="combat">Combat</SelectItem>
                    <SelectItem value="aquatic">Aquatic</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="editClassDescription">Description</Label>
              <Textarea 
                id="editClassDescription" 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})}
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editClassDuration">Duration (minutes)</Label>
                <Input 
                  id="editClassDuration" 
                  type="number" 
                  value={formData.duration} 
                  onChange={e => setFormData({...formData, duration: parseInt(e.target.value) || 30})}
                  min={15}
                  step={5}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="editClassCapacity">Max Capacity</Label>
                <Input 
                  id="editClassCapacity" 
                  type="number" 
                  value={formData.capacity} 
                  onChange={e => setFormData({...formData, capacity: parseInt(e.target.value) || 1})}
                  min={1}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="editClassColor">Color</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    id="editClassColor" 
                    type="color" 
                    value={formData.color} 
                    onChange={e => setFormData({...formData, color: e.target.value})}
                    className="w-12 h-12 p-1"
                  />
                  <div 
                    className="w-10 h-10 rounded border" 
                    style={{ backgroundColor: formData.color }}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-center">
              <Label htmlFor="editClassStatus" className="flex items-center cursor-pointer">
                <input
                  id="editClassStatus"
                  type="checkbox"
                  checked={formData.active}
                  onChange={() => setFormData({...formData, active: !formData.active})}
                  className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 mr-2"
                />
                Active
              </Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>Cancel</Button>
            <Button type="submit" onClick={handleUpdateClass}>Update Class Type</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default ClassTypesPage;
