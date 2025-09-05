import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-400">Loading statistics...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;