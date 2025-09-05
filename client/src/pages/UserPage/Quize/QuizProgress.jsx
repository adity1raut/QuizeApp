import React from "react";

const QuizProgress = ({
  currentQuestion,
  totalQuestions,
  answers,
  onQuestionNav,
}) => {
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-8 shadow-sm">
      <div className="flex justify-between mb-4">
        <span className="text-sm font-medium text-gray-300">
          Question {currentQuestion + 1} of {totalQuestions}
        </span>
        <span className="text-sm font-medium text-gray-300">
          {Math.round(progress)}% Complete
        </span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4">
        <div
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Question navigation dots */}
      <div className="flex justify-center space-x-2">
        {Array.from({ length: totalQuestions }).map((_, index) => (
          <button
            key={index}
            onClick={() => onQuestionNav(index)}
            className={`h-2 w-2 rounded-full transition-all ${
              answers[index]
                ? "bg-green-400"
                : index === currentQuestion
                  ? "bg-blue-400"
                  : "bg-gray-600 hover:bg-gray-500"
            }`}
            title={`Question ${index + 1}: ${answers[index] ? "Answered" : "Unanswered"}`}
          />
        ))}
      </div>
    </div>
  );
};

export default QuizProgress;
