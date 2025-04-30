
import React from 'react';
import { Instagram, Facebook, Twitter } from 'lucide-react';

const TrainerSection = () => {
  const trainers = [
    {
      name: 'Alex Rivera',
      specialty: 'CrossFit Coach',
      image: '/images/trainer1.jpg',
      bio: 'Certified CrossFit coach with 8+ years of experience helping clients achieve their fitness goals.',
      social: {
        instagram: '#',
        facebook: '#',
        twitter: '#'
      }
    },
    {
      name: 'Jessica Kim',
      specialty: 'Yoga Instructor',
      image: '/images/trainer2.jpg',
      bio: '200hr RYT certified yoga instructor specializing in vinyasa flow and restorative practices.',
      social: {
        instagram: '#',
        facebook: '#',
        twitter: '#'
      }
    },
    {
      name: 'Marcus Thompson',
      specialty: 'Strength Coach',
      image: '/images/trainer3.jpg',
      bio: 'NSCA certified strength coach with a passion for powerlifting and functional fitness.',
      social: {
        instagram: '#',
        facebook: '#',
        twitter: '#'
      }
    },
    {
      name: 'Sofia Martinez',
      specialty: 'Nutrition Specialist',
      image: '/images/trainer4.jpg',
      bio: 'Registered dietitian with expertise in sports nutrition and meal planning for optimal performance.',
      social: {
        instagram: '#',
        facebook: '#',
        twitter: '#'
      }
    }
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {trainers.map((trainer, index) => (
            <div key={index} className="bg-gym-gray-900 rounded-lg overflow-hidden shadow-lg text-center">
              <div className="h-64 bg-gray-400 flex items-center justify-center">
                <span className="text-gray-600">[Trainer Image]</span>
              </div>
              <div className="p-6">
                <h3 className="text-gym-yellow text-xl font-bold">{trainer.name}</h3>
                <p className="text-white text-sm mb-4">{trainer.specialty}</p>
                <p className="text-gym-gray-400 mb-4">{trainer.bio}</p>
                <div className="flex justify-center space-x-4">
                  <a href={trainer.social.instagram} className="text-gym-yellow hover:text-white">
                    <Instagram className="h-5 w-5" />
                  </a>
                  <a href={trainer.social.facebook} className="text-gym-yellow hover:text-white">
                    <Facebook className="h-5 w-5" />
                  </a>
                  <a href={trainer.social.twitter} className="text-gym-yellow hover:text-white">
                    <Twitter className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrainerSection;
