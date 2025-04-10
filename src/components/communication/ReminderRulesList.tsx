
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ReminderRule, ReminderTriggerType } from "@/types/notification";
import { toast } from "sonner";
import { 
  BellRing, 
  Pencil, 
  RefreshCw, 
  MoreVertical, 
  Trash2, 
  PlayCircle 
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

// Mock data for reminder rules
const mockReminderRules: ReminderRule[] = [
  {
    id: "1",
    name: "Membership Expiry Reminder",
    description: "Remind members before their membership expires",
    triggerType: "membershipExpiry",
    type: "membership-renewal",
    daysBeforeTrigger: 7,
    triggerDays: 7,
    message: "Your membership will expire soon. Please renew to continue enjoying our services.",
    notificationChannels: ["email", "in-app"],
    channels: ["email", "in-app"],
    isActive: true,
    enabled: true,
    createdAt: "2023-05-10T09:00:00Z",
    updatedAt: "2023-05-10T09:00:00Z",
    appliesTo: ["member"],
    targetRoles: ["member"],
    active: true,
    createdBy: "admin1"
  },
  {
    id: "2",
    name: "Birthday Wish",
    description: "Send birthday wishes to members",
    triggerType: "birthday",
    type: "birthday",
    daysBeforeTrigger: 0,
    triggerDays: 0,
    message: "Happy Birthday! Enjoy a special discount on your next purchase.",
    notificationChannels: ["email", "whatsapp", "sms"],
    channels: ["email", "whatsapp", "sms"],
    isActive: true,
    enabled: true,
    createdAt: "2023-05-15T10:00:00Z",
    updatedAt: "2023-05-15T10:00:00Z",
    appliesTo: ["member", "trainer", "staff"],
    targetRoles: ["member", "trainer", "staff"],
    active: true,
    createdBy: "admin1"
  },
  {
    id: "3",
    name: "Missed Attendance Follow-up",
    description: "Follow up with members who haven't visited recently",
    triggerType: "inactivity",
    type: "missed-attendance",
    daysBeforeTrigger: 3,
    triggerDays: 3,
    message: "We've noticed you haven't visited recently. Is everything okay?",
    notificationChannels: ["sms", "whatsapp"],
    channels: ["sms", "whatsapp"],
    isActive: false,
    enabled: false,
    createdAt: "2023-05-20T11:00:00Z",
    updatedAt: "2023-05-20T11:00:00Z",
    appliesTo: ["member"],
    targetRoles: ["member"],
    active: false,
    createdBy: "admin1"
  },
  {
    id: "4",
    name: "Membership Renewal Reminder",
    description: "Remind members to renew their membership",
    triggerType: "payment",
    type: "payment-due",
    daysBeforeTrigger: 3,
    triggerDays: 3,
    message: "Your membership is expiring soon. Renew now to avoid interruption.",
    notificationChannels: ["email", "in-app", "sms"],
    channels: ["email", "in-app", "sms"],
    isActive: true,
    enabled: true,
    createdAt: "2023-05-25T12:00:00Z",
    updatedAt: "2023-05-25T12:00:00Z",
    appliesTo: ["member"],
    targetRoles: ["member"],
    active: true,
    createdBy: "admin1"
  }
];

interface ReminderRulesListProps {
  onEdit: (rule: ReminderRule) => void;
}

const ReminderRulesList = ({ onEdit }: ReminderRulesListProps) => {
  const [rules, setRules] = useState<ReminderRule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setRules(mockReminderRules);
      setLoading(false);
    }, 1000);
  }, []);

  const handleToggleActive = (id: string, currentStatus: boolean) => {
    // In a real app, this would be an API call
    const updatedRules = rules.map(rule => 
      rule.id === id ? { ...rule, active: !currentStatus } : rule
    );
    setRules(updatedRules);
    
    toast.success(`Rule ${currentStatus ? 'disabled' : 'enabled'} successfully`);
  };

  const handleDelete = (id: string) => {
    // In a real app, this would be an API call
    setRules(rules.filter(rule => rule.id !== id));
    toast.success("Reminder rule deleted successfully");
  };

  const handleManualTrigger = (id: string, name: string) => {
    // Simulate sending reminders manually
    toast.success(`Manually triggered "${name}" reminders`);
  };

  const getTriggerDisplay = (rule: ReminderRule) => {
    if (rule.type === "birthday") {
      return "On birthday date";
    } else if (rule.type === "missed-attendance") {
      return `After ${rule.triggerDays} days of absence`;
    } else {
      return `${rule.triggerDays} days before ${rule.type === "membership-renewal" ? "expiry" : "payment"}`;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Reminder Rules</CardTitle>
            <CardDescription>Configure automated notifications and reminders</CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            disabled={loading}
            onClick={() => {
              setLoading(true);
              setTimeout(() => {
                setRules(mockReminderRules);
                setLoading(false);
              }, 1000);
            }}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-80 flex items-center justify-center">
            <div className="text-center">
              <div className="h-8 w-8 rounded-full border-4 border-t-primary mx-auto animate-spin"></div>
              <p className="mt-2 text-sm text-muted-foreground">Loading reminder rules...</p>
            </div>
          </div>
        ) : rules.length === 0 ? (
          <div className="text-center py-10">
            <BellRing className="h-10 w-10 mx-auto text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No reminder rules</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Create your first automated reminder rule
            </p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rule Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Trigger</TableHead>
                  <TableHead>Channels</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rules.map((rule) => (
                  <TableRow key={rule.id}>
                    <TableCell className="font-medium">{rule.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {rule.type.replace("-", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>{getTriggerDisplay(rule)}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {rule.channels.map((channel) => (
                          <Badge key={channel} variant="secondary" className="capitalize">
                            {channel}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Switch 
                        checked={rule.active} 
                        onCheckedChange={() => handleToggleActive(rule.id, rule.active || false)} 
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEdit(rule)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleManualTrigger(rule.id, rule.name)}>
                            <PlayCircle className="h-4 w-4 mr-2" />
                            Trigger Manually
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(rule.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReminderRulesList;
