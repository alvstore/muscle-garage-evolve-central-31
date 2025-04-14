
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';

const BranchManagementInfo = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Multi-Branch Management</CardTitle>
        <CardDescription>Understanding how branches work in Muscle Garage</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="staff">Staff</TabsTrigger>
            <TabsTrigger value="trainers">Trainers</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <Alert>
              <InfoIcon className="h-4 w-4" />
              <AlertTitle>Multi-Branch System</AlertTitle>
              <AlertDescription>
                Muscle Garage supports managing multiple gym locations from a single dashboard.
                Each branch can have its own staff, trainers, members, and schedules.
              </AlertDescription>
            </Alert>
            
            <div className="mt-4 space-y-4">
              <h3 className="text-lg font-medium">Key Features</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Branch selector in the navigation for quick switching between locations</li>
                <li>Role-based access control per branch</li>
                <li>Branch-specific reporting and analytics</li>
                <li>Members can be assigned to multiple branches with a primary branch</li>
                <li>Branch-specific class schedules and equipment</li>
              </ul>

              <h3 className="text-lg font-medium mt-6">Creating A New Branch</h3>
              <p>To create a new branch, navigate to <span className="font-mono bg-gray-100 p-1 rounded">Branches</span> in the sidebar, then click <span className="font-mono bg-gray-100 p-1 rounded">Add Branch</span>.</p>
              <p className="mt-2">Required information includes:</p>
              <ul className="list-disc pl-5 space-y-1 mt-1">
                <li>Branch name</li>
                <li>Address</li>
                <li>Contact details</li>
                <li>Manager assignment (optional)</li>
                <li>Operating hours</li>
                <li>Maximum capacity</li>
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="staff">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Staff Management</h3>
              <p>Staff members can be assigned to one or more branches:</p>
              
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Branch Managers</strong> - Staff with elevated permissions for a specific branch</li>
                <li><strong>Multi-Branch Staff</strong> - Staff that can work across multiple locations</li>
                <li><strong>Branch-Specific Staff</strong> - Staff restricted to a single branch</li>
              </ul>
              
              <h3 className="text-lg font-medium mt-4">Assigning Staff to Branches</h3>
              <p>To assign staff to branches:</p>
              <ol className="list-decimal pl-5 space-y-1 mt-2">
                <li>Navigate to the Staff Management page</li>
                <li>Select a staff member</li>
                <li>Click "Edit Branch Access"</li>
                <li>Select the branches and whether they're a manager</li>
                <li>Save changes</li>
              </ol>
              
              <Alert className="mt-4">
                <InfoIcon className="h-4 w-4" />
                <AlertTitle>Staff Permissions</AlertTitle>
                <AlertDescription>
                  Staff can only view and manage data for branches they're assigned to.
                  Branch managers have additional permissions within their branches.
                </AlertDescription>
              </Alert>
            </div>
          </TabsContent>
          
          <TabsContent value="trainers">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Trainer Management</h3>
              <p>Trainers can be assigned to specific branches:</p>
              
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Primary Branch</strong> - The main location where a trainer works</li>
                <li><strong>Secondary Branches</strong> - Additional locations where a trainer may offer sessions</li>
                <li><strong>Schedule Management</strong> - Trainers can have different schedules per branch</li>
              </ul>
              
              <h3 className="text-lg font-medium mt-4">Assigning Trainers to Branches</h3>
              <p>To assign trainers to branches:</p>
              <ol className="list-decimal pl-5 space-y-1 mt-2">
                <li>Navigate to the Trainer Management page</li>
                <li>Select a trainer</li>
                <li>Click "Edit Branch Access"</li>
                <li>Set their primary branch and any additional branches</li>
                <li>Configure branch-specific schedules if needed</li>
                <li>Save changes</li>
              </ol>
              
              <Alert className="mt-4">
                <InfoIcon className="h-4 w-4" />
                <AlertTitle>Class Scheduling</AlertTitle>
                <AlertDescription>
                  When creating classes, trainers will only be available for selection if they're assigned to that branch.
                </AlertDescription>
              </Alert>
            </div>
          </TabsContent>
          
          <TabsContent value="members">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Member Management</h3>
              <p>Members can access one or multiple branches:</p>
              
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Primary Branch</strong> - The main gym location for the member</li>
                <li><strong>Secondary Access</strong> - Additional branches the member can access</li>
                <li><strong>Branch-Specific Membership Tiers</strong> - Different pricing and access levels per branch</li>
              </ul>
              
              <h3 className="text-lg font-medium mt-4">Managing Member Branch Access</h3>
              <p>To manage a member's branch access:</p>
              <ol className="list-decimal pl-5 space-y-1 mt-2">
                <li>Navigate to the Member Details page</li>
                <li>Locate the "Branch Access" section</li>
                <li>Set their primary branch</li>
                <li>Add or remove additional branch access</li>
                <li>Set any branch-specific membership details</li>
                <li>Save changes</li>
              </ol>
              
              <Alert className="mt-4">
                <InfoIcon className="h-4 w-4" />
                <AlertTitle>Multi-Branch Memberships</AlertTitle>
                <AlertDescription>
                  Members can have different membership types at different branches.
                  Branch-specific pricing and promotions can be configured in the Membership Settings.
                </AlertDescription>
              </Alert>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default BranchManagementInfo;
