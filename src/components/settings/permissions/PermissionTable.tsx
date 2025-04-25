
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash } from 'lucide-react';

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

export const PermissionTable: React.FC<PermissionTableProps> = ({
  filteredPermissions,
  roles,
  onPermissionChange,
  onDeleteRole
}) => {
  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[200px]">Permission</TableHead>
            <TableHead className="w-[180px]">Module</TableHead>
            {roles.map(role => (
              <TableHead key={role.id} className="text-center">
                <div className="flex flex-col items-center">
                  <span>{role.name}</span>
                  {!role.isSystem && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-destructive hover:text-destructive"
                      onClick={() => onDeleteRole(role.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredPermissions.map(permission => (
            <TableRow key={permission.id}>
              <TableCell className="font-medium">
                <div>
                  <div className="font-medium">{permission.name}</div>
                  <div className="text-xs text-muted-foreground">{permission.description}</div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  {permission.module}
                </Badge>
              </TableCell>
              {roles.map(role => (
                <TableCell key={`${role.id}-${permission.id}`} className="text-center">
                  <Checkbox
                    checked={role.permissions[permission.id] || false}
                    onCheckedChange={(checked) => 
                      onPermissionChange(role.id, permission.id, !!checked)
                    }
                    disabled={role.isSystem && role.name === 'Admin'} // Admin role has all permissions
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
          {filteredPermissions.length === 0 && (
            <TableRow>
              <TableCell colSpan={2 + roles.length} className="text-center py-6">
                No permissions found. Try adjusting your search or filters.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
