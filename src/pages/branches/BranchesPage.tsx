
import React, { useState, useEffect } from 'react';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, Trash2, Building2, CheckCircle, XCircle } from 'lucide-react';
import { Branch } from '@/types/branch';
import { useBranch } from '@/hooks/use-branches';
import { usePermissions } from '@/hooks/use-permissions';
import BranchForm from '@/components/branch/BranchForm';
import { PermissionGuard } from '@/components/auth/PermissionGuard';

const BranchesPage = () => {
  const { branches, isLoading } = useBranch();
  const { can } = usePermissions();
  const [selectedTab, setSelectedTab] = useState('all');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  
  const handleAddBranch = () => {
    setSelectedBranch(null);
    setIsEditModalOpen(true);
  };
  
  const handleEditBranch = (branch: Branch) => {
    setSelectedBranch(branch);
    setIsEditModalOpen(true);
  };
  
  const onComplete = () => {
    setIsEditModalOpen(false);
  };
  
  const activeBranches = branches.filter(branch => branch.isActive);
  const inactiveBranches = branches.filter(branch => !branch.isActive);
  
  return (
    <Container>
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Branch Management</h1>
          <PermissionGuard permission="manage_branches">
            <Button onClick={handleAddBranch} className="bg-primary-500 hover:bg-primary-600">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Branch
            </Button>
          </PermissionGuard>
        </div>
        
        <Tabs defaultValue={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Branches</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <BranchList 
              branches={branches} 
              isLoading={isLoading} 
              onEdit={handleEditBranch} 
              showEditOptions={can('manage_branches')}
            />
          </TabsContent>
          
          <TabsContent value="active">
            <BranchList 
              branches={activeBranches} 
              isLoading={isLoading} 
              onEdit={handleEditBranch} 
              showEditOptions={can('manage_branches')}
            />
          </TabsContent>
          
          <TabsContent value="inactive">
            <BranchList 
              branches={inactiveBranches} 
              isLoading={isLoading} 
              onEdit={handleEditBranch} 
              showEditOptions={can('manage_branches')}
            />
          </TabsContent>
        </Tabs>
        
        {isEditModalOpen && (
          <BranchForm
            branch={selectedBranch}
            onComplete={onComplete}
          />
        )}
      </div>
    </Container>
  );
};

interface BranchListProps {
  branches: Branch[];
  isLoading: boolean;
  onEdit: (branch: Branch) => void;
  showEditOptions: boolean;
}

const BranchList = ({ branches, isLoading, onEdit, showEditOptions }: BranchListProps) => {
  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading branches...</p>
      </div>
    );
  }
  
  if (branches.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-md">
        <Building2 className="h-12 w-12 mx-auto text-gray-400" />
        <h3 className="mt-2 text-lg font-medium">No branches found</h3>
        <p className="text-gray-500">There are no branches in this category.</p>
      </div>
    );
  }
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {branches.map((branch) => (
        <Card key={branch.id} className={`overflow-hidden ${!branch.isActive ? 'border-dashed border-gray-300' : ''}`}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="truncate">{branch.name}</CardTitle>
              {branch.isActive ? (
                <span className="flex items-center text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Active
                </span>
              ) : (
                <span className="flex items-center text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full">
                  <XCircle className="h-3 w-3 mr-1" />
                  Inactive
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-600 mb-4">
              <p>{branch.address}</p>
              <p className="mt-1">
                {branch.openingHours && branch.closingHours && (
                  <span>Hours: {branch.openingHours} - {branch.closingHours}</span>
                )}
              </p>
              <p className="mt-1">{branch.phone}</p>
              <p className="mt-1">{branch.email}</p>
            </div>
            
            <div className="text-sm text-gray-600 mb-4">
              <p>
                <span className="font-medium">Manager:</span> {branch.manager || 'Not assigned'}
              </p>
              <p>
                <span className="font-medium">Capacity:</span> {branch.maxCapacity || 'N/A'}
              </p>
            </div>
            
            {showEditOptions && (
              <div className="flex justify-end gap-2 mt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-gray-700"
                  onClick={() => onEdit(branch)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default BranchesPage;
