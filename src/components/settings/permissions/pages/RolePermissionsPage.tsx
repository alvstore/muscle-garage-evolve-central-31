
import React, { useState, useEffect } from 'react';
import { Container } from '@/components/ui/container';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Plus, Trash, Edit, Info, Users, Settings, Shield, Database, FileText, DollarSign, Calendar, Activity } from 'lucide-react';
import { toast } from 'sonner';

// Types
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
  userCount: number;
  permissions: Record<string, boolean>;
}

interface PermissionGroup {
  name: string;
  icon: React.ReactNode;
  permissions: Permission[];
}

// Add imports for reusable components
import { AddRoleDialog } from '@/components/settings/permissions/AddRoleDialog';
import { PermissionHeader } from '@/components/settings/permissions/PermissionHeader';
import { PermissionFooter } from '@/components/settings/permissions/PermissionFooter';

/* 
// Example of how to use the components:
<Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
  // Dialog content
</Dialog>

// Can be replaced with:
<AddRoleDialog
  isOpen={isAddDialogOpen}
  onOpenChange={setIsAddDialogOpen}
  newRoleName={newRoleName}
  onRoleNameChange={setNewRoleName}
  newRoleDescription={newRoleDescription}
  onRoleDescriptionChange={setNewRoleDescription}
  onAddRole={handleAddRole}
/>
*/

