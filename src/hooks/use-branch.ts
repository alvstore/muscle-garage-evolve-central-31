
import { useState, useEffect } from "react";
import { Branch } from "@/types/branch";
import { branchService } from "@/services/branchService";
import { useAuth } from "./use-auth";
import { toast } from "sonner";
import { User } from "@/types";

export const useBranch = () => {
  const { user } = useAuth();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [currentBranch, setCurrentBranch] = useState<Branch | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true); // Added for compatibility
  
  const fetchBranches = async () => {
    setIsLoading(true);
    try {
      const fetchedBranches = await branchService.getAllBranches();
      setBranches(fetchedBranches);
      
      // Check if there's a current branch in localStorage
      const storedBranchId = localStorage.getItem('currentBranchId');
      
      // Find current branch, either from localStorage or the first branch
      let currentBranchData: Branch | undefined;
      
      if (storedBranchId) {
        currentBranchData = fetchedBranches.find(branch => branch.id === storedBranchId);
      }
      
      // If no branch found from localStorage, use the first one
      if (!currentBranchData && fetchedBranches.length > 0) {
        currentBranchData = fetchedBranches[0];
      }
      
      if (currentBranchData) {
        setCurrentBranch(currentBranchData);
        localStorage.setItem('currentBranchId', currentBranchData.id);
      }
    } catch (error) {
      console.error("Failed to fetch branches:", error);
      toast.error("Failed to load branch information");
    } finally {
      setLoading(false);
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchBranches();
  }, []);
  
  const switchBranch = async (branchId: string) => {
    try {
      const branch = branches.find(b => b.id === branchId);
      if (!branch) {
        throw new Error("Branch not found");
      }
      
      setCurrentBranch(branch);
      localStorage.setItem('currentBranchId', branchId);
      
      // If there's a user with updateUserBranch method, update the user's branch
      if (user && user.updateUserBranch) {
        await user.updateUserBranch(branchId);
      }
      
      toast.success(`Switched to ${branch.name} branch`);
      return branch;
    } catch (error) {
      console.error("Failed to switch branch:", error);
      toast.error("Failed to switch branch");
      throw error;
    }
  };
  
  const canSwitchBranches = user && (user.role === 'admin' || (user.branchIds && user.branchIds.length > 1));
  
  return {
    branches,
    currentBranch: currentBranch as Branch, // Type assertion for compatibility
    loading,
    isLoading, // Added for compatibility
    fetchBranches, // Added for compatibility
    switchBranch,
    canSwitchBranches
  };
};
