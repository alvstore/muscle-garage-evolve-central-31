
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye, TrendingUp } from 'lucide-react';

interface Member {
  id: string;
  full_name: string;
  email?: string;
  phone?: string;
  gender?: string;
  goal?: string;
  branchId?: string;
}

interface MemberProgressTableProps {
  members: Member[];
}

export const MemberProgressTable: React.FC<MemberProgressTableProps> = ({ members }) => {
  if (members.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No members found matching your search criteria.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Goal</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id}>
              <TableCell className="font-medium">
                <div>
                  <div>{member.full_name}</div>
                  {member.email && (
                    <div className="text-sm text-muted-foreground">{member.email}</div>
                  )}
                </div>
              </TableCell>
              <TableCell>{member.gender || 'N/A'}</TableCell>
              <TableCell>{member.goal || 'Not specified'}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="mr-1 h-4 w-4" />
                    Details
                  </Button>
                  <Button size="sm">
                    <TrendingUp className="mr-1 h-4 w-4" />
                    Track
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
