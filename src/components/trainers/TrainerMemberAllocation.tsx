
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBranch } from '@/hooks/use-branches';
import { Branch } from '@/types/branch';
import { User } from '@/types/user';
import { toast } from 'sonner';
import { format, addMonths, isAfter } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { usePermissions } from '@/hooks/use-permissions';

// Mock data for trainers
const mockTrainers = [
  { id: 'trainer1', name: 'John Smith', specialization: 'Weight Loss', members: 8, maxMembers: 12, branches: ['branch1', 'branch2'] },
  { id: 'trainer2', name: 'Sarah Johnson', specialization: 'Strength Training', members: 10, maxMembers: 10, branches: ['branch1'] },
  { id: 'trainer3', name: 'Michael Lee', specialization: 'Yoga/Flexibility', members: 5, maxMembers: 8, branches: ['branch2', 'branch3'] },
  { id: 'trainer4', name: 'Emma Wilson', specialization: 'Cardio', members: 7, maxMembers: 12, branches: ['branch3'] },
];

// Mock data for unassigned members
const mockUnassignedMembers = [
  { id: 'member1', name: 'Alice Brown', goal: 'Weight Loss', branchId: 'branch1' },
  { id: 'member2', name: 'Robert Chen', goal: 'Muscle Building', branchId: 'branch2' },
  { id: 'member3', name: 'James Wilson', goal: 'General Fitness', branchId: 'branch1' },
  { id: 'member4', name: 'Emily Davis', goal: 'Flexibility', branchId: 'branch3' },
];

// Mock data for trainer-member assignments with package expiration
const mockMemberAssignments = [
  { 
    memberId: 'member5', 
    memberName: 'David Miller', 
    trainerId: 'trainer1', 
    packageName: 'Personal Training - 3 Months',
    startDate: '2025-02-15T00:00:00Z',
    endDate: '2025-05-15T00:00:00Z',
    goal: 'Muscle Building',
    sessions: 24,
    sessionsCompleted: 8
  },
  { 
    memberId: 'member6', 
    memberName: 'Jennifer Lee', 
    trainerId: 'trainer1', 
    packageName: 'Personal Training - 1 Month',
    startDate: '2025-03-10T00:00:00Z',
    endDate: '2025-04-10T00:00:00Z',
    goal: 'Weight Loss',
    sessions: 8,
    sessionsCompleted: 6
  },
  { 
    memberId: 'member7', 
    memberName: 'Michael Johnson', 
    trainerId: 'trainer2', 
    packageName: 'Personal Training - 6 Months',
    startDate: '2025-01-05T00:00:00Z',
    endDate: '2025-07-05T00:00:00Z',
    goal: 'Strength Training',
    sessions: 48,
    sessionsCompleted: 16
  }
];

interface AllocationFormProps {
  branches: Branch[];
  trainers: any[];
  unassignedMembers: any[];
  onAllocate: (trainerId: string, memberId: string, packageDuration: number) => void;
  isAdminView: boolean;
}

