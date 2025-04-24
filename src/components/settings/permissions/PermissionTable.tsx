
import React from "react";
import { Table, TableBody, TableHeader } from "@/components/ui/table";
import { PermissionTableHeader } from "./table/PermissionTableHeader";
import { PermissionTableRow } from "./table/PermissionTableRow";

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
          <PermissionTableHeader roles={roles} onDeleteRole={onDeleteRole} />
        </TableHeader>
        <TableBody>
          {filteredPermissions.map(permission => (
            <PermissionTableRow
              key={permission.id}
              permission={permission}
              roles={roles}
              onPermissionChange={onPermissionChange}
            />
          ))}
          {filteredPermissions.length === 0 && (
            <tr>
              <td colSpan={2 + roles.length} className="h-24 text-center">
                No permissions found matching your filters.
              </td>
            </tr>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
