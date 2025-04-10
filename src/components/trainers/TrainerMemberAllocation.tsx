import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBranch } from '@/hooks/use-branch';
import { Branch } from '@/types/branch';
import { User } from '@/types/user';
import { toast } from 'sonner';
import { branchService } from '@/services/branchService';

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

interface AllocationFormProps {
  branches: Branch[];
  trainers: any[];
  unassignedMembers: any[];
  onAllocate: (trainerId: string, memberId: string) => void;
}

const AllocationForm = ({ branches, trainers, unassignedMembers, onAllocate }: AllocationFormProps) => {
  const [selectedBranch, setSelectedBranch] = useState<string>('');
  const [selectedTrainer, setSelectedTrainer] = useState<string>('');
  const [selectedMember, setSelectedMember] = useState<string>('');
  
  const filteredTrainers = selectedBranch 
    ? trainers.filter(trainer => trainer.branches.includes(selectedBranch))
    : trainers;
    
  const filteredMembers = selectedBranch
    ? unassignedMembers.filter(member => member.branchId === selectedBranch)
    : unassignedMembers;
    
  const handleAllocate = () => {
    if (!selectedTrainer || !selectedMember) {
      toast.error("Please select both a trainer and a member");
      return;
    }
    
    onAllocate(selectedTrainer, selectedMember);
    setSelectedMember('');
  };
  
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
            <SelectItem value="">All Branches</SelectItem>
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
      
      <Button onClick={handleAllocate} className="w-full">
        Allocate Member to Trainer
      </Button>
    </div>
  );
};

interface TrainerMemberAllocationProps {
  isTrainerView?: boolean;
}

const TrainerMemberAllocation = ({ isTrainerView = false }: TrainerMemberAllocationProps) => {
  const { branches } = useBranch();
  const [trainers, setTrainers] = useState(mockTrainers);
  const [unassignedMembers, setUnassignedMembers] = useState(mockUnassignedMembers);
  
  const fetchBranches = async () => {
    try {
      const branchesData = await branchService.getBranches();
      const enrichedBranches = branchesData.map((branch: Branch) => ({
        ...branch,
        createdAt: branch.createdAt || new Date().toISOString(),
        updatedAt: branch.updatedAt || new Date().toISOString()
      }));
      setBranches(enrichedBranches);
    } catch (error) {
      console.error("Failed to fetch branches:", error);
      toast.error("Failed to fetch branches");
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const handleAllocate = (trainerId: string, memberId: string) => {
    // Find the trainer and member
    const trainer = trainers.find(t => t.id === trainerId);
    const member = unassignedMembers.find(m => m.id === memberId);
    
    if (!trainer || !member) return;
    
    // Check if the trainer has capacity
    if (trainer.members >= trainer.maxMembers) {
      toast.error(`${trainer.name} has reached their maximum capacity of members`);
      return;
    }
    
    // Update trainer's member count
    setTrainers(trainers.map(t => 
      t.id === trainerId ? { ...t, members: t.members + 1 } : t
    ));
    
    // Remove member from unassigned list
    setUnassignedMembers(unassignedMembers.filter(m => m.id !== memberId));
    
    toast.success(`${member.name} has been assigned to ${trainer.name}`);
  };
  
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Trainer-Member Allocation</CardTitle>
          <CardDescription>Assign members to trainers by branch</CardDescription>
        </CardHeader>
        <CardContent>
          <AllocationForm 
            branches={branches} 
            trainers={trainers} 
            unassignedMembers={unassignedMembers}
            onAllocate={handleAllocate}
          />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Current Allocations</CardTitle>
          <CardDescription>View trainer workload by branch</CardDescription>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default TrainerMemberAllocation;
