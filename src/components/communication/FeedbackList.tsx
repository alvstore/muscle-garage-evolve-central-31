import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format, parseISO } from "date-fns";
import { Feedback } from "@/types/notification";
import { Star, MessageSquare, Download, MessageSquareOff, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/useAuth";

const mockFeedbackData: Feedback[] = [
  {
    id: "feedback1",
    memberId: "member1",
    memberName: "David Miller",
    type: "class",
    relatedId: "class1",
    rating: 4,
    comments: "Great class, but the room was a bit crowded.",
    createdAt: "2023-06-15T10:30:00Z",
    anonymous: false,
    title: "HIIT Class Review"
  },
  {
    id: "feedback2",
    memberId: "member2",
    memberName: "Sarah Parker",
    type: "trainer",
    relatedId: "trainer1",
    rating: 5,
    comments: "Excellent trainer, very motivating!",
    createdAt: "2023-06-16T14:20:00Z",
    anonymous: false,
    title: "Trainer Review"
  },
  {
    id: "feedback3",
    memberId: "member3",
    type: "fitness-plan",
    relatedId: "plan1",
    rating: 3,
    comments: "Plan is good but too challenging for beginners.",
    createdAt: "2023-06-17T09:15:00Z",
    anonymous: true,
    title: "Fitness Plan Feedback"
  },
  {
    id: "feedback4",
    memberId: "member4",
    memberName: "Emily Davidson",
    type: "general",
    rating: 2,
    comments: "The gym needs better ventilation.",
    createdAt: "2023-06-18T16:45:00Z",
    anonymous: false,
    title: "Facility Feedback"
  },
  {
    id: "feedback5",
    memberId: "member5",
    memberName: "Michael Wong",
    type: "class",
    relatedId: "class2",
    rating: 5,
    comments: "Best HIIT class I've ever taken!",
    createdAt: "2023-06-19T11:30:00Z",
    anonymous: false,
    title: "Yoga Class Review"
  }
];

interface FeedbackListProps {
  feedbacks?: Feedback[];
  isLoading?: boolean;
}

const FeedbackList = ({ feedbacks = mockFeedbackData, isLoading = false }: FeedbackListProps) => {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filter, setFilter] = useState<string>("all");
  const { user } = useAuth();

  useEffect(() => {
    setTimeout(() => {
      const filteredFeedbacks = user?.role === 'member'
        ? feedbacks.filter(f => f.memberId === user.id)
        : feedbacks;
      setFeedback(filteredFeedbacks);
      setLoading(isLoading);
    }, 1000);
  }, [feedbacks, isLoading, user]);

  const handleViewDetails = (feedback: Feedback) => {
    setSelectedFeedback(feedback);
    setIsDialogOpen(true);
  };

  const handleExportCSV = () => {
    toast.success("Feedback data exported to CSV");
  };

  const filteredFeedback = filter === "all" 
    ? feedback 
    : feedback.filter(item => item.type === filter);

  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star 
          key={i} 
          className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} 
        />
      ));
  };

  const getInitials = (name: string) => {
    if (name === "Anonymous") return "A";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Feedback Responses</CardTitle>
              <CardDescription>Review feedback from members and trainers</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant={filter === "all" ? "default" : "outline"} 
                size="sm" 
                onClick={() => setFilter("all")}
              >
                All
              </Button>
              <Button 
                variant={filter === "class" ? "default" : "outline"} 
                size="sm" 
                onClick={() => setFilter("class")}
              >
                Classes
              </Button>
              <Button 
                variant={filter === "trainer" ? "default" : "outline"} 
                size="sm" 
                onClick={() => setFilter("trainer")}
              >
                Trainers
              </Button>
              <Button 
                variant={filter === "fitness-plan" ? "default" : "outline"} 
                size="sm" 
                onClick={() => setFilter("fitness-plan")}
              >
                Fitness Plans
              </Button>
              <Button 
                variant={filter === "general" ? "default" : "outline"} 
                size="sm" 
                onClick={() => setFilter("general")}
              >
                General
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleExportCSV}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-300px)]">
            {loading ? (
              <div className="h-80 flex items-center justify-center">
                <div className="text-center">
                  <div className="h-8 w-8 rounded-full border-4 border-t-primary mx-auto animate-spin"></div>
                  <p className="mt-2 text-sm text-muted-foreground">Loading feedback...</p>
                </div>
              </div>
            ) : filteredFeedback.length === 0 ? (
              <div className="text-center py-10">
                <MessageSquareOff className="h-10 w-10 mx-auto text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No feedback found</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {filter === "all" 
                    ? "No feedback has been submitted yet." 
                    : `No feedback found for the "${filter}" category.`}
                </p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Member</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Comment Preview</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFeedback.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src="/placeholder.svg" alt={item.memberName} />
                              <AvatarFallback>{getInitials(item.memberName || "Anonymous")}</AvatarFallback>
                            </Avatar>
                            <span>{item.anonymous ? "Anonymous" : item.memberName}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {item.type === "fitness-plan" ? "Fitness Plan" : item.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex">
                            {renderStars(item.rating)}
                          </div>
                        </TableCell>
                        <TableCell>{format(parseISO(item.createdAt), "MMM dd, yyyy")}</TableCell>
                        <TableCell>
                          {item.comments 
                            ? item.comments.length > 30 
                              ? `${item.comments.substring(0, 30)}...` 
                              : item.comments
                            : "No comment provided"
                          }
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewDetails(item)}
                          >
                            <MessageSquare className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {selectedFeedback && (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Feedback Details</DialogTitle>
              <DialogDescription>
                Submitted on {format(parseISO(selectedFeedback.createdAt), "PPP")}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/placeholder.svg" alt={selectedFeedback.memberName} />
                    <AvatarFallback>
                      {getInitials(selectedFeedback.memberName || "Anonymous")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {selectedFeedback.anonymous ? "Anonymous Member" : selectedFeedback.memberName}
                    </p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {selectedFeedback.type === "fitness-plan" ? "Fitness Plan Feedback" : `${selectedFeedback.type} Feedback`}
                    </p>
                  </div>
                </div>
                <div className="flex">
                  {renderStars(selectedFeedback.rating)}
                </div>
              </div>
              
              <div className="rounded-md bg-muted p-3">
                <p className="text-sm">
                  {selectedFeedback.comments || "No comments provided."}
                </p>
              </div>
              
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
};

export default FeedbackList;
