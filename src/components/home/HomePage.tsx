
import React from 'react';
import { Link } from 'react-router-dom';
import { Play, ChevronDown, ArrowRight, ShoppingCart, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FacilitySection from './sections/FacilitySection';
import GoalSection from './sections/GoalSection';
import GallerySection from './sections/GallerySection';
import MembershipSection from './sections/MembershipSection';
import TrainersSection from './sections/TrainersSection';
import ClassScheduleSection from './sections/ClassScheduleSection';
import TestimonialsSection from './sections/TestimonialsSection';
import ContactSection from './sections/ContactSection';
import ServicesNavBar from './sections/ServicesNavBar';

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* Header/Navigation */}
      <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-sm border-b border-gray-800">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center">
              <h1 className="text-2xl font-bold text-yellow-500">MUSCLE GARAGE</h1>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-8">
              <div className="relative group">
                <button className="flex items-center gap-1 py-2 text-white hover:text-yellow-500 transition-colors">
                  Discover <ChevronDown className="h-4 w-4" />
                </button>
                <div className="absolute left-0 top-full w-48 bg-gray-900 shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="p-2 space-y-1">
                    <Link to="/" className="block px-3 py-2 rounded-md hover:bg-gray-800">About Us</Link>
                    <Link to="/" className="block px-3 py-2 rounded-md hover:bg-gray-800">Our Facilities</Link>
                    <Link to="/" className="block px-3 py-2 rounded-md hover:bg-gray-800">Trainers</Link>
                  </div>
                </div>
              </div>
              <div className="relative group">
                <button className="flex items-center gap-1 py-2 text-white hover:text-yellow-500 transition-colors">
                  Services <ChevronDown className="h-4 w-4" />
                </button>
                <div className="absolute left-0 top-full w-48 bg-gray-900 shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="p-2 space-y-1">
                    <Link to="/" className="block px-3 py-2 rounded-md hover:bg-gray-800">Gym Membership</Link>
                    <Link to="/" className="block px-3 py-2 rounded-md hover:bg-gray-800">Personal Training</Link>
                    <Link to="/" className="block px-3 py-2 rounded-md hover:bg-gray-800">Group Classes</Link>
                  </div>
                </div>
              </div>
              <div className="relative group">
                <button className="flex items-center gap-1 py-2 text-white hover:text-yellow-500 transition-colors">
                  Connect <ChevronDown className="h-4 w-4" />
                </button>
                <div className="absolute left-0 top-full w-48 bg-gray-900 shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="p-2 space-y-1">
                    <Link to="/" className="block px-3 py-2 rounded-md hover:bg-gray-800">Contact Us</Link>
                    <Link to="/" className="block px-3 py-2 rounded-md hover:bg-gray-800">Careers</Link>
                    <Link to="/" className="block px-3 py-2 rounded-md hover:bg-gray-800">Feedback</Link>
                  </div>
                </div>
              </div>
            </nav>
            
            <div className="flex items-center gap-3">
              <Link to="/store" className="text-white hover:text-yellow-500 transition-colors">
                <ShoppingCart className="h-5 w-5" />
              </Link>
              <Link to="/join-now" className="hidden md:block bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded-md transition-colors">
                Join Now
              </Link>
              <Link to="/login" className="flex items-center gap-1 text-white hover:text-yellow-500 transition-colors">
                <UserCircle className="h-5 w-5" />
                <span className="hidden md:inline">Login</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black z-10"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1675&q=80')] bg-cover bg-center opacity-40"></div>
        
        <div className="container mx-auto px-4 relative z-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6">
              BUILD <span className="text-yellow-500">LIKE A</span> BEAST
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-gray-300">
              One of the largest premium fitness facilities with state-of-the-art equipment and expert trainers.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/join-now" className="gym-btn-primary">
                Join Now <ArrowRight className="ml-2 h-5 w-5 inline" />
              </Link>
              <Link to="/tour" className="gym-btn-outline">
                <Play className="mr-2 h-5 w-5 inline" /> Take a Virtual Tour
              </Link>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20">
          <button 
            onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-yellow-500 animate-scroll-down"
          >
            <ChevronDown className="h-10 w-10" />
          </button>
        </div>
      </section>

      {/* Services Bar */}
      <ServicesNavBar />

      {/* About Section */}
      <section id="about" className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold mb-2">ABOUT <span className="text-yellow-500">MUSCLE GARAGE</span></h2>
          </div>
          <div className="max-w-4xl mx-auto text-center text-gray-300">
            <p className="text-lg mb-8">
              Muscle Garage is the biggest, most advanced GYM in Ahmedabad. The Facility is fully equipped with state of the art Cardio machines, sensorised strength training machines and a variety of training equipment to workout on. The GYM features a Strength zone, Free-weight zone, Cardio zone, Group training studio, crossfit area, swimming pool, steam bath and ICE Bath.
            </p>
          </div>
        </div>
      </section>

      {/* Goal Section */}
      <GoalSection />

      {/* Facilities Section */}
      <FacilitySection />

      {/* Gallery Section */}
      <GallerySection />

      {/* Membership Plans Section */}
      <MembershipSection />

      {/* Trainers Section */}
      <TrainersSection />

      {/* Class Schedule Section */}
      <ClassScheduleSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Contact Section */}
      <ContactSection />

      {/* Footer */}
      <footer className="py-10 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">MUSCLE GARAGE</h3>
              <p className="text-gray-400 mb-4">Transform your body, transform your life.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-yellow-500">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-yellow-500">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-yellow-500">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-yellow-500">Home</a></li>
                <li><a href="#about" className="text-gray-400 hover:text-yellow-500">About Us</a></li>
                <li><a href="#membership" className="text-gray-400 hover:text-yellow-500">Membership</a></li>
                <li><a href="#classes" className="text-gray-400 hover:text-yellow-500">Classes</a></li>
                <li><a href="#contact" className="text-gray-400 hover:text-yellow-500">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Services</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-yellow-500">Personal Training</a></li>
                <li><a href="#" className="text-gray-400 hover:text-yellow-500">Group Classes</a></li>
                <li><a href="#" className="text-gray-400 hover:text-yellow-500">Nutrition Consulting</a></li>
                <li><a href="#" className="text-gray-400 hover:text-yellow-500">Swimming Pool</a></li>
                <li><a href="#" className="text-gray-400 hover:text-yellow-500">Steam & Ice Bath</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Contact</h3>
              <address className="not-italic text-gray-400">
                <p className="mb-2">123 Fitness Road, Navrangpura,</p>
                <p className="mb-4">Ahmedabad, Gujarat 380009</p>
                <p className="mb-2">Phone: +91 98765 43210</p>
                <p>Email: info@musclegarage.com</p>
              </address>
            </div>
          </div>
          <div className="mt-10 pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-400">&copy; 2025 Muscle Garage. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
