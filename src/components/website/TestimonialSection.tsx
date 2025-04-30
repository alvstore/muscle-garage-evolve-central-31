
import React from 'react';
import { Star } from 'lucide-react';

const TestimonialSection = () => {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Member since 2020',
      quote: 'This gym completely changed my life. The trainers are exceptional and the facilities are always clean and well-maintained.',
      image: '/images/testimonial1.jpg',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Member since 2019',
      quote: 'I've been to many gyms, but this one stands out for its community feel and professional staff. Worth every penny!',
      image: '/images/testimonial2.jpg',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      role: 'Member since 2021',
      quote: 'The classes here are amazing! I've lost 30 pounds and gained so much confidence. Highly recommend!',
      image: '/images/testimonial3.jpg',
      rating: 4
    }
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gym-gray-900 p-6 rounded-lg">
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-gym-yellow text-gym-yellow" />
                ))}
              </div>
              <blockquote className="text-white mb-4">"{testimonial.quote}"</blockquote>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gray-500 mr-4"></div>
                <div>
                  <div className="font-bold text-gym-yellow">{testimonial.name}</div>
                  <div className="text-gym-gray-400 text-sm">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
