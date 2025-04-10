
import { useState, useEffect } from "react";
import { Container } from "@/components/ui/container";
import { useAuth } from "@/hooks/use-auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PTPlanManagement from "@/components/trainers/PTPlanManagement";
import { Member } from "@/types";
import { toast } from "sonner";

const TrainerPTPlansPage = () => {
  const { user } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchMembers = async () => {
      setIsLoading(true);
      
      try {
        // In a real app, this would be an API call
        // For now, simulate with mock data
        setTimeout(() => {
          const mockMembers: Member[] = [
            {
              id: "member-1",
              name: "John Doe",
              email: "john.doe@example.com",
              role: "member",
              membershipStatus: "active",
              trainerId: user?.id
            },
            {
              id: "member-2",
              name: "Sarah Parker",
              email: "sarah.parker@example.com",
              role: "member",
              membershipStatus: "active",
              trainerId: user?.id
            },
            {
              id: "member-3",
              name: "Michael Wong",
              email: "michael.wong@example.com",
              role: "member",
              membershipStatus: "active",
              trainerId: user?.id
            },
            {
              id: "member-4",
              name: "Emily Davidson",
              email: "emily.davidson@example.com",
              role: "member",
              membershipStatus: "active"
            },
            {
              id: "member-5",
              name: "David Miller",
              email: "david.miller@example.com",
              role: "member",
              membershipStatus: "active"
            }
          ];
          
          setMembers(mockMembers);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching members:", error);
        toast.error("Failed to load members");
        setIsLoading(false);
      }
    };
    
    fetchMembers();
  }, [user?.id]);

  return (
    <Container>
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-6">Personal Training Plans</h1>
        
        <Tabs defaultValue="current">
          <TabsList className="mb-6">
            <TabsTrigger value="current">Current Plans</TabsTrigger>
            <TabsTrigger value="all">All Members</TabsTrigger>
          </TabsList>
          
          <TabsContent value="current">
            {isLoading ? (
              <div className="h-64 w-full animate-pulse bg-muted rounded-md"></div>
            ) : (
              <PTPlanManagement 
                trainerId={user?.id || ""}
                members={members}
              />
            )}
          </TabsContent>
          
          <TabsContent value="all">
            {isLoading ? (
              <div className="h-64 w-full animate-pulse bg-muted rounded-md"></div>
            ) : (
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Assign personal training plans to any member in the system.
                </p>
                <PTPlanManagement 
                  trainerId={user?.id || ""}
                  members={members}
                />
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
};

export default TrainerPTPlansPage;
