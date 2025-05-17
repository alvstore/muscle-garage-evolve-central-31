import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { 
  Calendar,
  ChevronDown, 
  Filter, 
  List, 
  Plus, 
  RefreshCw, 
  Table2 
} from "lucide-react";
import { usePermissions } from "@/hooks/use-permissions";
import { useBranch } from "@/hooks/use-branches";
import ClassList from "@/components/classes/ClassList";
import PageHeader from "@/components/layout/PageHeader";
import { GymClass } from "@/types/class";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const ClassListPage: React.FC = () => {
  const [view, setView] = useState<"grid" | "table">("grid");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { can } = usePermissions();
  const { currentBranch } = useBranch();
  const navigate = useNavigate();

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const handleClassSelect = (classItem: GymClass) => {
    navigate(`/classes/${classItem.id}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Class Management" 
        description="View and manage all classes across your gym" 
        actions={
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            
            {can('manage_classes') && (
              <Button onClick={() => navigate("/classes/create")} size="sm">
                <Plus className="mr-2 h-4 w-4" /> Create Class
              </Button>
            )}
          </div>
        }
      />

      <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="px-3 py-1 font-normal">
            Branch: {currentBranch?.name || 'All Branches'}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem>All Classes</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Today's Classes</DropdownMenuItem>
              <DropdownMenuItem>Upcoming Classes</DropdownMenuItem>
              <DropdownMenuItem>Past Classes</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Full Classes</DropdownMenuItem>
              <DropdownMenuItem>Available Classes</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <div className="flex border rounded-md overflow-hidden">
            <Button 
              variant={view === "grid" ? "default" : "ghost"} 
              size="sm" 
              className="rounded-none"
              onClick={() => setView("grid")}
            >
              <Table2 className="h-4 w-4" />
            </Button>
            <Button 
              variant={view === "table" ? "default" : "ghost"} 
              size="sm" 
              className="rounded-none"
              onClick={() => setView("table")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="all">All Classes</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <ClassList onClassSelect={handleClassSelect} />
        </TabsContent>
        
        <TabsContent value="upcoming">
          <ClassList 
            onClassSelect={handleClassSelect}
            filterStatus="upcoming"
          />
        </TabsContent>
        
        <TabsContent value="today">
          <ClassList 
            onClassSelect={handleClassSelect}
            filterStatus="today"
          />
        </TabsContent>
        
        <TabsContent value="past">
          <ClassList 
            onClassSelect={handleClassSelect}
            filterStatus="past"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClassListPage;
