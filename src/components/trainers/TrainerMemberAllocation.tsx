import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Member, Trainer } from "@/types";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { branchService, Branch } from "@/services/branchService";

interface TrainerMemberAllocationProps {
  member: Member;
  trainers: Trainer[];
  onAllocationChange: (trainerId: string | undefined) => void;
}

const TrainerMemberAllocation: React.FC<TrainerMemberAllocationProps> = ({
  member,
  trainers,
  onAllocationChange,
}) => {
  const [selectedTrainerId, setSelectedTrainerId] = useState<string | undefined>(member.trainerId);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranchId, setSelectedBranchId] = useState<string | undefined>(member.primaryBranchId);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const loadBranches = async () => {
      try {
        const branchesData = await branchService.getAllBranches();
        setBranches(branchesData);
      } catch (error) {
        console.error("Error loading branches:", error);
        setError("Failed to load branches. Please try again.");
      }
    };

    loadBranches();
  }, []);

  const handleTrainerChange = (trainerId: string) => {
    setSelectedTrainerId(trainerId);
    onAllocationChange(trainerId);
  };

  const handleBranchChange = (branchId: string) => {
    setSelectedBranchId(branchId);
    // Implement branch change logic here
    toast({
      title: "Branch Changed",
      description: `Member's branch updated to ${branchId}`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trainer & Branch Allocation</CardTitle>
        <CardDescription>Assign a trainer and branch to this member.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && <div className="text-red-500">{error}</div>}
        <div>
          <Label htmlFor="trainer">Trainer</Label>
          <Select onValueChange={handleTrainerChange} defaultValue={selectedTrainerId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a trainer" />
            </SelectTrigger>
            <SelectContent>
              {trainers.map((trainer) => (
                <SelectItem key={trainer.id} value={trainer.id}>
                  {trainer.name}
                </SelectItem>
              ))}
              <SelectItem value="">Unassign Trainer</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="branch">Branch</Label>
          <Select onValueChange={handleBranchChange} defaultValue={selectedBranchId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a branch" />
            </SelectTrigger>
            <SelectContent>
              {branches.map((branch) => (
                <SelectItem key={branch.id} value={branch.id}>
                  {branch.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrainerMemberAllocation;
