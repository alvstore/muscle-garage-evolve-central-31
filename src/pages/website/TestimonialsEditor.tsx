
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { ImageUpload } from "@/components/ui/image-upload";

// Mock data
const initialTestimonials = [
  {
    id: "1",
    name: "John Smith",
    designation: "Member since 2020",
    review: "Joining this gym was one of the best decisions I've made. The trainers are exceptional and the community is so supportive. I've achieved fitness goals I never thought possible.",
    image: "/images/testimonial1.jpg"
  },
  {
    id: "2",
    name: "Sarah Johnson",
    designation: "Member since 2021",
    review: "The atmosphere here is amazing. Everyone is so encouraging and the facilities are top-notch. I look forward to my workouts every day!",
    image: "/images/testimonial2.jpg"
  }
];

const TestimonialsEditor = () => {
  const [testimonials, setTestimonials] = useState(initialTestimonials);
  const [isSaving, setIsSaving] = useState(false);
  
  const handleInputChange = (id: string, field: string, value: string) => {
    setTestimonials(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };
  
  const handleImageChange = (id: string, imageUrl: string) => {
    setTestimonials(prev => prev.map(item => 
      item.id === id ? { ...item, image: imageUrl } : item
    ));
  };
  
  const handleAddTestimonial = () => {
    const newId = String(testimonials.length + 1);
    setTestimonials(prev => [
      ...prev,
      {
        id: newId,
        name: "New Testimonial",
        designation: "Member",
        review: "Write the testimonial here...",
        image: ""
      }
    ]);
  };
  
  const handleRemoveTestimonial = (id: string) => {
    setTestimonials(prev => prev.filter(item => item.id !== id));
  };
  
  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      toast.success("Testimonials saved successfully");
      setIsSaving(false);
    }, 1000);
  };
  
  return (
    <div className="space-y-6 py-4">
      <Card>
        <CardHeader>
          <CardTitle>Testimonials Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Add and manage member testimonials that will appear on your website.
            </p>
            
            {testimonials.map((testimonial, index) => (
              <div key={testimonial.id} className="space-y-4">
                {index > 0 && <Separator className="my-6" />}
                
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium">Testimonial {index + 1}</h3>
                  {testimonials.length > 1 && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleRemoveTestimonial(testimonial.id)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor={`name-${testimonial.id}`}>Name</Label>
                    <Input
                      id={`name-${testimonial.id}`}
                      value={testimonial.name}
                      onChange={(e) => handleInputChange(testimonial.id, 'name', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`designation-${testimonial.id}`}>Designation / Title</Label>
                    <Input
                      id={`designation-${testimonial.id}`}
                      value={testimonial.designation}
                      onChange={(e) => handleInputChange(testimonial.id, 'designation', e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor={`review-${testimonial.id}`}>Testimonial Text</Label>
                  <Textarea
                    id={`review-${testimonial.id}`}
                    value={testimonial.review}
                    onChange={(e) => handleInputChange(testimonial.id, 'review', e.target.value)}
                    rows={4}
                  />
                </div>
                
                <div>
                  <Label>Member Photo</Label>
                  <div className="mt-2">
                    <ImageUpload
                      value={testimonial.image}
                      onChange={(url) => handleImageChange(testimonial.id, url)}
                      onRemove={() => handleImageChange(testimonial.id, "")}
                    />
                  </div>
                </div>
              </div>
            ))}
            
            <Button 
              variant="outline" 
              onClick={handleAddTestimonial}
            >
              Add New Testimonial
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};

export default TestimonialsEditor;
