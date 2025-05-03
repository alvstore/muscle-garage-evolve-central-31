
import React from 'react';
import ServicesSection from '@/components/website/ServicesSection';
import GallerySection from '@/components/website/GallerySection';
import SectionDivider from '@/components/website/SectionDivider';

const ServicesPage: React.FC = () => {
  return (
    <div className="bg-gym-black text-white pt-24">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-6xl font-impact mb-6 text-center">
          OUR <span className="text-gym-yellow">SERVICES</span>
        </h1>
        <p className="text-xl text-center text-gray-300 max-w-3xl mx-auto">
          At Muscle Garage, we offer a wide range of fitness services designed to help you
          achieve your health and wellness goals.
        </p>
      </div>
      <ServicesSection />
      <SectionDivider />
      <GallerySection />
    </div>
  );
};

export default ServicesPage;
