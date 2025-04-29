
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import HeroSection from '@/components/website/HeroSection';
import AboutSection from '@/components/website/AboutSection';
import HighlightsSection from '@/components/website/HighlightsSection';
import TestimonialsSection from '@/components/website/TestimonialsSection';
import TrainersSection from '@/components/website/TrainersSection';
import GallerySection from '@/components/website/GallerySection';
import MembershipSection from '@/components/website/MembershipSection';
import ContactSection from '@/components/website/ContactSection';
import ServicesBar from '@/components/website/ServicesBar';
import SectionDivider from '@/components/website/SectionDivider';
import Footer from '@/components/website/Footer';
import Navbar from '@/components/website/Navbar';
import FloatingWhatsAppButton from '@/components/website/FloatingWhatsAppButton';
import '../index.css';

const Index = () => {
  return (
    <div className="min-h-screen bg-gym-black text-white">
      {/* Navbar */}
      <Navbar />
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Services Bar */}
      <ServicesBar />
      
      {/* Highlights Section (Keywords) */}
      <HighlightsSection />
      
      {/* About Section */}
      <SectionDivider />
      <AboutSection />
      
      {/* Trainers Section */}
      <SectionDivider />
      <TrainersSection />
      
      {/* Gallery Section */}
      <SectionDivider />
      <GallerySection />
      
      {/* Testimonials Section */}
      <SectionDivider />
      <TestimonialsSection />
      
      {/* Membership Plans Section */}
      <SectionDivider />
      <MembershipSection />
      
      {/* Contact Section */}
      <SectionDivider />
      <ContactSection />
      
      {/* Footer */}
      <Footer />
      
      {/* WhatsApp Button */}
      <FloatingWhatsAppButton />

      {/* Login Button */}
      <div className="fixed top-4 right-4 z-50">
        <Button asChild variant="outline" className="bg-gym-yellow text-gym-black hover:bg-white">
          <Link to="/login">Admin Login</Link>
        </Button>
      </div>
    </div>
  );
};

export default Index;
