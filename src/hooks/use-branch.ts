
import { useState, useEffect } from "react";
import { useAuth } from "./use-auth";
import { branchService, Branch } from "@/services/branchService";

export const useBranch = () => {
  const { user, updateUserBranch } = useAuth();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [currentBranch, setCurrentBranch] = useState<Branch | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadBranches = async () => {
      if (!user) {
        setBranches([]);
        setCurrentBranch(null);
        setLoading(false);
        return;
      }
      
      try {
        // Load branches the user has access to
        const accessibleBranches = await branchService.getUserBranches(user);
        setBranches(accessibleBranches);
        
        // Set current branch based on user's branchId
        if (user.branchId && accessibleBranches.length > 0) {
          const branch = accessibleBranches.find(b => b.id === user.branchId);
          setCurrentBranch(branch || accessibleBranches[0]);
        } else if (accessibleBranches.length > 0) {
          setCurrentBranch(accessibleBranches[0]);
        } else {
          setCurrentBranch(null);
        }
      } catch (error) {
        console.error("Failed to load branches:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadBranches();
  }, [user]);
  
  const switchBranch = async (branchId: string) => {
    if (!user || !updateUserBranch) return;
    
    const branch = branches.find(b => b.id === branchId);
    if (!branch) return;
    
    try {
      await updateUserBranch(branchId);
      setCurrentBranch(branch);
    } catch (error) {
      console.error("Failed to switch branch:", error);
    }
  };
  
  return {
    branches,
    currentBranch,
    loading,
    switchBranch,
    canSwitchBranches: branches.length > 1,
  };
};
