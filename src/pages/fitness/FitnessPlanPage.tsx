
import { useState, useEffect } from "react";
import { FitnessPlanManager } from "@/components/fitness";
import { mockMembers } from "@/data/mockData";
import { Member, User } from "@/types";

const FitnessPlanPage = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get current user
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }

    // Simulate API call to fetch members
    setTimeout(() => {
      // If trainer, only get assigned members
      // If admin or staff, get all members
      let filteredMembers: Member[] = [];
      
      const user = JSON.parse(storedUser || "{}");
      
      if (user.role === "trainer") {
        filteredMembers = mockMembers.filter(m => m.trainerId === user.id) as Member[];
      } else if (user.role === "admin" || user.role === "staff") {
        filteredMembers = mockMembers as Member[];
      }
      
      setMembers(filteredMembers);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full border-4 border-t-accent mx-auto animate-spin"></div>
          <p className="mt-4 text-lg font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!currentUser || (currentUser.role !== "trainer" && currentUser.role !== "admin" && currentUser.role !== "staff")) {
    return (
      <div className="container py-8">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">You do not have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-8">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Fitness & Diet Plans</h1>
      
      <FitnessPlanManager 
        members={members}
        trainerId={currentUser.id}
      />
    </div>
  );
};

export default FitnessPlanPage;
