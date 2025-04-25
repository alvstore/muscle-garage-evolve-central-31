
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Feedback } from '@/types/notification';
import { formatDistanceToNow } from 'date-fns';

export interface FeedbackListProps {
  feedbacks: Feedback[];
  isLoading: boolean;
  hideHeader?: boolean;
}

const FeedbackList: React.FC<FeedbackListProps> = ({ feedbacks, isLoading, hideHeader = false }) => {
  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Loading feedbacks...</div>;
  }

  if (!feedbacks || feedbacks.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No feedback entries available</p>
      </div>
    );
  }

  const getBadgeVariant = (rating: number) => {
    if (rating >= 4) return 'success';
    if (rating >= 3) return 'warning';
    return 'destructive';
  };

  const getRatingText = (rating: number) => {
    if (rating >= 4) return 'Positive';
    if (rating >= 3) return 'Neutral';
    return 'Negative';
  };

  return (
    <Card>
      {!hideHeader && (
        <CardHeader>
          <CardTitle>Recent Feedback</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <div className="space-y-4">
          {feedbacks.map((feedback) => (
            <div key={feedback.id} className="border-b pb-4 last:border-b-0 last:pb-0">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold">{feedback.title}</h3>
                <Badge variant={getBadgeVariant(feedback.rating) as any}>{getRatingText(feedback.rating)}</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{feedback.comments || feedback.content}</p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {feedback.anonymous ? 'Anonymous User' : feedback.memberName || feedback.member_name || 'Unknown'} • {feedback.type}
                </span>
                <span>
                  {(feedback.createdAt || feedback.created_at) && formatDistanceToNow(new Date(feedback.createdAt || feedback.created_at), { addSuffix: true })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FeedbackList;
