
import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Maximize } from "lucide-react";

const GallerySection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const [lightboxImage, setLightboxImage] = useState("");

  const galleryImages = [
    "/gallery-1.jpg",
    "/gallery-2.jpg",
    "/gallery-3.jpg",
    "/gallery-4.jpg",
    "/gallery-5.jpg",
    "/gallery-6.jpg",
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const nextSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % galleryImages.length);
  };

  const prevSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + galleryImages.length) % galleryImages.length);
  };

  const openLightbox = (imageUrl: string) => {
    setLightboxImage(imageUrl);
    setShowLightbox(true);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setShowLightbox(false);
    document.body.style.overflow = "auto";
  };

  return (
    <section id="gallery" ref={sectionRef} className="section-padding bg-gym-gray-900">
      <div className="gym-container">
        <div className={`text-center max-w-3xl mx-auto mb-12 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
          <h2 className="text-3xl md:text-5xl font-impact mb-4">
            OUR <span className="text-gym-yellow">GALLERY</span>
          </h2>
          <p className="text-gray-300">
            Take a virtual tour of our state-of-the-art facilities and envision your fitness journey with us.
          </p>
        </div>

        {/* Main Carousel */}
        <div className={`relative mb-8 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
          <div className="overflow-hidden rounded-lg">
            <div 
              className="flex transition-transform duration-500 ease-in-out h-[400px] md:h-[500px]" 
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {galleryImages.map((image, index) => (
                <div key={index} className="min-w-full h-full relative">
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => openLightbox(image)}
                      className="p-3 bg-gym-yellow rounded-full text-gym-black"
                    >
                      <Maximize size={24} />
                    </button>
                  </div>
                  <img 
                    src={image} 
                    alt={`Muscle Garage facility ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Navigation Arrows */}
          <button 
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gym-yellow p-2 rounded-full text-gym-black"
            aria-label="Previous image"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gym-yellow p-2 rounded-full text-gym-black"
            aria-label="Next image"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Thumbnail Navigation */}
        <div className={`grid grid-cols-3 md:grid-cols-6 gap-2 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '0.4s' }}>
          {galleryImages.map((image, index) => (
            <div
              key={index}
              className={`relative h-20 cursor-pointer rounded-md overflow-hidden ${
                index === activeIndex ? 'ring-2 ring-gym-yellow' : ''
              }`}
              onClick={() => setActiveIndex(index)}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {showLightbox && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <button 
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-white"
          >
            <X size={32} />
          </button>
          <div className="max-w-4xl max-h-[90vh]">
            <img
              src={lightboxImage}
              alt="Enlarged view"
              className="max-w-full max-h-[90vh] object-contain"
            />
          </div>
        </div>
      )}
    </section>
  );
};

// Add a missing import
import { X } from "lucide-react";

export default GallerySection;
