import { useEffect } from "react";
import Navbar from "@/components/website/Navbar";
import HeroSection from "@/components/website/HeroSection";
import AboutSection from "@/components/website/AboutSection";
import HighlightsSection from "@/components/website/HighlightsSection";
import GallerySection from "@/components/website/GallerySection";
import MembershipSection from "@/components/website/MembershipSection";
import TrainersSection from "@/components/website/TrainersSection";
import TestimonialsSection from "@/components/website/TestimonialsSection";
import ContactSection from "@/components/website/ContactSection";
import Footer from "@/components/website/Footer";
import SectionDivider from "@/components/website/SectionDivider";
import { useScrollAnimation } from "@/utils/useScrollAnimation";
import FloatingWhatsAppButton from "@/components/website/FloatingWhatsAppButton";

const PublicWebsite = () => {
  // Use the scroll animation hook for smooth animations
  useScrollAnimation();

  useEffect(() => {
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href')?.substring(1);
        if (targetId) {
          const targetElement = document.getElementById(targetId);
          if (targetElement) {
            targetElement.scrollIntoView({
              behavior: 'smooth'
            });
          }
        }
      });
    });

    // Add necessary CSS classes for the new components
    document.documentElement.classList.add('bg-gym-black', 'text-white');
    
    return () => {
      // Clean up when component unmounts
      document.documentElement.classList.remove('bg-gym-black', 'text-white');
    };
  }, []);

  return (
    <div className="min-h-screen public-website">
      <Navbar />
      <FloatingWhatsAppButton />
      <HeroSection />
      <HighlightsSection />
      <SectionDivider equipmentType="barbell" className="bg-gym-black" />
      <AboutSection />
      <SectionDivider equipmentType="dumbbell" className="bg-gym-gray-900" />
      
      <GallerySection />
      <SectionDivider equipmentType="kettlebell" className="bg-gym-gray-900" />
      <MembershipSection />
      <SectionDivider equipmentType="proteinShake" className="bg-gym-black" />
      <TrainersSection />
      <SectionDivider equipmentType="barbell" className="bg-gym-gray-900" />
      <TestimonialsSection />
      <SectionDivider equipmentType="dumbbell" className="bg-gym-black" />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default PublicWebsite;
