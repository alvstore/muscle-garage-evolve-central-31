
import { NavSection } from "@/types/navigation";
import { Permission } from "@/hooks/use-permissions";

export const financeNavigation: NavSection = {
  name: "Finance",
  items: [
    {
      href: "/finance/dashboard",
      label: "Finance Dashboard",
      icon: "Wallet",
      permission: "access_finance" as Permission,
    },
    {
      href: "/finance/invoices",
      label: "Invoices",
      icon: "Receipt",
      permission: "manage_invoices" as Permission,
    },
    {
      href: "/finance/transactions",
      label: "Transactions",
      icon: "DollarSign",
      permission: "manage_transactions" as Permission,
    },
    {
      href: "/finance/income",
      label: "Income Records",
      icon: "TrendingUp",
      permission: "manage_income" as Permission,
    },
    {
      href: "/finance/expenses",
      label: "Expense Management",
      icon: "TrendingDown",
      permission: "manage_expenses" as Permission,
    }
  ],
};