const AllocationForm = ({ branches, trainers, unassignedMembers, onAllocate, isAdminView }: AllocationFormProps) => {
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [selectedTrainer, setSelectedTrainer] = useState<string>('');
  const [selectedMember, setSelectedMember] = useState<string>('');
  const [packageDuration, setPackageDuration] = useState<number>(1);
  
  const filteredTrainers = selectedBranch === 'all'
    ? trainers
    : trainers.filter(trainer => trainer.branches.includes(selectedBranch));
    
  const filteredMembers = selectedBranch === 'all'
    ? unassignedMembers
    : unassignedMembers.filter(member => member.branchId === selectedBranch);
    
  const handleAllocate = () => {
    if (!selectedTrainer || !selectedMember) {
      toast.error("Please select both a trainer and a member");
      return;
    }
    
    onAllocate(selectedTrainer, selectedMember, packageDuration);
    setSelectedMember('');
    setPackageDuration(1);
  };
  
  if (!isAdminView) {
    return (
      <Alert>
        <AlertTitle>Trainer View</AlertTitle>
        <AlertDescription>
          You can only view assigned members. Admin or staff must assign members to you.
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="branch">Branch</Label>
        <Select 
          value={selectedBranch} 
          onValueChange={setSelectedBranch}
        >
          <SelectTrigger id="branch">
            <SelectValue placeholder="Select branch" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Branches</SelectItem>
            {branches.map(branch => (
              <SelectItem key={branch.id} value={branch.id}>
                {branch.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="trainer">Trainer</Label>
        <Select 
          value={selectedTrainer} 
          onValueChange={setSelectedTrainer}
        >
          <SelectTrigger id="trainer">
            <SelectValue placeholder="Select trainer" />
          </SelectTrigger>
          <SelectContent>
            {filteredTrainers.map(trainer => (
              <SelectItem key={trainer.id} value={trainer.id}>
                {trainer.name} ({trainer.members}/{trainer.maxMembers})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="member">Member</Label>
        <Select 
          value={selectedMember} 
          onValueChange={setSelectedMember}
        >
          <SelectTrigger id="member">
            <SelectValue placeholder="Select member" />
          </SelectTrigger>
          <SelectContent>
            {filteredMembers.map(member => (
              <SelectItem key={member.id} value={member.id}>
                {member.name} - {member.goal}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="package">PT Package Duration (months)</Label>
        <Select 
          value={packageDuration.toString()} 
          onValueChange={(value) => setPackageDuration(parseInt(value))}
        >
          <SelectTrigger id="package">
            <SelectValue placeholder="Select package duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 Month (8 sessions)</SelectItem>
            <SelectItem value="3">3 Months (24 sessions)</SelectItem>
            <SelectItem value="6">6 Months (48 sessions)</SelectItem>
            <SelectItem value="12">12 Months (96 sessions)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Button onClick={handleAllocate} className="w-full">
        Allocate Member to Trainer
      </Button>
    </div>
  );
};

interface AssignedMembersProps {
  memberAssignments: any[];
  currentDate: Date;
}

const AssignedMembers = ({ memberAssignments, currentDate }: AssignedMembersProps) => {
  const isExpired = (endDate: string) => {
    return !isAfter(new Date(endDate), currentDate);
  };
  
  return (
    <div className="space-y-4">
      {memberAssignments.length === 0 ? (
        <p className="text-center text-muted-foreground py-4">No members assigned yet</p>
      ) : (
        memberAssignments.map(assignment => (
          <div key={assignment.memberId} className="p-4 border rounded-lg space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{assignment.memberName}</h3>
                <p className="text-sm text-muted-foreground">Goal: {assignment.goal}</p>
              </div>
              
              <Badge variant={isExpired(assignment.endDate) ? "destructive" : "outline"}>
                {isExpired(assignment.endDate) ? "Expired" : "Active"}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Package:</span> {assignment.packageName}
              </div>
              <div>
                <span className="text-muted-foreground">Sessions:</span> {assignment.sessionsCompleted}/{assignment.sessions}
              </div>
              <div>
                <span className="text-muted-foreground">Start Date:</span> {format(new Date(assignment.startDate), 'MMM dd, yyyy')}
              </div>
              <div>
                <span className="text-muted-foreground">End Date:</span> {format(new Date(assignment.endDate), 'MMM dd, yyyy')}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

interface TrainerMemberAllocationProps {
  isTrainerView?: boolean;
}

const TrainerMemberAllocation = ({ isTrainerView = false }: TrainerMemberAllocationProps) => {
  const { branches } = useBranch();
  const { userRole } = usePermissions();
  const [trainers, setTrainers] = useState(mockTrainers);
  const [unassignedMembers, setUnassignedMembers] = useState(mockUnassignedMembers);
  const [memberAssignments, setMemberAssignments] = useState(mockMemberAssignments);
  const currentDate = new Date();
  
  const isAdminView = userRole === 'admin' || userRole === 'staff';
  
  const handleAllocate = (trainerId: string, memberId: string, packageDuration: number) => {
    // Find the trainer and member
    const trainer = trainers.find(t => t.id === trainerId);
    const member = unassignedMembers.find(m => m.id === memberId);
    
    if (!trainer || !member) return;
    
    // Check if the trainer has capacity
    if (trainer.members >= trainer.maxMembers) {
      toast.error(`${trainer.name} has reached their maximum capacity of members`);
      return;
    }
    
    // Calculate number of sessions based on package duration
    const sessions = packageDuration * 8;
    
    // Create start and end dates
    const startDate = new Date();
    const endDate = addMonths(startDate, packageDuration);
    
    // Create new assignment
    const newAssignment = {
      memberId: member.id,
      memberName: member.name,
      trainerId: trainer.id,
      packageName: `Personal Training - ${packageDuration} ${packageDuration === 1 ? 'Month' : 'Months'}`,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      goal: member.goal,
      sessions: sessions,
      sessionsCompleted: 0
    };
    
    // Update trainer's member count
    setTrainers(trainers.map(t => 
      t.id === trainerId ? { ...t, members: t.members + 1 } : t
    ));
    
    // Remove member from unassigned list
    setUnassignedMembers(unassignedMembers.filter(m => m.id !== memberId));
    
    // Add to assignments
    setMemberAssignments([...memberAssignments, newAssignment]);
    
    toast.success(`${member.name} has been assigned to ${trainer.name} for ${packageDuration} ${packageDuration === 1 ? 'month' : 'months'}`);
  };
  
  // Filter assignments for trainer view
  const filteredAssignments = isTrainerView
    ? memberAssignments.filter(a => a.trainerId === 'trainer1') // Using trainer1 as mock logged-in trainer
    : memberAssignments;
  
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Trainer-Member Allocation</CardTitle>
          <CardDescription>
            {isAdminView 
              ? "Assign members to trainers with specific PT packages" 
              : "Members assigned to you by admin or staff"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isTrainerView ? (
            <AssignedMembers 
              memberAssignments={filteredAssignments}
              currentDate={currentDate}
            />
          ) : (
            <AllocationForm 
              branches={branches} 
              trainers={trainers} 
              unassignedMembers={unassignedMembers}
              onAllocate={handleAllocate}
              isAdminView={isAdminView}
            />
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>
            {isAdminView ? "Current Allocations" : "PT Package Details"}
          </CardTitle>
          <CardDescription>
            {isAdminView 
              ? "View trainer workload by branch" 
              : "Your personal training package information"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isAdminView ? (
            <div className="space-y-4">
              {branches.map(branch => (
                <div key={branch.id} className="space-y-2">
                  <h3 className="font-medium">{branch.name}</h3>
                  <div className="space-y-2">
                    {trainers
                      .filter(trainer => trainer.branches.includes(branch.id))
                      .map(trainer => (
                        <div key={trainer.id} className="flex justify-between items-center p-2 bg-accent/10 rounded">
                          <div>
                            <p className="font-medium">{trainer.name}</p>
                            <p className="text-sm text-muted-foreground">{trainer.specialization}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{trainer.members}/{trainer.maxMembers}</p>
                            <p className="text-sm text-muted-foreground">
                              {trainer.members >= trainer.maxMembers ? "Full" : "Available"}
                            </p>
                          </div>
                        </div>
                      ))
                    }
                    {!trainers.some(trainer => trainer.branches.includes(branch.id)) && (
                      <p className="text-sm text-muted-foreground">No trainers assigned to this branch</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Package Policies</h3>
                <ul className="space-y-2 text-sm">
                  <li>• PT packages are non-transferable between trainers</li>
                  <li>• Rescheduling must be done 24 hours in advance</li>
                  <li>• Unused sessions expire at the end of the package period</li>
                  <li>• All sessions must be booked through the gym's scheduling system</li>
                  <li>• Extensions may be available in case of medical emergencies</li>
                </ul>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Session Information</h3>
                <p className="text-sm">Each session is 60 minutes, including warm-up and cool-down. 
                Your trainer will track your progress and adjust your program as needed.</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TrainerMemberAllocation;
