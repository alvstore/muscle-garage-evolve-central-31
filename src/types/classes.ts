
export interface ClassType {
  id: string;
  name: string;
  description?: string;
  is_active: boolean;
  branch_id?: string;
  created_at?: string;
  updated_at?: string;
}

export function adaptClassTypeFromDB(data: any): ClassType {
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    is_active: data.is_active,
    branch_id: data.branch_id,
    created_at: data.created_at,
    updated_at: data.updated_at
  };
}
