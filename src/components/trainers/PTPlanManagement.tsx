
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Edit, Trash2, TrendingUp } from "lucide-react";
import { PTPlan } from "@/types/measurements";
import { Member, Trainer } from "@/types";
import { toast } from "sonner";
import { format, parseISO, isAfter } from "date-fns";
import { useNavigate } from "react-router-dom";

interface PTPlanManagementProps {
  trainerId: string;
  members: Member[];
}

const PTPlanManagement: React.FC<PTPlanManagementProps> = ({ trainerId, members }) => {
  const navigate = useNavigate();
  const [isAddingPlan, setIsAddingPlan] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PTPlan | null>(null);
  const [formData, setFormData] = useState({
    memberId: "",
    startDate: format(new Date(), "yyyy-MM-dd"),
    endDate: format(new Date(new Date().setMonth(new Date().getMonth() + 3)), "yyyy-MM-dd"),
  });
  
  // Mock PT plans data
  const [ptPlans, setPtPlans] = useState<PTPlan[]>([
    {
      id: "ptplan-1",
      memberId: "member-1",
      trainerId,
      startDate: "2025-03-01",
      endDate: "2025-06-01",
      isActive: true
    },
    {
      id: "ptplan-2",
      memberId: "member-2",
      trainerId,
      startDate: "2025-02-15",
      endDate: "2025-05-15",
      isActive: true
    },
    {
      id: "ptplan-3",
      memberId: "member-3",
      trainerId,
      startDate: "2025-01-15",
      endDate: "2025-01-30",
      isActive: false
    },
  ]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate dates
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    
    if (isAfter(startDate, endDate)) {
      toast.error("End date must be after start date");
      return;
    }
    
    if (selectedPlan) {
      // Update existing plan
      const updatedPlans = ptPlans.map(plan => 
        plan.id === selectedPlan.id 
          ? { 
              ...plan, 
              memberId: formData.memberId,
              startDate: formData.startDate,
              endDate: formData.endDate,
              isActive: isAfter(new Date(formData.endDate), new Date())
            }
          : plan
      );
      
      setPtPlans(updatedPlans);
      toast.success("PT plan updated successfully");
    } else {
      // Add new plan
      const newPlan: PTPlan = {
        id: `ptplan-${Date.now()}`,
        memberId: formData.memberId,
        trainerId,
        startDate: formData.startDate,
        endDate: formData.endDate,
        isActive: isAfter(new Date(formData.endDate), new Date())
      };
      
      setPtPlans([...ptPlans, newPlan]);
      toast.success("PT plan added successfully");
    }
    
    resetForm();
  };

  const handleEdit = (plan: PTPlan) => {
    setSelectedPlan(plan);
    setFormData({
      memberId: plan.memberId,
      startDate: plan.startDate,
      endDate: plan.endDate,
    });
    setIsAddingPlan(true);
  };

  const handleDelete = (id: string) => {
    setPtPlans(ptPlans.filter(plan => plan.id !== id));
    toast.success("PT plan deleted successfully");
  };

  const resetForm = () => {
    setFormData({
      memberId: "",
      startDate: format(new Date(), "yyyy-MM-dd"),
      endDate: format(new Date(new Date().setMonth(new Date().getMonth() + 3)), "yyyy-MM-dd"),
    });
    setSelectedPlan(null);
    setIsAddingPlan(false);
  };

  const getMemberName = (memberId: string) => {
    const member = members.find(m => m.id === memberId);
    return member ? member.name : "Unknown Member";
  };

  const viewMemberProgress = (memberId: string) => {
    navigate(`/fitness/measurements/${memberId}`);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Personal Training Plans</CardTitle>
            <CardDescription>
              Manage your personal training clients
            </CardDescription>
          </div>
          <Button onClick={() => setIsAddingPlan(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Plan
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ptPlans.length > 0 ? (
                ptPlans.map(plan => (
                  <TableRow key={plan.id}>
                    <TableCell className="font-medium">{getMemberName(plan.memberId)}</TableCell>
                    <TableCell>{format(parseISO(plan.startDate), "MMM dd, yyyy")}</TableCell>
                    <TableCell>{format(parseISO(plan.endDate), "MMM dd, yyyy")}</TableCell>
                    <TableCell>
                      <span 
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          plan.isActive 
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300" 
                        }`}
                      >
                        {plan.isActive ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => viewMemberProgress(plan.memberId)}
                        >
                          <TrendingUp className="mr-1 h-4 w-4" />
                          Progress
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleEdit(plan)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDelete(plan.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                    No PT plans found. Add a new plan to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        <Dialog open={isAddingPlan} onOpenChange={setIsAddingPlan}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedPlan ? "Edit PT Plan" : "Add New PT Plan"}</DialogTitle>
              <DialogDescription>
                {selectedPlan 
                  ? "Update the personal training plan details" 
                  : "Create a new personal training plan for a member"}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="memberId">Select Member</Label>
                <Select 
                  value={formData.memberId} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, memberId: value }))}
                  required
                >
                  <SelectTrigger id="memberId">
                    <SelectValue placeholder="Select a member" />
                  </SelectTrigger>
                  <SelectContent>
                    {members.map(member => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit">
                  {selectedPlan ? "Update Plan" : "Add Plan"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default PTPlanManagement;
