
import React from 'react';
import { format } from 'date-fns';
import { Card } from '@/components/ui/card';
import { Feedback } from '@/types/notification';
import { Star, MessageSquare } from 'lucide-react';

interface FeedbackListProps {
  feedbacks: Feedback[];
  isLoading: boolean;
}

const FeedbackList: React.FC<FeedbackListProps> = ({ feedbacks, isLoading }) => {
  if (isLoading) {
    return <div className="flex justify-center py-8">Loading feedback...</div>;
  }

  if (!feedbacks || feedbacks.length === 0) {
    return (
      <div className="text-center py-10">
        <MessageSquare className="h-10 w-10 mx-auto text-muted-foreground" />
        <h3 className="mt-4 text-lg font-medium">No feedback yet</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          When members submit feedback, it will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {feedbacks.map((feedback) => (
        <Card key={feedback.id} className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">{feedback.title}</h3>
              <p className="text-xs text-muted-foreground mt-1 capitalize">
                Type: {feedback.type}
              </p>
            </div>
            <div className="flex items-center">
              <span className="mr-1">{feedback.rating}</span>
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            </div>
          </div>

          {feedback.comments && (
            <p className="mt-2 text-sm text-gray-600">{feedback.comments}</p>
          )}

          <div className="mt-4 flex justify-between text-xs text-muted-foreground">
            <span>
              {feedback.anonymous 
                ? "Anonymous" 
                : `By ${feedback.memberName || "Unknown Member"}`}
            </span>
            <span>{format(new Date(feedback.createdAt), 'MMM d, yyyy')}</span>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default FeedbackList;
