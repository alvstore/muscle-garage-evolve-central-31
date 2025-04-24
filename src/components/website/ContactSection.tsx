
import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';

const ContactSection: React.FC = () => {
  return (
    <section id="contact" className="section-padding bg-gym-gray-900">
      <div className="gym-container">
        <div className="text-center max-w-3xl mx-auto mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-5xl font-impact mb-4">
            CONTACT <span className="text-gym-yellow">US</span>
          </h2>
          <p className="text-gray-300">
            Get in touch with us for any inquiries or to start your fitness journey
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="animate-fade-in">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name"
                    className="w-full p-3 bg-gym-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gym-yellow"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email"
                    className="w-full p-3 bg-gym-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gym-yellow"
                    placeholder="Your email"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
                <input 
                  type="text" 
                  id="subject" 
                  name="subject"
                  className="w-full p-3 bg-gym-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gym-yellow"
                  placeholder="Subject"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                <textarea 
                  id="message" 
                  name="message"
                  rows={4}
                  className="w-full p-3 bg-gym-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gym-yellow"
                  placeholder="Your message"
                ></textarea>
              </div>
              <div>
                <button 
                  type="submit"
                  className="w-full bg-gym-yellow hover:bg-gym-yellow-dark text-black font-bold py-3 px-6 rounded-md transition-colors"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
          
          <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="bg-gym-gray-800 p-6 rounded-lg h-full">
              <h3 className="text-xl font-bold mb-6">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <MapPin className="h-6 w-6 text-gym-yellow mr-3 mt-1" />
                  <div>
                    <h4 className="font-medium">Address</h4>
                    <address className="text-gray-400 not-italic">
                      123 Fitness Street<br />
                      Ahmedabad, Gujarat 380001<br />
                      India
                    </address>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="h-6 w-6 text-gym-yellow mr-3 mt-1" />
                  <div>
                    <h4 className="font-medium">Phone</h4>
                    <p className="text-gray-400">+91 98765 43210</p>
                    <p className="text-gray-400">+91 79 2345 6789</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Mail className="h-6 w-6 text-gym-yellow mr-3 mt-1" />
                  <div>
                    <h4 className="font-medium">Email</h4>
                    <p className="text-gray-400">info@musclegarage.com</p>
                    <p className="text-gray-400">support@musclegarage.com</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Hours</h4>
                  <p className="text-gray-400">Monday - Friday: 5:00 AM - 11:00 PM</p>
                  <p className="text-gray-400">Saturday & Sunday: 6:00 AM - 10:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
