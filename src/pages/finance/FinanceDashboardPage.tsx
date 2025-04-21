
import React, { useState } from 'react';
import { Container } from '@/components/ui/container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  BarChart2,
  ArrowUp,
  ArrowDown,
  CreditCard,
  Wallet,
  CalendarDays,
  CalendarClock,
  Info,
} from 'lucide-react';
import RevenueChart from '@/components/dashboard/RevenueChart';
import IncomeBreakdown from '@/components/finance/IncomeBreakdown';
import ExpenseBreakdown from '@/components/finance/ExpenseBreakdown';

// Mock data for demonstration
const revenueData = [
  { month: 'Jan', revenue: 12500, expenses: 8000, profit: 4500 },
  { month: 'Feb', revenue: 14200, expenses: 7800, profit: 6400 },
  { month: 'Mar', revenue: 13800, expenses: 8200, profit: 5600 },
  { month: 'Apr', revenue: 15600, expenses: 8500, profit: 7100 },
  { month: 'May', revenue: 16800, expenses: 9200, profit: 7600 },
  { month: 'Jun', revenue: 18200, expenses: 10000, profit: 8200 },
];

const incomeCategoriesData = [
  { category: 'Memberships', amount: 8500, color: '#8b5cf6' },
  { category: 'Personal Training', amount: 5200, color: '#0ea5e9' },
  { category: 'Classes', amount: 2800, color: '#10b981' },
  { category: 'Store Sales', amount: 1600, color: '#f97316' },
  { category: 'Other', amount: 700, color: '#ef4444' },
];

const expenseCategoriesData = [
  { category: 'Salaries', amount: 5200, color: '#ef4444' },
  { category: 'Rent', amount: 2000, color: '#f97316' },
  { category: 'Equipment', amount: 1200, color: '#f59e0b' },
  { category: 'Utilities', amount: 800, color: '#0ea5e9' },
  { category: 'Marketing', amount: 600, color: '#8b5cf6' },
  { category: 'Other', amount: 200, color: '#10b981' },
];

const FinanceDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <Container>
      <div className="py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold">Financial Dashboard</h1>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="flex items-center gap-1">
              <CalendarDays className="h-4 w-4" />
              <span>This Month</span>
            </Button>
            <Button variant="outline" className="flex items-center gap-1">
              <CalendarClock className="h-4 w-4" />
              <span>Select Period</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$18,200</div>
              <div className="flex items-center text-xs text-green-500 mt-1">
                <ArrowUp className="mr-1 h-3 w-3" />
                <span>+12.5% from last month</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$10,000</div>
              <div className="flex items-center text-xs text-red-500 mt-1">
                <ArrowUp className="mr-1 h-3 w-3" />
                <span>+8.7% from last month</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Net Profit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$8,200</div>
              <div className="flex items-center text-xs text-green-500 mt-1">
                <ArrowUp className="mr-1 h-3 w-3" />
                <span>+15.2% from last month</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$3,450</div>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <Info className="mr-1 h-3 w-3" />
                <span>12 invoices pending</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview" className="flex items-center">
              <BarChart2 className="mr-2 h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="income" className="flex items-center">
              <ArrowUp className="mr-2 h-4 w-4" />
              Income
            </TabsTrigger>
            <TabsTrigger value="expenses" className="flex items-center">
              <ArrowDown className="mr-2 h-4 w-4" />
              Expenses
            </TabsTrigger>
            <TabsTrigger value="invoices" className="flex items-center">
              <CreditCard className="mr-2 h-4 w-4" />
              Invoices
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Overview</CardTitle>
                  <CardDescription>Monthly revenue breakdown</CardDescription>
                </CardHeader>
                <CardContent className="h-[350px] pl-2">
                  <RevenueChart data={revenueData} />
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <IncomeBreakdown data={incomeCategoriesData} />
                <ExpenseBreakdown data={expenseCategoriesData} />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="income">
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Income Analysis</CardTitle>
                  <CardDescription>Detailed breakdown of income sources</CardDescription>
                </CardHeader>
                <CardContent>
                  <IncomeBreakdown data={incomeCategoriesData} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="expenses">
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Expense Analysis</CardTitle>
                  <CardDescription>Detailed breakdown of expenses</CardDescription>
                </CardHeader>
                <CardContent>
                  <ExpenseBreakdown data={expenseCategoriesData} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="invoices">
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Invoices</CardTitle>
                  <CardDescription>Latest invoices and payment status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-8 text-center">
                    <p className="text-muted-foreground">This tab will display recent invoices and payments.</p>
                    <Button className="mt-4" onClick={() => window.location.href = '/finance/invoices'}>
                      View All Invoices
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
};

export default FinanceDashboardPage;
