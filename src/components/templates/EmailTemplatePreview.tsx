import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { X } from 'lucide-react';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  isActive?: boolean;
}

type EmailTemplatePreviewProps = {
  isOpen: boolean;
  onClose: () => void;
  template: EmailTemplate | null;
};

const EmailTemplatePreview: React.FC<EmailTemplatePreviewProps> = ({ 
  isOpen, 
  onClose, 
  template 
}) => {
  const sampleData = {
    'member.name': 'John Doe',
    'member.email': 'john.doe@example.com',
    'gym.name': 'Muscle Garage',
    'gym.phone': '+1 (555) 123-4567',
    'gym.email': 'info@musclegarage.com'
  };

  // Replace tags with actual values for preview
  const processTemplate = (content?: string) => {
    if (!content) return '';
    
    let processed = content;
    
    Object.entries(sampleData).forEach(([key, value]) => {
      const regex = new RegExp(`\\{\\$${key}\\}`);
      processed = processed.replace(regex, value);
    });
    
    return processed;
  };

  const handleSendTest = () => {
    // Here we would normally send a test email
    toast.success("Test email sent successfully");
    onClose();
  };

  if (!template) {
    return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Preview Not Available</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <p>Template data is not available.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Preview: {template?.name || 'Untitled Template'}</DialogTitle>
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
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handleSendTest}>
            Send Test Email
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EmailTemplatePreview;
