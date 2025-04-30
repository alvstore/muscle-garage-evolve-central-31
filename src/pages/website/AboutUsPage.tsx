
import React from 'react';

const AboutUsPage = () => {
  const stats = [
    { value: '10+', label: 'Years of Experience' },
    { value: '20+', label: 'Expert Trainers' },
    { value: '50+', label: 'Fitness Classes Weekly' },
    { value: '10,000+', label: 'Happy Members' }
  ];

  return (
    <div className="bg-gym-black text-white">
      {/* Hero Section */}
      <div className="relative h-96 bg-gray-800">
        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-gym-yellow mb-4">About Our Gym</h1>
            <p className="text-xl max-w-2xl">
              We're dedicated to helping you achieve your fitness goals with state-of-the-art equipment and expert guidance.
            </p>
          </div>
        </div>
      </div>

      {/* Our Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-gym-yellow mb-4">Our Story</h2>
              <p className="mb-4">
                Founded in 2013, GYM CRM started with a simple mission: to create a fitness environment where everyone feels welcome and empowered to achieve their personal best.
              </p>
              <p className="mb-4">
                What began as a small, passionate team has grown into a network of modern fitness facilities across the country, each maintaining our core values of inclusivity, excellence, and community.
              </p>
              <p>
                Today, we're proud to offer cutting-edge equipment, innovative classes, and personalized training services that help thousands of members transform their lives every day.
              </p>
            </div>
            <div className="md:w-1/2 bg-gym-gray-800 h-80 flex items-center justify-center">
              <span className="text-gym-gray-600">[Gym History Image]</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gym-gray-900 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-4xl font-bold text-gym-yellow mb-2">{stat.value}</div>
                <div className="text-white">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gym-yellow mb-8 text-center">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gym-gray-900 p-8 rounded-lg">
              <h3 className="text-xl font-bold text-gym-yellow mb-4">Excellence</h3>
              <p className="text-gym-gray-400">
                We strive for excellence in everything we do, from our facilities and equipment to our training programs and customer service.
              </p>
            </div>
            <div className="bg-gym-gray-900 p-8 rounded-lg">
              <h3 className="text-xl font-bold text-gym-yellow mb-4">Community</h3>
              <p className="text-gym-gray-400">
                We foster a supportive community where members encourage each other and celebrate achievements together.
              </p>
            </div>
            <div className="bg-gym-gray-900 p-8 rounded-lg">
              <h3 className="text-xl font-bold text-gym-yellow mb-4">Innovation</h3>
              <p className="text-gym-gray-400">
                We continuously innovate our programs and facilities to provide the most effective fitness solutions for our members.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-gym-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gym-yellow mb-8 text-center">Our Leadership Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="bg-gym-black p-6 rounded-lg text-center">
                <div className="w-32 h-32 rounded-full bg-gym-gray-800 mx-auto mb-4"></div>
                <h3 className="text-xl font-bold text-gym-yellow">John Doe</h3>
                <p className="text-white mb-2">CEO & Founder</p>
                <p className="text-gym-gray-400">
                  Former professional athlete with a passion for helping others achieve their fitness goals.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage;
