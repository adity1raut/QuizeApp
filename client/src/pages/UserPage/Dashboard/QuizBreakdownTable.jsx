import React from 'react';
import { BarChart3, Calendar } from 'lucide-react';

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const QuizBreakdownTable = ({ quizBreakdown }) => {
  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 shadow-sm">
      <div className="px-6 py-4 border-b border-gray-700">
        <div className="flex items-center">
          <BarChart3 className="text-gray-400 mr-3" size={24} />
          <h2 className="text-xl font-semibold text-white">Quiz Performance Breakdown</h2>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-750">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Quiz Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Attempts
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Best Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Average Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Last Attempt
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {quizBreakdown.map((quiz) => (
              <tr key={quiz._id} className="hover:bg-gray-750">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-white">{quiz.quizTitle}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">{quiz.attempts}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-green-400">{quiz.bestScore}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">{quiz.averageScore.toFixed(1)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300 flex items-center">
                    <Calendar size={16} className="mr-2 text-gray-500" />
                    {formatDate(quiz.lastAttempt)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QuizBreakdownTable;