
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusIcon, Edit2, Trash2, Users, Calendar, Clock, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { useBranch } from "@/hooks/use-branch";
import { toast } from "sonner";
import ClassForm from "./ClassForm";

interface ClassItem {
  id: string;
  name: string;
  description?: string;
  trainer_id: string;
  trainerName?: string;
  type: string;
  difficulty: string;
  capacity: number;
  location: string;
  start_time: string;
  end_time: string;
  recurring: boolean;
  recurring_pattern?: string;
  status: string;
  enrolled: number;
  branch_id?: string;
}

const ClassList = () => {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassItem | null>(null);
  const { currentBranch } = useBranch();
  
  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      try {
        let query = supabase
          .from('class_schedules')
          .select(`
            *,
            profiles:trainer_id (full_name)
          `)
          .order('start_time', { ascending: true });
        
        if (currentBranch?.id) {
          query = query.eq('branch_id', currentBranch.id);
        }
        
        const { data, error } = await query;
        
        if (error) {
          throw error;
        }
        
        if (data) {
          // Transform the data to match our interface
          const transformedData: ClassItem[] = data.map(item => ({
            id: item.id,
            name: item.name,
            description: item.description,
            trainer_id: item.trainer_id,
            trainerName: item.profiles?.full_name,
            type: item.type,
            difficulty: item.difficulty,
            capacity: item.capacity,
            location: item.location,
            start_time: item.start_time,
            end_time: item.end_time,
            recurring: item.recurring,
            recurring_pattern: item.recurring_pattern,
            status: item.status,
            enrolled: item.enrolled || 0,
            branch_id: item.branch_id
          }));
          
          setClasses(transformedData);
        }
      } catch (error) {
        console.error('Error fetching classes:', error);
        toast.error('Failed to load class schedule');
      } finally {
        setLoading(false);
      }
    };
    
    fetchClasses();
  }, [currentBranch?.id]);
  
  const handleAddClass = () => {
    setEditingClass(null);
    setIsFormOpen(true);
  };
  
  const handleEditClass = (classItem: ClassItem) => {
    setEditingClass(classItem);
    setIsFormOpen(true);
  };
  
  const handleDeleteClass = async (id: string) => {
    try {
      const { error } = await supabase
        .from('class_schedules')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      setClasses(classes.filter(c => c.id !== id));
      toast.success("Class deleted successfully");
    } catch (error) {
      console.error('Error deleting class:', error);
      toast.error('Failed to delete class');
    }
  };
  
  const handleSaveClass = async (classItem: any) => {
    try {
      // Format the data for Supabase
      const classData = {
        name: classItem.name,
        description: classItem.description,
        trainer_id: classItem.trainer_id,
        type: classItem.type,
        difficulty: classItem.difficulty,
        capacity: classItem.capacity,
        location: classItem.location,
        start_time: classItem.start_time,
        end_time: classItem.end_time,
        recurring: classItem.recurring,
        recurring_pattern: classItem.recurring_pattern,
        status: classItem.status,
        branch_id: currentBranch?.id
      };
      
      if (editingClass) {
        // Update existing class
        const { error } = await supabase
          .from('class_schedules')
          .update(classData)
          .eq('id', editingClass.id);
        
        if (error) {
          throw error;
        }
        
        // Update local state
        setClasses(prevClasses =>
          prevClasses.map(c =>
            c.id === editingClass.id
              ? {
                  ...c,
                  ...classData,
                  trainerName: classItem.trainerName // Preserve trainer name in UI
                }
              : c
          )
        );
        
        toast.success("Class updated successfully");
      } else {
        // Create new class
        const { data, error } = await supabase
          .from('class_schedules')
          .insert(classData)
          .select();
        
        if (error) {
          throw error;
        }
        
        if (data && data[0]) {
          const newClass: ClassItem = {
            ...data[0],
            trainerName: classItem.trainerName
          };
          
          setClasses(prevClasses => [newClass, ...prevClasses]);
          toast.success("Class created successfully");
        }
      }
      
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error saving class:', error);
      toast.error('Failed to save class');
    }
  };
  
  const formatTime = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy hh:mm a');
    } catch (error) {
      return 'Invalid date';
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>;
      case 'in-progress':
        return <Badge className="bg-green-100 text-green-800">In Progress</Badge>;
      case 'completed':
        return <Badge className="bg-gray-100 text-gray-800">Completed</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge className="bg-purple-100 text-purple-800">{status}</Badge>;
    }
  };
  
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Class Schedule</CardTitle>
          <Button onClick={handleAddClass} className="flex items-center gap-1">
            <PlusIcon className="h-4 w-4" /> Add Class
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Class Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Trainer</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No classes found. Click "Add Class" to create one.
                    </TableCell>
                  </TableRow>
                ) : (
                  classes.map((classItem) => (
                    <TableRow key={classItem.id}>
                      <TableCell className="font-medium">
                        <div>{classItem.name}</div>
                        <div className="text-xs text-muted-foreground">{classItem.location}</div>
                      </TableCell>
                      <TableCell>
                        <div>{classItem.type}</div>
                        <div className="text-xs text-muted-foreground">{classItem.difficulty}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{formatTime(classItem.start_time)}</span>
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{formatTime(classItem.end_time)}</span>
                        </div>
                      </TableCell>
                      <TableCell>{classItem.trainerName || 'Unassigned'}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          <span>
                            {classItem.enrolled} / {classItem.capacity}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(classItem.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEditClass(classItem)}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDeleteClass(classItem.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {isFormOpen && (
        <ClassForm
          classItem={editingClass}
          onSave={handleSaveClass}
          onCancel={() => setIsFormOpen(false)}
        />
      )}
    </>
  );
};

export default ClassList;
