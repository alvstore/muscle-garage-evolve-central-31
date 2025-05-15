
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format, parseISO } from "date-fns";
import { RenewalItem } from "@/types/dashboard";
import { useToast } from "@/hooks/use-toast";

interface UpcomingRenewalsProps {
  renewals: RenewalItem[];
}

const UpcomingRenewals = ({ renewals }: UpcomingRenewalsProps) => {
  const { toast } = useToast();
  
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "inactive":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "expired":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const handleSendReminder = (memberId: string, memberName: string) => {
    // In a real app, this would send an API request to trigger a reminder
    console.log(`Sending renewal reminder to ${memberName} (ID: ${memberId})`);
    
    toast({
      title: "Reminder Sent",
      description: `Renewal reminder sent to ${memberName}`,
    });
  };

  const handleSendAllReminders = () => {
    // In a real app, this would send an API request to trigger reminders for all listed members
    console.log("Sending reminders to all members with upcoming renewals");
    
    toast({
      title: "All Reminders Sent",
      description: `Sent ${renewals.length} renewal reminders`,
    });
  };

  // Sort renewals by expiry date, closest first
  const sortedRenewals = [...renewals].sort((a, b) => 
    new Date(a.expiry_date || a.expiryDate || "").getTime() - 
    new Date(b.expiry_date || b.expiryDate || "").getTime()
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle>Upcoming Renewals</CardTitle>
          <CardDescription>Memberships expiring in the next 7 days</CardDescription>
        </div>
        {renewals.length > 0 && (
          <Button variant="outline" size="sm" onClick={handleSendAllReminders}>
            Send All Reminders
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {renewals.length === 0 ? (
          <p className="text-center text-muted-foreground py-6">No upcoming renewals</p>
        ) : (
          <div className="space-y-4">
            {sortedRenewals.map((renewal) => (
              <div key={renewal.id} className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={renewal.member_avatar || renewal.memberAvatar} alt={renewal.member_name || renewal.memberName || ""} />
                    <AvatarFallback>{getInitials(renewal.member_name || renewal.memberName || "")}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium leading-none">{renewal.member_name || renewal.memberName}</p>
                    <div className="flex items-center pt-1">
                      <span className="text-xs text-muted-foreground">{renewal.membershipPlan || renewal.plan_name}</span>
                      <span className="mx-1 text-xs text-muted-foreground">・</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded ${getStatusColor(renewal.status)}`}>
                        Expires: {format(parseISO(renewal.expiry_date || renewal.expiryDate || ""), "MMM dd")}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">${renewal.renewalAmount || renewal.amount}</span>
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={() => handleSendReminder(renewal.id, renewal.member_name || renewal.memberName || "")}
                  >
                    Remind
                  </Button>
                </div>
              </div>
            ))}
            
            {renewals.length > 5 && (
              <Button variant="outline" className="w-full mt-2">
                View All Renewals
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingRenewals;
