
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Users } from "lucide-react";

interface MemberStatusSectionProps {
  data: {
    active: number;
    inactive: number;
    expired: number;
  };
}

const MemberStatusSection = ({ data }: MemberStatusSectionProps) => {
  const chartData = [
    { name: "Active", value: data.active, color: "#10b981" },
    { name: "Inactive", value: data.inactive, color: "#f59e0b" },
    { name: "Expired", value: data.expired, color: "#ef4444" }
  ].filter(item => item.value > 0);
  
  const totalMembers = chartData.reduce((sum, item) => sum + item.value, 0);
  
  // If there's no data, show a placeholder message
  if (totalMembers === 0) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle>Membership Status</CardTitle>
            <CardDescription>Breakdown of member status</CardDescription>
          </div>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="h-[350px] flex items-center justify-center">
          <p className="text-muted-foreground">No membership data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Membership Status</CardTitle>
          <CardDescription>Breakdown of {totalMembers} members</CardDescription>
        </div>
        <Users className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [`${value} members`, 'Count']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default MemberStatusSection;
