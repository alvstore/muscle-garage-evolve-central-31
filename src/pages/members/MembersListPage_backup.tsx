// MembersListPage.tsx
import React from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Member } from '@/types/member';
import { Link } from 'react-router-dom';

const mockMembers = [
  {
    id: '1',
    name: 'John Doe',
    membershipStartDate: new Date().toISOString(), // Convert Date to string
    membershipEndDate: new Date().toISOString(),
    status: 'active',
    membershipStatus: 'active',
    membershipId: 'gold',
    role: 'member',
    branchId: 'branch1'
  },
  {
    id: '2',
    name: 'Jane Smith',
    membershipStartDate: new Date().toISOString(),
    membershipEndDate: new Date().toISOString(),
    status: 'inactive',
    membershipStatus: 'expired',
    membershipId: 'silver',
    role: 'member',
    branchId: 'branch2'
  },
  {
    id: '3',
    name: 'Alice Johnson',
    membershipStartDate: new Date().toISOString(),
    membershipEndDate: new Date().toISOString(),
    status: 'active',
    membershipStatus: 'active',
    membershipId: 'platinum',
    role: 'member',
    branchId: 'branch1'
  },
];

const MembersListPage: React.FC = () => {
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold">Members</h1>
        <Link to="/members/new">
          <Button><Plus className="mr-2 h-4 w-4" /> Add Member</Button>
        </Link>
      </div>

      <div className="mb-5">
        <Input type="text" placeholder="Search members..." />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableCaption>A list of your members.</TableCaption>
          <TableHead>
            <TableRow>
              <TableHeadCell>Name</TableHeadCell>
              <TableHeadCell>Status</TableHeadCell>
              <TableHeadCell>Membership Status</TableHeadCell>
              <TableHeadCell>Actions</TableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockMembers.map((member) => (
              <TableRow key={member.id}>
                <TableCell>{member.name}</TableCell>
                <TableCell>{member.status}</TableCell>
                <TableCell>{member.membershipStatus}</TableCell>
                <TableCell className="flex gap-2">
                  <Link to={`/members/${member.id}/edit`}>
                    <Button variant="outline" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button variant="destructive" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

function TableHeadCell({ children }: { children: React.ReactNode }) {
  return (
    <TableHead className="text-left [&:not([data-state=open])]:opacity-50">
      {children}
    </TableHead>
  )
}

export default MembersListPage;
