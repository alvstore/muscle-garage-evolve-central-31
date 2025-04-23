
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type EmailTemplatePreviewProps = {
  isOpen: boolean;
  onClose: () => void;
  template: any;
};

const EmailTemplatePreview: React.FC<EmailTemplatePreviewProps> = ({ 
  isOpen, 
  onClose, 
  template 
}) => {
  // Sample data for preview
  const sampleData = {
    member_name: "John Smith",
    gym_name: "Downtown Fitness Center",
    login_url: "https://example.com/login",
    plan_name: "Premium Membership",
    expiry_date: "December 31, 2023",
    invoice_link: "https://example.com/invoice/123",
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
    // Here we would normally send a test email
    toast.success("Test email sent successfully");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Preview: {template.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="border rounded-md p-4">
            <div className="font-semibold mb-2">Subject:</div>
            <div>{processTemplate(template.subject)}</div>
          </div>
          
          <div className="border rounded-md p-4">
            <div className="font-semibold mb-2">Email Body:</div>
            <div className="whitespace-pre-line">{processTemplate(template.content)}</div>
          </div>
          
          <div className="bg-slate-50 p-3 rounded text-xs">
            <p>This is a preview using sample data. The actual email will use real member data when sent.</p>
          </div>
        </div>
        
        <DialogFooter className="mt-6">
          <Button type="button" variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button type="button" onClick={handleSendTest}>
            Send Test Email
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EmailTemplatePreview;
