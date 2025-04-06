import React from 'react';
import { Link } from 'react-router-dom'; // Assuming you're using react-router-dom for routing

const UnAuthorized = () => {
  return (
    <div className="flex justify-center items-center h-screen ">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-4xl font-bold text-red-500 mb-4">Unauthorized Access</h1>
        <p className="text-lg text-gray-700 mb-6">
          You don't have permission to view this page. Please log in or contact support.
        </p>
        <Link to="/login" className="text-blue-500 hover:text-blue-700 font-semibold">
          Go to Login Page
        </Link>
      </div>
    </div>
  );
};

export default UnAuthorized;
