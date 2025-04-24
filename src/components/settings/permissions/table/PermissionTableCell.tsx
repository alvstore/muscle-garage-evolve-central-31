
import React from "react";
import { TableCell } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";

interface PermissionTableCellProps {
  roleId: string;
  permissionId: string;
  checked: boolean;
  disabled?: boolean;
  onPermissionChange: (roleId: string, permissionId: string, value: boolean) => void;
}

export function PermissionTableCell({
  roleId,
  permissionId,
  checked,
  disabled,
  onPermissionChange,
}: PermissionTableCellProps) {
  return (
    <TableCell className="text-center">
      <Switch
        checked={checked}
        onCheckedChange={(checked) => onPermissionChange(roleId, permissionId, checked)}
        disabled={disabled}
      />
    </TableCell>
  );
}
