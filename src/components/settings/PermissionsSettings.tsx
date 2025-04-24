import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";
import { PermissionHeader } from "./permissions/PermissionHeader";
import { PermissionFilters } from "./permissions/PermissionFilters";
import { AddRoleDialog } from "./permissions/AddRoleDialog";
import { PermissionTable } from "./permissions/PermissionTable";
import { PermissionFooter } from "./permissions/PermissionFooter";

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

const PermissionsSettings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedModule, setSelectedModule] = useState<string>("all");
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDescription, setNewRoleDescription] = useState("");

  // Mock permissions data
  const [permissions] = useState<Permission[]>([
    { id: "p1", name: "view_members", description: "View member profiles", module: "members" },
    { id: "p2", name: "edit_members", description: "Edit member profiles", module: "members" },
    { id: "p3", name: "delete_members", description: "Delete members", module: "members" },
    { id: "p4", name: "view_trainers", description: "View trainer profiles", module: "trainers" },
    { id: "p5", name: "edit_trainers", description: "Edit trainer profiles", module: "trainers" },
    { id: "p6", name: "delete_trainers", description: "Delete trainers", module: "trainers" },
    { id: "p7", name: "view_classes", description: "View classes", module: "classes" },
    { id: "p8", name: "create_classes", description: "Create classes", module: "classes" },
    { id: "p9", name: "edit_classes", description: "Edit classes", module: "classes" },
    { id: "p10", name: "delete_classes", description: "Delete classes", module: "classes" },
    { id: "p11", name: "view_invoices", description: "View invoices", module: "finance" },
    { id: "p12", name: "create_invoices", description: "Create invoices", module: "finance" },
    { id: "p13", name: "process_payments", description: "Process payments", module: "finance" },
    { id: "p14", name: "view_reports", description: "View reports", module: "reports" },
    { id: "p15", name: "manage_settings", description: "Manage system settings", module: "settings" },
  ]);

  // Mock roles data
  const [roles, setRoles] = useState<Role[]>([
    {
      id: "r1",
      name: "Admin",
      description: "Full system access",
      isSystem: true,
      permissions: {
        p1: true, p2: true, p3: true, p4: true, p5: true, p6: true, p7: true, p8: true,
        p9: true, p10: true, p11: true, p12: true, p13: true, p14: true, p15: true
      }
    },
    {
      id: "r2",
      name: "Manager",
      description: "Branch manager with limited admin rights",
      isSystem: true,
      permissions: {
        p1: true, p2: true, p3: false, p4: true, p5: true, p6: false, p7: true, p8: true,
        p9: true, p10: false, p11: true, p12: true, p13: true, p14: true, p15: false
      }
    },
    {
      id: "r3",
      name: "Trainer",
      description: "Personal trainer with member management",
      isSystem: true,
      permissions: {
        p1: true, p2: true, p3: false, p4: true, p5: false, p6: false, p7: true, p8: false,
        p9: false, p10: false, p11: false, p12: false, p13: false, p14: false, p15: false
      }
    },
    {
      id: "r4",
      name: "Receptionist",
      description: "Front desk staff with limited access",
      isSystem: false,
      permissions: {
        p1: true, p2: false, p3: false, p4: true, p5: false, p6: false, p7: true, p8: false,
        p9: false, p10: false, p11: true, p12: false, p13: true, p14: false, p15: false
      }
    },
  ]);

  // Get unique modules for filter
  const modules = ["all", ...new Set(permissions.map(p => p.module))];

  // Filter permissions based on search and module filter
  const filteredPermissions = permissions.filter(permission => {
    const matchesSearch = permission.name.includes(searchTerm.toLowerCase()) || 
                         permission.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesModule = selectedModule === "all" || permission.module === selectedModule;
    return matchesSearch && matchesModule;
  });

  const handlePermissionChange = (roleId: string, permissionId: string, value: boolean) => {
    const updatedRoles = roles.map(role => {
      if (role.id === roleId) {
        return {
          ...role,
          permissions: {
            ...role.permissions,
            [permissionId]: value
          }
        };
      }
      return role;
    });
    
    setRoles(updatedRoles);
  };

  const handleSaveChanges = async () => {
    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Permissions saved:", roles);
      toast.success("Permissions saved successfully!");
    } catch (error) {
      console.error("Error saving permissions:", error);
      toast.error("Failed to save permissions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddRole = () => {
    if (!newRoleName.trim()) {
      toast.error("Role name is required");
      return;
    }

    const newRole: Role = {
      id: `r${roles.length + 1}`,
      name: newRoleName,
      description: newRoleDescription,
      isSystem: false,
      permissions: Object.fromEntries(permissions.map(p => [p.id, false]))
    };

    setRoles([...roles, newRole]);
    setNewRoleName("");
    setNewRoleDescription("");
    setIsRoleDialogOpen(false);
    toast.success("New role created successfully");
  };

  const handleDeleteRole = (roleId: string) => {
    if (roles.find(r => r.id === roleId)?.isSystem) {
      toast.error("Cannot delete system roles");
      return;
    }

    setRoles(roles.filter(role => role.id !== roleId));
    toast.success("Role deleted successfully");
  };

  return (
    <Card>
      <CardHeader>
        <PermissionHeader />
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <PermissionFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedModule={selectedModule}
            onModuleChange={setSelectedModule}
            modules={modules}
            onAddRoleClick={() => setIsRoleDialogOpen(true)}
          />
          
          <PermissionTable
            filteredPermissions={filteredPermissions}
            roles={roles}
            onPermissionChange={handlePermissionChange}
            onDeleteRole={handleDeleteRole}
          />
          
          <PermissionFooter
            isLoading={isLoading}
            onReset={() => window.location.reload()}
            onSave={handleSaveChanges}
          />
        </div>
      </CardContent>

      <AddRoleDialog
        isOpen={isRoleDialogOpen}
        onOpenChange={setIsRoleDialogOpen}
        newRoleName={newRoleName}
        onRoleNameChange={setNewRoleName}
        newRoleDescription={newRoleDescription}
        onRoleDescriptionChange={setNewRoleDescription}
        onAddRole={handleAddRole}
      />
    </Card>
  );
};

export default PermissionsSettings;
