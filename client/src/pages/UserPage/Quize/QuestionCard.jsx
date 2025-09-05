import React from "react";
import { CheckCircle, Circle } from "lucide-react";

const QuestionCard = ({
  question,
  questionNumber,
  selectedAnswer,
  onAnswerSelect,
}) => {
  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-8 shadow-sm">
      <div className="flex items-start mb-6">
        <span className="bg-blue-600 h-10 w-10 rounded-full flex items-center justify-center text-white font-bold mr-4 flex-shrink-0">
          {questionNumber}
        </span>
        <h3 className="text-xl font-medium text-white pt-1.5">
          {question.questionText}
        </h3>
      </div>

      <div className="space-y-4">
        {question.options.map((option, index) => (
          <div
            key={index}
            className={`flex items-start p-4 rounded-lg cursor-pointer transition-all border ${
              selectedAnswer === option
                ? "bg-blue-900/30 border-blue-700/50"
                : "bg-gray-700/50 border-gray-600 hover:bg-gray-700/70 hover:border-gray-500"
            }`}
            onClick={() => onAnswerSelect(question._id, option)}
          >
            {selectedAnswer === option ? (
              <CheckCircle className="h-6 w-6 text-blue-400 mr-4 mt-0.5 flex-shrink-0" />
            ) : (
              <Circle className="h-6 w-6 text-gray-400 mr-4 mt-0.5 flex-shrink-0" />
            )}
            <label
              htmlFor={`option-${index}`}
              className="block text-gray-100 cursor-pointer select-none"
            >
              {option}
            </label>
            <input
              id={`option-${index}`}
              name="answer"
              type="radio"
              className="hidden"
              checked={selectedAnswer === option}
              onChange={() => onAnswerSelect(question._id, option)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;
