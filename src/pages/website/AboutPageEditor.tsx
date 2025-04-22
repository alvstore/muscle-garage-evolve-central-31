
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { ImageUpload } from "@/components/ui/image-upload";

// Mock data - would come from your database in a real implementation
const initialData = {
  pageTitle: "About Our Gym",
  mainContent: "Founded in 2010, our gym has been dedicated to helping people transform their lives through fitness. We believe in creating a supportive community where everyone feels welcome and motivated to achieve their health goals.",
  missionStatement: "Our mission is to empower individuals to lead healthier, more active lives by providing expert guidance, state-of-the-art facilities, and a supportive community.",
  teamMembers: [
    {
      id: "1",
      name: "John Doe",
      role: "Founder & Head Trainer",
      bio: "With over 15 years of experience in fitness and nutrition, John founded this gym with a vision to create an inclusive space for fitness enthusiasts of all levels.",
      image: "/images/team-member-1.jpg"
    },
    {
      id: "2",
      name: "Jane Smith",
      role: "Nutrition Specialist",
      bio: "Jane specializes in creating personalized nutrition plans to complement your fitness journey, ensuring you achieve optimal results.",
      image: "/images/team-member-2.jpg"
    }
  ],
  aboutImage: "/images/about-us-main.jpg"
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
  
  const handleTeamMemberChange = (id: string, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      teamMembers: prev.teamMembers.map(member => 
        member.id === id ? { ...member, [field]: value } : member
      )
    }));
  };
  
  const handleTeamMemberImageChange = (id: string, imageUrl: string) => {
    setFormData((prev) => ({
      ...prev,
      teamMembers: prev.teamMembers.map(member => 
        member.id === id ? { ...member, image: imageUrl } : member
      )
    }));
  };
  
  const handleMainImageChange = (imageUrl: string) => {
    setFormData((prev) => ({
      ...prev,
      aboutImage: imageUrl
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
  
  return (
    <div className="space-y-6 py-4">
      <Card>
        <CardHeader>
          <CardTitle>About Page Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="pageTitle">Page Title</Label>
            <Input
              id="pageTitle"
              name="pageTitle"
              value={formData.pageTitle}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="mainContent">Main Content</Label>
              <Textarea
                id="mainContent"
                name="mainContent"
                value={formData.mainContent}
                onChange={handleInputChange}
                rows={5}
              />
            </div>
            
            <div className="sm:col-span-2">
              <Label htmlFor="missionStatement">Mission Statement</Label>
              <Textarea
                id="missionStatement"
                name="missionStatement"
                value={formData.missionStatement}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
          </div>
          
          <div>
            <Label>Main About Image</Label>
            <div className="mt-2">
              <ImageUpload 
                value={formData.aboutImage} 
                onChange={handleMainImageChange}
                onRemove={() => handleMainImageChange("")}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.teamMembers.map((member, index) => (
            <div key={member.id} className="space-y-4">
              {index > 0 && <Separator className="my-4" />}
              <h3 className="text-sm font-medium">Team Member {index + 1}</h3>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor={`member-${member.id}-name`}>Name</Label>
                  <Input
                    id={`member-${member.id}-name`}
                    value={member.name}
                    onChange={(e) => handleTeamMemberChange(member.id, 'name', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor={`member-${member.id}-role`}>Role</Label>
                  <Input
                    id={`member-${member.id}-role`}
                    value={member.role}
                    onChange={(e) => handleTeamMemberChange(member.id, 'role', e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor={`member-${member.id}-bio`}>Bio</Label>
                <Textarea
                  id={`member-${member.id}-bio`}
                  value={member.bio}
                  onChange={(e) => handleTeamMemberChange(member.id, 'bio', e.target.value)}
                  rows={3}
                />
              </div>
              
              <div>
                <Label>Profile Image</Label>
                <div className="mt-2">
                  <ImageUpload 
                    value={member.image} 
                    onChange={(url) => handleTeamMemberImageChange(member.id, url)}
                    onRemove={() => handleTeamMemberImageChange(member.id, "")}
                  />
                </div>
              </div>
            </div>
          ))}
          
          <Button
            variant="outline"
            onClick={() => {
              const newId = String(formData.teamMembers.length + 1);
              setFormData((prev) => ({
                ...prev,
                teamMembers: [
                  ...prev.teamMembers,
                  {
                    id: newId,
                    name: "New Team Member",
                    role: "Role",
                    bio: "Add a bio for this team member",
                    image: ""
                  }
                ]
              }));
            }}
          >
            Add Team Member
          </Button>
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

export default AboutPageEditor;
