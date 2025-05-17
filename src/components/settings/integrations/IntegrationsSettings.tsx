
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight, Shield, CreditCard, MessageCircle, Bell } from "lucide-react";
import { useIntegrationStatuses } from "@/hooks/settings/use-realtime-settings";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

type IntegrationStatus = 'configured' | 'partially-configured' | 'not-configured';

interface IntegrationCardProps {
  name: string;
  description: string;
  icon: React.ReactElement;
  link: string;
  status: IntegrationStatus;
  isLoading?: boolean;
}

const IntegrationCard: React.FC<IntegrationCardProps> = ({
  name,
  description,
  icon,
  link,
  status,
  isLoading = false
}) => {
  const getStatusBadgeClasses = (status: IntegrationStatus) => {
    switch (status) {
      case 'configured':
        return 'bg-green-100 text-green-800';
      case 'partially-configured':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const getStatusText = (status: IntegrationStatus) => {
    switch (status) {
      case 'configured':
        return 'Configured';
      case 'partially-configured':
        return 'Partially Configured';
      default:
        return 'Not Configured';
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="p-2 rounded-md bg-primary/10">
            {icon}
          </div>
          <div className={`text-xs px-2 py-1 rounded-full ${getStatusBadgeClasses(status)}`}>
            {isLoading ? (
              <span className="flex items-center">
                <Loader2 className="h-3 w-3 animate-spin mr-1" />
                Loading...
              </span>
            ) : (
              getStatusText(status)
            )}
          </div>
        </div>
        <h3 className="text-lg font-medium mt-3">{name}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardFooter className="pt-1 pb-4">
        <Button asChild variant="ghost" className="w-full justify-between">
          <Link to={link}>
            Configure
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

const IntegrationsSettings = () => {
  const { data: integrations, isLoading } = useIntegrationStatuses();

  // Icon map for lucide icons
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Shield':
        return <Shield className="h-5 w-5 text-primary" />;
      case 'CreditCard':
        return <CreditCard className="h-5 w-5 text-primary" />;
      case 'MessageCircle':
        return <MessageCircle className="h-5 w-5 text-primary" />;
      case 'Bell':
        return <Bell className="h-5 w-5 text-primary" />;
      default:
        return <Shield className="h-5 w-5 text-primary" />;
    }
  };

  // If we have no integrations data, use fallback data
  const displayIntegrations = integrations.length > 0 
    ? integrations 
    : [
        {
          integration_key: 'access-control',
          name: 'Access Control',
          description: 'Configure Hikvision access control integration',
          status: 'configured',
          icon: 'Shield'
        },
        {
          integration_key: 'payment-gateways',
          name: 'Payment Gateways',
          description: 'Configure payment providers like Razorpay',
          status: 'partially-configured',
          icon: 'CreditCard'
        },
        {
          integration_key: 'messaging-services',
          name: 'Messaging Services',
          description: 'Configure SMS and WhatsApp integrations',
          status: 'partially-configured',
          icon: 'MessageCircle'
        },
        {
          integration_key: 'push-notifications',
          name: 'Push Notifications',
          description: 'Configure Firebase and OneSignal for push notifications',
          status: 'not-configured',
          icon: 'Bell'
        }
      ];

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-semibold">Integration Settings</h2>
              <p className="text-muted-foreground">Configure third-party integrations and services</p>
            </div>
            
            <HoverCard>
              <HoverCardTrigger>
                <Button variant="outline" size="sm" className="hidden sm:flex">
                  Need Help?
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">About Integrations</h4>
                  <p className="text-sm">
                    Integrations connect your gym software with external services like payment gateways,
                    SMS providers, and access control systems.
                  </p>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayIntegrations.map((integration) => (
              <IntegrationCard
                key={integration.integration_key}
                name={integration.name}
                description={integration.description}
                icon={getIconComponent(integration.icon)}
                link={`/settings/integrations/${integration.integration_key}`}
                status={integration.status as IntegrationStatus}
                isLoading={isLoading}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntegrationsSettings;
