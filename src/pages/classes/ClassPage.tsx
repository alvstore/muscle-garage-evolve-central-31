
import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from "@/components/ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui";
import { Button } from "@/components/ui";
import { Plus } from "lucide-react";
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
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              {can('manage_classes') && (
                <TabsTrigger value="types">Class Types</TabsTrigger>
              )}
            </TabsList>
            <TabsContent value="schedule">
              <div className="mt-4">
                <ClassSchedulePage hideHeader />
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
