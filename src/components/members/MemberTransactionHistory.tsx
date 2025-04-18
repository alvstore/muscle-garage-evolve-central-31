
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Transaction } from "@/types/finance";
import { ScrollArea } from "@/components/ui/scroll-area";

const MemberTransactionHistory = () => {
  const { id } = useParams();

  // Mock data - In a real app, fetch from API
  const transactions: Transaction[] = [
    {
      id: "1",
      type: "income",
      amount: 99,
      date: "2024-04-18",
      category: "membership",
      description: "Monthly Membership Fee",
      recurring: true,
      paymentMethod: "card",
      createdBy: "system",
      createdAt: "2024-04-18",
      updatedAt: "2024-04-18"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <p className="font-medium">{transaction.description}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(transaction.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount}
                  </p>
                  <Badge variant="outline">
                    {transaction.paymentMethod}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default MemberTransactionHistory;
