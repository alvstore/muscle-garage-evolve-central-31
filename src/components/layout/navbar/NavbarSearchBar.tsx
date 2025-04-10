
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function NavbarSearchBar() {
  return (
    <form className="hidden md:block relative max-w-lg">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search..."
        className="bg-gray-50 border-gray-200 pl-8 md:w-80 lg:w-96 focus:bg-white"
      />
    </form>
  );
}
