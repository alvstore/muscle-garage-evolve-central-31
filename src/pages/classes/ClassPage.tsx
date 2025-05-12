
import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, List, BookOpen, Tag } from "lucide-react";
import { usePermissions } from "@/hooks/use-permissions";
import ClassSchedulePage from "./ClassSchedulePage";
import ClassTypesPage from "./ClassTypesPage";
import PageHeader from "@/components/layout/PageHeader";

interface ClassSchedulePageProps {
  hideHeader?: boolean;
}

interface ClassTypesPageProps {
  hideHeader?: boolean;
}

const ClassPage: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState("schedule");
  const { can } = usePermissions();
  const navigate = useNavigate();

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "types") {
      navigate("/classes/types");
    } else if (value === "schedule") {
      navigate("/classes/schedule");
    } else if (value === "list") {
      navigate("/classes/list");
    } else if (value === "bookings") {
      navigate("/classes/bookings");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Classes" 
        description="Manage your gym's class schedule and types" 
        actions={
          can('manage_classes') && (
            <Button onClick={() => navigate("/classes/create")}>
              <Plus className="mr-2 h-4 w-4" /> Create Class
            </Button>
          )
        }
      />

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Class Management</CardTitle>
              <CardDescription>
                View and manage your gym's classes
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs 
            defaultValue="schedule" 
            value={activeTab} 
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="schedule">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule
              </TabsTrigger>
              <TabsTrigger value="list">
                <List className="mr-2 h-4 w-4" />
                Class List
              </TabsTrigger>
              <TabsTrigger value="bookings">
                <BookOpen className="mr-2 h-4 w-4" />
                Bookings
              </TabsTrigger>
              {can('manage_classes') && (
                <TabsTrigger value="types">
                  <Tag className="mr-2 h-4 w-4" />
                  Class Types
                </TabsTrigger>
              )}
            </TabsList>
            <TabsContent value="schedule">
              <div className="mt-4">
                <ClassSchedulePage hideHeader />
              </div>
            </TabsContent>
            
            <TabsContent value="list">
              <div className="mt-4">
                <div className="text-center p-8">
                  <Button onClick={() => navigate('/classes/list')} variant="default">
                    <List className="mr-2 h-4 w-4" />
                    View Full Class List
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">
                    View and manage all classes with advanced filtering and search options
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="bookings">
              <div className="mt-4">
                <div className="text-center p-8">
                  <Button onClick={() => navigate('/classes/bookings')} variant="default">
                    <BookOpen className="mr-2 h-4 w-4" />
                    View All Bookings
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">
                    Manage class bookings, track attendance, and handle cancellations
                  </p>
                </div>
              </div>
            </TabsContent>
            
            {can('manage_classes') && (
              <TabsContent value="types">
                <div className="mt-4">
                  <ClassTypesPage hideHeader />
                </div>
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClassPage;
