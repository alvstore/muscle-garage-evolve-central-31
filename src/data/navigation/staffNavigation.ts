
import { Users, Dumbbell } from "lucide-react";
import { NavSection } from "@/types/navigation";
import { Permission } from "@/hooks/use-permissions";

export const staffNavigation: NavSection = {
  name: "Staff",
  items: [
    {
      href: "/staff",
      label: "Staff List",
      icon: <Users className="h-5 w-5" />,
      permission: "view_staff" as Permission,
    },
    {
      href: "/trainers",
      label: "Trainers",
      icon: <Dumbbell className="h-5 w-5" />,
      permission: "view_all_trainers" as Permission,
    },
  ],
};
