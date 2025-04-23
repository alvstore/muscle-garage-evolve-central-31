
import { CalendarDays, Dumbbell } from "lucide-react";
import { NavSection } from "@/types/navigation";
import { Permission } from "@/hooks/use-permissions";

export const classesNavigation: NavSection = {
  name: "Classes",
  items: [
    {
      href: "/classes",
      label: "Class Schedule",
      icon: <CalendarDays className="h-5 w-5" />,
      permission: "view_classes" as Permission,
    },
    {
      href: "/classes/types",
      label: "Class Types",
      icon: <Dumbbell className="h-5 w-5" />,
      permission: "trainer_view_classes" as Permission,
    },
  ],
};
