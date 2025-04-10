
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Invoice } from "@/types";

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
      toast.success("Payment successful");
    }, 2000);
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
            <DialogTitle>Payment Link Generated</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
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
              <p>Member: {invoice.memberId}</p>
              <p>Due Date: {new Date(invoice.dueDate).toLocaleDateString()}</p>
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowPaymentModal(false)}>
              Close
            </Button>
            <Button
              onClick={simulatePayment}
              disabled={processing}
            >
              {processing ? "Processing..." : "Simulate Successful Payment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PaymentIntegration;
