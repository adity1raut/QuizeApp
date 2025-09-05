import React from 'react';

const StatsHeader = ({ isOwnStats }) => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-white">
        {isOwnStats ? 'Your Statistics' : 'User Statistics'}
      </h1>
      <p className="text-gray-400 mt-2">
        {isOwnStats ? 'Track your quiz performance and progress' : 'Performance overview'}
      </p>
    </div>
  );
};

export default StatsHeader;