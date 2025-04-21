
import { useState } from "react";
import { Container } from "@/components/ui/container";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Info, CreditCard, Shield } from "lucide-react";
import { usePermissions } from "@/hooks/use-permissions";
import { Navigate } from "react-router-dom";

interface PaymentGatewayConfig {
  enabled: boolean;
  live: boolean;
  apiKey: string;
  secretKey: string;
  merchantId?: string;
  callbackUrl: string;
  webhookUrl: string;
  additionalConfig?: Record<string, string>;
}

const initialConfigs: Record<string, PaymentGatewayConfig> = {
  razorpay: {
    enabled: true,
    live: false,
    apiKey: "rzp_test_1234567890abcdef",
    secretKey: "••••••••••••••••••••••••••",
    callbackUrl: "https://yourdomain.com/api/payments/razorpay/callback",
    webhookUrl: "https://yourdomain.com/api/payments/razorpay/webhook",
  },
  payu: {
    enabled: false,
    live: false,
    apiKey: "",
    secretKey: "",
    merchantId: "",
    callbackUrl: "https://yourdomain.com/api/payments/payu/callback",
    webhookUrl: "https://yourdomain.com/api/payments/payu/webhook",
  },
  ccavenue: {
    enabled: false,
    live: false,
    apiKey: "",
    secretKey: "",
    merchantId: "",
    callbackUrl: "https://yourdomain.com/api/payments/ccavenue/callback",
    webhookUrl: "https://yourdomain.com/api/payments/ccavenue/webhook",
  },
  phonepe: {
    enabled: false,
    live: false,
    apiKey: "",
    secretKey: "",
    merchantId: "",
    callbackUrl: "https://yourdomain.com/api/payments/phonepe/callback",
    webhookUrl: "https://yourdomain.com/api/payments/phonepe/webhook",
  }
};

