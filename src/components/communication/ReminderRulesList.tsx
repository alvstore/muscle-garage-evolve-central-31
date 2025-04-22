import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ReminderRule } from '@/types/notification';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import ReminderRuleForm from './ReminderRuleForm';
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ReminderRulesListProps {
  rules: ReminderRule[];
  onUpdate: (rule: ReminderRule) => void;
  onDelete: (id: string) => void;
  onCreate: (rule: ReminderRule) => void;
}

const ReminderRulesList: React.FC<ReminderRulesListProps> = ({ rules, onUpdate, onDelete, onCreate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRules, setFilteredRules] = useState<ReminderRule[]>(rules);
  const [open, setOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState<ReminderRule | null>(null);

  useEffect(() => {
    setFilteredRules(
      rules.filter(rule =>
        rule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rule.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        getTypeLabel(rule.triggerType).toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, rules]);

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'membership_expiry':
        return 'Membership Expiry';
      case 'missed_classes':
        return 'Missed Classes';
      case 'birthday':
        return 'Birthday';
      case 'payment_due':
        return 'Payment Due';
      case 'missed_attendance':
        return 'Missed Attendance';
      case 'inactive_member':
        return 'Inactive Member';
      default:
        return 'Unknown';
    }
  };

  const handleToggleActive = (id: string, checked: boolean) => {
    const ruleToUpdate = rules.find(rule => rule.id === id);
    if (ruleToUpdate) {
      const updatedRule = { ...ruleToUpdate, isActive: checked };
      onUpdate(updatedRule);
      toast.success(`Reminder rule ${checked ? 'activated' : 'deactivated'}`);
    }
  };

  const handleDelete = (id: string) => {
    onDelete(id);
    toast.success('Reminder rule deleted successfully');
  };

  const handleEdit = (rule: ReminderRule) => {
    setSelectedRule(rule);
    setOpen(true);
  };

  const handleCreate = () => {
    setSelectedRule(null);
    setOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Reminder Rules</h2>
        <Button onClick={handleCreate}>Add Rule</Button>
      </div>

      <div className="mb-4">
        <Label htmlFor="search">Search Rules</Label>
        <Input
          type="text"
          id="search"
          placeholder="Search by name, description, or type..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <ScrollArea className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Schedule</TableHead>
              <TableHead>Channels</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRules.map((rule) => (
              <TableRow key={rule.id}>
                <TableCell className="font-medium">{rule.name}</TableCell>
                <TableCell>{rule.description}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{getTypeLabel(rule.triggerType)}</Badge>
                </TableCell>
                <TableCell>{`${rule.triggerValue} days before ${getTypeLabel(rule.triggerType)}`}</TableCell>
                <TableCell>
                  {rule.channels.map((channel) => (
                    <Badge key={channel} className="mr-1">
                      {channel}
                    </Badge>
                  ))}
                </TableCell>
                <TableCell>
                  <Switch
                    checked={rule.isActive}
                    onCheckedChange={(checked) => handleToggleActive(rule.id, checked)}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(rule)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(rule.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>{selectedRule ? 'Edit Rule' : 'Create Rule'}</DialogTitle>
            <DialogDescription>
              {selectedRule
                ? 'Make changes to your reminder rule here. Click save when you\'re done.'
                : 'Create a new reminder rule here. Click save when you\'re done.'}
            </DialogDescription>
          </DialogHeader>
          <ReminderRuleForm
            selectedRule={selectedRule}
            onSave={(rule) => {
              if (selectedRule) {
                onUpdate(rule);
              } else {
                onCreate(rule);
              }
              setOpen(false);
            }}
            onCancel={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

const mockRules: ReminderRule[] = [
  {
    id: '1',
    name: 'Membership Expiry Reminder',
    description: 'Reminds members 7 days before their membership expires',
    triggerType: 'membership_expiry',
    triggerValue: 7,
    message: 'Your membership expires in 7 days. Renew now!',
    channels: ['email', 'in-app'],
    isActive: true,
    sendVia: ['email'],
    targetRoles: ['member']
  },
  {
    id: '2',
    name: 'Missed Class Follow Up',
    description: 'Follows up with members who missed a class',
    triggerType: 'missed_classes',
    triggerValue: 1,
    message: 'We noticed you missed your class. Book another one soon!',
    channels: ['sms', 'in-app'],
    isActive: false,
    sendVia: ['sms'],
    targetRoles: ['member']
  },
  {
    id: '3',
    name: 'Birthday Wish',
    description: 'Sends birthday wishes to members',
    triggerType: 'birthday',
    triggerValue: 0,
    message: 'Happy birthday! Enjoy a free class on us.',
    channels: ['email', 'in-app'],
    isActive: true,
    sendVia: ['email'],
    targetRoles: ['member']
  },
  {
    id: '4',
    name: 'Payment Due Reminder',
    description: 'Reminds members about upcoming payments',
    triggerType: 'payment_due',
    triggerValue: 3,
    message: 'Your payment is due in 3 days. Please make the payment to continue enjoying our services.',
    channels: ['email', 'in-app'],
    isActive: true,
    sendVia: ['email'],
    targetRoles: ['member']
  },
  {
    id: '5',
    name: 'Missed Attendance Follow Up',
    description: 'Follows up with members who missed gym attendance',
    triggerType: 'missed_attendance',
    triggerValue: 2,
    message: 'We missed you at the gym! Come back soon.',
    channels: ['sms', 'in-app'],
    isActive: false,
    sendVia: ['sms'],
    targetRoles: ['member']
  },
  {
    id: '6',
    name: 'Inactive Member Reminder',
    description: 'Reminds inactive members to come back',
    triggerType: 'inactive_member',
    triggerValue: 30,
    message: 'We miss you! Get back in shape with our special offers.',
    channels: ['email', 'in-app'],
    isActive: true,
    sendVia: ['email'],
    targetRoles: ['member']
  }
];

export default ReminderRulesList;
