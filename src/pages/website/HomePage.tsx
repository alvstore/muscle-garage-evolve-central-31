
import React from 'react';
import HeroSection from '@/components/website/HeroSection';
import AboutSection from '@/components/website/AboutSection';
import ServicesSection from '@/components/website/ServicesSection';
import TrainersSection from '@/components/website/TrainersSection';
import MembershipSection from '@/components/website/MembershipSection';
import TestimonialsSection from '@/components/website/TestimonialsSection';
import GallerySection from '@/components/website/GallerySection';
import ContactSection from '@/components/website/ContactSection';
import ServicesBar from '@/components/website/ServicesBar';
import SectionDivider from '@/components/website/SectionDivider';

const HomePage: React.FC = () => {
  return (
    <div className="bg-gym-black text-white">
      <HeroSection />
      <ServicesBar />
      <AboutSection />
      <SectionDivider equipmentType="dumbbells" />
      <ServicesSection />
      <SectionDivider equipmentType="barbell" />
      <TrainersSection />
      <SectionDivider equipmentType="kettlebell" />
      <MembershipSection />
      <SectionDivider equipmentType="dumbbells" />
      <TestimonialsSection />
      <SectionDivider equipmentType="barbell" />
      <GallerySection />
      <ContactSection />
    </div>
  );
};

export default HomePage;
