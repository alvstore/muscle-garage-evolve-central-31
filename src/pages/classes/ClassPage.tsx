
import { useState } from "react";
import { Container } from "@/components/ui/container";
import ClassList from "@/components/classes/ClassList";
import BookingList from "@/components/classes/BookingList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ClassForm from "@/components/classes/ClassForm";
import { Plus, Calendar, CheckSquare, Settings } from "lucide-react";
import { usePermissions } from "@/hooks/use-permissions";

const ClassPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("classes");
  const { can } = usePermissions();
  const canAddClass = can('manage_classes');

  const handleAddClass = () => {
    setIsDialogOpen(false);
    // Refresh class list
  };

  return (
    <Container>
      <div className="py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold">Class Management</h1>
          
          {canAddClass && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-1">
                  <Plus className="h-4 w-4" />
                  Add New Class
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[800px]">
                <DialogHeader>
                  <DialogTitle>Add New Class</DialogTitle>
                  <DialogDescription>
                    Create a new class for your gym schedule.
                  </DialogDescription>
                </DialogHeader>
                <ClassForm onSave={handleAddClass} />
              </DialogContent>
            </Dialog>
          )}
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="classes" className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Class Schedule
            </TabsTrigger>
            <TabsTrigger value="bookings" className="flex items-center gap-1">
              <CheckSquare className="h-4 w-4" />
              Bookings
            </TabsTrigger>
            {canAddClass && (
              <TabsTrigger value="types" className="flex items-center gap-1">
                <Settings className="h-4 w-4" />
                Class Types
              </TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="classes">
            <ClassList showAddButton={canAddClass} onAddClass={() => setIsDialogOpen(true)} />
          </TabsContent>
          
          <TabsContent value="bookings">
            <BookingList />
          </TabsContent>
          
          {canAddClass && (
            <TabsContent value="types">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Class Types</h2>
                <p className="text-muted-foreground">
                  Manage different types of classes offered at your gym.
                </p>
                <Button onClick={() => window.location.href = '/classes/types'}>
                  Manage Class Types
                </Button>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </Container>
  );
};

export default ClassPage;
