
import React from 'react';
import { useFeedback } from '@/hooks/use-feedback';
import { FeedbackType, Feedback } from '@/types/notification';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

interface FeedbackListProps {
  feedbacks?: Feedback[];
  isLoading?: boolean;
  hideHeader?: boolean;
}

const FeedbackList: React.FC<FeedbackListProps> = ({ feedbacks: propFeedbacks, isLoading: propIsLoading, hideHeader = false }) => {
  const [activeTab, setActiveTab] = React.useState<FeedbackType | 'all'>('all');
  const hookResult = useFeedback();
  
  // Use props if provided, otherwise use hook data
  const feedbacks = propFeedbacks || hookResult.feedbacks;
  const isLoading = propIsLoading !== undefined ? propIsLoading : hookResult.isLoading;
  
  React.useEffect(() => {
    if (!propFeedbacks) {
      if (activeTab === 'all') {
        hookResult.fetchFeedback();
      } else {
        hookResult.fetchFeedback(activeTab as FeedbackType);
      }
    }
  }, [activeTab, propFeedbacks]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (hookResult.error && !propFeedbacks) {
    return (
      <div className="p-4 text-red-500">
        Error loading feedback: {hookResult.error.message}
      </div>
    );
  }
  
  const renderFeedbackCard = (feedback: Feedback) => {
    const ratingClass = feedback.rating >= 4 ? 'text-green-500' : 
                       feedback.rating >= 3 ? 'text-yellow-500' : 'text-red-500';
                       
    return (
      <Card key={feedback.id} className="mb-4">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-medium">{feedback.title}</h3>
              <Badge variant="outline">{feedback.type}</Badge>
            </div>
            <div className={`text-xl font-bold ${ratingClass}`}>
              {feedback.rating}/5
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 dark:text-gray-300 mb-4">{feedback.comment || feedback.comments}</p>
          <div className="flex justify-between text-sm text-gray-500">
            <span>
              {feedback.anonymous ? 'Anonymous' : feedback.member_name}
            </span>
            <span>
              {feedback.created_at && formatDistanceToNow(new Date(feedback.created_at), { addSuffix: true })}
            </span>
          </div>
        </CardContent>
      </Card>
    );
  };
  
  return (
    <div className="space-y-4">
      {!hideHeader && (
        <Tabs 
          defaultValue="all" 
          value={activeTab} 
          onValueChange={(value) => setActiveTab(value as FeedbackType | 'all')}
        >
          <TabsList className="grid grid-cols-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="trainer">Trainer</TabsTrigger>
            <TabsTrigger value="facility">Facility</TabsTrigger>
            <TabsTrigger value="class">Classes</TabsTrigger>
            <TabsTrigger value="equipment">Equipment</TabsTrigger>
          </TabsList>
        </Tabs>
      )}
      
      <div className="mt-6">
        {feedbacks && feedbacks.length === 0 ? (
          <div className="text-center p-8 text-gray-500">
            No feedback available in this category.
          </div>
        ) : (
          feedbacks?.map(renderFeedbackCard)
        )}
      </div>
    </div>
  );
};

export default FeedbackList;
