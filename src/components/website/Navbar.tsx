
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-gym-gray-900 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/public" className="text-gym-yellow font-impact text-2xl">MUSCLE GARAGE</Link>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link to="/public" className="text-white hover:text-gym-yellow px-3 py-2 rounded-md text-sm font-medium">Home</Link>
              <Link to="/public#about" className="text-white hover:text-gym-yellow px-3 py-2 rounded-md text-sm font-medium">About</Link>
              <Link to="/public#memberships" className="text-white hover:text-gym-yellow px-3 py-2 rounded-md text-sm font-medium">Memberships</Link>
              <Link to="/public#gallery" className="text-white hover:text-gym-yellow px-3 py-2 rounded-md text-sm font-medium">Gallery</Link>
              <Link to="/public#trainers" className="text-white hover:text-gym-yellow px-3 py-2 rounded-md text-sm font-medium">Trainers</Link>
              <Link to="/public#contact" className="text-white hover:text-gym-yellow px-3 py-2 rounded-md text-sm font-medium">Contact</Link>
              <Link to="/login" className="bg-gym-yellow text-black hover:bg-gym-yellow-dark px-4 py-2 rounded-md text-sm font-medium">Login</Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
