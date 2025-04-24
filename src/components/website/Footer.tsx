
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gym-gray-950 text-white py-12">
      <div className="gym-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">MUSCLE GARAGE</h3>
            <p className="text-gray-400 mb-4">
              Your premier fitness destination for achieving your health and wellness goals. Join our community and transform your life.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/public" className="text-gray-400 hover:text-gym-yellow">Home</Link></li>
              <li><Link to="/public#about" className="text-gray-400 hover:text-gym-yellow">About</Link></li>
              <li><Link to="/public#memberships" className="text-gray-400 hover:text-gym-yellow">Memberships</Link></li>
              <li><Link to="/public#trainers" className="text-gray-400 hover:text-gym-yellow">Trainers</Link></li>
              <li><Link to="/public#contact" className="text-gray-400 hover:text-gym-yellow">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-4">Programs</h4>
            <ul className="space-y-2">
              <li><Link to="#" className="text-gray-400 hover:text-gym-yellow">Personal Training</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-gym-yellow">Group Classes</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-gym-yellow">Nutritional Guidance</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-gym-yellow">Weight Management</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-gym-yellow">Strength Training</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-4">Connect With Us</h4>
            <div className="flex space-x-4 mb-4">
              <a href="#" className="text-gray-400 hover:text-gym-yellow">
                {/* Social media icons would go here */}
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-gym-yellow">
                {/* Social media icons would go here */}
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-gym-yellow">
                {/* Social media icons would go here */}
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-gym-yellow">
                {/* Social media icons would go here */}
                <span className="sr-only">YouTube</span>
              </a>
            </div>
            <p className="text-gray-400">
              Subscribe to our newsletter for the latest updates and offers.
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Muscle Garage. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <Link to="#" className="text-gray-400 hover:text-gym-yellow text-sm">Privacy Policy</Link>
            <Link to="#" className="text-gray-400 hover:text-gym-yellow text-sm">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
