
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  isSystem: boolean;
  permissions: Record<string, boolean>;
}

interface PermissionTableProps {
  filteredPermissions: Permission[];
  roles: Role[];
  onPermissionChange: (roleId: string, permissionId: string, value: boolean) => void;
  onDeleteRole: (roleId: string) => void;
}

export function PermissionTable({
  filteredPermissions,
  roles,
  onPermissionChange,
  onDeleteRole,
}: PermissionTableProps) {
  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
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
        </TableHeader>
        <TableBody>
          {filteredPermissions.map(permission => (
            <TableRow key={permission.id}>
              <TableCell className="font-medium">
                <Badge variant="outline" className="mr-2">
                  {permission.module}
                </Badge>
                {permission.name}
              </TableCell>
              <TableCell>{permission.description}</TableCell>
              {roles.map(role => (
                <TableCell key={`${role.id}-${permission.id}`} className="text-center">
                  <Switch
                    checked={!!role.permissions[permission.id]}
                    onCheckedChange={(checked) => onPermissionChange(role.id, permission.id, checked)}
                    disabled={role.isSystem && permission.name === "manage_settings"}
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
          {filteredPermissions.length === 0 && (
            <TableRow>
              <TableCell colSpan={2 + roles.length} className="h-24 text-center">
                No permissions found matching your filters.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
