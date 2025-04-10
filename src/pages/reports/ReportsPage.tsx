
import React from "react";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { Navigate } from "react-router-dom";

const ReportsPage = () => {
  const { user } = useAuth();

  // If the user is a member, they shouldn't access this page
  if (user?.role === "member") {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Container>
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-6">Reports & Analytics</h1>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Membership Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <p>View and analyze membership data, renewals, and churn rate.</p>
          </CardContent>
        </Card>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Financial Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Access revenue reports, expense tracking, and financial forecasts.</p>
          </CardContent>
        </Card>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Attendance Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Analyze check-in patterns, peak hours, and member attendance trends.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Inventory & Sales Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Track inventory movements, product sales, and restocking needs.</p>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
};

export default ReportsPage;
