
// Table and data display types
export interface TableColumn<T = any> {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string | number;
  render?: (value: any, record: T) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
}

export interface TableProps<T = any> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    onPageChange: (page: number) => void;
  };
  sorting?: {
    field: string;
    order: 'asc' | 'desc';
    onSortChange: (field: string, order: 'asc' | 'desc') => void;
  };
  selection?: {
    selectedRows: string[];
    onSelectionChange: (selectedRows: string[]) => void;
  };
  actions?: {
    onEdit?: (record: T) => void;
    onDelete?: (record: T) => void;
    onView?: (record: T) => void;
    custom?: Array<{
      label: string;
      icon?: React.ReactNode;
      onClick: (record: T) => void;
    }>;
  };
}

export interface DataTableState {
  page: number;
  limit: number;
  sort: { field: string; order: 'asc' | 'desc' } | null;
  filters: Record<string, any>;
  search: string;
  selectedRows: string[];
}
