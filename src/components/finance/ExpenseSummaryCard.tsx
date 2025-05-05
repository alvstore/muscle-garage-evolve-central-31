
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, DollarSign, AlertCircle } from "lucide-react";

interface ExpenseSummaryCardProps {
  title: string;
  amount: number;
  icon: 'total' | 'paid' | 'pending';
}

const ExpenseSummaryCard: React.FC<ExpenseSummaryCardProps> = ({ title, amount, icon }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0 
    }).format(amount);
  };
  
  const getIcon = () => {
    switch(icon) {
      case 'total':
        return <FileText className="h-5 w-5 text-blue-600" />;
      case 'paid':
        return <DollarSign className="h-5 w-5 text-green-600" />;
      case 'pending':
        return <AlertCircle className="h-5 w-5 text-amber-600" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };
  
  const getIconBackground = () => {
    switch(icon) {
      case 'total':
        return 'bg-blue-100';
      case 'paid':
        return 'bg-green-100';
      case 'pending':
        return 'bg-amber-100';
      default:
        return 'bg-gray-100';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={`rounded-full p-2 ${getIconBackground()}`}>
          {getIcon()}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatCurrency(amount)}</div>
      </CardContent>
    </Card>
  );
};

export default ExpenseSummaryCard;
