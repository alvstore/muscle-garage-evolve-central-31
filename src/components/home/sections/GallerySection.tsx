
import React from 'react';
import { ChevronLeft, ChevronRight, Maximize } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

const GallerySection = () => {
  const galleryImages = [
    { src: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80', alt: 'Muscle Garage facility 1' },
    { src: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80', alt: 'Muscle Garage facility 2' },
    { src: 'https://images.unsplash.com/photo-1637666229702-a2ed0e61605b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80', alt: 'Muscle Garage facility 3' },
  ];

  return (
    <section id="gallery" className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold mb-2">OUR <span className="text-yellow-500">GALLERY</span></h2>
          <p className="text-lg text-gray-300 mt-4">Take a virtual tour of our state-of-the-art facilities and envision your fitness journey with us.</p>
        </div>
        
        <div className="relative max-w-5xl mx-auto">
          <Carousel>
            <CarouselContent>
              {galleryImages.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="relative h-[400px] md:h-[500px] overflow-hidden rounded-lg">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <button className="bg-yellow-500 hover:bg-yellow-600 text-black p-3 rounded-full transition-colors">
                        <Maximize className="h-6 w-6" />
                      </button>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute -left-12 top-1/2 transform -translate-y-1/2 bg-yellow-500 hover:bg-yellow-600 text-black border-none" />
            <CarouselNext className="absolute -right-12 top-1/2 transform -translate-y-1/2 bg-yellow-500 hover:bg-yellow-600 text-black border-none" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
