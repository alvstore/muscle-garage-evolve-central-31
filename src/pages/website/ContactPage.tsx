
import React from 'react';
import ContactSection from '@/components/website/ContactSection';

const ContactPage: React.FC = () => {
  return (
    <div className="bg-gym-black text-white pt-24">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-6xl font-impact mb-6 text-center">
          CONTACT <span className="text-gym-yellow">US</span>
        </h1>
        <p className="text-xl text-center text-gray-300 max-w-3xl mx-auto">
          Have questions or ready to start your fitness journey? Get in touch with us.
        </p>
      </div>
      <ContactSection />
    </div>
  );
};

export default ContactPage;
