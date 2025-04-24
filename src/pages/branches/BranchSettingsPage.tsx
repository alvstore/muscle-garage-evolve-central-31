
import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const BranchSettingsPage = () => {
  const { id } = useParams();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Branch Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Branch ID: {id}</p>
          <p>Settings will be loaded from Supabase</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BranchSettingsPage;
