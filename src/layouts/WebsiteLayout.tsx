
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '@/components/website/Navbar';
import Footer from '@/components/website/Footer';
import FloatingWhatsAppButton from '@/components/website/FloatingWhatsAppButton';

const WebsiteLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <FloatingWhatsAppButton />
    </div>
  );
};

export default WebsiteLayout;
