
import React from 'react';

const GallerySection: React.FC = () => {
  const images = [
    '/gallery/gym-1.jpg',
    '/gallery/gym-2.jpg',
    '/gallery/gym-3.jpg',
    '/gallery/gym-4.jpg',
    '/gallery/gym-5.jpg',
    '/gallery/gym-6.jpg'
  ];

  return (
    <section id="gallery" className="section-padding bg-gym-gray-900">
      <div className="gym-container">
        <div className="text-center max-w-3xl mx-auto mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-5xl font-impact mb-4">
            OUR <span className="text-gym-yellow">GALLERY</span>
          </h2>
          <p className="text-gray-300">
            Take a look at our state-of-the-art facilities and equipment
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div 
              key={index}
              className="animate-fade-in overflow-hidden rounded-lg"
              style={{ animationDelay: `${0.2 * index}s` }}
            >
              <img 
                src={image} 
                alt={`Gym Interior ${index + 1}`}
                className="w-full h-64 object-cover transform hover:scale-110 transition-transform duration-500"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
