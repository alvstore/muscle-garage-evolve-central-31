import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface FinanceDataTableProps<T> {
  data: T[];
  columns: {
    header: string;
    accessorKey: string;
    cell?: (row: T) => React.ReactNode;
  }[];
  title?: string;
  emptyMessage?: string;
  isLoading?: boolean;
}

function FinanceDataTable<T>({
  data,
  columns,
  title = "Transactions",
  emptyMessage = "No data available",
  isLoading = false
}: FinanceDataTableProps<T>) {
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : data.length === 0 ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-muted-foreground">{emptyMessage}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((column, index) => (
                    <TableHead key={index}>{column.header}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {columns.map((column, colIndex) => (
                      <TableCell key={colIndex}>
                        {column.cell ? column.cell(row) : (row as any)[column.accessorKey]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Pre-configured tables for common financial data
export const TransactionsTable = ({ 
  data, 
  isLoading 
}: { 
  data: any[]; 
  isLoading?: boolean;
}) => {
  const columns = [
    {
      header: "Date",
      accessorKey: "transaction_date",
      cell: (row: any) => {
        const date = row.transaction_date || row.date || row.created_at;
        return date ? format(new Date(date), 'dd MMM yyyy') : 'N/A';
      }
    },
    {
      header: "Description",
      accessorKey: "description",
      cell: (row: any) => row.description || 'N/A'
    },
    {
      header: "Category",
      accessorKey: "category",
      cell: (row: any) => (
        <Badge variant="outline" className="font-normal">
          {row.category || 'Uncategorized'}
        </Badge>
      )
    },
    {
      header: "Amount",
      accessorKey: "amount",
      cell: (row: any) => {
        const amount = Number(row.amount);
        const isIncome = row.type === 'income';
        return (
          <span className={isIncome ? 'text-green-600' : 'text-red-600'}>
            {isIncome ? '+' : '-'}₹{amount.toLocaleString()}
          </span>
        );
      }
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (row: any) => {
        const status = row.status || 'completed';
        let badgeVariant: "default" | "secondary" | "destructive" | "outline" = "outline";
        
        switch (status.toLowerCase()) {
          case 'completed':
          case 'paid':
            badgeVariant = "default";
            break;
          case 'pending':
            badgeVariant = "secondary";
            break;
          case 'failed':
          case 'cancelled':
          case 'overdue':
            badgeVariant = "destructive";
            break;
          default:
            badgeVariant = "outline";
        }
        
        return (
          <Badge variant={badgeVariant} className="capitalize">
            {status}
          </Badge>
        );
      }
    }
  ];

  return (
    <FinanceDataTable
      data={data}
      columns={columns}
      title="Transactions"
      emptyMessage="No transactions available"
      isLoading={isLoading}
    />
  );
};

export const ExpensesTable = ({ 
  data, 
  isLoading 
}: { 
  data: any[]; 
  isLoading?: boolean;
}) => {
  const columns = [
    {
      header: "Date",
      accessorKey: "date",
      cell: (row: any) => {
        const date = row.date || row.transaction_date || row.created_at;
        return date ? format(new Date(date), 'dd MMM yyyy') : 'N/A';
      }
    },
    {
      header: "Description",
      accessorKey: "description",
      cell: (row: any) => row.description || 'N/A'
    },
    {
      header: "Vendor",
      accessorKey: "vendor",
      cell: (row: any) => row.vendor || 'N/A'
    },
    {
      header: "Category",
      accessorKey: "category",
      cell: (row: any) => (
        <Badge variant="outline" className="font-normal">
          {row.category || 'Uncategorized'}
        </Badge>
      )
    },
    {
      header: "Amount",
      accessorKey: "amount",
      cell: (row: any) => {
        const amount = Number(row.amount);
        return (
          <span className="text-red-600">
            -₹{amount.toLocaleString()}
          </span>
        );
      }
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (row: any) => {
        const status = row.status || 'paid';
        let badgeVariant: "default" | "secondary" | "destructive" | "outline" = "outline";
        
        switch (status.toLowerCase()) {
          case 'completed':
          case 'paid':
            badgeVariant = "default";
            break;
          case 'pending':
            badgeVariant = "secondary";
            break;
          case 'failed':
          case 'cancelled':
          case 'overdue':
            badgeVariant = "destructive";
            break;
          default:
            badgeVariant = "outline";
        }
        
        return (
          <Badge variant={badgeVariant} className="capitalize">
            {status}
          </Badge>
        );
      }
    }
  ];

  return (
    <FinanceDataTable
      data={data}
      columns={columns}
      title="Expense Records"
      emptyMessage="No expense records available"
      isLoading={isLoading}
    />
  );
};

export default FinanceDataTable;
