
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Building2, Settings, ExternalLink } from "lucide-react";
import { useBranch } from '@/hooks/use-branch';
import { useNavigate } from 'react-router-dom';
import { PermissionGuard } from '@/components/auth/PermissionGuard';
import { Badge } from "@/components/ui/badge";

const BranchSection = () => {
  const { branches, currentBranch } = useBranch();
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Branch Management</CardTitle>
            <CardDescription>Manage your gym locations</CardDescription>
          </div>
          <PermissionGuard permission="manage_branches">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/settings/branches')}
            >
              <Building2 className="mr-2 h-4 w-4" />
              Manage Branches
            </Button>
          </PermissionGuard>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 p-3 rounded-md">
            <Building2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            <div className="flex-1">
              <p className="font-medium">Current Branch</p>
              <p className="text-sm text-muted-foreground">{currentBranch?.name || 'No branch selected'}</p>
            </div>
            <PermissionGuard permission="manage_branches">
              <Button 
                variant="outline"
                size="sm"
                onClick={() => navigate('/settings/branches/integration')}
              >
                <Settings className="mr-2 h-4 w-4" />
                Configure
              </Button>
            </PermissionGuard>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <p className="font-medium">Active Branches: {branches.filter(b => b.isActive).length}</p>
              <Badge variant="outline" className="text-xs">{branches.length} total</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {branches.slice(0, 4).map(branch => (
                <div key={branch.id} className="flex items-center justify-between p-2 border rounded-md">
                  <div className="flex items-center">
                    <Building2 className="h-4 w-4 mr-2 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-sm">{branch.name}</span>
                  </div>
                  {branch.isActive ? (
                    <Badge variant="success" className="bg-green-500 text-white text-xs">Active</Badge>
                  ) : (
                    <Badge variant="secondary" className="text-xs">Inactive</Badge>
                  )}
                </div>
              ))}
              {branches.length > 4 && (
                <div className="flex items-center justify-center p-2 border rounded-md bg-muted">
                  <span className="text-sm text-muted-foreground">+{branches.length - 4} more branches</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <PermissionGuard permission="manage_branches">
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => navigate('/settings/branches')}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Branch
              </Button>
            </PermissionGuard>
            
            <PermissionGuard permission="manage_branches">
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => navigate('/settings/branches')}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                View All
              </Button>
            </PermissionGuard>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BranchSection;
