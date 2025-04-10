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
import { ReminderRule } from "@/types/notification";
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
    triggerType: "membership-expiry",
    daysInAdvance: 7,
    message: "Your membership will expire soon. Please renew to continue enjoying our services.",
    channels: ["email", "in-app"],
    enabled: true,
    createdBy: "admin1",
    createdAt: "2023-05-10T09:00:00Z",
    updatedAt: "2023-05-10T09:00:00Z",
    targetRoles: ["member"],
    type: "membership-expiry",
    triggerDays: 7,
    template: "template1",
    active: true
  },
  {
    id: "2",
    name: "Birthday Wish",
    description: "Send birthday wishes to members",
    triggerType: "birthday",
    daysInAdvance: 0,
    message: "Happy Birthday! Enjoy a special discount on your next purchase.",
    channels: ["email", "whatsapp", "sms"],
    enabled: true,
    createdBy: "admin1",
    createdAt: "2023-05-15T10:00:00Z",
    updatedAt: "2023-05-15T10:00:00Z",
    targetRoles: ["member", "trainer", "staff"],
    type: "birthday",
    triggerDays: 0,
    template: "template2",
    active: true
  },
  {
    id: "3",
    name: "Missed Attendance Follow-up",
    description: "Follow up with members who haven't visited recently",
    triggerType: "missed-attendance",
    daysInAdvance: 3,
    message: "We've noticed you haven't visited recently. Is everything okay?",
    channels: ["sms", "whatsapp"],
    enabled: false,
    createdBy: "admin2",
    createdAt: "2023-05-20T11:00:00Z",
    updatedAt: "2023-05-20T11:00:00Z",
    targetRoles: ["member"],
    type: "attendance",
    triggerDays: 3,
    template: "template3",
    active: false
  },
  {
    id: "4",
    name: "Membership Renewal Reminder",
    description: "Remind members to renew their membership",
    triggerType: "membership-expiry",
    daysInAdvance: 3,
    message: "Your membership is expiring soon. Renew now to avoid interruption.",
    channels: ["email", "in-app", "sms"],
    enabled: true,
    createdBy: "admin1",
    createdAt: "2023-05-25T12:00:00Z",
    updatedAt: "2023-05-25T12:00:00Z",
    targetRoles: ["member"],
    type: "renewal",
    triggerDays: 3,
    template: "template4",
    active: true
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
                    <TableCell>
                      {rule.type === "birthday" 
                        ? "On birthday date" 
                        : rule.type === "attendance"
                        ? `After ${rule.triggerDays} days of absence`
                        : `${rule.triggerDays} days before ${rule.type === "membership-expiry" ? "expiry" : "renewal"}`
                      }
                    </TableCell>
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
                        onCheckedChange={() => handleToggleActive(rule.id, rule.active)} 
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
