
import { Gift, Share2 } from "lucide-react";
import { NavSection } from "@/types/navigation";
import { Permission } from "@/hooks/use-permissions";

export const marketingNavigation: NavSection = {
  name: "Marketing",
  items: [
    {
      href: "/marketing/promo",
      label: "Promotions",
      icon: <Gift className="h-5 w-5" />,
      permission: "access_marketing" as Permission,
    },
    {
      href: "/marketing/referral",
      label: "Referral Programs",
      icon: <Share2 className="h-5 w-5" />,
      permission: "access_marketing" as Permission,
    },
  ],
};
