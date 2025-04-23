
import { NavSection } from "@/types/navigation";
import { Permission } from "@/hooks/use-permissions";

export const settingsNavigation: NavSection = {
  name: "Settings",
  items: [
    {
      href: "/settings",
      label: "System Settings",
      icon: "Settings",
      permission: "access_settings" as Permission,
      children: [
        {
          href: "/settings",
          label: "General Settings",
          permission: "manage_settings" as Permission,
        },
        {
          href: "/settings/branches",
          label: "Branch Management",
          permission: "manage_branches" as Permission,
        },
        {
          href: "/settings/automation",
          label: "Automation Rules",
          permission: "manage_settings" as Permission,
        },
      ]
    },
    {
      href: "/settings/integrations",
      label: "Integration Settings",
      icon: "Layers",
      permission: "access_settings" as Permission,
      children: [
        {
          href: "/settings/integrations/access-control",
          label: "Access Control",
          permission: "manage_integrations" as Permission,
        },
        {
          href: "/settings/integrations/payment",
          label: "Payment Gateways",
          permission: "manage_integrations" as Permission,
        },
        {
          href: "/settings/integrations/messaging",
          label: "Messaging Services",
          permission: "manage_integrations" as Permission,
        },
      ]
    },
    {
      href: "/settings/templates",
      label: "Message Templates",
      icon: "LayoutTemplate",
      permission: "access_settings" as Permission,
      children: [
        {
          href: "/settings/templates/email",
          label: "Email Templates",
          permission: "manage_templates" as Permission,
        },
        {
          href: "/settings/templates/sms",
          label: "SMS Templates",
          permission: "manage_templates" as Permission,
        },
        {
          href: "/settings/templates/whatsapp",
          label: "WhatsApp Templates",
          permission: "manage_templates" as Permission,
        }
      ]
    },
    {
      href: "/settings/attendance",
      label: "Attendance Settings",
      icon: "Smartphone",
      permission: "access_settings" as Permission,
      children: [
        {
          href: "/settings/attendance/devices",
          label: "Device Mapping",
          permission: "manage_devices" as Permission,
        },
        {
          href: "/settings/attendance/access-rules",
          label: "Access Rules",
          permission: "manage_devices" as Permission,
        }
      ]
    }
  ],
};
