
import React from 'react';
import { Branch } from '@/types/branch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, MapPin, Phone, Mail, XCircle } from 'lucide-react';

interface BranchSectionProps {
  branch: Branch;
  onEdit: (branch: Branch) => void;
  onDelete: (branchId: string) => void;
}

const BranchSection: React.FC<BranchSectionProps> = ({ branch, onEdit, onDelete }) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/50">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{branch.name}</CardTitle>
            <CardDescription>{branch.branch_code || 'No code'}</CardDescription>
          </div>
          <Badge variant={branch.is_active ? "outline" : "secondary"}>
            {branch.is_active ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="text-sm space-y-2">
          {branch.address && (
            <div className="flex items-start">
              <MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
              <div>
                <p>{branch.address}</p>
                <p>{[branch.city, branch.state, branch.country].filter(Boolean).join(', ')}</p>
              </div>
            </div>
          )}
          
          {branch.phone && (
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
              <p>{branch.phone}</p>
            </div>
          )}
          
          {branch.email && (
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
              <p>{branch.email}</p>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          {branch.is_active ? (
            <div className="flex items-center text-green-600">
              <CheckCircle className="h-4 w-4 mr-1" />
              <p>Active</p>
            </div>
          ) : (
            <div className="flex items-center text-red-500">
              <XCircle className="h-4 w-4 mr-1" />
              <p>Inactive</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="bg-muted/30 px-4 py-3 flex justify-between">
        <Button variant="outline" size="sm" onClick={() => onEdit(branch)}>
          Edit
        </Button>
        <Button variant="destructive" size="sm" onClick={() => onDelete(branch.id)}>
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BranchSection;
