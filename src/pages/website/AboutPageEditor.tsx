
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { ImageUpload } from "@/components/ui/image-upload";
import AboutSection from "@/components/website/AboutSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data - would come from your database in a real implementation
const initialData = {
  title: "ABOUT",
  subtitle: "MUSCLE GARAGE",
  description: "Muscle Garage is the biggest, most advanced GYM in Ahmedabad. The Facility is fully equipped with state of the art Cardio machines, sensorised strength training machines and a variety of training equipment to workout on. The GYM features a Strength zone, Free-weight zone, Cardio zone, Group training studio, crossfit area, swimming pool, steam bath and ICE Bath.",
  goalTitle: "OUR GOAL",
  goalDescription: "Our Mission is to provide a Dynamic Training Facility with state of the art equipments, Pro-instructors & High-level training. All our members are trained by Pro-Trainers who have abundance of knowledge & skills in many aspects of Fitness. Our Focus is a Fitness Experience that builds a stronger You!!",
  facilities: [
    {
      id: "1",
      title: "Swimming Pool & Ice Bath",
      description: "Olympic-sized swimming pool and therapeutic ice bath for recovery.",
      iconType: "waves"
    },
    {
      id: "2",
      title: "Locker Facility",
      description: "Secure, modern lockers with digital locks for all members.",
      iconType: "lock"
    },
    {
      id: "3",
      title: "Steam Room",
      description: "Luxury steam rooms to relax and recover after intense workouts.",
      iconType: "cloud"
    },
    {
      id: "4",
      title: "Huge Parking Space",
      description: "Convenient parking for all members with security surveillance.",
      iconType: "car"
    },
    {
      id: "5",
      title: "Dedicated Cardio Section",
      description: "State-of-the-art cardio equipment with personal entertainment screens.",
      iconType: "heart"
    },
    {
      id: "6",
      title: "Zumba & Yoga Studio",
      description: "Spacious studio for various fitness classes led by certified instructors.",
      iconType: "dumbbell"
    }
  ]
};

const AboutPageEditor = () => {
  const [formData, setFormData] = useState(initialData);
  const [isSaving, setIsSaving] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };
  

  
  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call to save data
    setTimeout(() => {
      toast.success("About page content saved successfully");
      setIsSaving(false);
    }, 1000);
  };
  
  const handleFacilityChange = (id: string, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      facilities: prev.facilities.map(facility => 
        facility.id === id ? { ...facility, [field]: value } : facility
      )
    }));
  };

  return (
    <div className="space-y-6 py-4">
      <Tabs defaultValue="edit">
        <TabsList className="mb-4">
          <TabsTrigger value="edit">Edit Content</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="preview" className="border rounded-lg p-4 bg-gym-black min-h-[400px]">
          <div className="-mx-4 -mt-4">
            <AboutSection 
              title={formData.title}
              subtitle={formData.subtitle}
              description={formData.description}
              goalTitle={formData.goalTitle}
              goalDescription={formData.goalDescription}
              facilities={formData.facilities}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="edit">
      <Card>
        <CardHeader>
          <CardTitle>About Section Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Section Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="subtitle">Section Subtitle</Label>
              <Input
                id="subtitle"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="description">Main Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={5}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="goalTitle">Goal Title</Label>
              <Input
                id="goalTitle"
                name="goalTitle"
                value={formData.goalTitle}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="goalDescription">Goal Description</Label>
            <Textarea
              id="goalDescription"
              name="goalDescription"
              value={formData.goalDescription}
              onChange={handleInputChange}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Facilities</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {formData.facilities.map((facility, index) => (
            <div key={facility.id} className="space-y-4">
              {index > 0 && <Separator className="my-4" />}
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <Label htmlFor={`facility-${facility.id}-title`}>Title</Label>
                  <Input
                    id={`facility-${facility.id}-title`}
                    value={facility.title}
                    onChange={(e) => handleFacilityChange(facility.id, 'title', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor={`facility-${facility.id}-iconType`}>Icon Type</Label>
                  <select
                    id={`facility-${facility.id}-iconType`}
                    value={facility.iconType}
                    onChange={(e) => handleFacilityChange(facility.id, 'iconType', e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="waves">Waves (Swimming)</option>
                    <option value="lock">Lock (Security)</option>
                    <option value="cloud">Cloud (Steam)</option>
                    <option value="car">Car (Parking)</option>
                    <option value="heart">Heart (Cardio)</option>
                    <option value="dumbbell">Dumbbell (Weights)</option>
                  </select>
                </div>
              </div>
              
              <div>
                <Label htmlFor={`facility-${facility.id}-description`}>Description</Label>
                <Textarea
                  id={`facility-${facility.id}-description`}
                  value={facility.description}
                  onChange={(e) => handleFacilityChange(facility.id, 'description', e.target.value)}
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
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
      </TabsContent>
      </Tabs>
    </div>
  );
};

export default AboutPageEditor;
