
// Common utility types
export type ID = string;

export type Status = 'active' | 'inactive' | 'pending' | 'cancelled' | 'completed';

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface TimestampFields {
  created_at: string;
  updated_at: string;
}

export interface BaseEntity extends TimestampFields {
  id: string;
}

export interface BranchEntity extends BaseEntity {
  branch_id?: string;
}

export interface UserEntity extends BaseEntity {
  user_id?: string;
  created_by?: string;
  updated_by?: string;
}

export interface AuditFields {
  created_by?: string;
  updated_by?: string;
  deleted_by?: string;
  deleted_at?: string;
}

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type Required<T, K extends keyof T> = T & { [P in K]-?: T[P] };
