
import { ChevronRight } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gym-black text-white">
      <div className="gym-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1 - About */}
          <div>
            <h3 className="text-2xl font-impact mb-6">MUSCLE GARAGE</h3>
            <p className="text-gray-400 mb-6">
              One of the largest premium fitness facilities in Ahmedabad offering state-of-the-art equipment and expert training services.
            </p>
            <div className="bg-gym-gray-800 p-4 rounded-lg">
              <p className="font-bold mb-1">Emergency Contact:</p>
              <p className="text-gym-yellow">+91 98765 43210</p>
            </div>
          </div>
          
          {/* Column 2 - Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {["Home", "About Us", "Gallery", "Membership", "Trainers", "Classes", "Contact Us"].map((link) => (
                <li key={link}>
                  <a 
                    href={`#${link.toLowerCase().replace(/\s+/g, "-")}`} 
                    className="text-gray-400 hover:text-gym-yellow transition-colors flex items-center"
                  >
                    <ChevronRight size={16} className="text-gym-yellow mr-2" />
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Column 3 - Operating Hours */}
          <div>
            <h3 className="text-xl font-bold mb-6">Operating Hours</h3>
            <ul className="space-y-3">
              <li className="flex justify-between">
                <span className="text-gray-400">Monday - Friday:</span>
                <span>5:00 AM - 11:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-400">Saturday:</span>
                <span>6:00 AM - 10:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-400">Sunday:</span>
                <span>6:00 AM - 10:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-400">Public Holidays:</span>
                <span>8:00 AM - 8:00 PM</span>
              </li>
            </ul>
            <div className="mt-6 p-3 bg-gym-yellow/10 rounded-lg border border-gym-yellow/30">
              <p className="text-gym-yellow text-sm">
                <strong>Note:</strong> Hours may vary during special events and holidays. Please check our social media for updates.
              </p>
            </div>
          </div>
          
          {/* Column 4 - Newsletter */}
          <div>
            <h3 className="text-xl font-bold mb-6">Newsletter</h3>
            <p className="text-gray-400 mb-4">
              Subscribe to our newsletter for the latest updates, fitness tips, and exclusive offers.
            </p>
            <form className="space-y-3">
              <div>
                <input
                  type="email"
                  placeholder="Your Email Address"
                  className="w-full p-3 rounded-md bg-gym-gray-800 border border-gym-gray-700 text-white focus:border-gym-yellow focus:ring-1 focus:ring-gym-yellow"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full btn btn-primary"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        {/* Bottom Footer */}
        <div className="border-t border-gym-gray-800 mt-10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-center md:text-left mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Muscle Garage. All Rights Reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-gym-yellow transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-gym-yellow transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-gray-400 hover:text-gym-yellow transition-colors">
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
