
import React from 'react';
import { Instagram, Facebook } from 'lucide-react';

interface TrainerProps {
  name: string;
  image: string;
  role: string;
}

const TrainerCard = ({ name, image, role }: TrainerProps) => {
  return (
    <div className="bg-gray-800 overflow-hidden rounded-lg">
      <div className="h-80 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold">{name}</h3>
          <div className="flex space-x-2">
            <a href="#" className="bg-yellow-500 hover:bg-yellow-600 text-black p-2 rounded-full transition-colors">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="#" className="bg-yellow-500 hover:bg-yellow-600 text-black p-2 rounded-full transition-colors">
              <Facebook className="h-5 w-5" />
            </a>
          </div>
        </div>
        <p className="text-yellow-500">{role}</p>
      </div>
    </div>
  );
};

const TrainersSection = () => {
  const trainers = [
    {
      name: 'Rahul Sharma',
      image: 'https://images.unsplash.com/photo-1534367610401-9f5ed68180aa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      role: 'Fitness Head Trainer',
    },
    {
      name: 'Priya Patel',
      image: 'https://images.unsplash.com/photo-1609952542840-df54cec5b9d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      role: 'Yoga & Fitness Trainer',
    },
    {
      name: 'Vikram Singh',
      image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
      role: 'Strength & Conditioning Coach',
    },
    {
      name: 'Anjali Kapoor',
      image: 'https://images.unsplash.com/photo-1622841623201-432b1f17c744?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
      role: 'Zumba & Dance Instructor',
    },
  ];

  return (
    <section id="trainers" className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold mb-2">OUR <span className="text-yellow-500">EXPERT TRAINERS</span></h2>
          <p className="text-lg text-gray-300 mt-4">Meet our team of certified fitness professionals dedicated to helping you achieve your goals.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {trainers.map((trainer, index) => (
            <TrainerCard key={index} {...trainer} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrainersSection;
