
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero section */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Muscle Garage</h1>
          <div className="flex gap-4">
            <Button variant="outline" asChild>
              <Link to="/about">About Us</Link>
            </Button>
            <Button asChild>
              <Link to="/login">Login</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* Main content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-6">
              <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
                Transform Your Fitness Journey
              </h2>
              <p className="mt-6 text-xl text-gray-500">
                Join Muscle Garage to access state-of-the-art equipment, expert training, and a supportive community dedicated to helping you achieve your fitness goals.
              </p>
              <div className="mt-10 flex gap-4">
                <Button size="lg" asChild>
                  <Link to="/register">Join Now</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/login">Member Login</Link>
                </Button>
              </div>
            </div>
            <div className="mt-12 lg:mt-0 lg:col-span-6">
              <div className="bg-gray-300 rounded-lg aspect-video flex items-center justify-center">
                <span className="text-gray-600">Gym Image Placeholder</span>
              </div>
            </div>
          </div>
        </div>

        {/* Features section */}
        <div className="bg-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-center text-gray-900">
              Our Facilities
            </h2>
            <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: 'Modern Equipment',
                  description: 'State-of-the-art machines and free weights for all your training needs.'
                },
                {
                  title: 'Expert Trainers',
                  description: 'Certified personal trainers to guide you through your fitness journey.'
                },
                {
                  title: 'Multiple Branches',
                  description: 'Conveniently located facilities across the city for easy access.'
                }
              ].map((feature, idx) => (
                <div key={idx} className="bg-gray-50 p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-medium text-gray-900">{feature.title}</h3>
                  <p className="mt-2 text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold">Muscle Garage</h3>
              <p className="mt-2 text-gray-400">Empowering fitness journeys since 2010</p>
            </div>
            <div>
              <h4 className="font-semibold">Quick Links</h4>
              <ul className="mt-2 space-y-2">
                <li><Link to="/" className="text-gray-400 hover:text-white">Home</Link></li>
                <li><Link to="/about" className="text-gray-400 hover:text-white">About</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
                <li><Link to="/login" className="text-gray-400 hover:text-white">Member Login</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Contact Us</h4>
              <address className="mt-2 not-italic text-gray-400">
                123 Fitness Lane<br />
                Mumbai, Maharashtra<br />
                India<br />
                <a href="tel:+911234567890" className="hover:text-white">+91 123-456-7890</a>
              </address>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Muscle Garage. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
