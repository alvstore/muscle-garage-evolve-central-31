
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/services/api/supabaseClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { usePermissions } from "@/hooks/auth/use-permissions";
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";

// Settings structure example
interface GlobalSetting {
  key: string;
  value: any;
  category: string;
  description?: string;
}

const GlobalSettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState("general");
  const { isSuperAdmin } = usePermissions();
  const isSuperAdminUser = isSuperAdmin();
  const globalForm = useForm({
    defaultValues: {
      companyName: "",
      companyAddress: "",
      companyEmail: "",
      companyPhone: "",
      currency: "USD",
      dateFormat: "MM/DD/YYYY",
      timeFormat: "12h"
    }
  });
  
  const razorpayForm = useForm({
    defaultValues: {
      apiKey: "",
      secretKey: "",
      webhookSecret: "",
      testMode: true
    }
  });

  // Fetch global settings from Supabase
  const { data: settings, isLoading, error } = useQuery({
    queryKey: ["global-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("settings")
        .select("*")
        .is("branch_id", null) // Global settings have no branch_id
        .order("category");

      if (error) throw error;
      return data as GlobalSetting[];
    }
  });

  React.useEffect(() => {
    if (settings) {
      // Process settings and update forms
      settings.forEach(setting => {
        if (setting.category === "general") {
          globalForm.setValue(setting.key as any, setting.value);
        } else if (setting.category === "payment" && setting.key === "razorpay") {
          const razorpaySettings = setting.value;
          Object.keys(razorpaySettings).forEach(key => {
            razorpayForm.setValue(key as any, razorpaySettings[key]);
          });
        }
      });
    }
  }, [settings]);

  const saveGeneralSettings = async (data: any) => {
    try {
      const { error } = await supabase.rpc("upsert_settings_batch", {
        settings_array: [
          {
            category: "general",
            key: "companyName",
            value: data.companyName,
            description: "Company name"
          },
          {
            category: "general",
            key: "companyAddress",
            value: data.companyAddress,
            description: "Company address"
          },
          {
            category: "general",
            key: "companyEmail",
            value: data.companyEmail,
            description: "Company email"
          },
          {
            category: "general",
            key: "companyPhone",
            value: data.companyPhone,
            description: "Company phone"
          },
          {
            category: "general",
            key: "currency",
            value: data.currency,
            description: "Default currency"
          },
          {
            category: "general",
            key: "dateFormat",
            value: data.dateFormat,
            description: "Date format"
          },
          {
            category: "general",
            key: "timeFormat",
            value: data.timeFormat,
            description: "Time format"
          }
        ]
      });

      if (error) throw error;
      toast.success("General settings saved successfully");
    } catch (err) {
      console.error("Error saving settings:", err);
      toast.error("Failed to save settings");
    }
  };

  const savePaymentSettings = async (data: any) => {
    try {
      const { error } = await supabase.rpc("upsert_settings_batch", {
        settings_array: [
          {
            category: "payment",
            key: "razorpay",
            value: {
              apiKey: data.apiKey,
              secretKey: data.secretKey,
              webhookSecret: data.webhookSecret,
              testMode: data.testMode
            },
            description: "Razorpay payment gateway settings"
          }
        ]
      });

      if (error) throw error;
      toast.success("Payment settings saved successfully");
    } catch (err) {
      console.error("Error saving payment settings:", err);
      toast.error("Failed to save payment settings");
    }
  };

  if (!isSuperAdminUser) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Access Denied</AlertTitle>
        <AlertDescription>
          Only Super Admins can access Global Settings.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Global Settings" 
        description="Configure system-wide settings" 
      />

      <Card>
        <CardHeader>
          <CardTitle>Global System Settings</CardTitle>
          <CardDescription>
            These settings apply across all branches in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs 
            defaultValue="general" 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3 md:grid-cols-5 mb-6">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="payment">Payment</TabsTrigger>
              <TabsTrigger value="communication">Communication</TabsTrigger>
              <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
              <TabsTrigger value="sms">SMS</TabsTrigger>
            </TabsList>

            <TabsContent value="general">
              <FormProvider {...globalForm}>
                <form onSubmit={globalForm.handleSubmit(saveGeneralSettings)}>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium">Company Information</h3>
                      <p className="text-sm text-muted-foreground">
                        Set up your company details
                      </p>
                    </div>
                    <Separator />
                    
                    {isLoading ? (
                      <div className="space-y-2">
                        <div className="h-4 w-1/3 bg-gray-200 animate-pulse rounded"></div>
                        <div className="h-10 bg-gray-200 animate-pulse rounded"></div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Company Name</label>
                          <input 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md" 
                            {...globalForm.register("companyName")}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Company Address</label>
                          <input 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md" 
                            {...globalForm.register("companyAddress")}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Company Email</label>
                          <input 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md" 
                            type="email"
                            {...globalForm.register("companyEmail")}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Company Phone</label>
                          <input 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md" 
                            {...globalForm.register("companyPhone")}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Currency</label>
                          <select 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md" 
                            {...globalForm.register("currency")}
                          >
                            <option value="USD">USD ($)</option>
                            <option value="EUR">EUR (€)</option>
                            <option value="GBP">GBP (£)</option>
                            <option value="INR">INR (₹)</option>
                            <option value="AUD">AUD (A$)</option>
                          </select>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Date Format</label>
                          <select 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md" 
                            {...globalForm.register("dateFormat")}
                          >
                            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                          </select>
                        </div>
                      </div>
                    )}
                    
                    <div className="pt-4 flex justify-end">
                      <Button 
                        type="submit" 
                        disabled={isLoading || !globalForm.formState.isDirty}
                      >
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </form>
              </FormProvider>
            </TabsContent>

            <TabsContent value="payment">
              <FormProvider {...razorpayForm}>
                <form onSubmit={razorpayForm.handleSubmit(savePaymentSettings)}>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium">Payment Gateway Settings</h3>
                      <p className="text-sm text-muted-foreground">
                        Configure your Razorpay integration
                      </p>
                    </div>
                    <Separator />
                    
                    {isLoading ? (
                      <div className="space-y-2">
                        <div className="h-4 w-1/3 bg-gray-200 animate-pulse rounded"></div>
                        <div className="h-10 bg-gray-200 animate-pulse rounded"></div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">API Key</label>
                          <input 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md" 
                            {...razorpayForm.register("apiKey")}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Secret Key</label>
                          <input 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md" 
                            type="password"
                            {...razorpayForm.register("secretKey")}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Webhook Secret</label>
                          <input 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md" 
                            {...razorpayForm.register("webhookSecret")}
                          />
                        </div>
                        
                        <div className="space-y-2 flex items-center">
                          <label className="flex items-center space-x-2">
                            <input 
                              type="checkbox" 
                              className="form-checkbox h-5 w-5" 
                              {...razorpayForm.register("testMode")}
                            />
                            <span className="text-sm font-medium">Test Mode</span>
                          </label>
                        </div>
                      </div>
                    )}
                    
                    <div className="pt-4 flex justify-end">
                      <Button 
                        type="submit" 
                        disabled={isLoading || !razorpayForm.formState.isDirty}
                      >
                        Save Payment Settings
                      </Button>
                    </div>
                  </div>
                </form>
              </FormProvider>
            </TabsContent>

            <TabsContent value="communication">
              <div className="p-4 text-center">
                <p>Communication settings coming soon</p>
              </div>
            </TabsContent>

            <TabsContent value="whatsapp">
              <div className="p-4 text-center">
                <p>WhatsApp integration settings coming soon</p>
              </div>
            </TabsContent>

            <TabsContent value="sms">
              <div className="p-4 text-center">
                <p>SMS provider settings coming soon</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default GlobalSettingsPage;
