
import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const ContactPage = () => {
  return (
    <div className="bg-gym-black text-white">
      {/* Hero Section */}
      <div className="relative h-96 bg-gray-800">
        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-gym-yellow mb-4">Contact Us</h1>
            <p className="text-xl max-w-2xl">
              Have questions or feedback? We're here to help. Reach out to our team today.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Contact Form */}
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-bold text-gym-yellow mb-6">Get In Touch</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-white mb-2">Your Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      className="w-full bg-gym-gray-900 border border-gym-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-gym-yellow"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-white mb-2">Email Address</label>
                    <input 
                      type="email" 
                      id="email" 
                      className="w-full bg-gym-gray-900 border border-gym-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-gym-yellow"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-white mb-2">Phone Number</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    className="w-full bg-gym-gray-900 border border-gym-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-gym-yellow"
                    placeholder="+1 (123) 456-7890"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-white mb-2">Subject</label>
                  <select 
                    id="subject" 
                    className="w-full bg-gym-gray-900 border border-gym-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-gym-yellow"
                  >
                    <option value="">Select a subject</option>
                    <option value="membership">Membership Inquiry</option>
                    <option value="classes">Class Information</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-white mb-2">Your Message</label>
                  <textarea 
                    id="message" 
                    rows={5}
                    className="w-full bg-gym-gray-900 border border-gym-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-gym-yellow"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>
                
                <button 
                  type="submit" 
                  className="bg-gym-yellow text-black hover:bg-yellow-400 py-3 px-8 rounded-full font-bold transition duration-300"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-bold text-gym-yellow mb-6">Contact Information</h2>
              
              <div className="space-y-8">
                <div className="flex items-start">
                  <MapPin className="text-gym-yellow h-6 w-6 mt-1 mr-4" />
                  <div>
                    <h3 className="font-bold text-white mb-1">Our Location</h3>
                    <p className="text-gym-gray-400">
                      123 Fitness Street<br />
                      Cityville, ST 12345<br />
                      India
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="text-gym-yellow h-6 w-6 mt-1 mr-4" />
                  <div>
                    <h3 className="font-bold text-white mb-1">Phone</h3>
                    <p className="text-gym-gray-400">
                      +91 123-456-7890 (Main)<br />
                      +91 987-654-3210 (Customer Support)
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Mail className="text-gym-yellow h-6 w-6 mt-1 mr-4" />
                  <div>
                    <h3 className="font-bold text-white mb-1">Email</h3>
                    <p className="text-gym-gray-400">
                      info@gymcrm.com<br />
                      support@gymcrm.com
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock className="text-gym-yellow h-6 w-6 mt-1 mr-4" />
                  <div>
                    <h3 className="font-bold text-white mb-1">Hours of Operation</h3>
                    <table className="text-gym-gray-400">
                      <tbody>
                        <tr>
                          <td className="pr-4">Monday - Friday</td>
                          <td>5:00 AM - 10:00 PM</td>
                        </tr>
                        <tr>
                          <td className="pr-4">Saturday</td>
                          <td>7:00 AM - 8:00 PM</td>
                        </tr>
                        <tr>
                          <td className="pr-4">Sunday</td>
                          <td>8:00 AM - 6:00 PM</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 bg-gym-gray-900 rounded-lg">
                <h3 className="font-bold text-white mb-2">Customer Support Hours</h3>
                <p className="text-gym-gray-400">
                  Our customer support team is available:<br />
                  Monday - Friday: 9:00 AM - 6:00 PM<br />
                  Saturday: 10:00 AM - 4:00 PM<br />
                  Sunday: Closed
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-gym-gray-900">
        <div className="container mx-auto px-4">
          <div className="bg-gray-400 h-96 flex items-center justify-center">
            <span className="text-gray-600">[Map Placeholder]</span>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gym-yellow mb-8 text-center">Frequently Asked Questions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gym-gray-900 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-gym-yellow mb-2">What are your membership cancellation policies?</h3>
              <p className="text-gym-gray-400">
                Members may cancel with 30 days written notice. Please contact our membership team for specific details about your plan.
              </p>
            </div>
            
            <div className="bg-gym-gray-900 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-gym-yellow mb-2">Can I freeze my membership temporarily?</h3>
              <p className="text-gym-gray-400">
                Yes, members can freeze their membership for up to 3 months per year. Medical freezes are also available with documentation.
              </p>
            </div>
            
            <div className="bg-gym-gray-900 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-gym-yellow mb-2">How do I book a class?</h3>
              <p className="text-gym-gray-400">
                Classes can be booked through our mobile app, website, or at the front desk up to 7 days in advance.
              </p>
            </div>
            
            <div className="bg-gym-gray-900 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-gym-yellow mb-2">Do you offer personal training?</h3>
              <p className="text-gym-gray-400">
                Yes, we offer one-on-one personal training with our certified trainers. Packages start at ₹2,500 per session.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
