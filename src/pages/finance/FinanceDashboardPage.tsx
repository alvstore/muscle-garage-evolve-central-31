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
    
    // Set up real-time subscriptions for all finance-related tables
    const channel = supabase
      .channel('finance_dashboard_changes')
      // Listen for transactions table changes
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'transactions',
          ...(currentBranch?.id ? { filter: `branch_id=eq.${currentBranch.id}` } : {})
        }, 
        () => {
          console.log('Transactions table updated');
          fetchTransactions();
        }
      )
      // Listen for income_records changes
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'income_records',
          ...(currentBranch?.id ? { filter: `branch_id=eq.${currentBranch.id}` } : {})
        }, 
        () => {
          console.log('Income records table updated');
          fetchTransactions();
        }
      )
      // Listen for expense_records changes
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'expense_records',
          ...(currentBranch?.id ? { filter: `branch_id=eq.${currentBranch.id}` } : {})
        }, 
        () => {
          console.log('Expense records table updated');
          fetchTransactions();
        }
      )
      // Listen for invoices table changes
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'invoices',
          ...(currentBranch?.id ? { filter: `branch_id=eq.${currentBranch.id}` } : {})
        }, 
        () => {
          console.log('Invoices table updated');
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
      let combinedTransactions: any[] = [];
      
      // Fetch from transactions table
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('transactions')
        .select('*')
        .eq('branch_id', currentBranch?.id || '')
        .order('transaction_date', { ascending: false });
      
      // Add transactions from the transactions table if available
      if (!transactionsError && transactionsData && transactionsData.length > 0) {
        const normalizedTransactions = transactionsData.map(transaction => ({
          id: transaction.id,
          type: transaction.type || 'unknown',
          amount: transaction.amount || 0,
          description: transaction.description || '',
          transaction_date: transaction.transaction_date || transaction.created_at,
          payment_method: transaction.payment_method || 'unknown',
          category: transaction.category || 'Uncategorized',
          branch_id: transaction.branch_id,
          reference_id: transaction.reference_id || '',
          status: transaction.status || 'completed',
          created_at: transaction.created_at,
          updated_at: transaction.updated_at
        }));
        
        combinedTransactions = [...normalizedTransactions];
      }
      
      // Fetch from income_records table
      const { data: incomeData, error: incomeError } = await supabase
        .from('income_records')
        .select('*')
        .eq('branch_id', currentBranch?.id || '')
        .order('date', { ascending: false });
      
      // Add income records if available
      if (!incomeError && incomeData && incomeData.length > 0) {
        const normalizedIncomeRecords = incomeData.map(record => ({
          id: record.id,
          type: 'income',
          amount: parseFloat(record.amount) || 0, // Ensure amount is parsed as a float
          description: record.description || '',
          transaction_date: record.date || record.created_at,
          payment_method: record.payment_method || 'unknown',
          category: record.category || 'Uncategorized',
          branch_id: record.branch_id,
          reference_id: record.reference || '',
          status: 'completed',
          created_at: record.created_at,
          updated_at: record.updated_at,
          source: record.source || 'Unknown'
        }));
        
        combinedTransactions = [...combinedTransactions, ...normalizedIncomeRecords];
      }
      
      // Fetch from expense_records table
      const { data: expenseData, error: expenseError } = await supabase
        .from('expense_records')
        .select('*')
        .eq('branch_id', currentBranch?.id || '')
        .order('date', { ascending: false });
      
      // Add expense records if available
      if (!expenseError && expenseData && expenseData.length > 0) {
        const normalizedExpenseRecords = expenseData.map(record => ({
          id: record.id,
          type: 'expense',
          amount: parseFloat(record.amount) || 0, // Ensure amount is parsed as a float
          description: record.description || '',
          transaction_date: record.date || record.created_at,
          payment_method: record.payment_method || 'unknown',
          category: record.category || 'Uncategorized',
          branch_id: record.branch_id,
          reference_id: record.reference || '',
          status: record.status || 'completed',
          created_at: record.created_at,
          updated_at: record.updated_at,
          vendor: record.vendor || 'Unknown'
        }));
        
        combinedTransactions = [...combinedTransactions, ...normalizedExpenseRecords];
      }
      
      // If we have no data from any source, log an error
      if (combinedTransactions.length === 0 && transactionsError && incomeError && expenseError) {
        console.error('Failed to fetch from all financial data sources');
        throw new Error('Failed to fetch financial data');
      }
      
      // Sort all transactions by date, most recent first
      const sortedTransactions = combinedTransactions.sort((a, b) => {
        const dateA = new Date(a.transaction_date || a.created_at).getTime();
        const dateB = new Date(b.transaction_date || b.created_at).getTime();
        return dateB - dateA;
      });
      
      setTransactions(sortedTransactions);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error('Failed to load transactions');
      setIsLoading(false);
    } finally {
      setIsLoading(false);
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
    if (!transactions || transactions.length === 0) {
      console.log('No transactions to process');
      return;
    }

    console.log('Processing transactions:', transactions.length);

    // Normalize transaction data to handle different table structures
    const normalizedTransactions = transactions.map(t => {
      // Determine the transaction date from various possible fields
      const transactionDate = t.transaction_date || t.date || t.created_at || new Date().toISOString();
      
      // Determine transaction type
      const type = t.type || 
                  (t.transaction_type ? t.transaction_type.toLowerCase() : null) || 
                  (t.amount > 0 ? 'income' : 'expense');
      
      // Ensure amount is a number and positive (we'll use type to determine if it's income or expense)
      const amount = Math.abs(Number(t.amount || 0));
      
      // Determine category
      const category = t.category || t.category_name || 'Uncategorized';
      
      return {
        ...t,
        transaction_date: transactionDate,
        type,
        amount,
        category
      };
    });

    // Get today's date and calculate date ranges
    const today = new Date();
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));
    const weekStart = startOfWeek(new Date());
    const monthStart = startOfMonth(new Date());
    const yearStart = startOfYear(new Date());
    
    // Filter transactions by date range
    const todayTransactions = normalizedTransactions.filter((t) => new Date(t.transaction_date) >= startOfToday);
    const weekTransactions = normalizedTransactions.filter((t) => new Date(t.transaction_date) >= weekStart);
    const monthTransactions = normalizedTransactions.filter((t) => new Date(t.transaction_date) >= monthStart);
    const yearTransactions = normalizedTransactions.filter((t) => new Date(t.transaction_date) >= yearStart);
    
    // Filter by custom date range
    const customTransactions = startDate && endDate 
      ? normalizedTransactions.filter((t) => {
          const date = new Date(t.transaction_date);
          return date >= startDate && date <= endDate;
        })
      : [];

    // Calculate financial summary
    const calculateSummary = (transactionList: any[]) => {
      const income = transactionList
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
      
      const expense = transactionList
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
      
      // Ensure we're working with precise numbers by using toFixed and parsing back to number
      return {
        income: parseFloat(income.toFixed(2)),
        expense: parseFloat(expense.toFixed(2)),
        profit: parseFloat((income - expense).toFixed(2))
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
    
    // Process transactions by month
    transactionsToProcess.forEach((transaction) => {
      const transactionDate = new Date(transaction.transaction_date);
      const monthName = monthNames[transactionDate.getMonth()];
      
      if (transaction.type === 'income') {
        revenueByMonth[monthName].revenue += parseFloat(transaction.amount || 0);
      } else if (transaction.type === 'expense') {
        revenueByMonth[monthName].expenses += parseFloat(transaction.amount || 0);
      }
    });
    
    // Calculate profit for each month and ensure precision
    Object.keys(revenueByMonth).forEach(month => {
      revenueByMonth[month].revenue = parseFloat(revenueByMonth[month].revenue.toFixed(2));
      revenueByMonth[month].expenses = parseFloat(revenueByMonth[month].expenses.toFixed(2));
      revenueByMonth[month].profit = parseFloat((revenueByMonth[month].revenue - revenueByMonth[month].expenses).toFixed(2));
    });
    
    // Convert to array and filter for current and past months
    const currentMonth = today.getMonth();
    const chartData = monthNames
      .filter((_, index) => index <= currentMonth)
      .map(month => revenueByMonth[month]);
    
    setRevenueData(chartData);

    // Process income and expense breakdowns
    // Define category item type
    type CategoryItem = {
      name: string;
      value: number;
      color: string;
    };
    
    // Group transactions by category
    const incomeByCategory: Record<string, CategoryItem> = {};
    const expenseByCategory: Record<string, CategoryItem> = {};
    
    // Calculate total income and expense with proper numeric handling
    const totalIncome = transactionsToProcess
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
      
    const totalExpense = transactionsToProcess
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
      
    // Ensure we have precise values
    const formattedTotalIncome = parseFloat(totalIncome.toFixed(2));
    const formattedTotalExpense = parseFloat(totalExpense.toFixed(2));
    
    // Process income transactions
    transactionsToProcess
      .filter((t) => t.type === 'income')
      .forEach((transaction) => {
        const categoryName = transaction.category || 'Other';
        
        if (!incomeByCategory[categoryName]) {
          incomeByCategory[categoryName] = {
            name: categoryName,
            value: 0,
            color: getRandomColor(categoryName)
          };
        }
        
        incomeByCategory[categoryName].value += parseFloat(transaction.amount || 0);
      });
      
    // Process expense transactions
    transactionsToProcess
      .filter((t) => t.type === 'expense')
      .forEach((transaction) => {
        const categoryName = transaction.category || 'Other';
        
        if (!expenseByCategory[categoryName]) {
          expenseByCategory[categoryName] = {
            name: categoryName,
            value: 0,
            color: getRandomColor(categoryName)
          };
        }
        
        expenseByCategory[categoryName].value += parseFloat(transaction.amount || 0);
      });
      
    // Ensure all category values have consistent precision
    Object.values(incomeByCategory).forEach(category => {
      category.value = parseFloat(category.value.toFixed(2));
    });
    
    Object.values(expenseByCategory).forEach(category => {
      category.value = parseFloat(category.value.toFixed(2));
    });
    
    // Convert to percentage for income with proper formatting
    const incomeBreakdownData = Object.values(incomeByCategory).map((category: CategoryItem) => {
      return {
        name: category.name,
        color: category.color,
        value: category.value,
        // Calculate percentage using formatted total for accuracy
        percentage: formattedTotalIncome > 0 ? Math.round((category.value / formattedTotalIncome) * 100) : 0
      };
    }).filter((cat: any) => cat.value > 0);
    
    // Sort by value (highest first)
    incomeBreakdownData.sort((a: any, b: any) => b.value - a.value);
    
    setIncomeBreakdown(incomeBreakdownData);
    
    // Convert to percentage for expenses with proper formatting
    const expenseBreakdownData = Object.values(expenseByCategory).map((category: CategoryItem) => {
      return {
        name: category.name,
        color: category.color,
        value: category.value,
        // Calculate percentage using formatted total for accuracy
        percentage: formattedTotalExpense > 0 ? Math.round((category.value / formattedTotalExpense) * 100) : 0
      };
    }).filter((cat: any) => cat.value > 0);
    
    // Sort by value (highest first)
    expenseBreakdownData.sort((a: any, b: any) => b.value - a.value);
    
    setExpenseBreakdown(expenseBreakdownData);
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
