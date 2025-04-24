
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';
import { Feedback, FeedbackType } from '@/types/notification';
import { feedbackService } from '@/services/communicationService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, ThumbsUp, ThumbsDown, AlertCircle, HelpCircle } from 'lucide-react';

interface FeedbackListProps {
  hideHeader?: boolean;
}

const FeedbackList: React.FC<FeedbackListProps> = ({ hideHeader = false }) => {
  const [feedbackItems, setFeedbackItems] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('all');

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    setLoading(true);
    try {
      const data = await feedbackService.getFeedback();
      setFeedbackItems(data);
    } catch (error) {
      console.error('Error fetching feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredFeedback = feedbackItems.filter(feedback => {
    if (activeTab === 'all') return true;
    return feedback.type === activeTab;
  });

  const getInitials = (name: string = '') => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const getFeedbackIcon = (type: FeedbackType) => {
    switch (type) {
      case 'general':
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case 'trainer':
        return <ThumbsUp className="h-4 w-4 text-green-500" />;
      case 'class':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'fitness-plan':
        return <ThumbsDown className="h-4 w-4 text-red-500" />;
      default:
        return <HelpCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Card>
      {!hideHeader && (
        <CardHeader>
          <CardTitle>Member Feedback</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="trainer">Trainers</TabsTrigger>
            <TabsTrigger value="class">Classes</TabsTrigger>
            <TabsTrigger value="fitness-plan">Fitness</TabsTrigger>
          </TabsList>
        </Tabs>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : filteredFeedback.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Feedback</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFeedback.map((feedback) => (
                <TableRow key={feedback.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-7 w-7">
                        <AvatarImage src="" />
                        <AvatarFallback>
                          {feedback.anonymous 
                            ? '?' 
                            : getInitials(feedback.member_name || '')}
                        </AvatarFallback>
                      </Avatar>
                      <span>
                        {feedback.anonymous
                          ? 'Anonymous User'
                          : feedback.member_name || 'Unknown'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <div className="flex items-center space-x-1">
                        {getFeedbackIcon(feedback.type as FeedbackType)}
                        <span className="font-medium">{feedback.title}</span>
                      </div>
                      {feedback.comments && (
                        <span className="text-sm text-muted-foreground line-clamp-1">
                          {feedback.comments}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          className={`text-lg ${
                            i < feedback.rating ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    {format(parseISO(feedback.created_at), 'MMM dd, yyyy')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8">
            <div className="flex justify-center mb-3">
              <MessageSquare className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No feedback yet</h3>
            <p className="text-muted-foreground mt-1">
              Feedback from members will appear here
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FeedbackList;
