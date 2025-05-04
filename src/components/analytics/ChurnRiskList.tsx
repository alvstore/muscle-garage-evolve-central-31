
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const ChurnRiskList = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Churn Risk Members</CardTitle>
        <CardDescription>Members at risk of not renewing their membership</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground py-8 text-center">
          Churn risk data will be displayed here once available
        </p>
      </CardContent>
    </Card>
  );
};

export default ChurnRiskList;
