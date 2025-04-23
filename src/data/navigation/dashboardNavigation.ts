
import { NavSection } from "@/types/navigation";
import { Permission } from "@/hooks/use-permissions";

export const dashboardNavigation: NavSection = {
  name: "Dashboard",
  items: [
    {
      href: "/",
      label: "Analytics Dashboard",
      icon: "BarChart3",
      permission: "access_dashboards" as Permission,
    },
    {
      href: "/dashboard/realtime",
      label: "Real-Time Dashboard",
      icon: "Activity",
      permission: "view_all_attendance" as Permission,
    }
  ],
};
