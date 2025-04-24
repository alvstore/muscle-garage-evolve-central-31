
import React from 'react';

const TrainersSection: React.FC = () => {
  const trainers = [
    {
      name: "John Doe",
      role: "Fitness Coach",
      image: "/trainers/trainer1.jpg",
      expertise: "Strength Training"
    },
    {
      name: "Jane Smith",
      role: "Yoga Instructor",
      image: "/trainers/trainer2.jpg",
      expertise: "Flexibility & Balance"
    },
    {
      name: "Mike Johnson",
      role: "Nutrition Expert",
      image: "/trainers/trainer3.jpg",
      expertise: "Diet Planning"
    },
    {
      name: "Sara Wilson",
      role: "Cardio Specialist",
      image: "/trainers/trainer4.jpg",
      expertise: "HIIT & Endurance"
    }
  ];

  return (
    <section id="trainers" className="section-padding bg-gym-gray-900">
      <div className="gym-container">
        <div className="text-center max-w-3xl mx-auto mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-5xl font-impact mb-4">
            OUR <span className="text-gym-yellow">TRAINERS</span>
          </h2>
          <p className="text-gray-300">
            Meet our team of experienced and certified fitness professionals
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {trainers.map((trainer, index) => (
            <div 
              key={index}
              className="animate-fade-in bg-gym-gray-800 rounded-lg overflow-hidden"
              style={{ animationDelay: `${0.2 * index}s` }}
            >
              <div className="h-72 overflow-hidden">
                <img 
                  src={trainer.image} 
                  alt={trainer.name}
                  className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="text-xl font-bold">{trainer.name}</h3>
                <p className="text-gym-yellow">{trainer.role}</p>
                <p className="text-gray-400 text-sm mt-1">{trainer.expertise}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrainersSection;
