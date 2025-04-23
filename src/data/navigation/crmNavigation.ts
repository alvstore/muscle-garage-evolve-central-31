
import { NavSection } from "@/types/navigation";
import { Permission } from "@/hooks/use-permissions";

export const crmNavigation: NavSection = {
  name: "CRM & Leads",
  items: [
    {
      href: "/crm/leads",
      label: "Lead Management",
      icon: "UserPlus",
      permission: "access_crm" as Permission,
    },
    {
      href: "/crm/funnel",
      label: "Sales Funnel",
      icon: "TrendingUp",
      permission: "access_crm" as Permission,
    },
    {
      href: "/crm/follow-up",
      label: "Follow-Up",
      icon: "RefreshCcw",
      permission: "access_crm" as Permission,
    },
  ],
};
