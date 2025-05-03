
import React from 'react';
import MembershipSection from '@/components/website/MembershipSection';
import TestimonialsSection from '@/components/website/TestimonialsSection';
import SectionDivider from '@/components/website/SectionDivider';

const WebsiteMembershipPage: React.FC = () => {
  return (
    <div className="bg-gym-black text-white pt-24">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-6xl font-impact mb-6 text-center">
          OUR <span className="text-gym-yellow">MEMBERSHIPS</span>
        </h1>
        <p className="text-xl text-center text-gray-300 max-w-3xl mx-auto">
          Choose the membership plan that best fits your fitness goals and lifestyle.
          We offer flexible options for all fitness levels.
        </p>
      </div>
      <MembershipSection />
      <SectionDivider />
      <TestimonialsSection />
    </div>
  );
};

export default WebsiteMembershipPage;
