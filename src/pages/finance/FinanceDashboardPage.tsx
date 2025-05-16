import { useState, useEffect } from "react";
import { Container } from "@/components/ui/container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, DollarSign, TrendingUp, TrendingDown, 
  PieChart, BarChart, ArrowUpRight, ArrowDownRight,
  Wallet, CreditCard, LineChart, Activity 
} from "lucide-react";
import TransactionList from "@/components/finance/TransactionList";
import RevenueChart from "@/components/dashboard/RevenueChart";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Label } from "@/components/ui/label";
import { supabase } from '@/services/supabaseClient';
import { useBranch } from '@/hooks/use-branch';
import { toast } from 'sonner';
import { format, subDays, startOfWeek, startOfMonth, startOfYear, subMonths } from "date-fns";

// Import modern finance components
import FinanceAreaChart from "@/components/finance/FinanceAreaChart";
import FinancePieChart from "@/components/finance/FinancePieChart";
import FinanceBarChart from "@/components/finance/FinanceBarChart";
import FinanceStatsCard from "@/components/finance/FinanceStatsCard";
import FinanceDataTable from "@/components/finance/FinanceDataTable";

const FinanceDashboardPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'year' | 'custom'>('month');
  const [startDate, setStartDate] = useState<Date | undefined>(startOfMonth(new Date()));
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [financialSummary, setFinancialSummary] = useState<any>({
    today: { income: 0, expense: 0, profit: 0 },
    week: { income: 0, expense: 0, profit: 0 },
    month: { income: 0, expense: 0, profit: 0 },
    year: { income: 0, expense: 0, profit: 0 },
    custom: { income: 0, expense: 0, profit: 0 }
  });
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [incomeBreakdown, setIncomeBreakdown] = useState<any[]>([]);
  const [expenseBreakdown, setExpenseBreakdown] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [incomeCategories, setIncomeCategories] = useState<any[]>([]);
  const [expenseCategories, setExpenseCategories] = useState<any[]>([]);
  
  const { currentBranch } = useBranch();

  useEffect(() => {
    fetchCategories();
    fetchTransactions();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('finance_dashboard_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'transactions',
          ...(currentBranch?.id ? { filter: `branch_id=eq.${currentBranch.id}` } : {})
        }, 
        () => {
          fetchTransactions();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentBranch]);

  useEffect(() => {
    if (transactions.length > 0) {
      processTransactionData();
      setIsLoading(false);
    }
  }, [transactions, dateRange, startDate, endDate]);

  const fetchCategories = async () => {
    try {
      // Fetch income categories
      const { data: incomeData, error: incomeError } = await supabase
        .from('income_categories')
        .select('id, name')
        .eq('branch_id', currentBranch?.id || '');
        
      if (incomeError) throw incomeError;
      
      setIncomeCategories(incomeData || []);
      
      // Fetch expense categories
      const { data: expenseData, error: expenseError } = await supabase
        .from('expense_categories')
        .select('id, name')
        .eq('branch_id', currentBranch?.id || '');
        
      if (expenseError) throw expenseError;
      
      setExpenseCategories(expenseData || []);
      
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to fetch categories');
    }
  };

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('branch_id', currentBranch?.id || '');
        
      if (error) throw error;
      
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error('Failed to fetch transactions');
    }
  };

  const handleDateRangeChange = (value: string) => {
    const today = new Date();
    
    switch (value) {
      case 'today':
        setStartDate(new Date(today.setHours(0, 0, 0, 0)));
        setEndDate(new Date());
        break;
      case 'week':
        setStartDate(startOfWeek(today));
        setEndDate(new Date());
        break;
      case 'month':
        setStartDate(startOfMonth(today));
        setEndDate(new Date());
        break;
      case 'year':
        setStartDate(startOfYear(today));
        setEndDate(new Date());
        break;
      case 'custom':
        // Keep current dates when switching to custom
        break;
    }
    
    setDateRange(value as any);
  };

  const processTransactionData = () => {
    if (!transactions || transactions.length === 0) return;

    // Get today's date and calculate date ranges
    const today = new Date();
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));
    const weekStart = startOfWeek(new Date());
    const monthStart = startOfMonth(new Date());
    const yearStart = startOfYear(new Date());
    
    // Filter transactions by date range
    const todayTransactions = transactions.filter((t) => new Date(t.transaction_date) >= startOfToday);
    const weekTransactions = transactions.filter((t) => new Date(t.transaction_date) >= weekStart);
    const monthTransactions = transactions.filter((t) => new Date(t.transaction_date) >= monthStart);
    const yearTransactions = transactions.filter((t) => new Date(t.transaction_date) >= yearStart);
    
    // Filter by custom date range
    const customTransactions = startDate && endDate 
      ? transactions.filter((t) => {
          const date = new Date(t.transaction_date);
          return date >= startDate && date <= endDate;
        })
      : [];

    // Calculate financial summary
    const calculateSummary = (transactionList: any[]) => {
      const income = transactionList
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + Number(t.amount), 0);
      
      const expense = transactionList
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + Number(t.amount), 0);
      
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
      year: calculateSummary(yearTransactions),
      custom: calculateSummary(customTransactions)
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
    
    // Use the appropriate transactions based on date range
    const transactionsToProcess = dateRange === 'custom' ? customTransactions :
                                 dateRange === 'today' ? todayTransactions :
                                 dateRange === 'week' ? weekTransactions :
                                 dateRange === 'year' ? yearTransactions : monthTransactions;
    
    // Group transactions by month
    transactionsToProcess.forEach((transaction) => {
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
    if (incomeCategories.length > 0 && expenseCategories.length > 0) {
      // Income breakdown
      const incomeByCategoryMap = new Map();
      const totalIncome = transactionsToProcess
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + Number(t.amount), 0);
      
      // Initialize with categories
      incomeCategories.forEach((cat) => {
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
      transactionsToProcess
        .filter((t) => t.type === 'income')
        .forEach((transaction) => {
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
      const totalExpense = transactionsToProcess
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + Number(t.amount), 0);
      
      // Initialize with categories
      expenseCategories.forEach((cat) => {
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
      transactionsToProcess
        .filter((t) => t.type === 'expense')
        .forEach((transaction) => {
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

  const currentPeriodData = financialSummary[dateRange];

  return (
    <Container>
      <div className="py-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-2xl font-bold">Financial Dashboard</h1>
        </div>
        
        <div className="mb-6 bg-white p-4 rounded-lg border shadow-sm">
          <h3 className="text-lg font-medium mb-3">Date Range</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label className="mb-2 block">Select Period</Label>
              <Select value={dateRange} onValueChange={handleDateRangeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {dateRange === 'custom' && (
              <>
                <div>
                  <Label className="mb-2 block">Start Date</Label>
                  <DatePicker
                    date={startDate}
                    onSelect={setStartDate}
                  />
                </div>
                <div>
                  <Label className="mb-2 block">End Date</Label>
                  <DatePicker
                    date={endDate}
                    onSelect={setEndDate}
                  />
                </div>
              </>
            )}
          </div>
          
          {dateRange !== 'custom' ? (
            <p className="text-sm text-muted-foreground mt-2">
              Showing data from {startDate ? format(startDate, 'PPP') : ''} to {endDate ? format(endDate, 'PPP') : ''}
            </p>
          ) : null}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <FinanceStatsCard
            title="Total Income"
            value={isLoading ? 0 : currentPeriodData.income}
            icon={DollarSign}
            iconColor="text-green-600"
            change={{
              value: 0,
              trend: 'up'
            }}
            subtitle="Updated in real-time"
            isLoading={isLoading}
          />
          
          <FinanceStatsCard
            title="Total Expenses"
            value={isLoading ? 0 : currentPeriodData.expense}
            icon={TrendingDown}
            iconColor="text-red-600"
            change={{
              value: 0,
              trend: 'down'
            }}
            subtitle="Updated in real-time"
            isLoading={isLoading}
          />
          
          <FinanceStatsCard
            title="Net Profit"
            value={isLoading ? 0 : currentPeriodData.profit}
            icon={Wallet}
            iconColor={currentPeriodData.profit >= 0 ? "text-green-600" : "text-red-600"}
            change={{
              value: 0,
              trend: currentPeriodData.profit >= 0 ? 'up' : 'down'
            }}
            subtitle="Updated in real-time"
            isLoading={isLoading}
          />
          
          <FinanceStatsCard
            title="Profit Margin"
            value={`${currentPeriodData.income > 0 
              ? Math.round((currentPeriodData.profit / currentPeriodData.income) * 100)
              : 0}%`}
            icon={LineChart}
            iconColor="text-blue-600"
            subtitle={currentPeriodData.income > 0 
              ? `Based on ₹${currentPeriodData.income.toLocaleString()} income` 
              : 'No income recorded'}
            isLoading={isLoading}
          />
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
              <div className="lg:col-span-5">
                <FinanceAreaChart 
                  data={revenueData} 
                  title="Revenue vs Expenses"
                  height={350}
                  showLegend={true}
                />
              </div>
              
              <Card className="lg:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Cash Flow Forecast</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="h-[350px] flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Projected Monthly Balance</p>
                        <h3 className={`text-2xl font-bold ${financialSummary.month.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ₹{financialSummary.month.profit.toLocaleString()}
                        </h3>
                        <Badge variant={financialSummary.month.profit >= 0 ? "outline" : "destructive"} className="mt-2">
                          {financialSummary.month.profit >= 0 ? "Positive" : "Negative"} Cash Flow
                        </Badge>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span>Current Month</span>
                            <span className={financialSummary.month.profit >= 0 ? 'text-green-600' : 'text-red-600'}>
                              ₹{Math.round(financialSummary.month.profit).toLocaleString()}
                            </span>
                          </div>
                          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${financialSummary.month.profit >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                              style={{ width: `${Math.min(Math.abs(financialSummary.month.profit) / 10000 * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span>Year to Date</span>
                            <span className={financialSummary.year.profit >= 0 ? 'text-green-600' : 'text-red-600'}>
                              ₹{Math.round(financialSummary.year.profit).toLocaleString()}
                            </span>
                          </div>
                          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${financialSummary.year.profit >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                              style={{ width: `${Math.min(Math.abs(financialSummary.year.profit) / 100000 * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <FinancePieChart 
                  data={incomeBreakdown} 
                  title="Income Breakdown"
                  height={300}
                  showLegend={true}
                  emptyMessage="No income data available for this period"
                  isLoading={isLoading}
                />
              </div>
              
              <div>
                <FinancePieChart 
                  data={expenseBreakdown} 
                  title="Expense Breakdown"
                  height={300}
                  showLegend={true}
                  emptyMessage="No expense data available for this period"
                  isLoading={isLoading}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="income" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="md:col-span-2">
                <FinanceBarChart 
                  data={incomeBreakdown} 
                  title="Income Sources"
                  height={400}
                  showLegend={true}
                  isLoading={isLoading}
                  emptyMessage="No income data available for this period"
                />
              </div>
              
              <div className="md:col-span-1">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">Income Summary</CardTitle>
                    <p className="text-sm text-muted-foreground">Breakdown by source</p>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="h-[350px] flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      </div>
                    ) : incomeBreakdown.length > 0 ? (
                      <div className="space-y-4">
                        {incomeBreakdown.map((item, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div 
                                className="w-3 h-3 rounded-full mr-2" 
                                style={{ backgroundColor: item.color }}
                              />
                              <span className="text-sm font-medium">{item.name}</span>
                            </div>
                            <Badge variant="outline" className="font-mono">
                              {item.value}%
                            </Badge>
                          </div>
                        ))}
                        
                        <div className="pt-4 mt-4 border-t">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Total Income</span>
                            <span className="font-bold text-green-600">
                              ₹{currentPeriodData.income.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        
                        <Button 
                          variant="outline" 
                          className="w-full mt-4" 
                          onClick={() => toast.info('Detailed income report will be available soon')}
                        >
                          <Activity className="mr-2 h-4 w-4" />
                          Generate Income Report
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-60">
                        <p className="text-muted-foreground">No income data available</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="expenses" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="md:col-span-2">
                <FinanceBarChart 
                  data={expenseBreakdown} 
                  title="Expense Categories"
                  height={400}
                  showLegend={true}
                  isLoading={isLoading}
                  emptyMessage="No expense data available for this period"
                />
              </div>
              
              <div className="md:col-span-1">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">Expense Summary</CardTitle>
                    <p className="text-sm text-muted-foreground">Breakdown by category</p>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="h-[350px] flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      </div>
                    ) : expenseBreakdown.length > 0 ? (
                      <div className="space-y-4">
                        {expenseBreakdown.map((item, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div 
                                className="w-3 h-3 rounded-full mr-2" 
                                style={{ backgroundColor: item.color }}
                              />
                              <span className="text-sm font-medium">{item.name}</span>
                            </div>
                            <Badge variant="outline" className="font-mono">
                              {item.value}%
                            </Badge>
                          </div>
                        ))}
                        
                        <div className="pt-4 mt-4 border-t">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Total Expenses</span>
                            <span className="font-bold text-red-600">
                              ₹{currentPeriodData.expense.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        
                        <Button 
                          variant="outline" 
                          className="w-full mt-4" 
                          onClick={() => toast.info('Detailed expense report will be available soon')}
                        >
                          <CreditCard className="mr-2 h-4 w-4" />
                          Generate Expense Report
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-60">
                        <p className="text-muted-foreground">No expense data available</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="transactions" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Recent Transactions</CardTitle>
                <p className="text-sm text-muted-foreground">All financial transactions in the selected period</p>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-[400px] flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <FinanceDataTable 
                    data={transactions} 
                    startDate={startDate}
                    endDate={endDate}
                    pageSize={10}
                    emptyMessage="No transactions found for the selected period"
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
};

export default FinanceDashboardPage;
