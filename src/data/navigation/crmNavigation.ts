
import { UserPlus, TrendingUp, RefreshCcw } from "lucide-react";
import { NavSection } from "@/types/navigation";
import { Permission } from "@/hooks/use-permissions";

export const crmNavigation: NavSection = {
  name: "CRM & Leads",
  items: [
    {
      href: "/crm/leads",
      label: "Lead Management",
      icon: <UserPlus className="h-5 w-5" />,
      permission: "access_crm" as Permission,
    },
    {
      href: "/crm/funnel",
      label: "Sales Funnel",
      icon: <TrendingUp className="h-5 w-5" />,
      permission: "access_crm" as Permission,
    },
    {
      href: "/crm/follow-up",
      label: "Follow-Up",
      icon: <RefreshCcw className="h-5 w-5" />,
      permission: "access_crm" as Permission,
    },
  ],
};
