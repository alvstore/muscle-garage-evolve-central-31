
import { NavSection } from "@/types/navigation";
import { Permission } from "@/hooks/use-permissions";

export const marketingNavigation: NavSection = {
  name: "Marketing",
  items: [
    {
      href: "/marketing/promo",
      label: "Promotions",
      icon: "Gift",
      permission: "access_marketing" as Permission,
    },
    {
      href: "/marketing/referral",
      label: "Referral Programs",
      icon: "Share2",
      permission: "access_marketing" as Permission,
    },
  ],
};
