
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { ImageUpload } from "@/components/ui/image-upload";

// Mock data - would typically come from your database
const initialData = {
  heroTitle: "Transform Your Body, Transform Your Life",
  heroSubtitle: "Join our fitness community and achieve your health goals with expert guidance and state-of-the-art facilities.",
  ctaButtonText: "Start Your Journey",
  ctaButtonLink: "/signup",
  featuresTitle: "Why Choose Us",
  features: [
    {
      id: "1",
      title: "Expert Trainers",
      description: "Our certified trainers provide personalized guidance to help you achieve your fitness goals.",
      iconType: "users"
    },
    {
      id: "2",
      title: "Modern Equipment",
      description: "Access to state-of-the-art fitness equipment for a complete workout experience.",
      iconType: "dumbbell"
    },
    {
      id: "3",
      title: "Flexible Plans",
      description: "Choose from a variety of membership plans designed to fit your schedule and budget.",
      iconType: "calendar"
    }
  ],
  heroImage: "/images/hero-background.jpg"
};

const HomePageEditor = () => {
  const [formData, setFormData] = useState(initialData);
  const [isSaving, setIsSaving] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleFeatureChange = (id: string, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.map(feature => 
        feature.id === id ? { ...feature, [field]: value } : feature
      )
    }));
  };
  
  const handleImageUpload = (imageUrl: string) => {
    setFormData((prev) => ({
      ...prev,
      heroImage: imageUrl
    }));
  };
  
  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call to save data
    setTimeout(() => {
      toast.success("Home page content saved successfully");
      setIsSaving(false);
    }, 1000);
  };
  
  return (
    <div className="space-y-6 py-4">
      <Card>
        <CardHeader>
          <CardTitle>Hero Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="heroTitle">Hero Title</Label>
              <Input
                id="heroTitle"
                name="heroTitle"
                value={formData.heroTitle}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="ctaButtonText">Call to Action Button</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  id="ctaButtonText"
                  name="ctaButtonText"
                  value={formData.ctaButtonText}
                  onChange={handleInputChange}
                  placeholder="Button Text"
                />
                <Input
                  id="ctaButtonLink"
                  name="ctaButtonLink"
                  value={formData.ctaButtonLink}
                  onChange={handleInputChange}
                  placeholder="Button Link URL"
                />
              </div>
            </div>
          </div>
          
          <div>
            <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
            <Textarea
              id="heroSubtitle"
              name="heroSubtitle"
              value={formData.heroSubtitle}
              onChange={handleInputChange}
              rows={3}
            />
          </div>
          
          <div>
            <Label>Hero Background Image</Label>
            <div className="mt-2">
              <ImageUpload 
                value={formData.heroImage} 
                onChange={handleImageUpload}
                onRemove={() => handleImageUpload("")}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Features Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="featuresTitle">Section Title</Label>
            <Input
              id="featuresTitle"
              name="featuresTitle"
              value={formData.featuresTitle}
              onChange={handleInputChange}
            />
          </div>
          
          {formData.features.map((feature, index) => (
            <div key={feature.id} className="space-y-4">
              <Separator className="my-4" />
              <h3 className="text-sm font-medium">Feature {index + 1}</h3>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor={`feature-${feature.id}-title`}>Title</Label>
                  <Input
                    id={`feature-${feature.id}-title`}
                    value={feature.title}
                    onChange={(e) => handleFeatureChange(feature.id, 'title', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor={`feature-${feature.id}-icon`}>Icon Type</Label>
                  <select
                    id={`feature-${feature.id}-icon`}
                    value={feature.iconType}
                    onChange={(e) => handleFeatureChange(feature.id, 'iconType', e.target.value)}
                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background"
                  >
                    <option value="users">Users</option>
                    <option value="dumbbell">Dumbbell</option>
                    <option value="calendar">Calendar</option>
                    <option value="heart">Heart</option>
                    <option value="star">Star</option>
                    <option value="badge">Badge</option>
                  </select>
                </div>
              </div>
              
              <div>
                <Label htmlFor={`feature-${feature.id}-description`}>Description</Label>
                <Textarea
                  id={`feature-${feature.id}-description`}
                  value={feature.description}
                  onChange={(e) => handleFeatureChange(feature.id, 'description', e.target.value)}
                  rows={2}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className="min-w-[120px]"
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};

export default HomePageEditor;
