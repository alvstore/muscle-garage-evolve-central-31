
import React from 'react';
import AboutSection from '@/components/website/AboutSection';
import TrainersSection from '@/components/website/TrainersSection';
import TestimonialsSection from '@/components/website/TestimonialsSection';
import SectionDivider from '@/components/website/SectionDivider';

const AboutPage: React.FC = () => {
  return (
    <div className="bg-gym-black text-white pt-24">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-6xl font-impact mb-6 text-center">
          ABOUT <span className="text-gym-yellow">MUSCLE GARAGE</span>
        </h1>
      </div>
      <AboutSection />
      <SectionDivider equipmentType="dumbbells" />
      <TrainersSection />
      <SectionDivider equipmentType="kettlebell" />
      <TestimonialsSection />
    </div>
  );
};

export default AboutPage;
