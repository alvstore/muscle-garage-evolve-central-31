
import React from "react";
import { Outlet } from "react-router-dom";

const WebsiteLayout: React.FC = () => {
  return (
    <div className="min-h-screen">
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default WebsiteLayout;
