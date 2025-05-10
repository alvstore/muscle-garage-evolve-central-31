
import React from 'react';
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from '@/utils/stringUtils';

const testimonials = [
  {
    id: 1,
    name: "John Smith",
    role: "Member since 2020",
    avatar: "",
    content: "This gym completely transformed my life! The trainers are incredibly knowledgeable and the equipment is top-notch. I've lost over 20kg and feel better than ever.",
    rating: 5
  },
  {
    id: 2,
    name: "Priya Sharma",
    role: "Member since 2021",
    avatar: "",
    content: "The personal training sessions are incredible. My trainer understands my goals perfectly and has created a program that works for my busy schedule.",
    rating: 5
  },
  {
    id: 3,
    name: "Rajesh Kumar",
    role: "Member since 2019",
    avatar: "",
    content: "From someone who never exercised to now working out 4 times a week - this gym made it possible. The supportive community keeps me motivated.",
    rating: 5
  }
];

const TestimonialsSection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Members Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it - hear from our members who have transformed their lives through fitness.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="h-full flex flex-col">
              <CardHeader className="pb-4">
                <div className="flex items-center">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback className="bg-primary/10">
                      {getInitials(testimonial.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-4">
                    <h3 className="font-medium">{testimonial.name}</h3>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-gray-600 italic">"{testimonial.content}"</p>
              </CardContent>
              <CardFooter className="pt-0">
                <div className="flex">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg 
                      key={i}
                      className="w-5 h-5 text-yellow-500" 
                      fill="currentColor" 
                      viewBox="0 0 20 20" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path 
                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                      />
                    </svg>
                  ))}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
