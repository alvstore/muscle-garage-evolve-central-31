
import React from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

interface TestimonialProps {
  name: string;
  photo: string;
  role: string;
  stars: number;
  testimonial: string;
}

const TestimonialCard = ({ name, photo, role, stars, testimonial }: TestimonialProps) => {
  return (
    <div className="gym-testimonial-card">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-16 h-16 rounded-full overflow-hidden">
          <img src={photo} alt={name} className="w-full h-full object-cover" />
        </div>
        <div>
          <h4 className="text-xl font-bold">{name}</h4>
          <p className="text-yellow-500">{role}</p>
          <div className="flex mt-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${i < stars ? 'text-yellow-500 fill-yellow-500' : 'text-gray-500'}`}
              />
            ))}
          </div>
        </div>
      </div>
      <blockquote className="text-gray-300 italic">"{testimonial}"</blockquote>
    </div>
  );
};

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'Deepak Mehta',
      photo: 'https://randomuser.me/api/portraits/men/32.jpg',
      role: 'Software Engineer',
      stars: 5,
      testimonial: 'I\'ve been a member for 2 years and the transformation is incredible! The trainers are knowledgeable and the equipment is top-notch. Muscle Garage has completely changed my fitness journey.'
    },
    {
      name: 'Shweta Agarwal',
      photo: 'https://randomuser.me/api/portraits/women/44.jpg',
      role: 'Marketing Executive',
      stars: 5,
      testimonial: 'The yoga classes at Muscle Garage are amazing. Priya is an excellent instructor who pays attention to form and modifications. The clean, spacious studio makes it a pleasure to practice.'
    },
    {
      name: 'Rajesh Kumar',
      photo: 'https://randomuser.me/api/portraits/men/62.jpg',
      role: 'Business Owner',
      stars: 4,
      testimonial: 'After trying several gyms in Ahmedabad, I can confidently say that Muscle Garage stands out. The personal training sessions with Vikram have helped me achieve goals I never thought possible.'
    },
    {
      name: 'Anita Desai',
      photo: 'https://randomuser.me/api/portraits/women/37.jpg',
      role: 'Doctor',
      stars: 5,
      testimonial: 'As a doctor, I appreciate the cleanliness and professionalism at Muscle Garage. The trainers understand anatomy and design safe, effective workouts. I recommend it to all my patients.'
    },
  ];

  return (
    <section id="testimonials" className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold mb-2">WHAT OUR <span className="text-yellow-500">MEMBERS SAY</span></h2>
          <p className="text-lg text-gray-300 mt-4">Hear from our community about their transformative experiences at Muscle Garage.</p>
        </div>
        
        <div className="relative">
          <Carousel className="mx-auto max-w-5xl">
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 p-2">
                  <TestimonialCard {...testimonial} />
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

export default TestimonialsSection;
