
import React from "react";

const LoadingScreen: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="h-10 w-10 rounded-full border-4 border-t-blue-600 border-blue-200 animate-spin"></div>
      <span className="ml-3 text-gray-700 font-medium">Loading...</span>
    </div>
  );
};

export default LoadingScreen;
