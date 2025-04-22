
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { ImageUpload } from "@/components/ui/image-upload";
import { Building2, Phone, AtSign, MapPin, Clock } from "lucide-react";

// Define a sample content type
interface ContactContent {
  address: string;
  googleMapEmbed: string;
  phone: string;
  email: string;
  showSocialLinks: boolean;
  socialLinks: {
    facebook: string;
    instagram: string;
    twitter: string;
    youtube: string;
  };
  hours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  contactFormHeader: string;
  contactFormSubheader: string;
}

const ContactPageEditor = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [contactImage, setContactImage] = useState("");
  const [showContactForm, setShowContactForm] = useState(true);
  const [showMap, setShowMap] = useState(true);
  const [showHours, setShowHours] = useState(true);
  
  // Sample data
  const [content, setContent] = useState<ContactContent>({
    address: "123 Fitness Blvd, New York, NY 10001",
    googleMapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387193.305935303!2d-74.25986548248684!3d40.69714941932609!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sin!4v1612600968661!5m2!1sen!2sin",
    phone: "+1 (555) 123-4567",
    email: "info@fitnessgym.com",
    showSocialLinks: true,
    socialLinks: {
      facebook: "https://facebook.com/fitnessgym",
      instagram: "https://instagram.com/fitnessgym",
      twitter: "https://twitter.com/fitnessgym",
      youtube: "https://youtube.com/fitnessgym"
    },
    hours: {
      monday: "6:00 AM - 10:00 PM",
      tuesday: "6:00 AM - 10:00 PM",
      wednesday: "6:00 AM - 10:00 PM",
      thursday: "6:00 AM - 10:00 PM",
      friday: "6:00 AM - 10:00 PM",
      saturday: "8:00 AM - 8:00 PM",
      sunday: "8:00 AM - 4:00 PM"
    },
    contactFormHeader: "Get In Touch",
    contactFormSubheader: "Have a question or need more information? Drop us a message and we'll get back to you."
  });
  
  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      toast.success("Contact page content saved successfully");
      setIsSaving(false);
    }, 1000);
  };
  
  const handleContentChange = (key: keyof ContactContent, value: any) => {
    setContent({
      ...content,
      [key]: value
    });
  };
  
  const handleSocialLinkChange = (network: keyof typeof content.socialLinks, value: string) => {
    setContent({
      ...content,
      socialLinks: {
        ...content.socialLinks,
        [network]: value
      }
    });
  };
  
  const handleHoursChange = (day: keyof typeof content.hours, value: string) => {
    setContent({
      ...content,
      hours: {
        ...content.hours,
        [day]: value
      }
    });
  };
  
  return (
    <div className="space-y-6 py-4">
      <Card>
        <CardHeader>
          <CardTitle>Contact Page Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Configure the contact information, hours, and map that will be displayed on your website's contact page.
            </p>
            
            <Separator className="my-4" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contactImage">Contact Page Image</Label>
                <div className="mt-2">
                  <ImageUpload
                    value={contactImage}
                    onChange={setContactImage}
                    onRemove={() => setContactImage("")}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="address" className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Address
                  </Label>
                  <Textarea
                    id="address"
                    value={content.address}
                    onChange={(e) => handleContentChange('address', e.target.value)}
                    rows={2}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    value={content.phone}
                    onChange={(e) => handleContentChange('phone', e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <AtSign className="h-4 w-4" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    value={content.email}
                    onChange={(e) => handleContentChange('email', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="showMap" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Show Google Map
                </Label>
                <Switch
                  id="showMap"
                  checked={showMap}
                  onCheckedChange={setShowMap}
                />
              </div>
              
              {showMap && (
                <div>
                  <Label htmlFor="googleMapEmbed">Google Map Embed URL</Label>
                  <Textarea
                    id="googleMapEmbed"
                    value={content.googleMapEmbed}
                    onChange={(e) => handleContentChange('googleMapEmbed', e.target.value)}
                    rows={2}
                    className="mt-1"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Enter the embed URL from Google Maps. Go to Google Maps, search your location, click "Share," then "Embed a map," and copy the provided URL.
                  </p>
                </div>
              )}
            </div>
            
            <Separator className="my-4" />
            
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="showHours" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Show Business Hours
                </Label>
                <Switch
                  id="showHours"
                  checked={showHours}
                  onCheckedChange={setShowHours}
                />
              </div>
              
              {showHours && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.keys(content.hours).map((day) => (
                    <div key={day}>
                      <Label htmlFor={`hours-${day}`} className="capitalize">
                        {day}
                      </Label>
                      <Input
                        id={`hours-${day}`}
                        value={content.hours[day as keyof typeof content.hours]}
                        onChange={(e) => handleHoursChange(day as keyof typeof content.hours, e.target.value)}
                        className="mt-1"
                        placeholder="e.g. 9:00 AM - 5:00 PM"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <Separator className="my-4" />
            
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="showContactForm">Show Contact Form</Label>
                <Switch
                  id="showContactForm"
                  checked={showContactForm}
                  onCheckedChange={setShowContactForm}
                />
              </div>
              
              {showContactForm && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="contactFormHeader">Contact Form Header</Label>
                    <Input
                      id="contactFormHeader"
                      value={content.contactFormHeader}
                      onChange={(e) => handleContentChange('contactFormHeader', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="contactFormSubheader">Contact Form Subheader</Label>
                    <Textarea
                      id="contactFormSubheader"
                      value={content.contactFormSubheader}
                      onChange={(e) => handleContentChange('contactFormSubheader', e.target.value)}
                      rows={2}
                      className="mt-1"
                    />
                  </div>
                </div>
              )}
            </div>
            
            <Separator className="my-4" />
            
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="showSocialLinks">Show Social Media Links</Label>
                <Switch
                  id="showSocialLinks"
                  checked={content.showSocialLinks}
                  onCheckedChange={(value) => handleContentChange('showSocialLinks', value)}
                />
              </div>
              
              {content.showSocialLinks && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.keys(content.socialLinks).map((network) => (
                    <div key={network}>
                      <Label htmlFor={`social-${network}`} className="capitalize">
                        {network}
                      </Label>
                      <Input
                        id={`social-${network}`}
                        value={content.socialLinks[network as keyof typeof content.socialLinks]}
                        onChange={(e) => handleSocialLinkChange(network as keyof typeof content.socialLinks, e.target.value)}
                        className="mt-1"
                        placeholder={`https://${network}.com/youraccount`}
                      />
                    </div>
                  ))}
                </div>
              )}
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
