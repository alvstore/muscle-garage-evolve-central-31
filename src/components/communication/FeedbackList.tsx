
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Eye, MessageCircle, Star, ThumbsUp, User } from "lucide-react";
import { format } from "date-fns";
import { Feedback } from "@/types/notification";
import { useFeedback } from '@/hooks/use-feedback';

export interface FeedbackListProps {
  feedbacks: Feedback[];
  isLoading: boolean;
  hideHeader?: boolean;
  onViewDetails?: (feedback: Feedback) => void;
  showBranchInfo?: boolean;
}

const FeedbackList: React.FC<FeedbackListProps> = ({ 
  feedbacks, 
  isLoading, 
  hideHeader = false,
  onViewDetails,
  showBranchInfo = false
}) => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const { markAsRead } = useFeedback();

  if (isLoading) {
    return <div className="text-center py-10">Loading feedback...</div>;
  }

  if (!feedbacks || feedbacks.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <MessageCircle className="w-12 h-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium">No Feedback Yet</p>
          <p className="text-muted-foreground">When members submit feedback, it will appear here.</p>
        </CardContent>
      </Card>
    );
  }

  const getFeedbackByCategory = (category: string) => {
    if (category === 'all') return feedbacks;
    return feedbacks.filter(feedback => feedback.type === category);
  };

  const categories = ['all', ...new Set(feedbacks.map(f => f.type))];
  const displayFeedbacks = getFeedbackByCategory(activeTab);

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'bg-green-500';
    if (rating >= 3) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Card>
      {!hideHeader && (
        <CardHeader>
          <CardTitle>Member Feedback</CardTitle>
        </CardHeader>
      )}
      <CardContent className="p-0">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <div className="px-6 pt-4">
            <TabsList className="mb-4">
              {categories.map(category => (
                <TabsTrigger key={category} value={category} className="capitalize">
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value={activeTab} className="m-0">
            <div className="space-y-4 px-6 pb-6">
              {displayFeedbacks.map(feedback => (
                <div key={feedback.id} className="border rounded-md p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">{feedback.title}</h4>
                      <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                        {feedback.memberName ? (
                          <div className="flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            <span>{feedback.memberName}</span>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            <span>Anonymous</span>
                          </div>
                        )}
                        <span>•</span>
                        <div className="flex items-center">
                          <MessageCircle className="h-3 w-3 mr-1" />
                          <span>{feedback.type}</span>
                        </div>
                        <span>•</span>
                        <div>
                          {format(new Date(feedback.createdAt), 'MMM d, yyyy')}
                        </div>
                      </div>
                    </div>
                    <Badge className={getRatingColor(feedback.rating)}>
                      <Star className="h-3 w-3 mr-1 fill-current" /> {feedback.rating}
                    </Badge>
                  </div>
                  <p className="text-sm mt-2">{feedback.content}</p>
                  
                  {onViewDetails && (
                    <div className="mt-3 flex justify-end">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => onViewDetails(feedback)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Details
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default FeedbackList;
