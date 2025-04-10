
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Invoice } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// This is a mock component for Razorpay integration
// In a real app, you would use the Razorpay SDK and API

interface PaymentIntegrationProps {
  invoice: Invoice;
  onPaymentComplete: (paymentId: string) => void;
}

const PaymentIntegration = ({ invoice, onPaymentComplete }: PaymentIntegrationProps) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [generatingLink, setGeneratingLink] = useState(false);
  const [paymentLink, setPaymentLink] = useState("");
  const [processing, setProcessing] = useState(false);
  const [sendSms, setSendSms] = useState(true);
  const [sendWhatsapp, setSendWhatsapp] = useState(true);
  const [activeTab, setActiveTab] = useState("link");
  const [sendEmail, setSendEmail] = useState(false);
  const [webhookEvents, setWebhookEvents] = useState(true);

  const generatePaymentLink = () => {
    setGeneratingLink(true);
    
    // In a real app, this would be an API call to Razorpay
    setTimeout(() => {
      // Mock payment link
      const mockPaymentLink = `https://rzp.io/i/gym${invoice.id}`;
      setPaymentLink(mockPaymentLink);
      setGeneratingLink(false);
      setShowPaymentModal(true);
    }, 1500);
  };

  const simulatePayment = () => {
    setProcessing(true);
    
    // In a real app, this would be handled by Razorpay callback
    setTimeout(() => {
      const mockPaymentId = `pay_${Date.now()}`;
      onPaymentComplete(mockPaymentId);
      setProcessing(false);
      setShowPaymentModal(false);
      
      // Show success toast with notification details
      const notificationSent = (sendSms || sendWhatsapp || sendEmail);
      const notificationMethods = [];
      if (sendSms) notificationMethods.push("SMS");
      if (sendWhatsapp) notificationMethods.push("WhatsApp");
      if (sendEmail) notificationMethods.push("Email");
      
      toast.success(
        notificationSent
          ? `Payment successful. Receipt sent via ${notificationMethods.join(" and ")}`
          : "Payment successful"
      );
      
      if (webhookEvents) {
        // Simulate webhook events
        toast.info("Webhook events will be processed automatically", {
          description: "Payment captured webhook will update the invoice status",
          duration: 5000
        });
      }
    }, 2000);
  };

  const handleSendLink = () => {
    // In a real app, this would send SMS/WhatsApp with the payment link
    if (!sendSms && !sendWhatsapp && !sendEmail) {
      toast.error("Please select at least one notification method");
      return;
    }
    
    const notificationMethods = [];
    if (sendSms) notificationMethods.push("SMS");
    if (sendWhatsapp) notificationMethods.push("WhatsApp");
    if (sendEmail) notificationMethods.push("Email");
    
    toast.success(`Payment link sent via ${notificationMethods.join(" and ")}`);
  };

  return (
    <>
      <Button
        onClick={generatePaymentLink}
        disabled={generatingLink || invoice.status === "paid"}
        className="w-full"
      >
        {generatingLink ? "Generating..." : "Generate Razorpay Link"}
      </Button>
      
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Payment for Invoice #{invoice.id}</DialogTitle>
            <DialogDescription>
              Use Razorpay to process payment for this invoice
            </DialogDescription>
          </DialogHeader>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="link">Payment Link</TabsTrigger>
              <TabsTrigger value="notify">Notify Member</TabsTrigger>
            </TabsList>
            
            <TabsContent value="link" className="py-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Payment Link</Label>
                  <div className="flex gap-2">
                    <Input value={paymentLink} readOnly />
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        navigator.clipboard.writeText(paymentLink);
                        toast.success("Payment link copied to clipboard");
                      }}
                    >
                      Copy
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Share this link with the member to complete payment via Razorpay
                  </p>
                </div>
                
                <div className="space-y-2 rounded-md bg-muted p-3">
                  <h4 className="font-medium">Invoice Summary</h4>
                  <p>Amount: ₹{invoice.amount.toFixed(2)}</p>
                  <p>Member: {invoice.memberName}</p>
                  <p>Due Date: {new Date(invoice.dueDate).toLocaleDateString()}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="webhook-events" 
                      checked={webhookEvents}
                      onCheckedChange={(checked) => setWebhookEvents(checked === true)}
                    />
                    <Label htmlFor="webhook-events" className="text-sm">Process Razorpay webhooks for this payment</Label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    When enabled, the system will automatically update the invoice status when payment webhooks are received
                  </p>
                </div>
                
                <Button
                  onClick={simulatePayment}
                  disabled={processing}
                  className="w-full"
                >
                  {processing ? "Processing..." : "Simulate Successful Payment"}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="notify" className="py-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Send Payment Link to Member</h4>
                  <p className="text-sm text-muted-foreground">Choose notification methods:</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="send-sms" 
                        checked={sendSms}
                        onCheckedChange={(checked) => setSendSms(checked === true)}
                      />
                      <Label htmlFor="send-sms">Send via SMS</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="send-whatsapp" 
                        checked={sendWhatsapp}
                        onCheckedChange={(checked) => setSendWhatsapp(checked === true)}
                      />
                      <Label htmlFor="send-whatsapp">Send via WhatsApp</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="send-email" 
                        checked={sendEmail}
                        onCheckedChange={(checked) => setSendEmail(checked === true)}
                      />
                      <Label htmlFor="send-email">Send via Email</Label>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <Button 
                      variant="secondary" 
                      className="w-full"
                      onClick={handleSendLink}
                      disabled={!sendSms && !sendWhatsapp && !sendEmail}
                    >
                      Send Payment Link
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2 rounded-md bg-muted p-3">
                  <h4 className="font-medium">Message Preview</h4>
                  <p className="text-sm italic">
                    "Hello from Muscle Garage! Your invoice #{invoice.id} for ₹{invoice.amount.toFixed(2)} is ready for payment. Click here to pay: {paymentLink}"
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter className="flex justify-end">
            <Button variant="outline" onClick={() => setShowPaymentModal(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PaymentIntegration;
