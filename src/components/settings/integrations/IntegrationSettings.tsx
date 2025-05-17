
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useBranch } from "@/hooks/settings/use-branches";
import { Label } from "@/components/ui/label";

export default function IntegrationSettings() {
  const { currentBranch } = useBranch();
  const [isLoading, setIsLoading] = useState(false);
  
  if (!currentBranch?.id) {
    return (
      <div className="text-center p-4">
        Please select a branch to view settings
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Razorpay</CardTitle>
            <CardDescription>
              Accept payments online through Razorpay
            </CardDescription>
          </div>
          <Badge variant="outline" className="ml-auto">
            Configured
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="razorpay-active">Active</Label>
              <Switch id="razorpay-active" defaultChecked />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            Configure
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Hikvision Access Control</CardTitle>
            <CardDescription>
              Integrate with Hikvision access control systems
            </CardDescription>
          </div>
          <Badge variant="outline" className="ml-auto">
            Not Configured
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="hikvision-active">Active</Label>
              <Switch id="hikvision-active" />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            Configure
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>WhatsApp Business</CardTitle>
            <CardDescription>
              Send notifications via WhatsApp Business API
            </CardDescription>
          </div>
          <Badge variant="outline" className="ml-auto">
            Not Configured
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="whatsapp-active">Active</Label>
              <Switch id="whatsapp-active" />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            Configure
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
