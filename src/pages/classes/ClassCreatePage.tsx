
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container } from '@/components/ui/container';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ChevronRight, ArrowLeft, Loader2, Save } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useBranch } from '@/hooks/use-branches';

interface ClassFormData {
  name: string;
  description: string;
  type: string;
  start_time: string;
  end_time: string;
  location: string;
  capacity: number;
  trainer_id: string;
  status: string;
}

interface Trainer {
  id: string;
  full_name: string;
}

interface ClassType {
  id: string;
  name: string;
}

const ClassCreatePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentBranch } = useBranch();
  const branchId = currentBranch?.id;
  
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState<ClassFormData>({
    name: '',
    description: '',
    type: '',
    start_time: new Date().toISOString(),
    end_time: new Date(new Date().getTime() + 60 * 60 * 1000).toISOString(),
    location: '',
    capacity: 20,
    trainer_id: '',
    status: 'active',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [classTypes, setClassTypes] = useState<ClassType[]>([]);
  
  useEffect(() => {
    const fetchData = async () => {
      if (!branchId) return;
      
      try {
        setIsLoading(true);
        
        // Fetch trainers
        const { data: trainersData, error: trainersError } = await supabase
          .from('profiles')
          .select('id, full_name')
          .eq('branch_id', branchId)
          .eq('role', 'trainer');
          
        if (trainersError) throw trainersError;
        setTrainers(trainersData || []);
        
        // Fetch class types
        const { data: typesData, error: typesError } = await supabase
          .from('class_types')
          .select('id, name')
          .eq('branch_id', branchId)
          .eq('is_active', true);
          
        if (typesError) throw typesError;
        setClassTypes(typesData || []);
        
        // If in edit mode, fetch class details
        if (isEditMode && id) {
          const { data: classData, error: classError } = await supabase
            .from('classes')
            .select('*')
            .eq('id', id)
            .single();
            
          if (classError) throw classError;
          
          if (classData) {
            setFormData({
              name: classData.name,
              description: classData.description || '',
              type: classData.type,
              start_time: classData.start_time,
              end_time: classData.end_time,
              location: classData.location,
              capacity: classData.capacity,
              trainer_id: classData.trainer_id,
              status: classData.status,
            });
          }
        }
      } catch (error: any) {
        console.error('Error loading data:', error);
        toast({
          title: 'Error',
          description: error.message || 'Failed to load required data',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [branchId, id, isEditMode, toast]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: keyof ClassFormData, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCapacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setFormData(prev => ({ ...prev, capacity: value }));
  };
  
  const handleDateSelect = (date: Date | undefined, field: 'start_time' | 'end_time') => {
    if (!date) return;
    
    const currentDateTime = new Date(formData[field]);
    const hours = currentDateTime.getHours();
    const minutes = currentDateTime.getMinutes();
    
    const newDateTime = new Date(date);
    newDateTime.setHours(hours, minutes);
    
    setFormData(prev => ({ ...prev, [field]: newDateTime.toISOString() }));
  };
  
  const handleTimeChange = (time: string, field: 'start_time' | 'end_time') => {
    if (!time) return;
    
    const [hours, minutes] = time.split(':').map(Number);
    const dateTime = new Date(formData[field]);
    
    dateTime.setHours(hours, minutes);
    
    setFormData(prev => ({ ...prev, [field]: dateTime.toISOString() }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!branchId) {
      toast({
        title: 'Error',
        description: 'No branch selected',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setIsSaving(true);
      
      const classData = {
        ...formData,
        branch_id: branchId,
      };
      
      if (isEditMode && id) {
        // Update existing class
        const { error } = await supabase
          .from('classes')
          .update({
            ...classData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', id);
          
        if (error) throw error;
        
        toast({
          title: 'Success',
          description: 'Class updated successfully',
        });
      } else {
        // Create new class
        const { error } = await supabase
          .from('classes')
          .insert([{
            ...classData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }]);
          
        if (error) throw error;
        
        toast({
          title: 'Success',
          description: 'Class created successfully',
        });
      }
      
      // Navigate back to classes page
      navigate('/classes');
    } catch (error: any) {
      console.error('Error saving class:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save class',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const formatTimeForInput = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  };
  
  if (isLoading) {
    return (
      <Container>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Container>
    );
  }
  
  return (
    <Container>
      <div className="py-6">
        <Breadcrumb className="mb-6">
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="/classes">Classes</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href={isEditMode ? `/classes/edit/${id}` : '/classes/create'} isCurrentPage>
              {isEditMode ? 'Edit Class' : 'Create Class'}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0 mb-6">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon" onClick={() => navigate('/classes')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {isEditMode ? 'Edit Class' : 'Create New Class'}
              </h1>
              <p className="text-muted-foreground">
                {isEditMode ? 'Update class details' : 'Add a new class to your schedule'}
              </p>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Class Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Class Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="e.g., Morning Yoga"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="type">Class Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => handleSelectChange('type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a class type" />
                    </SelectTrigger>
                    <SelectContent>
                      {classTypes.map((type) => (
                        <SelectItem key={type.id} value={type.name}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Enter a description for this class"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left"
                      >
                        {format(new Date(formData.start_time), "PPP")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={new Date(formData.start_time)}
                        onSelect={(date) => {
                          handleDateSelect(date, 'start_time');
                          // Also update end_time to be on the same day
                          handleDateSelect(date, 'end_time');
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    placeholder="e.g., Main Studio"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="start_time">Start Time</Label>
                  <Input
                    id="start_time"
                    type="time"
                    value={formatTimeForInput(formData.start_time)}
                    onChange={(e) => handleTimeChange(e.target.value, 'start_time')}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="end_time">End Time</Label>
                  <Input
                    id="end_time"
                    type="time"
                    value={formatTimeForInput(formData.end_time)}
                    onChange={(e) => handleTimeChange(e.target.value, 'end_time')}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input
                    id="capacity"
                    type="number"
                    min="1"
                    value={formData.capacity}
                    onChange={handleCapacityChange}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="trainer_id">Trainer</Label>
                  <Select
                    value={formData.trainer_id}
                    onValueChange={(value) => handleSelectChange('trainer_id', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a trainer" />
                    </SelectTrigger>
                    <SelectContent>
                      {trainers.map((trainer) => (
                        <SelectItem key={trainer.id} value={trainer.id}>
                          {trainer.full_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleSelectChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => navigate('/classes')}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!formData.name || !formData.type || isSaving}
              >
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSaving ? 'Saving' : <><Save className="mr-2 h-4 w-4" /> Save</>}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </Container>
  );
};

export default ClassCreatePage;
