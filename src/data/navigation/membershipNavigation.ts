
import { NavSection } from "@/types/navigation";
import { Permission } from "@/hooks/use-permissions";

export const membershipNavigation: NavSection = {
  name: "Members",
  items: [
    {
      href: "/members",
      label: "Member List",
      icon: "Users",
      permission: "manage_members" as Permission,
    },
    {
      href: "/memberships",
      label: "Membership Plans",
      icon: "Briefcase",
      permission: "member_view_plans" as Permission,
    },
  ],
};
