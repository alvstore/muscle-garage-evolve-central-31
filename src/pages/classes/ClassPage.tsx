
import { useState } from "react";
import { Container } from "@/components/ui/container";
import ClassList from "@/components/classes/ClassList";
import BookingList from "@/components/classes/BookingList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePermissions } from "@/hooks/use-permissions";

const ClassPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("classes");
  const { userRole } = usePermissions();
  const isStaff = userRole === "admin" || userRole === "staff";

  const handleAddClass = () => {
    navigate("/classes/new");
  };

  const handleManageType = () => {
    navigate("/classes/types");
  };

  return (
    <Container>
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Class Management</h1>
          
          {isStaff && activeTab === "classes" && (
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleManageType}>
                Manage Types
              </Button>
              <Button onClick={handleAddClass}>
                <PlusCircle className="h-4 w-4 mr-2" />
                New Class
              </Button>
            </div>
          )}
        </div>
        
        <Tabs defaultValue="classes" onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="classes">Class Schedule</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="classes">
            <ClassList />
          </TabsContent>
          
          <TabsContent value="bookings">
            <BookingList />
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
};

export default ClassPage;
