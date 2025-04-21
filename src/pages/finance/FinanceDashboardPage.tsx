
import { useState, useEffect } from "react";
import { Container } from "@/components/ui/container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Calendar, DollarSign, TrendingUp, TrendingDown, 
  PieChart, BarChart, ArrowUpRight, ArrowDownRight 
} from "lucide-react";
import TransactionList from "@/components/finance/TransactionList";
import RevenueChart from "@/components/dashboard/RevenueChart";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { format } from "date-fns";

const FinanceDashboardPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("month");
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Mock financial data
  const financialSummary = {
    today: {
      income: 1250,
      expense: 350,
      profit: 900
    },
    week: {
      income: 8750,
      expense: 3200,
      profit: 5550
    },
    month: {
      income: 38500,
      expense: 15200,
      profit: 23300
    },
    year: {
      income: 462000,
      expense: 182500,
      profit: 279500
    }
  };

  // Mock data for revenue chart
  const revenueData = [
    { month: "Jan", revenue: 35000, expenses: 12000, profit: 23000 },
    { month: "Feb", revenue: 38000, expenses: 14000, profit: 24000 },
    { month: "Mar", revenue: 32000, expenses: 13500, profit: 18500 },
    { month: "Apr", revenue: 40000, expenses: 15000, profit: 25000 },
    { month: "May", revenue: 38500, expenses: 15200, profit: 23300 },
    { month: "Jun", revenue: 42000, expenses: 16500, profit: 25500 },
  ];

  const currentPeriodData = financialSummary[timeRange as keyof typeof financialSummary];
  
  // Mock data for income sources breakdown
  const incomeBreakdown = [
    { name: "Memberships", value: 65, color: "#4caf50" },
    { name: "Personal Training", value: 20, color: "#2196f3" },
    { name: "Classes", value: 10, color: "#ff9800" },
    { name: "Store Sales", value: 5, color: "#9c27b0" },
  ];
  
  // Mock data for expense categories breakdown
  const expenseBreakdown = [
    { name: "Salaries", value: 45, color: "#f44336" },
    { name: "Rent", value: 25, color: "#ff9800" },
    { name: "Equipment", value: 15, color: "#2196f3" },
    { name: "Utilities", value: 10, color: "#9c27b0" },
    { name: "Marketing", value: 5, color: "#4caf50" },
  ];

  return (
    <Container>
      <div className="py-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-2xl font-bold">Financial Dashboard</h1>
          <div className="mt-3 sm:mt-0">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Income</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {isLoading ? "Loading..." : `$${currentPeriodData.income.toLocaleString()}`}
              </div>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
                <span>+12% from last period</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Expenses</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {isLoading ? "Loading..." : `$${currentPeriodData.expense.toLocaleString()}`}
              </div>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <ArrowDownRight className="mr-1 h-3 w-3 text-red-500" />
                <span>+5% from last period</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Net Profit</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {isLoading ? "Loading..." : `$${currentPeriodData.profit.toLocaleString()}`}
              </div>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
                <span>+8% from last period</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="income">Income</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="lg:col-span-5">
                <CardHeader>
                  <CardTitle>Revenue vs Expenses</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="h-80 animate-pulse rounded-lg bg-muted"></div>
                  ) : (
                    <RevenueChart data={revenueData} />
                  )}
                </CardContent>
              </Card>
              
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-muted-foreground">Current Cash Flow</h4>
                      <div className="text-2xl font-bold">
                        ${financialSummary.month.profit.toLocaleString()}
                        <span className="ml-2 text-xs font-normal text-green-600">+8.2%</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-muted-foreground">YTD Profit</h4>
                      <div className="text-2xl font-bold">
                        ${financialSummary.year.profit.toLocaleString()}
                        <span className="ml-2 text-xs font-normal text-green-600">+12.5%</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-muted-foreground">Profit Margin</h4>
                      <div className="text-2xl font-bold">
                        {Math.round((financialSummary.month.profit / financialSummary.month.income) * 100)}%
                        <span className="ml-2 text-xs font-normal text-green-600">+2.1%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Income Breakdown</CardTitle>
                  <PieChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="h-60 animate-pulse rounded-lg bg-muted"></div>
                  ) : (
                    <div className="flex justify-center">
                      <div className="w-full max-w-md">
                        {incomeBreakdown.map((item, index) => (
                          <div key={index} className="mb-4">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm">{item.name}</span>
                              <span className="text-sm font-medium">{item.value}%</span>
                            </div>
                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full rounded-full" 
                                style={{ 
                                  width: `${item.value}%`,
                                  backgroundColor: item.color
                                }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Expense Breakdown</CardTitle>
                  <BarChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="h-60 animate-pulse rounded-lg bg-muted"></div>
                  ) : (
                    <div className="flex justify-center">
                      <div className="w-full max-w-md">
                        {expenseBreakdown.map((item, index) => (
                          <div key={index} className="mb-4">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm">{item.name}</span>
                              <span className="text-sm font-medium">{item.value}%</span>
                            </div>
                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full rounded-full" 
                                style={{ 
                                  width: `${item.value}%`,
                                  backgroundColor: item.color
                                }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="income" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Income Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96 flex items-center justify-center">
                  <p className="text-muted-foreground">Income breakdown by category (Coming Soon)</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="expenses" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Expense Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96 flex items-center justify-center">
                  <p className="text-muted-foreground">Expense breakdown by category (Coming Soon)</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="transactions" className="space-y-4">
            <TransactionList />
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
};

export default FinanceDashboardPage;
