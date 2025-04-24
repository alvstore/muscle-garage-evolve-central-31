
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
      <HeroSection 
        title="UNLOCK YOUR"
        subtitle="POTENTIAL"
        ctaButtonText="START YOUR JOURNEY"
        ctaButtonLink="/register"
        backgroundImage="/hero-bg.jpg"
      />
      <SectionDivider equipmentType="dumbbell" />
      <AboutSection 
        title="ABOUT US"
        subtitle="WHERE FITNESS MEETS PASSION"
        description="Muscle Garage is a premier fitness facility dedicated to helping you achieve your fitness goals. Our state-of-the-art equipment, expert trainers, and supportive community create the perfect environment for your fitness journey."
        goalTitle="OUR MISSION"
        goalDescription="To inspire and empower individuals to transform their lives through fitness, providing exceptional facilities, expert guidance, and a supportive community."
        facilities={[
          {
            id: "1",
            title: "Expert Trainers",
            description: "Certified professionals dedicated to your success",
            iconType: "trainers"
          },
          {
            id: "2",
            title: "Premium Equipment",
            description: "Top-of-the-line machines and free weights",
            iconType: "equipment"
          },
          {
            id: "3",
            title: "24/7 Access",
            description: "Train on your schedule, whenever you want",
            iconType: "hours"
          },
          {
            id: "4",
            title: "Supportive Community",
            description: "Connect with like-minded fitness enthusiasts",
            iconType: "community"
          }
        ]}
      />
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
      <FloatingWhatsAppButton phoneNumber="1234567890" />
    </div>
  );
};

export default PublicWebsite;
