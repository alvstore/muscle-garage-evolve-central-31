
import React from 'react';
import { Outlet } from 'react-router-dom';

const WebsiteLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary text-white py-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Muscle Garage</h1>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-gray-100 py-6">
        <div className="container mx-auto">
          <p className="text-center">© {new Date().getFullYear()} Muscle Garage. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default WebsiteLayout;
