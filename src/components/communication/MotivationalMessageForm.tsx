
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { MotivationalMessage, MotivationalCategory } from "@/types/notification";

interface MotivationalMessageFormProps {
  message?: MotivationalMessage | null;
  onComplete?: () => void;
}

const MotivationalMessageForm: React.FC<MotivationalMessageFormProps> = ({
  message = null,
  onComplete
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<MotivationalCategory>("motivation");
  const [author, setAuthor] = useState("");
  const [tags, setTags] = useState("");
  const [active, setActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (message) {
      setTitle(message.title);
      setContent(message.content);
      setCategory(message.category);
      setAuthor(message.author || "");
      setTags(message.tags?.join(", ") || "");
      setActive(message.active || message.isActive || false);
    }
  }, [message]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Process tags from comma-separated string to array
      const tagsArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const formData = {
        id: message?.id || "", // Will be empty for new messages
        title,
        content,
        category,
        author,
        tags: tagsArray,
        active
      };

      // In a real implementation, you would call your API here
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error("Error saving motivational message:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {message ? "Edit Motivational Message" : "Create New Motivational Message"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter message title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Message Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter the motivational message content"
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={category}
                onValueChange={(value) => setCategory(value as MotivationalCategory)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="motivation">Motivation</SelectItem>
                  <SelectItem value="fitness">Fitness</SelectItem>
                  <SelectItem value="nutrition">Nutrition</SelectItem>
                  <SelectItem value="wellness">Wellness</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="author">Author (Optional)</Label>
              <Input
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Author name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (Comma separated)</Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="inspiration, workout, health, etc."
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="active" checked={active} onCheckedChange={setActive} />
            <Label htmlFor="active">Message is active</Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            {onComplete && (
              <Button
                type="button"
                variant="outline"
                onClick={onComplete}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : message ? "Update Message" : "Create Message"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default MotivationalMessageForm;
