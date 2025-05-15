import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Payment } from '@/types/finance';

interface StaffActivityDataProps {
  payments: Payment[];
}

const StaffActivityData: React.FC<StaffActivityDataProps> = ({ payments }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Staff Activity</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px] w-full overflow-x-auto">
          <Table>
            <TableCaption>Recent payments and transactions processed by staff.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Date</TableHead>
                <TableHead>Member</TableHead>
                <TableHead>Membership</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Contact Info</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">{payment.date}</TableCell>
                  <TableCell>{payment.member_name}</TableCell>
                  <TableCell>{payment.membership_plan}</TableCell>
                  <TableCell>{payment.amount}</TableCell>
                  <TableCell>{payment.payment_method}</TableCell>
                  <TableCell>{payment.contactInfo}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default StaffActivityData;
