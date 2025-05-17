
import React from 'react';
import { ShieldX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/auth/use-auth';

const Unauthorized = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const goBack = () => {
    navigate(-1);
  };
  
  const goToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <ShieldX className="mx-auto h-16 w-16 text-destructive" />
          <h2 className="mt-6 text-3xl font-extrabold">Access Denied</h2>
          <p className="mt-2 text-gray-600">
            You don't have permission to access this page.
          </p>
          {user && (
            <p className="mt-1 text-gray-500">
              Your role: <span className="font-semibold">{user.role}</span>
            </p>
          )}
        </div>
        <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3 justify-center">
          <Button onClick={goBack} variant="outline">
            Go Back
          </Button>
          <Button onClick={goToDashboard}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
