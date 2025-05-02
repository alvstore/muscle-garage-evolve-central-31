import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
const TestimonialsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, {
      threshold: 0.1
    });
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);
  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: -300,
        behavior: 'smooth'
      });
    }
  };
  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: 300,
        behavior: 'smooth'
      });
    }
  };
  const testimonials = [{
    name: "Deepak Mehta",
    image: "/testimonial-1.jpg",
    stars: 5,
    text: "I've been a member for 2 years and the transformation is incredible! The trainers are knowledgeable and the equipment is top-notch. Muscle Garage has completely changed my fitness journey.",
    role: "Software Engineer"
  }, {
    name: "Shweta Agarwal",
    image: "/testimonial-2.jpg",
    stars: 5,
    text: "The yoga classes at Muscle Garage are amazing. Priya is an excellent instructor who pays attention to form and modifications. The clean, spacious studio makes it a pleasure to practice.",
    role: "Marketing Executive"
  }, {
    name: "Rajesh Kumar",
    image: "/testimonial-3.jpg",
    stars: 4,
    text: "After trying several gyms in Ahmedabad, I can confidently say that Muscle Garage stands out. The personal training sessions with Vikram have helped me achieve goals I never thought possible.",
    role: "Business Owner"
  }, {
    name: "Neha Singh",
    image: "/testimonial-4.jpg",
    stars: 5,
    text: "The facilities are incredible! From the swimming pool to the steam room, everything is well-maintained. I especially love the dedicated cardio section with views of the city.",
    role: "Doctor"
  }, {
    name: "Amit Patel",
    image: "/testimonial-5.jpg",
    stars: 5,
    text: "Joining Muscle Garage was the best decision I've made for my health. The trainers have helped me lose 15kg and build muscle. The community feeling keeps me motivated.",
    role: "Teacher"
  }];
  return <section id="testimonials" ref={sectionRef} className="section-padding bg-gym-black">
      <div className="gym-container">
        <div className={`text-center max-w-3xl mx-auto mb-12 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
          <h2 className="text-3xl md:text-5xl font-impact mb-4 text-white font-bold">
            WHAT OUR <span className="text-gym-yellow">MEMBERS SAY</span>
          </h2>
          <p className="text-gray-300">
            Hear from our community about their transformative experiences at Muscle Garage.
          </p>
        </div>

        <div className="relative">
          <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 z-10">
            <button onClick={scrollLeft} className="bg-gym-yellow text-gym-black p-2 rounded-full">
              <ChevronLeft size={24} />
            </button>
          </div>
          
          <div ref={scrollRef} className={`flex space-x-6 overflow-x-auto pb-8 scrollbar-none snap-x snap-mandatory ${isVisible ? 'animate-fade-in' : 'opacity-0'}`} style={{
          animationDelay: '0.3s'
        }}>
            {testimonials.map((testimonial, index) => <div key={index} className="min-w-[300px] md:min-w-[400px] bg-gym-gray-800 rounded-lg p-6 shadow-lg snap-start">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-16 w-16 rounded-full overflow-hidden">
                    <img src={testimonial.image} alt={testimonial.name} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-white">{testimonial.name}</h4>
                    <p className="text-gym-yellow text-sm">{testimonial.role}</p>
                    <div className="flex items-center mt-1">
                      {[...Array(5)].map((_, i) => <Star key={i} size={16} fill={i < testimonial.stars ? "#FFD100" : "none"} className={i < testimonial.stars ? "text-gym-yellow" : "text-gray-500"} />)}
                    </div>
                  </div>
                </div>
                <blockquote className="text-gray-300 italic">"{testimonial.text}"</blockquote>
              </div>)}
          </div>
          
          <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 z-10">
            <button onClick={scrollRight} className="bg-gym-yellow text-gym-black p-2 rounded-full">
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>
    </section>;
};
export default TestimonialsSection;