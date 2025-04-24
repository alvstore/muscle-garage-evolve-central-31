
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
import { useSupabaseData } from '@/hooks/use-supabase-data';
import { useBranch } from '@/hooks/use-branch';
import { toast } from 'sonner';
import { format } from "date-fns";

const FinanceDashboardPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("month");
  const [financialSummary, setFinancialSummary] = useState<any>({
    today: { income: 0, expense: 0, profit: 0 },
    week: { income: 0, expense: 0, profit: 0 },
    month: { income: 0, expense: 0, profit: 0 },
    year: { income: 0, expense: 0, profit: 0 }
  });
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [incomeBreakdown, setIncomeBreakdown] = useState<any[]>([]);
  const [expenseBreakdown, setExpenseBreakdown] = useState<any[]>([]);
  
  const { currentBranch } = useBranch();
  
  // Fetch transactions from Supabase
  const { data: transactions, loading: loadingTransactions, refresh } = useSupabaseData('transactions', {
    columns: '*, category_id',
    branchId: currentBranch?.id
  });

  const { data: incomeCategories } = useSupabaseData('income_categories', {
    columns: '*',
    branchId: currentBranch?.id
  });

  const { data: expenseCategories } = useSupabaseData('expense_categories', {
    columns: '*',
    branchId: currentBranch?.id
  });

  useEffect(() => {
    if (loadingTransactions) {
      setIsLoading(true);
    } else {
      processTransactionData();
      setIsLoading(false);
    }
  }, [transactions, timeRange, loadingTransactions, currentBranch]);

  const processTransactionData = () => {
    if (!transactions) return;

    // Get today's date and calculate date ranges
    const today = new Date();
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));
    const startOfWeek = new Date(today);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Start of week (Sunday)
    startOfWeek.setHours(0, 0, 0, 0);
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    // Filter transactions by date range
    const todayTransactions = transactions.filter((t: any) => new Date(t.transaction_date) >= startOfToday);
    const weekTransactions = transactions.filter((t: any) => new Date(t.transaction_date) >= startOfWeek);
    const monthTransactions = transactions.filter((t: any) => new Date(t.transaction_date) >= startOfMonth);
    const yearTransactions = transactions.filter((t: any) => new Date(t.transaction_date) >= startOfYear);

    // Calculate financial summary
    const calculateSummary = (transactionList: any[]) => {
      const income = transactionList
        .filter((t: any) => t.type === 'income')
        .reduce((sum: number, t: any) => sum + Number(t.amount), 0);
      
      const expense = transactionList
        .filter((t: any) => t.type === 'expense')
        .reduce((sum: number, t: any) => sum + Number(t.amount), 0);
      
      return {
        income,
        expense,
        profit: income - expense
      };
    };

    // Set financial summary
    setFinancialSummary({
      today: calculateSummary(todayTransactions),
      week: calculateSummary(weekTransactions),
      month: calculateSummary(monthTransactions),
      year: calculateSummary(yearTransactions)
    });

    // Process revenue data for chart
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const revenueByMonth: any = {};
    
    // Initialize the months
    monthNames.forEach((month, index) => {
      revenueByMonth[month] = {
        month,
        revenue: 0,
        expenses: 0,
        profit: 0
      };
    });
    
    // Group transactions by month
    yearTransactions.forEach((transaction: any) => {
      const transactionDate = new Date(transaction.transaction_date);
      const monthName = monthNames[transactionDate.getMonth()];
      
      if (transaction.type === 'income') {
        revenueByMonth[monthName].revenue += Number(transaction.amount);
      } else if (transaction.type === 'expense') {
        revenueByMonth[monthName].expenses += Number(transaction.amount);
      }
    });
    
    // Calculate profit for each month
    Object.keys(revenueByMonth).forEach(month => {
      revenueByMonth[month].profit = revenueByMonth[month].revenue - revenueByMonth[month].expenses;
    });
    
    // Convert to array and filter for current and past months
    const currentMonth = today.getMonth();
    const chartData = monthNames
      .filter((_, index) => index <= currentMonth)
      .map(month => revenueByMonth[month]);
    
    setRevenueData(chartData);

    // Process income and expense breakdowns
    if (incomeCategories && expenseCategories) {
      // Income breakdown
      const incomeByCategoryMap = new Map();
      const totalIncome = monthTransactions
        .filter((t: any) => t.type === 'income')
        .reduce((sum: number, t: any) => sum + Number(t.amount), 0);
      
      // Initialize with categories
      incomeCategories.forEach((cat: any) => {
        incomeByCategoryMap.set(cat.id, { 
          name: cat.name, 
          value: 0, 
          color: getRandomColor(cat.name)
        });
      });
      
      // Add "Other" category
      incomeByCategoryMap.set('other', {
        name: 'Other',
        value: 0,
        color: '#9c27b0'
      });
      
      // Aggregate income by category
      monthTransactions
        .filter((t: any) => t.type === 'income')
        .forEach((transaction: any) => {
          if (transaction.category_id && incomeByCategoryMap.has(transaction.category_id)) {
            const category = incomeByCategoryMap.get(transaction.category_id);
            category.value += Number(transaction.amount);
          } else {
            const other = incomeByCategoryMap.get('other');
            other.value += Number(transaction.amount);
          }
        });
      
      // Calculate percentages
      incomeByCategoryMap.forEach((category) => {
        category.value = totalIncome > 0 
          ? Math.round((category.value / totalIncome) * 100) 
          : 0;
      });
      
      // Convert to array and filter out zero values
      const incomeData = Array.from(incomeByCategoryMap.values())
        .filter(cat => cat.value > 0);
      
      setIncomeBreakdown(incomeData);
      
      // Expense breakdown
      const expenseByCategoryMap = new Map();
      const totalExpense = monthTransactions
        .filter((t: any) => t.type === 'expense')
        .reduce((sum: number, t: any) => sum + Number(t.amount), 0);
      
      // Initialize with categories
      expenseCategories.forEach((cat: any) => {
        expenseByCategoryMap.set(cat.id, { 
          name: cat.name, 
          value: 0, 
          color: getRandomColor(cat.name) 
        });
      });
      
      // Add "Other" category
      expenseByCategoryMap.set('other', {
        name: 'Other',
        value: 0,
        color: '#9c27b0'
      });
      
      // Aggregate expenses by category
      monthTransactions
        .filter((t: any) => t.type === 'expense')
        .forEach((transaction: any) => {
          if (transaction.category_id && expenseByCategoryMap.has(transaction.category_id)) {
            const category = expenseByCategoryMap.get(transaction.category_id);
            category.value += Number(transaction.amount);
          } else {
            const other = expenseByCategoryMap.get('other');
            other.value += Number(transaction.amount);
          }
        });
      
      // Calculate percentages
      expenseByCategoryMap.forEach((category) => {
        category.value = totalExpense > 0 
          ? Math.round((category.value / totalExpense) * 100) 
          : 0;
      });
      
      // Convert to array and filter out zero values
      const expenseData = Array.from(expenseByCategoryMap.values())
        .filter(cat => cat.value > 0);
      
      setExpenseBreakdown(expenseData);
    }
  };

  // Helper function to generate consistent colors for categories
  const getRandomColor = (str: string) => {
    // Simple hash function to generate consistent colors
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colors = [
      '#4caf50', '#2196f3', '#ff9800', '#f44336', '#9c27b0',
      '#3f51b5', '#e91e63', '#009688', '#673ab7', '#ffc107'
    ];
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  const currentPeriodData = financialSummary[timeRange as keyof typeof financialSummary];

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
                {isLoading ? "Loading..." : `₹${currentPeriodData.income.toLocaleString()}`}
              </div>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
                <span>Updated in real-time</span>
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
                {isLoading ? "Loading..." : `₹${currentPeriodData.expense.toLocaleString()}`}
              </div>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <ArrowDownRight className="mr-1 h-3 w-3 text-red-500" />
                <span>Updated in real-time</span>
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
                {isLoading ? "Loading..." : `₹${currentPeriodData.profit.toLocaleString()}`}
              </div>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
                <span>Updated in real-time</span>
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
                        ₹{financialSummary.month.profit.toLocaleString()}
                        <span className="ml-2 text-xs font-normal text-green-600">Monthly</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-muted-foreground">YTD Profit</h4>
                      <div className="text-2xl font-bold">
                        ₹{financialSummary.year.profit.toLocaleString()}
                        <span className="ml-2 text-xs font-normal text-green-600">Year to date</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-muted-foreground">Profit Margin</h4>
                      <div className="text-2xl font-bold">
                        {financialSummary.month.income > 0 
                          ? Math.round((financialSummary.month.profit / financialSummary.month.income) * 100)
                          : 0}%
                        <span className="ml-2 text-xs font-normal text-green-600">This month</span>
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
                  ) : incomeBreakdown.length > 0 ? (
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
                  ) : (
                    <div className="flex items-center justify-center h-60">
                      <p className="text-muted-foreground">No income data available for this period</p>
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
                  ) : expenseBreakdown.length > 0 ? (
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
                  ) : (
                    <div className="flex items-center justify-center h-60">
                      <p className="text-muted-foreground">No expense data available for this period</p>
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
                {isLoading ? (
                  <div className="h-80 animate-pulse rounded-lg bg-muted"></div>
                ) : incomeBreakdown.length > 0 ? (
                  <div className="space-y-8">
                    <div className="grid md:grid-cols-3 gap-4">
                      {incomeBreakdown.map((item, index) => (
                        <Card key={index}>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">{item.name}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold" style={{ color: item.color }}>{item.value}%</div>
                            <div className="mt-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full rounded-full" 
                                style={{ 
                                  width: `${item.value}%`,
                                  backgroundColor: item.color
                                }}
                              ></div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    
                    <Button variant="outline" onClick={() => toast.info('Detailed income report will be available soon')}>
                      View Detailed Report
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-60">
                    <p className="text-muted-foreground">No income data available for this period</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="expenses" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Expense Categories</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-80 animate-pulse rounded-lg bg-muted"></div>
                ) : expenseBreakdown.length > 0 ? (
                  <div className="space-y-8">
                    <div className="grid md:grid-cols-3 gap-4">
                      {expenseBreakdown.map((item, index) => (
                        <Card key={index}>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">{item.name}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold" style={{ color: item.color }}>{item.value}%</div>
                            <div className="mt-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full rounded-full" 
                                style={{ 
                                  width: `${item.value}%`,
                                  backgroundColor: item.color
                                }}
                              ></div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    
                    <Button variant="outline" onClick={() => toast.info('Detailed expense report will be available soon')}>
                      View Detailed Report
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-60">
                    <p className="text-muted-foreground">No expense data available for this period</p>
                  </div>
                )}
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
