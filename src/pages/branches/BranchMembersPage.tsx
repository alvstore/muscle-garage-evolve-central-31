
import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const BranchMembersPage = () => {
  const { id } = useParams();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Branch Members</h1>
      <Card>
        <CardHeader>
          <CardTitle>Members List</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Branch ID: {id}</p>
          <p>Members will be loaded from Supabase</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BranchMembersPage;
