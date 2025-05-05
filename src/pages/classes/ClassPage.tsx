
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "@/components/ui/container";
import ClassList from "@/components/classes/ClassList";
import BookingList from "@/components/classes/BookingList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, List } from "lucide-react";

const ClassPage = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");

  return (
    <Container>
      <div className="py-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Class Management</h1>
            <p className="text-muted-foreground">
              View and manage all fitness classes
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-muted rounded-md p-1 flex items-center">
              <Button 
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="gap-1"
              >
                <List className="h-4 w-4" />
                List
              </Button>
              <Button 
                variant={viewMode === "calendar" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("calendar")}
                className="gap-1"
              >
                <Calendar className="h-4 w-4" />
                Calendar
              </Button>
            </div>
            <Button size="sm" onClick={() => navigate('/classes/create')}>
              <Plus className="h-4 w-4 mr-2" />
              Add Class
            </Button>
          </div>
        </div>
        
        {viewMode === "list" ? (
          <Tabs defaultValue="classes">
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
        ) : (
          <div className="bg-card rounded-lg border shadow-sm">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Calendar View</h2>
              <p className="text-muted-foreground mb-4">Switch to the dedicated schedule page for a full calendar view.</p>
              <Button onClick={() => navigate('/classes/schedule')}>
                Open Schedule View
              </Button>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
};

export default ClassPage;
