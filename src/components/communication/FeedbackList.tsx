
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";
import { useFeedback } from '@/hooks/use-feedback';

export interface FeedbackListProps {
  hideHeader?: boolean;
  specificType?: string;
}

const FeedbackList: React.FC<FeedbackListProps> = ({ hideHeader = false, specificType }) => {
  const { feedback, isLoading, fetchFeedback } = useFeedback();

  useEffect(() => {
    fetchFeedback();
  }, [fetchFeedback]);

  const filteredFeedback = specificType && specificType !== 'all'
    ? feedback.filter(item => item.type === specificType)
    : feedback;

  if (isLoading) {
    return <div className="p-8 text-center">Loading feedback...</div>;
  }

  return (
    <Card>
      {!hideHeader && (
        <CardHeader>
          <CardTitle>Member Feedback</CardTitle>
        </CardHeader>
      )}
      
      <CardContent>
        {filteredFeedback.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Member</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            
            <TableBody>
              {filteredFeedback.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Badge variant="outline">{item.type}</Badge>
                  </TableCell>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.rating}/5</TableCell>
                  <TableCell>
                    {item.anonymous ? "Anonymous" : item.memberName || "Unknown"}
                  </TableCell>
                  <TableCell>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 mr-1">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center p-4">No feedback found</div>
        )}
      </CardContent>
    </Card>
  );
};

export default FeedbackList;
