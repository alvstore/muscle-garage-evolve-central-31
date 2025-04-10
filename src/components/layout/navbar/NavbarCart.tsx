
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function NavbarCart() {
  return (
    <Button variant="ghost" size="icon" className="relative" asChild>
      <Link to="/store">
        <ShoppingCart className="h-5 w-5" />
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold text-white">
          3
        </span>
        <span className="sr-only">View cart</span>
      </Link>
    </Button>
  );
}
