
import React from 'react';
import { Link } from 'react-router-dom';

const ServicesNavBar = () => {
  return (
    <div id="services" className="bg-gray-900 py-4 overflow-x-auto whitespace-nowrap">
      <div className="container mx-auto px-4">
        <div className="flex justify-center gap-4 md:gap-8">
          <Link to="/services/weight-training" className="text-yellow-500 hover:text-yellow-400 font-medium px-2">
            WEIGHT TRAINING
          </Link>
          <span className="text-gray-500">|</span>
          <Link to="/services/cardio" className="text-yellow-500 hover:text-yellow-400 font-medium px-2">
            CARDIO
          </Link>
          <span className="text-gray-500">|</span>
          <Link to="/services/strength-conditioning" className="text-yellow-500 hover:text-yellow-400 font-medium px-2">
            STRENGTH & CONDITIONING
          </Link>
          <span className="text-gray-500">|</span>
          <Link to="/services/bootcamp" className="text-yellow-500 hover:text-yellow-400 font-medium px-2">
            BOOTCAMP
          </Link>
          <span className="text-gray-500">|</span>
          <Link to="/services/aerobics" className="text-yellow-500 hover:text-yellow-400 font-medium px-2">
            AEROBICS
          </Link>
          <span className="text-gray-500">|</span>
          <Link to="/services/zumba" className="text-yellow-500 hover:text-yellow-400 font-medium px-2">
            ZUMBA
          </Link>
          <span className="text-gray-500">|</span>
          <Link to="/services/yoga" className="text-yellow-500 hover:text-yellow-400 font-medium px-2">
            YOGA
          </Link>
          <span className="text-gray-500">|</span>
          <Link to="/services/crossfit" className="text-yellow-500 hover:text-yellow-400 font-medium px-2">
            CROSSFIT TRAINING
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServicesNavBar;
