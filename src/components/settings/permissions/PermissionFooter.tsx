
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckSquare, Loader2 } from "lucide-react";

interface PermissionFooterProps {
  isLoading: boolean;
  onReset: () => void;
  onSave: () => void;
}

export function PermissionFooter({ isLoading, onReset, onSave }: PermissionFooterProps) {
  return (
    <>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onReset}>
          Reset
        </Button>
        <Button onClick={onSave} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <CheckSquare className="mr-2 h-4 w-4" />
              Save Permissions
            </>
          )}
        </Button>
      </div>
      
      <div className="rounded-md bg-amber-50 p-4 border border-amber-200 text-amber-800">
        <div className="flex gap-2">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <div>
            <h4 className="font-medium">Important Note</h4>
            <p className="text-sm mt-1">
              Changes to permissions will take effect immediately for all users with the modified roles.
              System roles have some restrictions that cannot be modified for security reasons.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
