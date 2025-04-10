
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Loader2, AlertCircle, Shield, Info, CheckSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { UserRole } from "@/types";

// Permission interface
interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
}

// Role with permissions
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
      // In a real implementation, this would be an API call to save permissions
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
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
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search permissions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
                className="max-w-md"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={selectedModule} onValueChange={setSelectedModule}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by module" />
                </SelectTrigger>
                <SelectContent>
                  {modules.map(module => (
                    <SelectItem key={module} value={module}>
                      {module.charAt(0).toUpperCase() + module.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    Add New Role
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Role</DialogTitle>
                    <DialogDescription>
                      Add a new role with custom permissions
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <label htmlFor="name">Role Name</label>
                      <Input
                        id="name"
                        value={newRoleName}
                        onChange={(e) => setNewRoleName(e.target.value)}
                        placeholder="e.g., Marketing Staff"
                      />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="description">Description</label>
                      <Input
                        id="description"
                        value={newRoleDescription}
                        onChange={(e) => setNewRoleDescription(e.target.value)}
                        placeholder="Describe role permissions and responsibilities"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsRoleDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddRole}>
                      Create Role
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
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
                              onClick={() => handleDeleteRole(role.id)}
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
                          onCheckedChange={(checked) => handlePermissionChange(role.id, permission.id, checked)}
                          disabled={role.isSystem && permission.name === "manage_settings"} // Example restriction
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
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => window.location.reload()}>
              Reset
            </Button>
            <Button onClick={handleSaveChanges} disabled={isLoading}>
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
        </div>
      </CardContent>
    </Card>
  );
};

export default PermissionsSettings;
