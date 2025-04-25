
import React, { useState } from 'react';
import { Container } from '@/components/ui/container';
import { Card, CardContent } from '@/components/ui/card';
import { PermissionHeader } from '@/components/settings/permissions/PermissionHeader';
import { PermissionFilters } from '@/components/settings/permissions/PermissionFilters';
import { PermissionTable } from '@/components/settings/permissions/PermissionTable';
import { PermissionFooter } from '@/components/settings/permissions/PermissionFooter';
import { AddRoleDialog } from '@/components/settings/permissions/AddRoleDialog';

// Mock data for permissions and roles
const mockPermissions = [
  { id: 'p1', name: 'View Members', description: 'Can view member profiles', module: 'members' },
  { id: 'p2', name: 'Create Members', description: 'Can add new members', module: 'members' },
  { id: 'p3', name: 'Edit Members', description: 'Can modify member details', module: 'members' },
  { id: 'p4', name: 'Delete Members', description: 'Can remove members', module: 'members' },
  
  { id: 'p5', name: 'View Classes', description: 'Can view class schedules', module: 'classes' },
  { id: 'p6', name: 'Create Classes', description: 'Can create new classes', module: 'classes' },
  { id: 'p7', name: 'Edit Classes', description: 'Can modify class details', module: 'classes' },
  { id: 'p8', name: 'Delete Classes', description: 'Can cancel classes', module: 'classes' },
  
  { id: 'p9', name: 'View Reports', description: 'Can access reports', module: 'reports' },
  { id: 'p10', name: 'Export Reports', description: 'Can export report data', module: 'reports' },
  
  { id: 'p11', name: 'Manage Settings', description: 'Can change system settings', module: 'settings' },
  { id: 'p12', name: 'Manage Users', description: 'Can manage user accounts', module: 'users' },
];

const mockRoles = [
  { 
    id: 'r1', 
    name: 'Admin', 
    description: 'Full system access', 
    isSystem: true,
    permissions: mockPermissions.reduce((acc, p) => ({ ...acc, [p.id]: true }), {})
  },
  { 
    id: 'r2', 
    name: 'Manager', 
    description: 'Branch management access', 
    isSystem: true,
    permissions: {
      p1: true, p2: true, p3: true, p4: false,
      p5: true, p6: true, p7: true, p8: false,
      p9: true, p10: true,
      p11: false, p12: false
    }
  },
  { 
    id: 'r3', 
    name: 'Trainer', 
    description: 'Trainer-specific permissions', 
    isSystem: true,
    permissions: {
      p1: true, p2: false, p3: false, p4: false,
      p5: true, p6: false, p7: false, p8: false,
      p9: false, p10: false,
      p11: false, p12: false
    }
  }
];

const RolePermissionsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModule, setSelectedModule] = useState('all');
  const [isAddRoleOpen, setIsAddRoleOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDescription, setNewRoleDescription] = useState('');
  const [roles, setRoles] = useState(mockRoles);
  const [isLoading, setIsLoading] = useState(false);
  
  const modules = ['all', ...Array.from(new Set(mockPermissions.map(p => p.module)))];
  
  // Filter permissions based on search term and selected module
  const filteredPermissions = mockPermissions.filter(permission => {
    const matchesSearch = 
      permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permission.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesModule = selectedModule === 'all' || permission.module === selectedModule;
    
    return matchesSearch && matchesModule;
  });
  
  const handlePermissionChange = (roleId: string, permissionId: string, value: boolean) => {
    setRoles(roles.map(role => 
      role.id === roleId 
        ? { ...role, permissions: { ...role.permissions, [permissionId]: value } }
        : role
    ));
  };
  
  const handleDeleteRole = (roleId: string) => {
    setRoles(roles.filter(role => role.id !== roleId));
  };
  
  const handleAddRole = () => {
    if (!newRoleName.trim()) return;
    
    const newRole = {
      id: `r${roles.length + 1}`,
      name: newRoleName,
      description: newRoleDescription,
      isSystem: false,
      permissions: mockPermissions.reduce((acc, p) => ({ ...acc, [p.id]: false }), {})
    };
    
    setRoles([...roles, newRole]);
    setNewRoleName('');
    setNewRoleDescription('');
    setIsAddRoleOpen(false);
  };
  
  const handleSave = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Show success notification here
    }, 1000);
  };
  
  const handleReset = () => {
    setRoles(mockRoles);
  };

  return (
    <Container>
      <div className="space-y-6 py-6">
        <Card>
          <CardContent className="p-6 space-y-6">
            <PermissionHeader />
            
            <PermissionFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedModule={selectedModule}
              onModuleChange={setSelectedModule}
              modules={modules}
              onAddRoleClick={() => setIsAddRoleOpen(true)}
            />
            
            <PermissionTable
              filteredPermissions={filteredPermissions}
              roles={roles}
              onPermissionChange={handlePermissionChange}
              onDeleteRole={handleDeleteRole}
            />
            
            <PermissionFooter
              isLoading={isLoading}
              onReset={handleReset}
              onSave={handleSave}
            />
          </CardContent>
        </Card>
        
        <AddRoleDialog
          isOpen={isAddRoleOpen}
          onOpenChange={setIsAddRoleOpen}
          newRoleName={newRoleName}
          onRoleNameChange={setNewRoleName}
          newRoleDescription={newRoleDescription}
          onRoleDescriptionChange={setNewRoleDescription}
          onAddRole={handleAddRole}
        />
      </div>
    </Container>
  );
};

export default RolePermissionsPage;
