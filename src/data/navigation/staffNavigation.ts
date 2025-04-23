
import { NavSection } from "@/types/navigation";
import { Permission } from "@/hooks/use-permissions";

export const staffNavigation: NavSection = {
  name: "Staff",
  items: [
    {
      href: "/staff",
      label: "Staff List",
      icon: "Users",
      permission: "view_staff" as Permission,
    },
    {
      href: "/trainers",
      label: "Trainers",
      icon: "Dumbbell",
      permission: "view_all_trainers" as Permission,
    },
  ],
};
