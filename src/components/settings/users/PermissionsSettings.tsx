
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { usePermissionsManagement } from "@/hooks/use-permissions-management";
import { PermissionHeader } from "./permissions/PermissionHeader";
import { PermissionFilters } from "./permissions/PermissionFilters";
import { PermissionTable } from "./permissions/PermissionTable";
import { PermissionFooter } from "./permissions/PermissionFooter";
import { AddRoleDialog } from "./permissions/AddRoleDialog";

const PermissionsSettings = () => {
  const {
    isLoading,
    searchTerm,
    setSearchTerm,
    selectedModule,
    setSelectedModule,
    isRoleDialogOpen,
    setIsRoleDialogOpen,
    newRoleName,
    setNewRoleName,
    newRoleDescription,
    setNewRoleDescription,
    modules,
    filteredPermissions,
    roles,
    handlePermissionChange,
    handleSaveChanges,
    handleAddRole,
    handleDeleteRole
  } = usePermissionsManagement();

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
