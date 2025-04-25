
import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table } from '@tanstack/react-table';
import { SlidersHorizontal } from 'lucide-react';

interface DataTableViewOptionsProps<TData> {
  table: Table<TData> | null;
}

export function DataTableViewOptions<TData>({
  table
}: DataTableViewOptionsProps<TData>) {
  if (!table) return null;
  
  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex flex-1 items-center space-x-2">
        {/* Placeholder for search or filters could go here */}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="ml-auto flex items-center gap-1">
            <SlidersHorizontal className="h-4 w-4" />
            <span>View</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[150px]">
          {table.getAllColumns()
            .filter(column => column.getCanHide())
            .map(column => {
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={value => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              )
            })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
