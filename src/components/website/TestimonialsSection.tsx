
import React from 'react';

const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      quote: "Joining Muscle Garage was the best decision I made for my fitness journey. The facilities and trainers are top-notch!",
      author: "Robert K.",
      role: "Member since 2021",
      image: "/testimonials/person1.jpg"
    },
    {
      quote: "The personal training program here has completely transformed my physique. I've never felt stronger and more confident.",
      author: "Priya M.",
      role: "Member since 2020",
      image: "/testimonials/person2.jpg"
    },
    {
      quote: "The community here is amazing. Everyone is supportive and the trainers really know how to push you to your limits.",
      author: "David T.",
      role: "Member since 2022",
      image: "/testimonials/person3.jpg"
    }
  ];

  return (
    <section className="section-padding bg-gym-gray-800">
      <div className="gym-container">
        <div className="text-center max-w-3xl mx-auto mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-5xl font-impact mb-4">
            SUCCESS <span className="text-gym-yellow">STORIES</span>
          </h2>
          <p className="text-gray-300">
            Don't just take our word for it - hear from our satisfied members
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, index) => (
            <div 
              key={index}
              className="animate-fade-in bg-gym-gray-900 p-6 rounded-lg"
              style={{ animationDelay: `${0.2 * index}s` }}
            >
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 rounded-full overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.author}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <blockquote className="text-center">
                <p className="text-gray-300 italic mb-4">"{item.quote}"</p>
                <footer>
                  <div className="font-bold">{item.author}</div>
                  <div className="text-gym-yellow text-sm">{item.role}</div>
                </footer>
              </blockquote>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
