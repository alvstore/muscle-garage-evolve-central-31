import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  UserPlus, 
  Eye, 
  Filter, 
  Download, 
  Calendar 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { usePermissions } from '@/hooks/use-permissions';
import { supabase } from '@/services/supabaseClient';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

export interface WorkoutPlansManagerProps {
  readOnly?: boolean;
  assignOnly?: boolean;
  forMemberId?: string;
}

const WorkoutPlansManager: React.FC<WorkoutPlansManagerProps> = ({
  readOnly = false,
  assignOnly = false,
  forMemberId
}) => {
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [assignedPlans, setAssignedPlans] = useState([]);
  
  const { toast } = useToast();
  const { user } = useAuth();
  const { can } = usePermissions();
  const navigate = useNavigate();
  
  const canEditPlans = !readOnly && can('create_edit_plans');
  const canAssignPlans = !readOnly && (assignOnly || can('assign_workout_plan'));
  
  useEffect(() => {
    fetchWorkoutPlans();
    if (canAssignPlans) {
      fetchMembers();
    }
    if (forMemberId) {
      fetchAssignedPlans(forMemberId);
    }
  }, [forMemberId]);
  
  useEffect(() => {
    if (searchQuery || filterCategory !== 'all') {
      filterPlans();
    } else {
      setFilteredPlans(workoutPlans);
    }
  }, [searchQuery, filterCategory, workoutPlans]);
  
  const fetchWorkoutPlans = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('workout_plans')
        .select(`
          id,
          name,
          description,
          difficulty_level,
          category,
          created_at,
          created_by,
          profiles:created_by (full_name)
        `)
        .order('created_at', { ascending: false });
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      setWorkoutPlans(data || []);
      setFilteredPlans(data || []);
    } catch (error) {
      console.error('Error fetching workout plans:', error);
      toast({
        title: 'Error',
        description: 'Failed to load workout plans',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('role', 'member')
        .order('full_name');
      
      if (error) throw error;
      
      setMembers(data || []);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };
  
  const fetchAssignedPlans = async (memberId) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('member_workout_plans')
        .select(`
          id,
          assigned_date,
          start_date,
          end_date,
          status,
          workout_plan_id,
          workout_plans:workout_plan_id (
            id,
            name,
            description,
            difficulty_level,
            category
          ),
          assigned_by,
          profiles:assigned_by (full_name)
        `)
        .eq('member_id', memberId)
        .order('assigned_date', { ascending: false });
      
      if (error) throw error;
      
      setAssignedPlans(data || []);
      setFilteredPlans(data?.map(ap => ap.workout_plans) || []);
    } catch (error) {
      console.error('Error fetching assigned plans:', error);
      toast({
        title: 'Error',
        description: 'Failed to load assigned workout plans',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const filterPlans = () => {
    let filtered = [...workoutPlans];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        plan => 
          plan.name.toLowerCase().includes(query) ||
          plan.description.toLowerCase().includes(query) ||
          plan.category.toLowerCase().includes(query)
      );
    }
    
    // Apply category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter(plan => plan.category === filterCategory);
    }
    
    setFilteredPlans(filtered);
  };
  
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  const handleFilterChange = (value) => {
    setFilterCategory(value);
  };
  
  const handleCreatePlan = () => {
    navigate('/fitness/workout-plans/create');
  };
  
  const handleEditPlan = (plan) => {
    navigate(`/fitness/workout-plans/edit/${plan.id}`);
  };
  
  const handleViewPlan = (plan) => {
    navigate(`/fitness/workout-plans/view/${plan.id}`);
  };
  
  const handleDeleteClick = (plan) => {
    setSelectedPlan(plan);
    setIsDeleteDialogOpen(true);
  };
  
  const handleDeletePlan = async () => {
    if (!selectedPlan) return;
    
    try {
      const { error } = await supabase
        .from('workout_plans')
        .delete()
        .eq('id', selectedPlan.id);
      
      if (error) throw error;
      
      setWorkoutPlans(workoutPlans.filter(plan => plan.id !== selectedPlan.id));
      toast({
        title: 'Success',
        description: 'Workout plan deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting workout plan:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete workout plan',
        variant: 'destructive',
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedPlan(null);
    }
  };
  
  const handleAssignClick = (plan) => {
    setSelectedPlan(plan);
    setIsAssignDialogOpen(true);
  };
  
  const handleAssignPlan = async () => {
    if (!selectedPlan || !selectedMember) {
      toast({
        title: 'Error',
        description: 'Please select a member',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      const now = new Date();
      const endDate = new Date();
      endDate.setDate(now.getDate() + 30); // Default 30 days plan
      
      const { data, error } = await supabase
        .from('member_workout_plans')
        .insert({
          member_id: selectedMember,
          workout_plan_id: selectedPlan.id,
          assigned_date: now.toISOString(),
          start_date: now.toISOString(),
          end_date: endDate.toISOString(),
          status: 'active',
          assigned_by: user.id,
        })
        .select();
      
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Workout plan assigned successfully',
      });
    } catch (error) {
      console.error('Error assigning workout plan:', error);
      toast({
        title: 'Error',
        description: 'Failed to assign workout plan',
        variant: 'destructive',
      });
    } finally {
      setIsAssignDialogOpen(false);
      setSelectedPlan(null);
      setSelectedMember('');
    }
  };
  
  const getDifficultyBadge = (level) => {
    switch (level) {
      case 'beginner':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Beginner</Badge>;
      case 'intermediate':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">Intermediate</Badge>;
      case 'advanced':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">Advanced</Badge>;
      case 'expert':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">Expert</Badge>;
      default:
        return <Badge variant="outline">{level}</Badge>;
    }
  };
  
  const renderPlansTable = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <p className="text-muted-foreground">Loading workout plans...</p>
        </div>
      );
    }
    
    if (filteredPlans.length === 0) {
      return (
        <div className="flex justify-center items-center h-64">
          <p className="text-muted-foreground">No workout plans found</p>
        </div>
      );
    }
    
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Difficulty</TableHead>
            <TableHead>Created By</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredPlans.map((plan) => (
            <TableRow key={plan.id}>
              <TableCell className="font-medium">{plan.name}</TableCell>
              <TableCell>{plan.category}</TableCell>
              <TableCell>{getDifficultyBadge(plan.difficulty_level)}</TableCell>
              <TableCell>{plan.profiles?.full_name || 'System'}</TableCell>
              <TableCell>{format(new Date(plan.created_at), 'MMM d, yyyy')}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleViewPlan(plan)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  
                  {canEditPlans && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditPlan(plan)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                  
                  {canAssignPlans && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleAssignClick(plan)}
                    >
                      <UserPlus className="h-4 w-4" />
                    </Button>
                  )}
                  
                  {canEditPlans && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteClick(plan)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };
  
  const renderAssignedPlansTable = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <p className="text-muted-foreground">Loading assigned plans...</p>
        </div>
      );
    }
    
    if (assignedPlans.length === 0) {
      return (
        <div className="flex justify-center items-center h-64">
          <p className="text-muted-foreground">No assigned workout plans found</p>
        </div>
      );
    }
    
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Plan Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Difficulty</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assignedPlans.map((assignment) => (
            <TableRow key={assignment.id}>
              <TableCell className="font-medium">{assignment.workout_plans.name}</TableCell>
              <TableCell>{assignment.workout_plans.category}</TableCell>
              <TableCell>{getDifficultyBadge(assignment.workout_plans.difficulty_level)}</TableCell>
              <TableCell>{format(new Date(assignment.start_date), 'MMM d, yyyy')}</TableCell>
              <TableCell>{format(new Date(assignment.end_date), 'MMM d, yyyy')}</TableCell>
              <TableCell>
                <Badge 
                  variant={assignment.status === 'active' ? 'default' : 'secondary'}
                >
                  {assignment.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleViewPlan(assignment.workout_plans)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <CardTitle>
            {assignOnly ? 'Assign Workout Plans' : forMemberId ? 'My Workout Plans' : 'Workout Plans'}
          </CardTitle>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search plans..."
                className="pl-8 w-full sm:w-[200px] md:w-[260px]"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
            
            {!forMemberId && (
              <Select value={filterCategory} onValueChange={handleFilterChange}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="Filter" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="strength">Strength</SelectItem>
                  <SelectItem value="cardio">Cardio</SelectItem>
                  <SelectItem value="flexibility">Flexibility</SelectItem>
                  <SelectItem value="hiit">HIIT</SelectItem>
                  <SelectItem value="bodybuilding">Bodybuilding</SelectItem>
                  <SelectItem value="weight-loss">Weight Loss</SelectItem>
                  <SelectItem value="muscle-gain">Muscle Gain</SelectItem>
                </SelectContent>
              </Select>
            )}
            
            {canEditPlans && !assignOnly && !forMemberId && (
              <Button onClick={handleCreatePlan}>
                <Plus className="h-4 w-4 mr-2" />
                Create Plan
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {forMemberId ? (
          renderAssignedPlansTable()
        ) : (
          renderPlansTable()
        )}
      </CardContent>
      
      {/* Assign Plan Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Workout Plan</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h4 className="font-medium">Selected Plan</h4>
              <p>{selectedPlan?.name}</p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Select Member</h4>
              <Select value={selectedMember} onValueChange={setSelectedMember}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a member" />
                </SelectTrigger>
                <SelectContent>
                  {members.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssignPlan}>
              <UserPlus className="h-4 w-4 mr-2" />
              Assign Plan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Plan Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Workout Plan</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete the workout plan "{selectedPlan?.name}"?</p>
            <p className="text-muted-foreground mt-2">This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeletePlan}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Plan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default WorkoutPlansManager;
