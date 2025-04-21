
import { useState } from "react";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ClassType {
  id: string;
  name: string;
  description: string;
  color: string;
  capacity: number;
  duration: number;
  difficulty: "beginner" | "intermediate" | "advanced" | "all-levels";
  equipment: string[];
  active: boolean;
}

const MOCK_CLASS_TYPES: ClassType[] = [
  {
    id: "ct1",
    name: "HIIT",
    description: "High Intensity Interval Training for maximum calorie burn",
    color: "#ef4444",
    capacity: 20,
    duration: 45,
    difficulty: "intermediate",
    equipment: ["Dumbbells", "Kettlebells", "Jump rope"],
    active: true,
  },
  {
    id: "ct2",
    name: "Yoga",
    description: "Mind and body practice focusing on strength, flexibility and breathing",
    color: "#22c55e",
    capacity: 15,
    duration: 60,
    difficulty: "all-levels",
    equipment: ["Yoga mat", "Blocks", "Straps"],
    active: true,
  },
  {
    id: "ct3",
    name: "Strength Training",
    description: "Build muscle and strength with progressive overload",
    color: "#3b82f6",
    capacity: 12,
    duration: 50,
    difficulty: "advanced",
    equipment: ["Barbells", "Weight plates", "Rack"],
    active: true,
  },
  {
    id: "ct4",
    name: "Pilates",
    description: "Core-focused exercises for stability and posture",
    color: "#a855f7",
    capacity: 15,
    duration: 55,
    difficulty: "beginner",
    equipment: ["Mat", "Reformer", "Ring"],
    active: false,
  },
];

const ClassTypesPage = () => {
  const [classTypes, setClassTypes] = useState<ClassType[]>(MOCK_CLASS_TYPES);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentClassType, setCurrentClassType] = useState<ClassType | null>(null);
  const [formData, setFormData] = useState<Partial<ClassType>>({});
  
  const handleOpenDialog = (classType?: ClassType) => {
    if (classType) {
      setCurrentClassType(classType);
      setFormData({...classType});
    } else {
      setCurrentClassType(null);
      setFormData({
        name: "",
        description: "",
        color: "#3b82f6",
        capacity: 15,
        duration: 60,
        difficulty: "all-levels",
        equipment: [],
        active: true
      });
    }
    setIsDialogOpen(true);
  };
  
  const handleFormChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };
  
  const handleSaveClassType = () => {
    if (!formData.name) {
      toast.error("Class name is required");
      return;
    }
    
    if (currentClassType) {
      // Update existing
      setClassTypes(classTypes.map(ct => 
        ct.id === currentClassType.id ? 
          {...ct, ...formData} as ClassType : 
          ct
      ));
      toast.success(`Class type "${formData.name}" updated successfully`);
    } else {
      // Add new
      const newClassType: ClassType = {
        id: `ct${classTypes.length + 1}`,
        name: formData.name || "",
        description: formData.description || "",
        color: formData.color || "#3b82f6",
        capacity: formData.capacity || 15,
        duration: formData.duration || 60,
        difficulty: formData.difficulty as "beginner" | "intermediate" | "advanced" | "all-levels" || "all-levels",
        equipment: formData.equipment || [],
        active: formData.active !== undefined ? formData.active : true
      };
      
      setClassTypes([...classTypes, newClassType]);
      toast.success(`Class type "${formData.name}" added successfully`);
    }
    
    setIsDialogOpen(false);
  };
  
  const handleOpenDeleteDialog = (classType: ClassType) => {
    setCurrentClassType(classType);
    setIsDeleteDialogOpen(true);
  };
  
  const handleDeleteClassType = () => {
    if (currentClassType) {
      setClassTypes(classTypes.filter(ct => ct.id !== currentClassType.id));
      toast.success(`Class type "${currentClassType.name}" deleted successfully`);
    }
    setIsDeleteDialogOpen(false);
  };
  
  const handleToggleStatus = (id: string) => {
    setClassTypes(classTypes.map(ct => 
      ct.id === id ? 
        {...ct, active: !ct.active} : 
        ct
    ));
    
    const classType = classTypes.find(ct => ct.id === id);
    if (classType) {
      toast.success(`Class type "${classType.name}" ${classType.active ? 'deactivated' : 'activated'} successfully`);
    }
  };
  
  return (
    <Container>
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Class Types</h1>
            <p className="text-muted-foreground">Manage your gym class categories</p>
          </div>
          
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Class Type
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Class Types</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classTypes.map((classType) => (
                  <TableRow key={classType.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <div 
                          className="w-4 h-4 mr-2 rounded-full" 
                          style={{ backgroundColor: classType.color }} 
                        />
                        <span className="font-medium">{classType.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{classType.duration} min</TableCell>
                    <TableCell>{classType.capacity} people</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {classType.difficulty}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={classType.active ? "success" : "secondary"}>
                        {classType.active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => handleOpenDialog(classType)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => handleToggleStatus(classType.id)}
                        >
                          {classType.active ? (
                            <X className="h-4 w-4" />
                          ) : (
                            <Check className="h-4 w-4" />
                          )}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => handleOpenDeleteDialog(classType)}
                        >
                          <Trash2 className="h-4 w-4" />
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
      
      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {currentClassType ? "Edit Class Type" : "Add New Class Type"}
            </DialogTitle>
            <DialogDescription>
              {currentClassType 
                ? "Edit the details of your class type."
                : "Create a new class type that can be used to categorize classes."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input
                id="name"
                value={formData.name || ""}
                onChange={(e) => handleFormChange("name", e.target.value)}
                placeholder="e.g., HIIT, Yoga, Spinning"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) => handleFormChange("description", e.target.value)}
                placeholder="Describe the class type"
                className="col-span-3"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="color" className="text-right">Color</Label>
              <div className="col-span-3 flex items-center gap-2">
                <input
                  type="color"
                  id="color"
                  value={formData.color || "#3b82f6"}
                  onChange={(e) => handleFormChange("color", e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer"
                />
                <span className="text-sm text-muted-foreground">
                  This color will be used to identify this class type in the schedule
                </span>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="difficulty" className="text-right">Difficulty</Label>
              <Select
                value={formData.difficulty || "all-levels"}
                onValueChange={(value) => handleFormChange("difficulty", value)}
              >
                <SelectTrigger id="difficulty" className="col-span-3">
                  <SelectValue placeholder="Select difficulty level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                  <SelectItem value="all-levels">All Levels</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="duration" className="text-right">Duration (min)</Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration || 60}
                onChange={(e) => handleFormChange("duration", parseInt(e.target.value))}
                min={5}
                max={180}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="capacity" className="text-right">Capacity</Label>
              <Input
                id="capacity"
                type="number"
                value={formData.capacity || 15}
                onChange={(e) => handleFormChange("capacity", parseInt(e.target.value))}
                min={1}
                max={100}
                className="col-span-3"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveClassType}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the "{currentClassType?.name}" class type?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteClassType}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
    </Container>
  );
};

export default ClassTypesPage;
