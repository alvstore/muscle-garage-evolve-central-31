
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { useBranch } from "@/hooks/use-branch";

interface StaffDashboardHeaderProps {
  isLoading: boolean;
  onRefresh: () => void;
}

const StaffDashboardHeader = ({ isLoading, onRefresh }: StaffDashboardHeaderProps) => {
  const { currentBranch } = useBranch();

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Staff Dashboard</h1>
        <p className="text-muted-foreground">
          Branch: {currentBranch?.name || 'Unknown Branch'}
        </p>
      </div>
      <Button 
        size="sm" 
        variant="outline" 
        className="flex items-center gap-1"
        onClick={onRefresh}
        disabled={isLoading}
      >
        <RefreshCcw className="h-4 w-4" />
        Refresh
      </Button>
    </div>
  );
};

export default StaffDashboardHeader;
