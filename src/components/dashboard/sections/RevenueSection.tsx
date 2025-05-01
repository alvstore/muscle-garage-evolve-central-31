
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { DollarSign } from "lucide-react";

export interface RevenueData {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

interface RevenueSectionProps {
  data: RevenueData[];
}

const RevenueSection = ({ data }: RevenueSectionProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Revenue Overview</CardTitle>
          <CardDescription>Monthly revenue, expenses and profit</CardDescription>
        </div>
        <DollarSign className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="h-[350px]">
        {data.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">No revenue data available</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis 
                tickFormatter={(value) => `₹${value/1000}k`}
              />
              <Tooltip 
                formatter={(value: number) => [`₹${value.toLocaleString()}`, '']}
              />
              <Legend />
              <Bar dataKey="revenue" name="Revenue" fill="#8884d8" />
              <Bar dataKey="expenses" name="Expenses" fill="#82ca9d" />
              <Bar dataKey="profit" name="Profit" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default RevenueSection;