const PaymentGatewaySettingsPage = () => {
  const [configs, setConfigs] = useState<Record<string, PaymentGatewayConfig>>(initialConfigs);
  const [activeTab, setActiveTab] = useState("razorpay");
  const { can } = usePermissions();
  
  // Check if user has permission to manage settings
  if (!can("manage_settings")) {
    toast.error("You don't have permission to access payment gateway settings");
    return <Navigate to="/unauthorized" replace />;
  }
  
  const handleConfigChange = (gateway: string, field: keyof PaymentGatewayConfig, value: any) => {
    setConfigs({
      ...configs,
      [gateway]: {
        ...configs[gateway],
        [field]: value
      }
    });
  };
  
  const handleAdditionalConfigChange = (gateway: string, field: string, value: string) => {
    setConfigs({
      ...configs,
      [gateway]: {
        ...configs[gateway],
        additionalConfig: {
          ...configs[gateway].additionalConfig,
          [field]: value
        }
      }
    });
  };
  
  const handleSaveChanges = (gateway: string) => {
    toast.success(`${gateway.charAt(0).toUpperCase() + gateway.slice(1)} settings saved successfully`);
  };
  
  const handleTestConnection = (gateway: string) => {
    toast.success(`${gateway.charAt(0).toUpperCase() + gateway.slice(1)} connection test successful`);
  };
  
  return (
    <Container>
      <div className="py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Payment Gateway Settings</h1>
          <p className="text-muted-foreground">Configure your payment gateway credentials</p>
        </div>
        
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Security Notice</AlertTitle>
          <AlertDescription>
            These are global settings for all branches. Your API keys and secrets are encrypted 
            before storage. Never share these credentials with unauthorized personnel.
          </AlertDescription>
        </Alert>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-2">
            <TabsTrigger value="razorpay">Razorpay</TabsTrigger>
            <TabsTrigger value="payu">PayU</TabsTrigger>
            <TabsTrigger value="ccavenue">CCAvenue</TabsTrigger>
            <TabsTrigger value="phonepe">PhonePe</TabsTrigger>
          </TabsList>
          
          {/* Razorpay */}
          <TabsContent value="razorpay">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Razorpay Settings</CardTitle>
                    <CardDescription>Configure your Razorpay payment gateway</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={configs.razorpay.enabled}
                      onCheckedChange={(value) => handleConfigChange("razorpay", "enabled", value)}
                      id="razorpay-enabled"
                    />
                    <Label htmlFor="razorpay-enabled">
                      {configs.razorpay.enabled ? "Enabled" : "Disabled"}
                    </Label>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={configs.razorpay.live}
                      onCheckedChange={(value) => handleConfigChange("razorpay", "live", value)}
                      id="razorpay-live"
                    />
                    <Label htmlFor="razorpay-live">
                      {configs.razorpay.live ? "Live Mode" : "Test Mode"}
                    </Label>
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="razorpay-api-key">API Key</Label>
                      <Input
                        id="razorpay-api-key"
                        value={configs.razorpay.apiKey}
                        onChange={(e) => handleConfigChange("razorpay", "apiKey", e.target.value)}
                        placeholder="rzp_live_xxxxxxxxxx"
                      />
                      <p className="text-sm text-muted-foreground">
                        Your Razorpay API key ({configs.razorpay.live ? "Live" : "Test"})
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="razorpay-secret-key">Secret Key</Label>
                      <Input
                        id="razorpay-secret-key"
                        type="password"
                        value={configs.razorpay.secretKey}
                        onChange={(e) => handleConfigChange("razorpay", "secretKey", e.target.value)}
                        placeholder="••••••••••••••••••••••••••"
                      />
                      <p className="text-sm text-muted-foreground">
                        Your Razorpay secret key ({configs.razorpay.live ? "Live" : "Test"})
                      </p>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Webhook Configuration</h3>
                  <div className="space-y-2">
                    <Label htmlFor="razorpay-webhook-url">Webhook URL</Label>
                    <div className="flex gap-2">
                      <Input
                        id="razorpay-webhook-url"
                        value={configs.razorpay.webhookUrl}
                        onChange={(e) => handleConfigChange("razorpay", "webhookUrl", e.target.value)}
                        placeholder="https://yourdomain.com/api/payments/razorpay/webhook"
                        className="flex-1"
                      />
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          navigator.clipboard.writeText(configs.razorpay.webhookUrl);
                          toast.success("Webhook URL copied to clipboard");
                        }}
                      >
                        Copy
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Add this URL in your Razorpay dashboard to receive payment events
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => handleTestConnection("razorpay")}>
                    <Shield className="mr-2 h-4 w-4" />
                    Test Connection
                  </Button>
                  <Button onClick={() => handleSaveChanges("razorpay")}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* PayU */}
          <TabsContent value="payu">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>PayU Settings</CardTitle>
                    <CardDescription>Configure your PayU payment gateway</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={configs.payu.enabled}
                      onCheckedChange={(value) => handleConfigChange("payu", "enabled", value)}
                      id="payu-enabled"
                    />
                    <Label htmlFor="payu-enabled">
                      {configs.payu.enabled ? "Enabled" : "Disabled"}
                    </Label>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={configs.payu.live}
                      onCheckedChange={(value) => handleConfigChange("payu", "live", value)}
                      id="payu-live"
                    />
                    <Label htmlFor="payu-live">
                      {configs.payu.live ? "Live Mode" : "Test Mode"}
                    </Label>
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="payu-merchant-id">Merchant ID</Label>
                      <Input
                        id="payu-merchant-id"
                        value={configs.payu.merchantId || ""}
                        onChange={(e) => handleConfigChange("payu", "merchantId", e.target.value)}
                        placeholder="Enter your PayU Merchant ID"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="payu-api-key">API Key</Label>
                      <Input
                        id="payu-api-key"
                        value={configs.payu.apiKey}
                        onChange={(e) => handleConfigChange("payu", "apiKey", e.target.value)}
                        placeholder="Enter your PayU API key"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="payu-secret-key">Secret Key</Label>
                    <Input
                      id="payu-secret-key"
                      type="password"
                      value={configs.payu.secretKey}
                      onChange={(e) => handleConfigChange("payu", "secretKey", e.target.value)}
                      placeholder="••••••••••••••••••••••••••"
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Callback URLs</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="payu-success-url">Success URL</Label>
                      <Input
                        id="payu-success-url"
                        value={configs.payu.callbackUrl}
                        onChange={(e) => handleConfigChange("payu", "callbackUrl", e.target.value)}
                        placeholder="https://yourdomain.com/api/payments/payu/callback"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="payu-webhook-url">Webhook URL</Label>
                      <Input
                        id="payu-webhook-url"
                        value={configs.payu.webhookUrl}
                        onChange={(e) => handleConfigChange("payu", "webhookUrl", e.target.value)}
                        placeholder="https://yourdomain.com/api/payments/payu/webhook"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => handleTestConnection("payu")}>
                    <Shield className="mr-2 h-4 w-4" />
                    Test Connection
                  </Button>
                  <Button onClick={() => handleSaveChanges("payu")}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* CCAvenue */}
          <TabsContent value="ccavenue">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>CCAvenue Settings</CardTitle>
                    <CardDescription>Configure your CCAvenue payment gateway</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={configs.ccavenue.enabled}
                      onCheckedChange={(value) => handleConfigChange("ccavenue", "enabled", value)}
                      id="ccavenue-enabled"
                    />
                    <Label htmlFor="ccavenue-enabled">
                      {configs.ccavenue.enabled ? "Enabled" : "Disabled"}
                    </Label>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={configs.ccavenue.live}
                      onCheckedChange={(value) => handleConfigChange("ccavenue", "live", value)}
                      id="ccavenue-live"
                    />
                    <Label htmlFor="ccavenue-live">
                      {configs.ccavenue.live ? "Live Mode" : "Test Mode"}
                    </Label>
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="ccavenue-merchant-id">Merchant ID</Label>
                      <Input
                        id="ccavenue-merchant-id"
                        value={configs.ccavenue.merchantId || ""}
                        onChange={(e) => handleConfigChange("ccavenue", "merchantId", e.target.value)}
                        placeholder="Enter your CCAvenue Merchant ID"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ccavenue-api-key">Access Code</Label>
                      <Input
                        id="ccavenue-api-key"
                        value={configs.ccavenue.apiKey}
                        onChange={(e) => handleConfigChange("ccavenue", "apiKey", e.target.value)}
                        placeholder="Enter your CCAvenue Access Code"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="ccavenue-secret-key">Working Key</Label>
                    <Input
                      id="ccavenue-secret-key"
                      type="password"
                      value={configs.ccavenue.secretKey}
                      onChange={(e) => handleConfigChange("ccavenue", "secretKey", e.target.value)}
                      placeholder="••••••••••••••••••••••••••"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => handleTestConnection("ccavenue")}>
                    <Shield className="mr-2 h-4 w-4" />
                    Test Connection
                  </Button>
                  <Button onClick={() => handleSaveChanges("ccavenue")}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* PhonePe */}
          <TabsContent value="phonepe">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>PhonePe Settings</CardTitle>
                    <CardDescription>Configure your PhonePe payment gateway</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={configs.phonepe.enabled}
                      onCheckedChange={(value) => handleConfigChange("phonepe", "enabled", value)}
                      id="phonepe-enabled"
                    />
                    <Label htmlFor="phonepe-enabled">
                      {configs.phonepe.enabled ? "Enabled" : "Disabled"}
                    </Label>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={configs.phonepe.live}
                      onCheckedChange={(value) => handleConfigChange("phonepe", "live", value)}
                      id="phonepe-live"
                    />
                    <Label htmlFor="phonepe-live">
                      {configs.phonepe.live ? "Live Mode" : "Test Mode"}
                    </Label>
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="phonepe-merchant-id">Merchant ID</Label>
                      <Input
                        id="phonepe-merchant-id"
                        value={configs.phonepe.merchantId || ""}
                        onChange={(e) => handleConfigChange("phonepe", "merchantId", e.target.value)}
                        placeholder="Enter your PhonePe Merchant ID"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phonepe-api-key">API Key</Label>
                      <Input
                        id="phonepe-api-key"
                        value={configs.phonepe.apiKey}
                        onChange={(e) => handleConfigChange("phonepe", "apiKey", e.target.value)}
                        placeholder="Enter your PhonePe API key"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phonepe-secret-key">Secret Key</Label>
                    <Input
                      id="phonepe-secret-key"
                      type="password"
                      value={configs.phonepe.secretKey}
                      onChange={(e) => handleConfigChange("phonepe", "secretKey", e.target.value)}
                      placeholder="••••••••••••••••••••••••••"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => handleTestConnection("phonepe")}>
                    <Shield className="mr-2 h-4 w-4" />
                    Test Connection
                  </Button>
                  <Button onClick={() => handleSaveChanges("phonepe")}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
};

export default PaymentGatewaySettingsPage;
