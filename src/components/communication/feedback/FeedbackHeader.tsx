
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

interface FeedbackHeaderProps {
  onNewFeedback?: () => void;
}

const FeedbackHeader = ({ onNewFeedback }: FeedbackHeaderProps) => {
  const { user } = useAuth();
  const isMember = user?.role === 'member';

  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Feedback Management</h1>
      {isMember && onNewFeedback && (
        <Button onClick={onNewFeedback} className="bg-indigo-600 hover:bg-indigo-700">
          <PlusCircle className="h-4 w-4 mr-2" />
          Submit Feedback
        </Button>
      )}
    </div>
  );
};

export default FeedbackHeader;
