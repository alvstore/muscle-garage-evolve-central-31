
import { NavSection } from "@/types/navigation";
import { Permission } from "@/hooks/use-permissions";

export const classesNavigation: NavSection = {
  name: "Classes",
  items: [
    {
      href: "/classes",
      label: "Class Schedule",
      icon: "CalendarDays",
      permission: "view_classes" as Permission,
    },
    {
      href: "/classes/types",
      label: "Class Types",
      icon: "Dumbbell",
      permission: "trainer_view_classes" as Permission,
    },
  ],
};
