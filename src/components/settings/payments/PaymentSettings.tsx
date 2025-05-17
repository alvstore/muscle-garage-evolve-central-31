
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useBranch } from "@/hooks/settings/use-branches";

export default function PaymentSettings() {
  const { currentBranch } = useBranch();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSave = async () => {
    if (!currentBranch?.id) {
      toast.error("Please select a branch first");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast.success("Payment settings saved successfully");
    } catch (error) {
      console.error("Error saving payment settings:", error);
      toast.error("Failed to save payment settings");
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!currentBranch?.id) {
    return (
      <div className="text-center p-4">
        Please select a branch to view settings
      </div>
    );
  }
  
  return (
    <Tabs defaultValue="online" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-4">
        <TabsTrigger value="online">Online Payments</TabsTrigger>
        <TabsTrigger value="offline">Offline Payments</TabsTrigger>
        <TabsTrigger value="invoicing">Invoicing</TabsTrigger>
      </TabsList>
      
      <TabsContent value="online" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Razorpay Configuration</CardTitle>
            <CardDescription>
              Configure Razorpay payment gateway for online transactions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="razorpay-enabled">Enable Razorpay</Label>
              <Switch id="razorpay-enabled" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="razorpay-key">Razorpay Key ID</Label>
              <Input id="razorpay-key" type="text" placeholder="rzp_xxxxxxxxxxxxx" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="razorpay-secret">Razorpay Key Secret</Label>
              <Input id="razorpay-secret" type="password" placeholder="••••••••••••••••••••••" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="razorpay-webhook">Webhook Secret</Label>
              <Input id="razorpay-webhook" type="password" placeholder="••••••••••••••••••••••" />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSave} disabled={isLoading}>
              Save Razorpay Settings
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
      
      <TabsContent value="offline" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Offline Payment Methods</CardTitle>
            <CardDescription>
              Configure acceptable offline payment methods
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="cash-enabled">Cash</Label>
              <Switch id="cash-enabled" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="check-enabled">Check/Cheque</Label>
              <Switch id="check-enabled" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="bank-transfer-enabled">Bank Transfer</Label>
              <Switch id="bank-transfer-enabled" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="upi-enabled">UPI</Label>
              <Switch id="upi-enabled" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="pos-enabled">POS Terminal</Label>
              <Switch id="pos-enabled" />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSave} disabled={isLoading}>
              Save Offline Payment Settings
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
      
      <TabsContent value="invoicing" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Invoice Settings</CardTitle>
            <CardDescription>
              Configure invoice generation and formatting options
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="invoice-prefix">Invoice Number Prefix</Label>
              <Input id="invoice-prefix" placeholder="INV-" defaultValue="INV-" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="invoice-terms">Default Invoice Terms</Label>
              <Input id="invoice-terms" placeholder="Payment due within 15 days" />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-invoice">Auto-generate invoices</Label>
              <Switch id="auto-invoice" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="send-email">Send invoice by email</Label>
              <Switch id="send-email" defaultChecked />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSave} disabled={isLoading}>
              Save Invoice Settings
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
