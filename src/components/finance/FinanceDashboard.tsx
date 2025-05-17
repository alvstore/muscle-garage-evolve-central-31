
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/utils/formatters';
import { ArrowDown, ArrowUp, DollarSign, Calendar, RefreshCcw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFinanceDashboard } from '@/hooks/finance/use-finance-dashboard';

const FinanceDashboard = () => {
  const { financeSummary, isLoading, refreshData } = useFinanceDashboard();

  // Colors for charts
  const colors = {
    revenue: '#22c55e',
    expense: '#ef4444',
    profit: '#3b82f6',
    pieColors: ['#3b82f6', '#22c55e', '#eab308', '#ef4444', '#a855f7', '#ec4899', '#6366f1', '#14b8a6'],
  };

  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin mr-2" />
        <p>Loading financial data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Financial Overview</h2>
        <Button variant="outline" size="sm" onClick={refreshData}>
          <RefreshCcw className="h-4 w-4 mr-2" /> Refresh Data
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">
                {formatCurrency(financeSummary.totalRevenue)}
              </div>
              <div className="text-green-600 flex items-center">
                <DollarSign className="h-4 w-4 mr-1" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">
                {formatCurrency(financeSummary.totalExpenses)}
              </div>
              <div className="text-red-600 flex items-center">
                <DollarSign className="h-4 w-4 mr-1" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Net Income
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className={`text-2xl font-bold ${financeSummary.netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(financeSummary.netIncome)}
              </div>
              <div className={`${financeSummary.netIncome >= 0 ? 'text-green-600' : 'text-red-600'} flex items-center`}>
                {financeSummary.netIncome >= 0 ? (
                  <ArrowUp className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDown className="h-4 w-4 mr-1" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Revenue vs Expenses</CardTitle>
            <CardDescription>Monthly comparison for the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={financeSummary.monthlyRevenue}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Legend />
                  <Bar dataKey="revenue" name="Revenue" fill={colors.revenue} />
                  <Bar dataKey="expenses" name="Expenses" fill={colors.expense} />
                  <Bar dataKey="profit" name="Profit" fill={colors.profit} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <Tabs defaultValue="revenue">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Breakdown by Category</CardTitle>
                <TabsList>
                  <TabsTrigger value="revenue">Revenue</TabsTrigger>
                  <TabsTrigger value="expenses">Expenses</TabsTrigger>
                </TabsList>
              </div>
            </CardHeader>
            <CardContent>
              <TabsContent value="revenue" className="h-[300px]">
                {financeSummary.revenueByCategory.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={financeSummary.revenueByCategory}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="amount"
                        nameKey="category"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {financeSummary.revenueByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={colors.pieColors[index % colors.pieColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    No revenue data available
                  </div>
                )}
              </TabsContent>
              <TabsContent value="expenses" className="h-[300px]">
                {financeSummary.expensesByCategory.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={financeSummary.expensesByCategory}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="amount"
                        nameKey="category"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {financeSummary.expensesByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={colors.pieColors[index % colors.pieColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    No expense data available
                  </div>
                )}
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {financeSummary.recentTransactions.length > 0 ? (
                financeSummary.recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between py-2 border-b">
                    <div>
                      <div className="font-medium line-clamp-1">{transaction.description}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(transaction.date).toLocaleDateString()}
                        <Badge variant="outline" className="ml-2">
                          {transaction.category}
                        </Badge>
                      </div>
                    </div>
                    <div className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                      {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  No recent transactions
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Pending Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {financeSummary.pendingInvoices.length > 0 ? (
                financeSummary.pendingInvoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between py-2 border-b">
                    <div>
                      <div className="font-medium">{invoice.memberName}</div>
                      <div className="text-sm text-muted-foreground flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        Due: {new Date(invoice.dueDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="font-medium">{formatCurrency(invoice.amount)}</div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  No pending invoices
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FinanceDashboard;
