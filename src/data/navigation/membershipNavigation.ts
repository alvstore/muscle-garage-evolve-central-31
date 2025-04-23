
import { Users, Briefcase } from "lucide-react";
import { NavSection } from "@/types/navigation";
import { Permission } from "@/hooks/use-permissions";

export const membershipNavigation: NavSection = {
  name: "Members",
  items: [
    {
      href: "/members",
      label: "Member List",
      icon: <Users className="h-5 w-5" />,
      permission: "manage_members" as Permission,
    },
    {
      href: "/memberships",
      label: "Membership Plans",
      icon: <Briefcase className="h-5 w-5" />,
      permission: "member_view_plans" as Permission,
    },
  ],
};
