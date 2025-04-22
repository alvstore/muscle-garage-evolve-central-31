
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

type SmsTemplatePreviewProps = {
  isOpen: boolean;
  onClose: () => void;
  template: any;
};

const SmsTemplatePreview: React.FC<SmsTemplatePreviewProps> = ({ 
  isOpen, 
  onClose, 
  template 
}) => {
  const [testPhone, setTestPhone] = useState("");
  
  // Sample data for preview
  const sampleData = {
    member_name: "John Smith",
    gym_name: "Downtown Fitness Center",
    plan_name: "Premium Membership",
    expiry_date: "31/12/2023",
    amount: "5000",
    due_date: "15/08/2023",
    class_name: "Yoga",
    class_time: "6:00 PM",
    branch_name: "Downtown Branch",
    trainer_name: "Alex Johnson"
  };

  // Replace tags with actual values for preview
  const processTemplate = (text: string) => {
    let processed = text;
    
    Object.entries(sampleData).forEach(([key, value]) => {
      const regex = new RegExp(`{${key}}`, 'g');
      processed = processed.replace(regex, value);
    });
    
    return processed;
  };

  const handleSendTest = () => {
    if (!testPhone) {
      toast.error("Please enter a phone number for the test SMS");
      return;
    }
    
    // Validate phone number
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (!phoneRegex.test(testPhone)) {
      toast.error("Please enter a valid phone number");
      return;
    }
    
    // Here we would normally send a test SMS
    toast.success(`Test SMS sent to ${testPhone}`);
    onClose();
  };

  const processedContent = processTemplate(template.content);
  const characterCount = processedContent.length;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Preview: {template.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {template.isDltRequired && (
            <div className="flex flex-col gap-1">
              <div className="text-sm font-medium">DLT Template ID:</div>
              <div className="text-sm">{template.dltTemplateId}</div>
              <div className="text-sm font-medium mt-1">Category:</div>
              <div className="text-sm">{template.dltCategory}</div>
              <div className="text-sm font-medium mt-1">Sender ID:</div>
              <div className="text-sm">{template.senderId || "Not specified"}</div>
            </div>
          )}
          
          <div className="border rounded-md p-4">
            <div className="font-semibold mb-2">SMS Content:</div>
            <div className="whitespace-pre-line">{processedContent}</div>
            <div className={`text-xs mt-2 ${characterCount > 160 ? 'text-red-500' : 'text-muted-foreground'}`}>
              {characterCount}/160 characters
            </div>
          </div>
          
          <div className="bg-slate-50 p-3 rounded text-xs">
            <p>This is a preview using sample data. The actual SMS will use real member data when sent.</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="test-phone">Send Test SMS To:</Label>
            <Input 
              id="test-phone" 
              placeholder="+91XXXXXXXXXX" 
              value={testPhone} 
              onChange={(e) => setTestPhone(e.target.value)} 
            />
          </div>
        </div>
        
        <DialogFooter className="mt-6">
          <Button type="button" variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button 
            type="button" 
            onClick={handleSendTest}
            disabled={characterCount > 160}
          >
            Send Test SMS
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SmsTemplatePreview;
