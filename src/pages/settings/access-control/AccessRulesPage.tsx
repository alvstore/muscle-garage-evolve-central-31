
import React, { useState } from 'react';
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { ChevronRight, KeyRound, Settings, Shield } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { useForm } from 'react-hook-form';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const AccessRulesPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm({
    defaultValues: {
      accessSettings: {
        membershipBasedAccess: true,
        timeBasedAccess: true,
        featureBasedAccess: false
      },
      deviceSettings: {
        fallbackMode: 'offline',
        syncPeriod: 'daily'
      }
    }
  });
  
  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Access rules saved successfully");
      console.log("Saved access rules:", data);
    } catch (error) {
      toast.error("Failed to save access rules");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Container>
      <div className="py-6">
        <Breadcrumb className="mb-6">
          <BreadcrumbItem>
            <BreadcrumbLink href="/settings">
              <Settings className="h-4 w-4 mr-1" />
              Settings
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="/settings/attendance">
              Attendance
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="/settings/attendance/access-rules" isCurrentPage>
              Access Rules
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Access Control Rules</h1>
            <p className="text-muted-foreground">Configure rules for member access to facilities</p>
          </div>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Access Policy Settings</CardTitle>
                <CardDescription>Define how access is granted to different areas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="accessSettings.membershipBasedAccess"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <FormLabel className="text-base">Membership-Based Access</FormLabel>
                          <Badge>Recommended</Badge>
                        </div>
                        <FormDescription>
                          Grant access based on member's plan type (gym-only, pool-only, premium)
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="accessSettings.timeBasedAccess"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Time-Based Access</FormLabel>
                        <FormDescription>
                          Restrict member access based on time of day (peak/off-peak hours)
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="accessSettings.featureBasedAccess"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <FormLabel className="text-base">Feature-Based Access</FormLabel>
                          <Badge variant="outline">Coming Soon</Badge>
                        </div>
                        <FormDescription>
                          Grant access to specific features (spa, courts, machines) based on add-ons
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Device Settings</CardTitle>
                <CardDescription>Configure access device settings and fallback behavior</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="deviceSettings.fallbackMode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fallback Mode</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select fallback mode" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="offline">Offline Cache</SelectItem>
                          <SelectItem value="open">Always Open</SelectItem>
                          <SelectItem value="closed">Always Closed</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        How devices should behave when connection to the server is lost
                      </FormDescription>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="deviceSettings.syncPeriod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sync Period</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select sync period" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="realtime">Real-time</SelectItem>
                          <SelectItem value="hourly">Hourly</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        How often devices should sync access data with the server
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => form.reset()}>
                Reset
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Container>
  );
};

export default AccessRulesPage;
