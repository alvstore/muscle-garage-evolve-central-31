
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PermissionTableCell } from "./PermissionTableCell";

interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
}

interface Role {
  id: string;
  name: string;
  isSystem: boolean;
  permissions: Record<string, boolean>;
}

interface PermissionTableRowProps {
  permission: Permission;
  roles: Role[];
  onPermissionChange: (roleId: string, permissionId: string, value: boolean) => void;
}

export function PermissionTableRow({
  permission,
  roles,
  onPermissionChange,
}: PermissionTableRowProps) {
  return (
    <TableRow>
      <TableCell className="font-medium">
        <Badge variant="outline" className="mr-2">
          {permission.module}
        </Badge>
        {permission.name}
      </TableCell>
      <TableCell>{permission.description}</TableCell>
      {roles.map(role => (
        <PermissionTableCell
          key={`${role.id}-${permission.id}`}
          roleId={role.id}
          permissionId={permission.id}
          checked={!!role.permissions[permission.id]}
          disabled={role.isSystem && permission.name === "manage_settings"}
          onPermissionChange={onPermissionChange}
        />
      ))}
    </TableRow>
  );
}
