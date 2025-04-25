
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from '@/hooks/use-auth';
import { useBranch } from '@/hooks/use-branch';
import { useFeedback } from '@/hooks/use-feedback';
import { toast } from 'sonner';

interface FeedbackFormProps {
  allowedFeedbackTypes?: string[];
  onComplete?: () => void;
  onSubmitSuccess?: () => void;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ 
  allowedFeedbackTypes = ['general', 'facility', 'trainer', 'class', 'equipment'],
  onComplete,
  onSubmitSuccess
}) => {
  const { user } = useAuth();
  const { currentBranch } = useBranch();
  const { submitFeedback } = useFeedback();

  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [type, setType] = useState(allowedFeedbackTypes[0] || 'general');
  const [anonymous, setAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Please provide a title for your feedback');
      return;
    }
    
    if (!content.trim()) {
      toast.error('Please provide feedback content');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const feedbackData = {
        title,
        content,
        rating,
        type,
        memberId: anonymous ? undefined : user?.id,
        memberName: anonymous ? undefined : user?.name,
        anonymous,
        branchId: currentBranch?.id
      };
      
      const success = await submitFeedback(feedbackData);
      
      if (success) {
        toast.success('Thank you for your feedback!');
        resetForm();
        if (onComplete) {
          onComplete();
        }
        if (onSubmitSuccess) {
          onSubmitSuccess();
        }
      } else {
        toast.error('Failed to submit feedback. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('An error occurred while submitting your feedback');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const resetForm = () => {
    setTitle('');
    setContent('');
    setRating(5);
    setType(allowedFeedbackTypes[0] || 'general');
    setAnonymous(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="feedback-title">Title</Label>
          <Input
            id="feedback-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Brief title for your feedback"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="feedback-type">Feedback Category</Label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger>
              <SelectValue placeholder="Select feedback type" />
            </SelectTrigger>
            <SelectContent>
              {allowedFeedbackTypes.map(type => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="feedback-content">Your Feedback</Label>
          <Textarea
            id="feedback-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Please share your experience or suggestions"
            rows={5}
            required
          />
        </div>
        
        <div>
          <Label>Rating</Label>
          <RadioGroup 
            className="flex space-x-4 mt-2" 
            value={String(rating)} 
            onValueChange={val => setRating(Number(val))}
          >
            {[1, 2, 3, 4, 5].map((value) => (
              <div className="flex flex-col items-center space-y-1" key={value}>
                <RadioGroupItem value={String(value)} id={`rating-${value}`} />
                <Label htmlFor={`rating-${value}`} className="text-xs">{value}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="anonymous" 
            checked={anonymous} 
            onCheckedChange={(checked) => setAnonymous(checked === true)}
          />
          <Label htmlFor="anonymous" className="text-sm">
            Submit anonymously
          </Label>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={resetForm}>
          Reset
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
        </Button>
      </div>
    </form>
  );
};

export default FeedbackForm;
