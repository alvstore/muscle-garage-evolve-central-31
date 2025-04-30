
import React from 'react';
import HeroSection from '@/components/website/HeroSection';
import ServicesBar from '@/components/website/ServicesBar';
import AboutSection from '@/components/website/AboutSection';
import FacilitiesSection from '@/components/website/FacilitiesSection';
import MembershipSection from '@/components/website/MembershipSection';
import TestimonialSection from '@/components/website/TestimonialSection';
import GallerySection from '@/components/website/GallerySection';
import TrainerSection from '@/components/website/TrainerSection';
import ContactSection from '@/components/website/ContactSection';
import SectionDivider from '@/components/website/SectionDivider';

const Index = () => {
  return (
    <div className="website-container">
      <main>
        <HeroSection />
        
        <ServicesBar />
        
        <AboutSection />
        
        <SectionDivider equipmentType="Our World-Class Facilities" />
        
        <FacilitiesSection />
        
        <SectionDivider equipmentType="Membership Plans" />
        
        <MembershipSection />
        
        <SectionDivider equipmentType="What Our Members Say" />
        
        <TestimonialSection />
        
        <SectionDivider equipmentType="Training Gallery" />
        
        <GallerySection />
        
        <SectionDivider equipmentType="Expert Trainers" />
        
        <TrainerSection />
        
        <SectionDivider equipmentType="Get In Touch" />
        
        <ContactSection />
      </main>
    </div>
  );
};

export default Index;
