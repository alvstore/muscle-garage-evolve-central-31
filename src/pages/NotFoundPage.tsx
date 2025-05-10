
import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="mt-2 text-xl">Page not found</p>
      <p className="mt-4 text-gray-500">The page you are looking for doesn't exist or has been moved.</p>
      <Link to="/" className="mt-6 px-4 py-2 bg-primary text-white rounded">
        Go to Homepage
      </Link>
    </div>
  );
};

export default NotFoundPage;
