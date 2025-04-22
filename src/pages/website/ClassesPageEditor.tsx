
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { ImageUpload } from "@/components/ui/image-upload";

const ClassesPageEditor = () => {
  const [isSaving, setIsSaving] = useState(false);
  
  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      toast.success("Classes & Trainers content saved successfully");
      setIsSaving(false);
    }, 1000);
  };
  
  return (
    <div className="space-y-6 py-4">
      <Card>
        <CardHeader>
          <CardTitle>Classes & Trainers Page</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Configure the classes and trainers information that will be displayed on your website.
            </p>
            
            <div>
              <Label htmlFor="pageTitle">Page Title</Label>
              <Input
                id="pageTitle"
                defaultValue="Our Classes & Expert Trainers"
              />
            </div>
            
            <div>
              <Label htmlFor="pageDescription">Page Description</Label>
              <Textarea
                id="pageDescription"
                defaultValue="Join our expert-led classes designed for all fitness levels. Our certified trainers are here to help you achieve your goals."
                rows={3}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch id="showClassSchedule" defaultChecked />
              <Label htmlFor="showClassSchedule">Show Class Schedule on Website</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch id="showTrainers" defaultChecked />
              <Label htmlFor="showTrainers">Show Trainers Section on Website</Label>
            </div>
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

export default ClassesPageEditor;
