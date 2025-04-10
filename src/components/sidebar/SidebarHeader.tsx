
import React from "react";
import Logo from "@/components/Logo";

const SidebarHeader: React.FC = () => {
  return (
    <div className="p-4 flex items-center gap-3 border-b border-gray-700">
      <div className="bg-indigo-600 p-1 rounded-md">
        <Logo variant="white" />
      </div>
      <h1 className="text-xl font-semibold text-white">Muscle Garage</h1>
    </div>
  );
};

export default SidebarHeader;
