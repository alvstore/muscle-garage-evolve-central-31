
import React from "react";
import { TableHead, TableRow } from "@/components/ui/table";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

interface Role {
  id: string;
  name: string;
  isSystem: boolean;
}

interface PermissionTableHeaderProps {
  roles: Role[];
  onDeleteRole: (roleId: string) => void;
}

export function PermissionTableHeader({ roles, onDeleteRole }: PermissionTableHeaderProps) {
  return (
    <TableRow>
      <TableHead className="min-w-[200px]">Permission</TableHead>
      <TableHead className="min-w-[250px]">Description</TableHead>
      {roles.map(role => (
        <TableHead key={role.id} className="text-center min-w-[100px]">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1">
              {role.name}
              {role.isSystem && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3.5 w-3.5 text-blue-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>System role - some restrictions apply</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            <div className="flex items-center mt-1">
              {!role.isSystem && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => onDeleteRole(role.id)}
                >
                  Delete
                </Button>
              )}
            </div>
          </div>
        </TableHead>
      ))}
    </TableRow>
  );
}
