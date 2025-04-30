
import React from 'react';

const ClassesPage = () => {
  const classCategories = [
    {
      name: 'Strength Training',
      icon: '💪',
      description: 'Build muscle and increase strength with expert guidance'
    },
    {
      name: 'Cardio',
      icon: '🏃‍♂️',
      description: 'Improve your cardiovascular health and endurance'
    },
    {
      name: 'Yoga & Pilates',
      icon: '🧘‍♀️',
      description: 'Enhance flexibility, balance and mental wellbeing'
    },
    {
      name: 'Group Classes',
      icon: '👥',
      description: 'Motivating workouts in a supportive group environment'
    }
  ];

  const classSchedule = [
    {
      name: 'HIIT Workout',
      time: '6:00 - 7:00',
      day: 'Monday',
      trainer: 'Alex Rivera',
      level: 'Intermediate',
      spots: '5 spots left'
    },
    {
      name: 'Yoga Flow',
      time: '8:00 - 9:00',
      day: 'Monday',
      trainer: 'Jessica Kim',
      level: 'All Levels',
      spots: '8 spots left'
    },
    {
      name: 'Strength Circuit',
      time: '18:00 - 19:00',
      day: 'Monday',
      trainer: 'Marcus Thompson',
      level: 'Advanced',
      spots: '3 spots left'
    },
    {
      name: 'Spin Class',
      time: '7:00 - 8:00',
      day: 'Tuesday',
      trainer: 'Sofia Martinez',
      level: 'All Levels',
      spots: '10 spots left'
    },
    {
      name: 'Core Blast',
      time: '12:00 - 13:00',
      day: 'Tuesday',
      trainer: 'Alex Rivera',
      level: 'Intermediate',
      spots: '6 spots left'
    },
    {
      name: 'Power Yoga',
      time: '18:30 - 19:30',
      day: 'Tuesday',
      trainer: 'Jessica Kim',
      level: 'Intermediate',
      spots: '4 spots left'
    }
  ];

  return (
    <div className="bg-gym-black text-white">
      {/* Hero Section */}
      <div className="relative h-96 bg-gray-800">
        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-gym-yellow mb-4">Our Classes</h1>
            <p className="text-xl max-w-2xl">
              Discover a variety of classes designed to help you reach your fitness goals, led by our expert trainers.
            </p>
          </div>
        </div>
      </div>

      {/* Class Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gym-yellow mb-8 text-center">Class Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {classCategories.map((category, index) => (
              <div key={index} className="bg-gym-gray-900 p-6 rounded-lg text-center">
                <div className="text-4xl mb-4">{category.icon}</div>
                <h3 className="text-xl font-bold text-gym-yellow mb-2">{category.name}</h3>
                <p className="text-gym-gray-400">{category.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Class Schedule */}
      <section className="py-16 bg-gym-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gym-yellow mb-8 text-center">Class Schedule</h2>
          
          <div className="bg-gym-black rounded-lg overflow-hidden">
            <div className="grid grid-cols-6 bg-gym-gray-800 text-gym-yellow font-bold">
              <div className="p-4">Class</div>
              <div className="p-4">Time</div>
              <div className="p-4">Day</div>
              <div className="p-4">Trainer</div>
              <div className="p-4">Level</div>
              <div className="p-4">Availability</div>
            </div>
            
            {classSchedule.map((cls, index) => (
              <div key={index} className={`grid grid-cols-6 ${index % 2 === 0 ? 'bg-gym-gray-900' : 'bg-gym-black'}`}>
                <div className="p-4 font-medium text-gym-yellow">{cls.name}</div>
                <div className="p-4">{cls.time}</div>
                <div className="p-4">{cls.day}</div>
                <div className="p-4">{cls.trainer}</div>
                <div className="p-4">{cls.level}</div>
                <div className="p-4">{cls.spots}</div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button className="bg-gym-yellow text-black hover:bg-yellow-400 py-3 px-8 rounded-full font-bold transition duration-300">
              Book a Class
            </button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gym-yellow mb-8 text-center">Benefits of Group Classes</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gym-gray-900 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-gym-yellow mb-4">Professional Guidance</h3>
              <p className="text-gym-gray-400">
                Our certified trainers ensure you perform exercises correctly and safely, maximizing results and preventing injury.
              </p>
            </div>
            <div className="bg-gym-gray-900 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-gym-yellow mb-4">Motivation & Support</h3>
              <p className="text-gym-gray-400">
                Working out in a group creates energy and accountability that helps you push through challenges and stay consistent.
              </p>
            </div>
            <div className="bg-gym-gray-900 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-gym-yellow mb-4">Structured Workouts</h3>
              <p className="text-gym-gray-400">
                Our professionally designed class programs take the guesswork out of your workout, ensuring balanced and progressive training.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gym-yellow">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-black mb-4">Ready to Join a Class?</h2>
          <p className="text-black text-lg mb-8 max-w-2xl mx-auto">
            Experience the energy and results of our group fitness classes. Your first class is free!
          </p>
          <button className="bg-black text-gym-yellow hover:bg-gray-800 py-3 px-8 rounded-full font-bold transition duration-300">
            Try a Free Class
          </button>
        </div>
      </section>
    </div>
  );
};

export default ClassesPage;
