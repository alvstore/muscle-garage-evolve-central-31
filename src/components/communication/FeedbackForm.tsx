
import React, { useState } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { AlertCircle, Check, PenSquare, Star } from 'lucide-react';
import { FeedbackType, Feedback } from '@/types/notification';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';

interface FeedbackFormProps {
  onComplete: () => void;
  onSubmit?: (feedback: Feedback) => void;
  memberId?: string;
  memberName?: string;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ 
  onComplete, 
  onSubmit,
  memberId,
  memberName 
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [title, setTitle] = useState('');
  const [type, setType] = useState<FeedbackType>('general');
  const [rating, setRating] = useState<number>(5);
  const [comments, setComments] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title) {
      toast({
        title: "Title is required",
        description: "Please provide a title for your feedback.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    const newFeedback: Feedback = {
      id: '',
      memberId: memberId || user?.id || '',
      memberName: anonymous ? undefined : (memberName || user?.name),
      type,
      rating,
      comments,
      createdAt: new Date().toISOString(),
      anonymous,
      title
    };
    
    try {
      // If onSubmit was provided, call it with the feedback
      if (onSubmit) {
        await onSubmit(newFeedback);
      } else {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast({
          title: "Feedback submitted",
          description: "Thank you for your feedback!",
        });
      }
      
      setIsOpen(false);
      onComplete();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) onComplete();
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Submit Feedback</DialogTitle>
          <DialogDescription>
            Your feedback helps us improve our services
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Brief title for your feedback"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label>Feedback Type</Label>
            <RadioGroup value={type} onValueChange={(value) => setType(value as FeedbackType)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="general" id="general" />
                <Label htmlFor="general">General</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="class" id="class" />
                <Label htmlFor="class">Class</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="trainer" id="trainer" />
                <Label htmlFor="trainer">Trainer</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fitness-plan" id="fitness-plan" />
                <Label htmlFor="fitness-plan">Fitness Plan</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label>Rating</Label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="comments">Comments</Label>
            <Textarea
              id="comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Please share your thoughts..."
              rows={4}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="anonymous"
              checked={anonymous}
              onCheckedChange={setAnonymous}
            />
            <Label htmlFor="anonymous">Submit anonymously</Label>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                setIsOpen(false);
                onComplete();
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <PenSquare className="mr-2 h-4 w-4" />
                  Submit Feedback
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackForm;
