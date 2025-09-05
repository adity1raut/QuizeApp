import React from "react";
import { ChevronLeft, Brain, Clock } from "lucide-react";

const QuizHeader = ({ quiz, timeRemaining, onBack }) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="mb-8">
      <button
        onClick={onBack}
        className="flex items-center text-gray-400 hover:text-white transition-colors mb-6 group"
      >
        <ChevronLeft className="h-5 w-5 mr-1 group-hover:-translate-x-1 transition-transform" />
        Back to Quizzes
      </button>

      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
              <Brain className="h-8 w-8 mr-3 text-blue-400" />
              {quiz.title}
            </h1>
            <p className="text-gray-400">{quiz.description}</p>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center text-gray-300 bg-gray-700/50 px-3 py-2 rounded-lg">
              <Clock className="h-5 w-5 mr-2 text-blue-400" />
              <span>{quiz.questions.length} questions</span>
            </div>
            
            {timeRemaining !== null && (
              <div className={`flex items-center px-3 py-2 rounded-lg ${
                timeRemaining < 60 ? 'bg-red-900/30 text-red-300' : 'bg-blue-900/30 text-blue-300'
              }`}>
                <Clock className="h-5 w-5 mr-2" />
                <span className="font-mono">{formatTime(timeRemaining)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizHeader;