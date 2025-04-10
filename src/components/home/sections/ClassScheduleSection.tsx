
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface ClassProps {
  day: string;
  time: string;
  instructor: string;
}

const ClassItem = ({ day, time, instructor }: ClassProps) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg grid grid-cols-1 md:grid-cols-3 items-center gap-4">
      <div>
        <h4 className="text-xl font-bold">{day}</h4>
        <p className="text-yellow-500">{time}</p>
      </div>
      <div className="text-center">
        <p className="text-gray-300">Instructor: {instructor}</p>
      </div>
      <div className="flex justify-end">
        <Link to="/book-class" className="border-2 border-yellow-500 hover:bg-yellow-500 hover:text-black text-yellow-500 font-bold py-2 px-4 rounded-md transition-colors">
          Book Class
        </Link>
      </div>
    </div>
  );
};

const ClassScheduleSection = () => {
  const [activeTab, setActiveTab] = useState('zumba');
  
  const zumbaClasses = [
    { day: 'Monday', time: '6:30 AM - 7:30 AM', instructor: 'Anjali Kapoor' },
    { day: 'Wednesday', time: '6:30 PM - 7:30 PM', instructor: 'Anjali Kapoor' },
    { day: 'Saturday', time: '10:00 AM - 11:00 AM', instructor: 'Anjali Kapoor' },
  ];
  
  const yogaClasses = [
    { day: 'Tuesday', time: '7:00 AM - 8:00 AM', instructor: 'Priya Patel' },
    { day: 'Thursday', time: '6:00 PM - 7:00 PM', instructor: 'Priya Patel' },
    { day: 'Sunday', time: '9:00 AM - 10:00 AM', instructor: 'Priya Patel' },
  ];
  
  const hiitClasses = [
    { day: 'Monday', time: '5:30 PM - 6:30 PM', instructor: 'Vikram Singh' },
    { day: 'Wednesday', time: '5:30 PM - 6:30 PM', instructor: 'Vikram Singh' },
    { day: 'Friday', time: '5:30 PM - 6:30 PM', instructor: 'Vikram Singh' },
  ];
  
  const strengthClasses = [
    { day: 'Tuesday', time: '6:30 PM - 7:30 PM', instructor: 'Rahul Sharma' },
    { day: 'Thursday', time: '6:30 PM - 7:30 PM', instructor: 'Rahul Sharma' },
    { day: 'Saturday', time: '5:00 PM - 6:00 PM', instructor: 'Rahul Sharma' },
  ];

  return (
    <section id="classes" className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold mb-2">CLASS <span className="text-yellow-500">SCHEDULE</span></h2>
          <p className="text-lg text-gray-300 mt-4">Join our specialized classes led by expert trainers to enhance your fitness journey.</p>
        </div>
        
        <div className="mb-8">
          <div className="grid grid-cols-4 gap-4">
            <button
              onClick={() => setActiveTab('zumba')}
              className={`py-3 font-medium transition-colors ${activeTab === 'zumba' ? 'bg-yellow-500 text-black' : 'bg-gray-800 text-white hover:bg-gray-700'}`}
            >
              Zumba
            </button>
            <button
              onClick={() => setActiveTab('yoga')}
              className={`py-3 font-medium transition-colors ${activeTab === 'yoga' ? 'bg-yellow-500 text-black' : 'bg-gray-800 text-white hover:bg-gray-700'}`}
            >
              Yoga
            </button>
            <button
              onClick={() => setActiveTab('hiit')}
              className={`py-3 font-medium transition-colors ${activeTab === 'hiit' ? 'bg-yellow-500 text-black' : 'bg-gray-800 text-white hover:bg-gray-700'}`}
            >
              HIIT
            </button>
            <button
              onClick={() => setActiveTab('strength')}
              className={`py-3 font-medium transition-colors ${activeTab === 'strength' ? 'bg-yellow-500 text-black' : 'bg-gray-800 text-white hover:bg-gray-700'}`}
            >
              Strength
            </button>
          </div>
        </div>
        
        <div>
          {activeTab === 'zumba' && (
            <>
              <h3 className="text-2xl font-bold mb-6 text-yellow-500">Zumba Classes</h3>
              <div className="space-y-4">
                {zumbaClasses.map((classItem, index) => (
                  <ClassItem key={index} {...classItem} />
                ))}
              </div>
            </>
          )}
          
          {activeTab === 'yoga' && (
            <>
              <h3 className="text-2xl font-bold mb-6 text-yellow-500">Yoga Classes</h3>
              <div className="space-y-4">
                {yogaClasses.map((classItem, index) => (
                  <ClassItem key={index} {...classItem} />
                ))}
              </div>
            </>
          )}
          
          {activeTab === 'hiit' && (
            <>
              <h3 className="text-2xl font-bold mb-6 text-yellow-500">HIIT Classes</h3>
              <div className="space-y-4">
                {hiitClasses.map((classItem, index) => (
                  <ClassItem key={index} {...classItem} />
                ))}
              </div>
            </>
          )}
          
          {activeTab === 'strength' && (
            <>
              <h3 className="text-2xl font-bold mb-6 text-yellow-500">Strength Classes</h3>
              <div className="space-y-4">
                {strengthClasses.map((classItem, index) => (
                  <ClassItem key={index} {...classItem} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default ClassScheduleSection;
