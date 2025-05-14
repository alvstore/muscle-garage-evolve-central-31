
import { ColumnDef } from "@tanstack/react-table";
import { Lead } from "@/types/crm";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export const LeadsColumn: ColumnDef<Lead>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge variant={status === "new" ? "default" : status === "contacted" ? "secondary" : "outline"}>
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "source",
    header: "Source",
  },
  {
    accessorKey: "created_at",
    header: "Created",
    cell: ({ row }) => {
      const date = row.getValue("created_at") as string;
      return date ? format(new Date(date), "MMM d, yyyy") : "N/A";
    },
  },
];
