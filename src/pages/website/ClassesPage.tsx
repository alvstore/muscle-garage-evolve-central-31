
import React from 'react';

const ClassesPage = () => {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-6">Our Classes</h1>
      <p className="mb-8">Discover our wide range of fitness classes designed for all levels.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Sample class cards */}
        <div className="border rounded-lg overflow-hidden shadow-sm">
          <div className="h-48 bg-gray-200"></div>
          <div className="p-4">
            <h3 className="text-xl font-semibold">Strength Training</h3>
            <p className="text-gray-600 mt-2">Build muscle and improve strength with our expert trainers.</p>
            <button className="mt-4 px-4 py-2 bg-primary text-white rounded">Learn More</button>
          </div>
        </div>
        
        <div className="border rounded-lg overflow-hidden shadow-sm">
          <div className="h-48 bg-gray-200"></div>
          <div className="p-4">
            <h3 className="text-xl font-semibold">Yoga</h3>
            <p className="text-gray-600 mt-2">Improve flexibility and find inner peace with our yoga classes.</p>
            <button className="mt-4 px-4 py-2 bg-primary text-white rounded">Learn More</button>
          </div>
        </div>
        
        <div className="border rounded-lg overflow-hidden shadow-sm">
          <div className="h-48 bg-gray-200"></div>
          <div className="p-4">
            <h3 className="text-xl font-semibold">Cardio</h3>
            <p className="text-gray-600 mt-2">Burn calories and improve cardiovascular health with our high-energy sessions.</p>
            <button className="mt-4 px-4 py-2 bg-primary text-white rounded">Learn More</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassesPage;
