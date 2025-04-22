
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const ContactPageEditor = () => {
  const [formData, setFormData] = useState({
    pageTitle: "Contact Us",
    introText: "We're here to help! Reach out to us with any questions about our gym, classes, or membership options.",
    address: "123 Fitness Street, Workout City, 12345",
    email: "info@evolvefit.com",
    phone: "+91 9876543210",
    googleMapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d317715.7119496962!2d-0.3817765050863085!3d51.52873519756199!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47d8a00baf21de75%3A0x52963a5addd52a99!2sLondon%2C%20UK!5e0!3m2!1sen!2sin!4v1698869582833!5m2!1sen!2sin",
    openingHours: {
      monday: "6:00 AM - 10:00 PM",
      tuesday: "6:00 AM - 10:00 PM",
      wednesday: "6:00 AM - 10:00 PM",
      thursday: "6:00 AM - 10:00 PM",
      friday: "6:00 AM - 10:00 PM",
      saturday: "8:00 AM - 8:00 PM",
      sunday: "8:00 AM - 6:00 PM"
    },
    socialLinks: {
      facebook: "https://facebook.com/evolvefit",
      instagram: "https://instagram.com/evolvefit",
      twitter: "https://twitter.com/evolvefit"
    }
  });
  
  const [isSaving, setIsSaving] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section as keyof typeof prev],
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      toast.success("Contact page content saved successfully");
      setIsSaving(false);
    }, 1000);
  };
  
  return (
    <div className="space-y-6 py-4">
      <Card>
        <CardHeader>
          <CardTitle>Contact Page Content</CardTitle>
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
          
          <div>
            <Label htmlFor="introText">Introduction Text</Label>
            <Textarea
              id="introText"
              name="introText"
              value={formData.introText}
              onChange={handleInputChange}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              rows={2}
            />
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="googleMapEmbed">Google Maps Embed Code</Label>
            <Textarea
              id="googleMapEmbed"
              name="googleMapEmbed"
              value={formData.googleMapEmbed}
              onChange={handleInputChange}
              rows={3}
              placeholder="Paste Google Maps embed code here"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Go to Google Maps, search for your location, click "Share", select "Embed a map" and copy the iframe src URL.
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Opening Hours</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="monday">Monday</Label>
              <Input
                id="monday"
                name="openingHours.monday"
                value={formData.openingHours.monday}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <Label htmlFor="tuesday">Tuesday</Label>
              <Input
                id="tuesday"
                name="openingHours.tuesday"
                value={formData.openingHours.tuesday}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <Label htmlFor="wednesday">Wednesday</Label>
              <Input
                id="wednesday"
                name="openingHours.wednesday"
                value={formData.openingHours.wednesday}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <Label htmlFor="thursday">Thursday</Label>
              <Input
                id="thursday"
                name="openingHours.thursday"
                value={formData.openingHours.thursday}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <Label htmlFor="friday">Friday</Label>
              <Input
                id="friday"
                name="openingHours.friday"
                value={formData.openingHours.friday}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <Label htmlFor="saturday">Saturday</Label>
              <Input
                id="saturday"
                name="openingHours.saturday"
                value={formData.openingHours.saturday}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <Label htmlFor="sunday">Sunday</Label>
              <Input
                id="sunday"
                name="openingHours.sunday"
                value={formData.openingHours.sunday}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Social Media Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="facebook">Facebook</Label>
              <Input
                id="facebook"
                name="socialLinks.facebook"
                value={formData.socialLinks.facebook}
                onChange={handleInputChange}
                placeholder="https://facebook.com/yourgym"
              />
            </div>
            
            <div>
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                name="socialLinks.instagram"
                value={formData.socialLinks.instagram}
                onChange={handleInputChange}
                placeholder="https://instagram.com/yourgym"
              />
            </div>
            
            <div>
              <Label htmlFor="twitter">Twitter</Label>
              <Input
                id="twitter"
                name="socialLinks.twitter"
                value={formData.socialLinks.twitter}
                onChange={handleInputChange}
                placeholder="https://twitter.com/yourgym"
              />
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

export default ContactPageEditor;
