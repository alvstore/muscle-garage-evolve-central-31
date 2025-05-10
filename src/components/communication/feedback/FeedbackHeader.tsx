
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface FeedbackHeaderProps {
  onNewFeedback: () => void;
}

const FeedbackHeader = ({ onNewFeedback }: FeedbackHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Feedback Management</h1>
      <Button onClick={onNewFeedback} className="bg-primary-500 hover:bg-primary-600">
        <PlusCircle className="h-4 w-4 mr-2" />
        Submit Feedback
      </Button>
    </div>
  );
};

export default FeedbackHeader;
