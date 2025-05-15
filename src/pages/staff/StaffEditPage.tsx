import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import EditStaffForm from '@/components/staff/EditStaffForm';

const StaffEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  if (!id) {
    return (
      <Container>
        <div className="py-6">
          <h1 className="text-2xl font-bold mb-4">Staff Member Not Found</h1>
          <p className="mb-4">The staff member ID is missing.</p>
          <Button onClick={() => navigate('/staff')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Staff List
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/staff')}
              className="mb-2"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Staff List
            </Button>
            <h1 className="text-2xl font-bold">Edit Staff Member</h1>
            <p className="text-muted-foreground">Update staff member information</p>
          </div>
        </div>

        <EditStaffForm 
          staffId={id} 
          onSuccess={() => navigate('/staff')} 
          onCancel={() => navigate('/staff')} 
        />
      </div>
    </Container>
  );
};

export default StaffEditPage;
