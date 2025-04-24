import React from 'react';
import Navbar from '@/components/website/Navbar';
import HeroSection from '@/components/website/HeroSection';
import SectionDivider from '@/components/website/SectionDivider';
import AboutSection from '@/components/website/AboutSection';
import HighlightsSection from '@/components/website/HighlightsSection';
import GallerySection from '@/components/website/GallerySection';
import MembershipSection from '@/components/website/MembershipSection';
import TrainersSection from '@/components/website/TrainersSection';
import TestimonialsSection from '@/components/website/TestimonialsSection';
import ContactSection from '@/components/website/ContactSection';
import Footer from '@/components/website/Footer';
import FloatingWhatsAppButton from '@/components/website/FloatingWhatsAppButton';

const PublicWebsite = () => {

  return (
    <div className="bg-gym-gray-900 text-white">
      <Navbar />
      <HeroSection />
      <SectionDivider equipmentType="dumbbell" />
      <AboutSection />
      <SectionDivider equipmentType="kettlebell" />
      <HighlightsSection />
      <SectionDivider equipmentType="barbell" />
      <GallerySection />
      <SectionDivider equipmentType="kettlebell" />
      <MembershipSection />
      <SectionDivider equipmentType="dumbbell" />
      <TrainersSection />
      <SectionDivider equipmentType="proteinShake" />
      <TestimonialsSection />
      <SectionDivider equipmentType="barbell" />
      <ContactSection />
      <Footer />
      <FloatingWhatsAppButton phoneNumber="1234567890" /> {/* Add required phoneNumber prop */}
    </div>
  );
};

export default PublicWebsite;
