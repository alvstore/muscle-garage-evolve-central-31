
import { Wallet, Receipt, DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { NavSection } from "@/types/navigation";
import { Permission } from "@/hooks/use-permissions";

export const financeNavigation: NavSection = {
  name: "Finance",
  items: [
    {
      href: "/finance/dashboard",
      label: "Finance Dashboard",
      icon: <Wallet className="h-5 w-5" />,
      permission: "access_finance" as Permission,
    },
    {
      href: "/finance/invoices",
      label: "Invoices",
      icon: <Receipt className="h-5 w-5" />,
      permission: "manage_invoices" as Permission,
    },
    {
      href: "/finance/transactions",
      label: "Transactions",
      icon: <DollarSign className="h-5 w-5" />,
      permission: "manage_transactions" as Permission,
    },
    {
      href: "/finance/income",
      label: "Income Records",
      icon: <TrendingUp className="h-5 w-5" />,
      permission: "manage_income" as Permission,
    },
    {
      href: "/finance/expenses",
      label: "Expense Management",
      icon: <TrendingDown className="h-5 w-5" />,
      permission: "manage_expenses" as Permission,
    }
  ],
};
