import React from 'react';
import { BarChart3, User } from 'lucide-react';

const EmptyState = ({ isOwnStats, hasSubmissions = false }) => {
  if (hasSubmissions) {
    return (
      <div className="bg-gray-800 rounded-lg border border-gray-700 shadow-sm p-12 text-center">
        <BarChart3 size={48} className="mx-auto text-gray-500 mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">No Quiz Activity Yet</h3>
        <p className="text-gray-400">
          {isOwnStats 
            ? 'Start taking quizzes to see your performance statistics here.' 
            : 'This user hasn\'t taken any quizzes yet.'}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <User size={48} className="mx-auto text-gray-500 mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">No Statistics Available</h3>
        <p className="text-gray-400">No quiz submissions found for this user.</p>
      </div>
    </div>
  );
};

export default EmptyState;