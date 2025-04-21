
import React, { useState } from 'react';
import { Container } from '@/components/ui/container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { CreditCard, ShieldCheck, ArrowRightLeft, Check, X } from 'lucide-react';
import { PaymentGateway } from '@/types';

const initialGateways: PaymentGateway[] = [
  {
    id: '1',
    name: 'Razorpay',
    isActive: true,
    apiKey: 'rzp_test_xxxxxxxxxxxxxxx',
    secretKey: '••••••••••••••••••••••••••',
    webhookUrl: 'https://yourdomain.com/api/webhooks/razorpay',
    testMode: true
  },
  {
    id: '2',
    name: 'PayU',
    isActive: false,
    merchantId: '',
    apiKey: '',
    secretKey: '',
    testMode: true
  },
  {
    id: '3',
    name: 'CCAvenue',
    isActive: false,
    merchantId: '',
    apiKey: '',
    secretKey: '',
    testMode: true
  },
  {
    id: '4',
    name: 'PhonePe',
    isActive: false,
    merchantId: '',
    apiKey: '',
    secretKey: '',
    testMode: true
  }
];

const PaymentGatewaySettingsPage = () => {
  const [gateways, setGateways] = useState<PaymentGateway[]>(initialGateways);
  const [activeTab, setActiveTab] = useState('razorpay');
  const [currencySettings, setCurrencySettings] = useState({
    code: 'INR',
    symbol: '₹',
    position: 'before',
    decimalPlaces: 2
  });

  const handleToggleGateway = (id: string) => {
    setGateways(gateways.map(gateway => 
      gateway.id === id ? { ...gateway, isActive: !gateway.isActive } : gateway
    ));
    
    const gateway = gateways.find(g => g.id === id);
    if (gateway) {
      toast.success(`${gateway.name} ${gateway.isActive ? 'disabled' : 'enabled'}`);
    }
  };

  const handleSaveGateway = (id: string) => {
    toast.success('Payment gateway settings saved');
  };

  const handleSaveCurrency = () => {
    toast.success('Currency settings saved');
  };

  return (
    <Container>
      <div className="py-6">
        <h1 className="text-3xl font-bold mb-6">Payment Gateway Settings</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Currency Settings</CardTitle>
                <CardDescription>
                  Configure the currency used throughout the application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currency-code">Currency Code</Label>
                  <Input 
                    id="currency-code" 
                    value={currencySettings.code}
                    onChange={(e) => setCurrencySettings({...currencySettings, code: e.target.value})}
                    placeholder="USD" 
                  />
                  <p className="text-sm text-muted-foreground">Three-letter ISO code (e.g., USD, INR, EUR)</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="currency-symbol">Currency Symbol</Label>
                  <Input 
                    id="currency-symbol" 
                    value={currencySettings.symbol}
                    onChange={(e) => setCurrencySettings({...currencySettings, symbol: e.target.value})}
                    placeholder="$" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Symbol Position</Label>
                  <RadioGroup 
                    value={currencySettings.position}
                    onValueChange={(value) => setCurrencySettings({...currencySettings, position: value as 'before' | 'after'})}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="before" id="before" />
                      <Label htmlFor="before" className="cursor-pointer">Before amount (e.g., $100)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="after" id="after" />
                      <Label htmlFor="after" className="cursor-pointer">After amount (e.g., 100$)</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="decimal-places">Decimal Places</Label>
                  <Input 
                    id="decimal-places" 
                    type="number" 
                    min={0}
                    max={4}
                    value={currencySettings.decimalPlaces}
                    onChange={(e) => setCurrencySettings({...currencySettings, decimalPlaces: parseInt(e.target.value)})}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveCurrency} className="ml-auto">Save Currency Settings</Button>
              </CardFooter>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Payment Gateways</CardTitle>
                <CardDescription>
                  Enable or disable payment methods
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {gateways.map(gateway => (
                  <div key={gateway.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${gateway.isActive ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span>{gateway.name}</span>
                    </div>
                    <Switch 
                      checked={gateway.isActive}
                      onCheckedChange={() => handleToggleGateway(gateway.id)}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Gateway Configuration</CardTitle>
                <CardDescription>Configure payment gateway settings</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                  <TabsList className="grid grid-cols-2 md:grid-cols-4">
                    <TabsTrigger value="razorpay">Razorpay</TabsTrigger>
                    <TabsTrigger value="payu">PayU</TabsTrigger>
                    <TabsTrigger value="ccavenue">CCAvenue</TabsTrigger>
                    <TabsTrigger value="phonepe">PhonePe</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="razorpay" className="space-y-6">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="razorpay-test-mode" 
                        checked={gateways[0].testMode}
                        onCheckedChange={(checked) => setGateways(gateways.map(gateway => 
                          gateway.id === '1' ? { ...gateway, testMode: checked } : gateway
                        ))}
                      />
                      <Label htmlFor="razorpay-test-mode">Test Mode</Label>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="razorpay-key">API Key</Label>
                        <Input 
                          id="razorpay-key" 
                          value={gateways[0].apiKey} 
                          onChange={(e) => setGateways(gateways.map(gateway => 
                            gateway.id === '1' ? { ...gateway, apiKey: e.target.value } : gateway
                          ))}
                          placeholder="rzp_xxxxxxxxxxxxxxxxx"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="razorpay-secret">Secret Key</Label>
                        <Input 
                          id="razorpay-secret" 
                          type="password" 
                          value={gateways[0].secretKey === '••••••••••••••••••••••••••' ? '' : gateways[0].secretKey} 
                          onChange={(e) => setGateways(gateways.map(gateway => 
                            gateway.id === '1' ? { ...gateway, secretKey: e.target.value } : gateway
                          ))}
                          placeholder="Enter secret key"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="razorpay-webhook">Webhook URL</Label>
                        <Input 
                          id="razorpay-webhook" 
                          value={gateways[0].webhookUrl} 
                          onChange={(e) => setGateways(gateways.map(gateway => 
                            gateway.id === '1' ? { ...gateway, webhookUrl: e.target.value } : gateway
                          ))}
                          placeholder="https://yourdomain.com/api/webhooks/razorpay"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Set this URL in your Razorpay Dashboard to receive real-time notifications.
                        </p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-end">
                      <Button onClick={() => handleSaveGateway('1')}>
                        Save Razorpay Settings
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="payu" className="space-y-6">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="payu-test-mode" 
                        checked={gateways[1].testMode}
                        onCheckedChange={(checked) => setGateways(gateways.map(gateway => 
                          gateway.id === '2' ? { ...gateway, testMode: checked } : gateway
                        ))}
                      />
                      <Label htmlFor="payu-test-mode">Test Mode</Label>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="payu-merchant-id">Merchant ID</Label>
                        <Input 
                          id="payu-merchant-id" 
                          value={gateways[1].merchantId || ''} 
                          onChange={(e) => setGateways(gateways.map(gateway => 
                            gateway.id === '2' ? { ...gateway, merchantId: e.target.value } : gateway
                          ))}
                          placeholder="Enter merchant ID"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="payu-key">API Key</Label>
                        <Input 
                          id="payu-key" 
                          value={gateways[1].apiKey || ''} 
                          onChange={(e) => setGateways(gateways.map(gateway => 
                            gateway.id === '2' ? { ...gateway, apiKey: e.target.value } : gateway
                          ))}
                          placeholder="Enter API key"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="payu-salt">Salt</Label>
                        <Input 
                          id="payu-salt" 
                          type="password" 
                          value={gateways[1].secretKey || ''} 
                          onChange={(e) => setGateways(gateways.map(gateway => 
                            gateway.id === '2' ? { ...gateway, secretKey: e.target.value } : gateway
                          ))}
                          placeholder="Enter salt value"
                        />
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-end">
                      <Button onClick={() => handleSaveGateway('2')}>
                        Save PayU Settings
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="ccavenue" className="space-y-6">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="ccavenue-test-mode" 
                        checked={gateways[2].testMode}
                        onCheckedChange={(checked) => setGateways(gateways.map(gateway => 
                          gateway.id === '3' ? { ...gateway, testMode: checked } : gateway
                        ))}
                      />
                      <Label htmlFor="ccavenue-test-mode">Test Mode</Label>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="ccavenue-merchant-id">Merchant ID</Label>
                        <Input 
                          id="ccavenue-merchant-id" 
                          value={gateways[2].merchantId || ''} 
                          onChange={(e) => setGateways(gateways.map(gateway => 
                            gateway.id === '3' ? { ...gateway, merchantId: e.target.value } : gateway
                          ))}
                          placeholder="Enter merchant ID"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="ccavenue-access-code">Access Code</Label>
                        <Input 
                          id="ccavenue-access-code" 
                          value={gateways[2].apiKey || ''} 
                          onChange={(e) => setGateways(gateways.map(gateway => 
                            gateway.id === '3' ? { ...gateway, apiKey: e.target.value } : gateway
                          ))}
                          placeholder="Enter access code"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="ccavenue-working-key">Working Key</Label>
                        <Input 
                          id="ccavenue-working-key" 
                          type="password" 
                          value={gateways[2].secretKey || ''} 
                          onChange={(e) => setGateways(gateways.map(gateway => 
                            gateway.id === '3' ? { ...gateway, secretKey: e.target.value } : gateway
                          ))}
                          placeholder="Enter working key"
                        />
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-end">
                      <Button onClick={() => handleSaveGateway('3')}>
                        Save CCAvenue Settings
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="phonepe" className="space-y-6">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="phonepe-test-mode" 
                        checked={gateways[3].testMode}
                        onCheckedChange={(checked) => setGateways(gateways.map(gateway => 
                          gateway.id === '4' ? { ...gateway, testMode: checked } : gateway
                        ))}
                      />
                      <Label htmlFor="phonepe-test-mode">Test Mode</Label>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="phonepe-merchant-id">Merchant ID</Label>
                        <Input 
                          id="phonepe-merchant-id" 
                          value={gateways[3].merchantId || ''} 
                          onChange={(e) => setGateways(gateways.map(gateway => 
                            gateway.id === '4' ? { ...gateway, merchantId: e.target.value } : gateway
                          ))}
                          placeholder="Enter merchant ID"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phonepe-salt-key">Salt Key</Label>
                        <Input 
                          id="phonepe-salt-key" 
                          value={gateways[3].apiKey || ''} 
                          onChange={(e) => setGateways(gateways.map(gateway => 
                            gateway.id === '4' ? { ...gateway, apiKey: e.target.value } : gateway
                          ))}
                          placeholder="Enter salt key"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phonepe-salt-index">Salt Index</Label>
                        <Input 
                          id="phonepe-salt-index" 
                          value={gateways[3].secretKey || ''} 
                          onChange={(e) => setGateways(gateways.map(gateway => 
                            gateway.id === '4' ? { ...gateway, secretKey: e.target.value } : gateway
                          ))}
                          placeholder="Enter salt index"
                        />
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-end">
                      <Button onClick={() => handleSaveGateway('4')}>
                        Save PhonePe Settings
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default PaymentGatewaySettingsPage;
