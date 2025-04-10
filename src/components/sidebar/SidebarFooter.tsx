
import React from "react";
import { Separator } from "@/components/ui/separator";
import LogoutButton from "./LogoutButton";

const SidebarFooter: React.FC = () => {
  return (
    <div className="mt-auto p-4">
      <Separator className="my-2 bg-gray-700" />
      <LogoutButton />
    </div>
  );
};

export default SidebarFooter;