const RolePermissionsPage = () => {
  // State
  const [roles, setRoles] = useState<Role[]>([
    { 
      id: 'r1', 
      name: 'Administrator', 
      description: 'Full system access with all permissions', 
      isSystem: true,
      userCount: 4,
      permissions: {} // Will be populated in useEffect
    },
    { 
      id: 'r2', 
      name: 'Manager', 
      description: 'Branch management with limited admin capabilities', 
      isSystem: true,
      userCount: 7,
      permissions: {} // Will be populated in useEffect
    },
    { 
      id: 'r3', 
      name: 'Trainer', 
      description: 'Access to training schedules and member fitness data', 
      isSystem: true,
      userCount: 6,
      permissions: {} // Will be populated in useEffect
    },
    { 
      id: 'r4', 
      name: 'Member', 
      description: 'Limited access to personal data and class bookings', 
      isSystem: true,
      userCount: 5,
      permissions: {} // Will be populated in useEffect
    },
    { 
      id: 'r5', 
      name: 'Restricted User', 
      description: 'Very limited access for trial members', 
      isSystem: false,
      userCount: 10,
      permissions: {} // Will be populated in useEffect
    }
  ]);
  
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDescription, setNewRoleDescription] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Permission groups with icons
  const permissionGroups: PermissionGroup[] = [
    {
      name: 'User Management',
      icon: <Users className="h-5 w-5" />,
      permissions: [
        { id: 'p1', name: 'View Users', description: 'Can view user profiles', module: 'users' },
        { id: 'p2', name: 'Create Users', description: 'Can add new users', module: 'users' },
        { id: 'p3', name: 'Edit Users', description: 'Can modify user details', module: 'users' },
        { id: 'p4', name: 'Delete Users', description: 'Can remove users', module: 'users' },
      ]
    },
    {
      name: 'Content Management',
      icon: <FileText className="h-5 w-5" />,
      permissions: [
        { id: 'p5', name: 'View Content', description: 'Can view website content', module: 'content' },
        { id: 'p6', name: 'Create Content', description: 'Can create new content', module: 'content' },
        { id: 'p7', name: 'Edit Content', description: 'Can modify content', module: 'content' },
        { id: 'p8', name: 'Delete Content', description: 'Can remove content', module: 'content' },
      ]
    },
    {
      name: 'Disputes Management',
      icon: <Shield className="h-5 w-5" />,
      permissions: [
        { id: 'p9', name: 'View Disputes', description: 'Can view member disputes', module: 'disputes' },
        { id: 'p10', name: 'Resolve Disputes', description: 'Can resolve member disputes', module: 'disputes' },
        { id: 'p11', name: 'Escalate Disputes', description: 'Can escalate disputes to management', module: 'disputes' },
      ]
    },
    {
      name: 'Database Management',
      icon: <Database className="h-5 w-5" />,
      permissions: [
        { id: 'p12', name: 'View Data', description: 'Can view database records', module: 'database' },
        { id: 'p13', name: 'Export Data', description: 'Can export database records', module: 'database' },
        { id: 'p14', name: 'Modify Data', description: 'Can modify database records', module: 'database' },
      ]
    },
    {
      name: 'Financial Management',
      icon: <DollarSign className="h-5 w-5" />,
      permissions: [
        { id: 'p15', name: 'View Finances', description: 'Can view financial records', module: 'finance' },
        { id: 'p16', name: 'Process Payments', description: 'Can process payments', module: 'finance' },
        { id: 'p17', name: 'Issue Refunds', description: 'Can issue refunds', module: 'finance' },
        { id: 'p18', name: 'Generate Reports', description: 'Can generate financial reports', module: 'finance' },
      ]
    },
    {
      name: 'Class Management',
      icon: <Calendar className="h-5 w-5" />,
      permissions: [
        { id: 'p19', name: 'View Classes', description: 'Can view class schedules', module: 'classes' },
        { id: 'p20', name: 'Create Classes', description: 'Can create new classes', module: 'classes' },
        { id: 'p21', name: 'Edit Classes', description: 'Can modify class details', module: 'classes' },
        { id: 'p22', name: 'Cancel Classes', description: 'Can cancel scheduled classes', module: 'classes' },
      ]
    },
    {
      name: 'Reporting',
      icon: <Activity className="h-5 w-5" />,
      permissions: [
        { id: 'p23', name: 'View Reports', description: 'Can view system reports', module: 'reports' },
        { id: 'p24', name: 'Generate Reports', description: 'Can generate custom reports', module: 'reports' },
        { id: 'p25', name: 'Export Reports', description: 'Can export reports', module: 'reports' },
      ]
    },
    {
      name: 'System Settings',
      icon: <Settings className="h-5 w-5" />,
      permissions: [
        { id: 'p26', name: 'View Settings', description: 'Can view system settings', module: 'settings' },
        { id: 'p27', name: 'Modify Settings', description: 'Can modify system settings', module: 'settings' },
        { id: 'p28', name: 'Manage Integrations', description: 'Can manage third-party integrations', module: 'settings' },
      ]
    },
  ];

  // Flatten permissions for easier access
  const allPermissions = permissionGroups.flatMap(group => group.permissions);

  // Initialize role permissions
  useEffect(() => {
    // Set default permissions based on role
    const updatedRoles = roles.map(role => {
      const permissions: Record<string, boolean> = {};
      
      allPermissions.forEach(permission => {
        // Admin has all permissions
        if (role.name === 'Administrator') {
          permissions[permission.id] = true;
        }
        // Manager has most permissions except some system settings
        else if (role.name === 'Manager') {
          permissions[permission.id] = !['p27', 'p28'].includes(permission.id);
        }
        // Trainer has permissions related to classes and members
        else if (role.name === 'Trainer') {
          permissions[permission.id] = ['p1', 'p5', 'p9', 'p12', 'p19', 'p23', 'p26'].includes(permission.id);
        }
        // Member has very limited permissions
        else if (role.name === 'Member') {
          permissions[permission.id] = ['p5', 'p19'].includes(permission.id);
        }
        // Restricted user has minimal permissions
        else {
          permissions[permission.id] = ['p5'].includes(permission.id);
        }
      });
      
      return { ...role, permissions };
    });
    
    setRoles(updatedRoles);
    if (updatedRoles.length > 0) {
      setSelectedRole(updatedRoles[0]);
    }
  }, []);

  // Handlers
  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    if (!selectedRole) return;
    
    setSelectedRole({
      ...selectedRole,
      permissions: {
        ...selectedRole.permissions,
        [permissionId]: checked
      }
    });
    
    setRoles(roles.map(role => 
      role.id === selectedRole.id 
        ? {
            ...role,
            permissions: {
              ...role.permissions,
              [permissionId]: checked
            }
          }
        : role
    ));
  };

  const handleSelectAll = (groupPermissions: Permission[], checked: boolean) => {
    if (!selectedRole) return;
    
    const updatedPermissions = { ...selectedRole.permissions };
    groupPermissions.forEach(permission => {
      updatedPermissions[permission.id] = checked;
    });
    
    setSelectedRole({
      ...selectedRole,
      permissions: updatedPermissions
    });
    
    setRoles(roles.map(role => 
      role.id === selectedRole.id 
        ? { ...role, permissions: updatedPermissions }
        : role
    ));
  };

  const handleAddRole = () => {
    if (!newRoleName.trim()) return;
    
    const newRole: Role = {
      id: `r${roles.length + 1}`,
      name: newRoleName,
      description: newRoleDescription,
      isSystem: false,
      userCount: 0,
      permissions: allPermissions.reduce((acc, p) => ({ ...acc, [p.id]: false }), {})
    };
    
    setRoles([...roles, newRole]);
    setSelectedRole(newRole);
    setNewRoleName('');
    setNewRoleDescription('');
    setIsAddDialogOpen(false);
    
    toast.success('New role added successfully');
  };

  const handleDeleteRole = (roleId: string) => {
    const roleToDelete = roles.find(r => r.id === roleId);
    if (!roleToDelete || roleToDelete.isSystem) return;
    
    setRoles(roles.filter(role => role.id !== roleId));
    if (selectedRole?.id === roleId) {
      setSelectedRole(roles[0]);
    }
    
    toast.success(`Role "${roleToDelete.name}" deleted successfully`);
  };

  const handleSaveChanges = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Role permissions saved successfully');
    }, 1000);
  };

  // Filter permissions based on search term
  const filteredPermissionGroups = searchTerm.trim() === ''
    ? permissionGroups
    : permissionGroups.map(group => ({
        ...group,
        permissions: group.permissions.filter(permission =>
          permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          permission.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })).filter(group => group.permissions.length > 0);

  return (
    <Container>
      <div className="space-y-6 py-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Roles & Permissions</h1>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add New Role
          </Button>
        </div>
        
        <p className="text-muted-foreground">
          A role provides access to predefined menus and features so that depending on assigned role an administrator can have access to what they need
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Roles List - Left Side */}
          <div className="lg:col-span-4 space-y-4">
            <Card>
              <CardContent className="p-0">
                <div className="p-4 border-b">
                  <h2 className="text-xl font-semibold">Roles List</h2>
                </div>
                <div className="divide-y">
                  {roles.map(role => (
                    <div 
                      key={role.id} 
                      className={`p-4 flex items-center justify-between cursor-pointer hover:bg-muted/50 ${selectedRole?.id === role.id ? 'bg-muted' : ''}`}
                      onClick={() => setSelectedRole(role)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex -space-x-2">
                          {[...Array(Math.min(3, role.userCount))].map((_, i) => (
                            <Avatar key={i} className="border-2 border-background">
                              <AvatarFallback>{role.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                          ))}
                          {role.userCount > 3 && (
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-xs border-2 border-background">
                              +{role.userCount - 3}
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium">{role.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Total {role.userCount} {role.userCount === 1 ? 'user' : 'users'}
                          </p>
                        </div>
                      </div>
                      {!role.isSystem && (
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteRole(role.id);
                          }}
                        >
                          <Trash className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t">
                  <p className="text-sm text-muted-foreground flex items-center">
                    <Info className="h-4 w-4 mr-2" />
                    {roles.filter(r => !r.isSystem).length === 0 
                      ? 'Add a new role if it doesn\'t exist' 
                      : `${roles.filter(r => !r.isSystem).length} custom ${roles.filter(r => !r.isSystem).length === 1 ? 'role' : 'roles'} created`}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Permissions - Right Side */}
          <div className="lg:col-span-8">
            <Card>
              <CardContent className="p-0">
                {selectedRole ? (
                  <>
                    <div className="p-4 border-b flex justify-between items-center">
                      <div>
                        <h2 className="text-xl font-semibold">Edit Role</h2>
                        <p className="text-sm text-muted-foreground">{selectedRole.description}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="relative">
                          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Search permissions"
                            className="pl-8 w-[250px]"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </div>
                        <Button 
                          variant="outline" 
                          onClick={() => setIsEditDialogOpen(true)}
                          disabled={selectedRole.isSystem}
                        >
                          <Edit className="mr-2 h-4 w-4" /> Edit Role
                        </Button>
                      </div>
                    </div>
                    
                    <div className="p-4 space-y-6">
                      {filteredPermissionGroups.map((group, index) => (
                        <div key={index} className="space-y-4">
                          <div className="flex justify-between items-center">
                            <h3 className="font-medium flex items-center">
                              {group.icon}
                              <span className="ml-2">{group.name}</span>
                            </h3>
                            <div className="flex items-center space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleSelectAll(group.permissions, true)}
                                disabled={selectedRole.isSystem && selectedRole.name === 'Administrator'}
                              >
                                Select All
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleSelectAll(group.permissions, false)}
                                disabled={selectedRole.isSystem && selectedRole.name === 'Administrator'}
                              >
                                Deselect All
                              </Button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {group.permissions.map(permission => (
                              <div key={permission.id} className="flex items-start space-x-2">
                                <Checkbox
                                  id={permission.id}
                                  checked={selectedRole.permissions[permission.id] || false}
                                  onCheckedChange={(checked) => 
                                    handlePermissionChange(permission.id, checked === true)
                                  }
                                  disabled={selectedRole.isSystem && selectedRole.name === 'Administrator'}
                                />
                                <div className="space-y-1">
                                  <label 
                                    htmlFor={permission.id} 
                                    className="font-medium cursor-pointer"
                                  >
                                    {permission.name}
                                  </label>
                                  <p className="text-xs text-muted-foreground">{permission.description}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                      
                      {filteredPermissionGroups.length === 0 && (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">No permissions found matching your search.</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4 border-t flex justify-end space-x-2">
                      <Button 
                        variant="outline"
                        onClick={() => {
                          // Reset permissions to original state
                          const originalRole = roles.find(r => r.id === selectedRole.id);
                          if (originalRole) {
                            setSelectedRole(originalRole);
                          }
                        }}
                      >
                        Reset
                      </Button>
                      <Button 
                        onClick={handleSaveChanges}
                        disabled={isLoading || (selectedRole.isSystem && selectedRole.name === 'Administrator')}
                      >
                        {isLoading ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-muted-foreground">Select a role to view and edit permissions</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Add Role Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Role</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Role Name</Label>
              <Input
                id="name"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                placeholder="Enter role name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newRoleDescription}
                onChange={(e) => setNewRoleDescription(e.target.value)}
                placeholder="Describe this role's purpose and access level"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleAddRole}
              disabled={!newRoleName.trim()}
            >
              Add Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Role Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Role Name</Label>
              <Input
                id="edit-name"
                value={selectedRole?.name || ''}
                onChange={(e) => {
                  if (selectedRole) {
                    setSelectedRole({ ...selectedRole, name: e.target.value });
                  }
                }}
                placeholder="Enter role name"
                disabled={selectedRole?.isSystem}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={selectedRole?.description || ''}
                onChange={(e) => {
                  if (selectedRole) {
                    setSelectedRole({ ...selectedRole, description: e.target.value });
                  }
                }}
                placeholder="Describe this role's purpose and access level"
                rows={3}
                disabled={selectedRole?.isSystem}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={() => {
                if (selectedRole) {
                  setRoles(roles.map(role => 
                    role.id === selectedRole.id ? selectedRole : role
                  ));
                  setIsEditDialogOpen(false);
                  toast.success('Role updated successfully');
                }
              }}
              disabled={!selectedRole || selectedRole.isSystem || !selectedRole.name.trim()}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default RolePermissionsPage;
