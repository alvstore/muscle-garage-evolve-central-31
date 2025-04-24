
import { Badge } from "@/components/ui/badge";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

export function PermissionHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <CardTitle>Role & Permissions Management</CardTitle>
        <CardDescription>
          Manage access control for different user roles
        </CardDescription>
      </div>
      <Badge variant="secondary" className="px-3 py-1 flex items-center gap-1">
        <Shield className="h-3.5 w-3.5" />
        Admin Only
      </Badge>
    </div>
  );
}
