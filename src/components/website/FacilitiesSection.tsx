
import React from 'react';

const FacilitiesSection = () => {
  const facilities = [
    {
      name: 'Cardio Area',
      image: '/images/cardio.jpg',
      description: 'State-of-the-art cardio equipment with personal entertainment systems'
    },
    {
      name: 'Weight Training',
      image: '/images/weights.jpg',
      description: 'Complete range of free weights and machines for strength training'
    },
    {
      name: 'Swimming Pool',
      image: '/images/pool.jpg',
      description: 'Olympic-size swimming pool with dedicated lap lanes'
    },
    {
      name: 'Yoga Studio',
      image: '/images/yoga.jpg',
      description: 'Peaceful studio space for yoga, pilates and meditation classes'
    }
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {facilities.map((facility, index) => (
            <div key={index} className="bg-gym-gray-900 rounded-lg overflow-hidden shadow-lg">
              <div className="h-48 bg-gray-300 flex items-center justify-center">
                <span className="text-gray-600">[Facility Image]</span>
              </div>
              <div className="p-6">
                <h3 className="text-gym-yellow text-xl font-bold mb-2">{facility.name}</h3>
                <p className="text-white">{facility.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FacilitiesSection;
