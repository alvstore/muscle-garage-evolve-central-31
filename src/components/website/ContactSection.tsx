import { useState, useEffect, useRef } from "react";
import type { LeadSource, LeadStatus, FunnelStage } from '@/types/crm';
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Twitter } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
const ContactSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const {
    toast
  } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    inquiryType: "membership",
    message: ""
  });
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, {
      threshold: 0.1
    });
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const [submitting, setSubmitting] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const leadInput = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        source: 'website' as LeadSource,
        status: 'new' as LeadStatus,
        funnelStage: 'cold' as FunnelStage,
        notes: `${formData.inquiryType}: ${formData.message}`
      };
      const result = await import('@/services/crmService').then(m => m.crmService.createLead(leadInput));
      if (result) {
        toast({
          title: "Message Sent!",
          description: "We'll get back to you as soon as possible."
        });
        setFormData({
          name: "",
          email: "",
          phone: "",
          inquiryType: "membership",
          message: ""
        });
      } else {
        toast({
          title: "Failed to send message",
          description: "Please try again later.",
          variant: "destructive"
        });
      }
    } catch (err) {
      toast({
        title: "Failed to send message",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };
  return <section id="contact" ref={sectionRef} className="section-padding bg-gym-gray-900">
      <div className="gym-container">
        <div className={`text-center max-w-3xl mx-auto mb-12 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
          <h2 className="text-3xl md:text-5xl font-impact mb-4 text-white">
            GET IN <span className="text-gym-yellow">TOUCH</span>
          </h2>
          <p className="text-gray-300">
            Have questions or ready to start your fitness journey? Reach out to us.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Contact Form */}
          <div className={`bg-gym-gray-800 rounded-lg p-6 lg:p-8 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`} style={{
          animationDelay: '0.2s'
        }}>
            <h3 className="text-2xl font-bold mb-6 text-white">Send us a Message</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                  Full Name
                </label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="w-full p-3 rounded-md bg-gym-gray-700 border border-gym-gray-600 text-black" placeholder="Your name" required />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                    Email
                  </label>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-3 rounded-md bg-gym-gray-700 border border-gym-gray-600 text-black" placeholder="Your email" required />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
                    Phone Number
                  </label>
                  <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className="w-full p-3 rounded-md bg-gym-gray-700 border border-gym-gray-600 text-black" placeholder="Your phone" required />
                </div>
              </div>

              <div>
                <label htmlFor="inquiryType" className="block text-sm font-medium text-gray-300 mb-1">
                  Inquiry Type
                </label>
                <select id="inquiryType" name="inquiryType" value={formData.inquiryType} onChange={handleChange} className="w-full p-3 rounded-md bg-gym-gray-700 border border-gym-gray-600 text-black" required>
                  <option value="membership">Membership Inquiry</option>
                  <option value="training">Personal Training</option>
                  <option value="classes">Group Classes</option>
                  <option value="facilities">Facility Information</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
                  Message
                </label>
                <textarea id="message" name="message" value={formData.message} onChange={handleChange} rows={4} className="w-full p-3 rounded-md bg-gym-gray-700 border border-gym-gray-600 text-black" placeholder="Tell us how we can help..." required></textarea>
              </div>

              <div>
                <button type="submit" className="w-full btn btn-primary" disabled={submitting}>
                  {submitting ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </form>
          </div>

          {/* Contact Info and Map */}
          <div className={`${isVisible ? 'animate-fade-in' : 'opacity-0'}`} style={{
          animationDelay: '0.4s'
        }}>
            <div className="bg-gym-gray-800 rounded-lg p-6 lg:p-8 mb-8">
              <h3 className="text-2xl font-bold mb-6 text-white">Contact Information</h3>
              
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gym-yellow rounded-full text-gym-black">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-white">Location</h4>
                    <p className="text-gray-300">FP 17 Opp. SBI Bank, Motera, Ahmedabad, Gujarat 380009</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gym-yellow rounded-full text-gym-black">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Phone</h4>
                    <p className="text-gray-300">+91 88806 88828</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gym-yellow rounded-full text-gym-black">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Email</h4>
                    <p className="text-gray-300">info@musclegarage.com</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gym-yellow rounded-full text-gym-black">
                    <Clock size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Working Hours</h4>
                    <p className="text-gray-300">Monday - Friday: 5:00 AM - 11:00 PM</p>
                    <p className="text-gray-300">Saturday - Sunday: 6:00 AM - 10:00 PM</p>
                  </div>
                </div>
                
                <div className="pt-4">
                  <h4 className="font-bold text-lg mb-3">Follow Us</h4>
                  <div className="flex gap-4">
                    <a href="#" className="p-3 bg-gym-yellow text-gym-black rounded-full hover:bg-white transition-colors">
                      <Instagram size={20} />
                    </a>
                    <a href="#" className="p-3 bg-gym-yellow text-gym-black rounded-full hover:bg-white transition-colors">
                      <Facebook size={20} />
                    </a>
                    <a href="#" className="p-3 bg-gym-yellow text-gym-black rounded-full hover:bg-white transition-colors">
                      <Twitter size={20} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Google Map Embed */}
            <div className="bg-gym-gray-800 rounded-lg overflow-hidden h-[300px]">
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117494.35139554477!2d72.46773550437931!3d23.020497841501823!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e848aba5bd449%3A0x4fcedd11614f6516!2sAhmedabad%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1712536161124!5m2!1sen!2sin" width="100%" height="100%" style={{
              border: 0
            }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Muscle Garage Location"></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default ContactSection;