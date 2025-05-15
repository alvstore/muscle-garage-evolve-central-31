
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format, parseISO } from "date-fns";
import { Payment } from "@/types/dashboard";
import { formatCurrency } from '@/utils/stringUtils';

interface PendingPaymentsProps {
  payments: Payment[];
}

const PendingPayments = ({ payments }: PendingPaymentsProps) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getStatusColor = (status: string) => {
    return status === "overdue" 
      ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300" 
      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
  };

  // Sort by due date, with overdue first
  const sortedPayments = [...payments].sort((a, b) => {
    if (a.status === "overdue" && b.status !== "overdue") return -1;
    if (a.status !== "overdue" && b.status === "overdue") return 1;
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    return 0;
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle>Pending Payments</CardTitle>
          <CardDescription>Members with pending or overdue payments</CardDescription>
        </div>
        {payments.length > 0 && (
          <Button variant="outline" size="sm">
            Send All Reminders
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {payments.length === 0 ? (
          <p className="text-center text-muted-foreground py-6">No pending payments</p>
        ) : (
          <div className="space-y-4">
            {sortedPayments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={payment.memberAvatar} alt={payment.member_name || payment.memberName || ""} />
                    <AvatarFallback>{getInitials(payment.member_name || payment.memberName || "")}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium leading-none">{payment.member_name || payment.memberName}</p>
                    <div className="flex items-center pt-1">
                      <span className="text-xs text-muted-foreground">{payment.membershipPlan}</span>
                      <span className="mx-1 text-xs text-muted-foreground">・</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded ${getStatusColor(payment.status)}`}>
                        {payment.status === "overdue" ? "Overdue" : (payment.dueDate ? `Due ${format(parseISO(payment.dueDate), "MMM dd")}` : "Pending")}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{formatCurrency(payment.amount)}</span>
                  <Button variant="secondary" size="sm">
                    Remind
                  </Button>
                </div>
              </div>
            ))}
            
            {payments.length > 5 && (
              <Button variant="outline" className="w-full mt-2">
                View All Payments
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PendingPayments;
