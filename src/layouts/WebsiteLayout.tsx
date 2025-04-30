
import React from 'react';
import { Outlet } from 'react-router-dom';

const WebsiteLayout = () => {
  return (
    <div className="min-h-screen bg-gym-black text-white">
      <header className="bg-gym-black py-4 shadow-md">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-gym-yellow">GYM CRM</div>
          <nav>
            <ul className="flex space-x-6">
              <li><a href="/" className="text-white hover:text-gym-yellow">Home</a></li>
              <li><a href="/about" className="text-white hover:text-gym-yellow">About</a></li>
              <li><a href="/classes" className="text-white hover:text-gym-yellow">Classes</a></li>
              <li><a href="/membership" className="text-white hover:text-gym-yellow">Membership</a></li>
              <li><a href="/contact" className="text-white hover:text-gym-yellow">Contact</a></li>
              <li><a href="/login" className="bg-gym-yellow text-black px-4 py-2 rounded hover:bg-yellow-400">Login</a></li>
            </ul>
          </nav>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="bg-gym-gray-900 py-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-gym-yellow text-xl font-bold mb-4">GYM CRM</h3>
              <p className="text-gym-gray-400">Your premier fitness destination with state-of-the-art equipment and expert trainers.</p>
            </div>
            <div>
              <h3 className="text-gym-yellow text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="/" className="text-gym-gray-400 hover:text-gym-yellow">Home</a></li>
                <li><a href="/about" className="text-gym-gray-400 hover:text-gym-yellow">About Us</a></li>
                <li><a href="/classes" className="text-gym-gray-400 hover:text-gym-yellow">Classes</a></li>
                <li><a href="/membership" className="text-gym-gray-400 hover:text-gym-yellow">Membership</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-gym-yellow text-xl font-bold mb-4">Hours</h3>
              <ul className="space-y-2 text-gym-gray-400">
                <li>Monday - Friday: 5am - 10pm</li>
                <li>Saturday: 7am - 8pm</li>
                <li>Sunday: 8am - 6pm</li>
              </ul>
            </div>
            <div>
              <h3 className="text-gym-yellow text-xl font-bold mb-4">Contact</h3>
              <address className="not-italic text-gym-gray-400">
                123 Fitness Street<br />
                Cityville, ST 12345<br />
                Phone: (123) 456-7890<br />
                Email: info@gymcrm.com
              </address>
            </div>
          </div>
          <div className="border-t border-gym-gray-700 mt-8 pt-8 text-center text-gym-gray-400">
            <p>&copy; {new Date().getFullYear()} GYM CRM. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WebsiteLayout;
