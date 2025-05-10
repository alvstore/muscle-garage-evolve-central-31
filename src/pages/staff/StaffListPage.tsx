
import React, { useState, useEffect } from 'react';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Search, Loader2, Users } from 'lucide-react';
import { useStaff } from '@/hooks/use-staff';
import CreateStaffForm from '@/components/staff/CreateStaffForm';
import { useBranch } from '@/hooks/use-branch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { StaffMember } from '@/types/staff';

const StaffListPage: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('staff');
  const [isLoading, setIsLoading] = useState(true);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [trainers, setTrainers] = useState<any[]>([]);
  const { currentBranch } = useBranch();
  const { toast } = useToast();
  
  useEffect(() => {
    fetchStaffAndTrainers();
  }, [currentBranch]);
  
  const fetchStaffAndTrainers = async () => {
    setIsLoading(true);
    try {
      // Fetch staff members
      const { data: staffData, error: staffError } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'staff')
        .order('full_name', { ascending: true });
        
      if (staffError) throw staffError;
      
      // Fetch trainers
      const { data: trainerData, error: trainerError } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'trainer')
        .order('full_name', { ascending: true });
        
      if (trainerError) throw trainerError;
      
      setStaffMembers(staffData || []);
      setTrainers(trainerData || []);
    } catch (error: any) {
      console.error('Error fetching staff and trainers:', error);
      toast({
        title: 'Error',
        description: 'Failed to load staff and trainers',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const getInitials = (name: string) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    return parts.length > 1 
      ? `${parts[0][0]}${parts[1][0]}` 
      : parts[0].substring(0, 2);
  };

  const handleStaffCreated = () => {
    setIsDialogOpen(false);
    fetchStaffAndTrainers();
  };
  
  const getFilteredList = () => {
    const list = activeTab === 'staff' ? staffMembers : trainers;
    return list.filter((member) => 
      member.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.department?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };
  
  const filteredList = getFilteredList();
  
  return (
    <Container>
      <div className="py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold">Staff Management</h1>
            <p className="text-muted-foreground">
              Manage your gym's staff and trainers
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Button 
              className="bg-primary hover:bg-primary/90 text-white"
              onClick={() => setIsDialogOpen(true)}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Add Staff
            </Button>
          </div>
        </div>
        
        <Tabs 
          defaultValue="staff" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 w-[200px] mb-4">
            <TabsTrigger value="staff" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Staff
            </TabsTrigger>
            <TabsTrigger value="trainer" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Trainers
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="staff">
            {renderPersonnel(filteredList, "staff")}
          </TabsContent>
          
          <TabsContent value="trainer">
            {renderPersonnel(filteredList, "trainer")}
          </TabsContent>
        </Tabs>
        
        {/* Add Staff Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <CreateStaffForm 
              onSuccess={handleStaffCreated}
              onCancel={() => setIsDialogOpen(false)} 
              staff={[]} 
              refetch={fetchStaffAndTrainers} 
            />
          </DialogContent>
        </Dialog>
      </div>
    </Container>
  );

  function renderPersonnel(list: any[], type: string) {
    if (isLoading) {
      return (
        <div className="flex justify-center my-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }
    
    if (list.length === 0) {
      return (
        <Card className="w-full">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <p className="text-muted-foreground my-4">
              {searchTerm ? 'No results match your search.' : `No ${type === 'staff' ? 'staff members' : 'trainers'} found.`}
            </p>
            <Button className="bg-primary hover:bg-primary/90 text-white" onClick={() => setIsDialogOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              {`Add ${type === 'staff' ? 'Staff' : 'Trainer'}`}
            </Button>
          </CardContent>
        </Card>
      );
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {list.map((member) => (
          <Card key={member.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  {member.avatar_url ? (
                    <AvatarImage src={member.avatar_url} alt={member.full_name} />
                  ) : (
                    <AvatarFallback>{getInitials(member.full_name)}</AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{member.full_name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{member.email}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Role</span>
                  <Badge variant="outline" className="capitalize">
                    {member.role}
                  </Badge>
                </div>
                {member.department && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Department</span>
                    <span className="text-sm">{member.department}</span>
                  </div>
                )}
                {member.branch_id && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Branch</span>
                    <span className="text-sm">{member.branch_id}</span>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end mt-4">
                <Button variant="outline" size="sm">View Details</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
};

export default StaffListPage;
