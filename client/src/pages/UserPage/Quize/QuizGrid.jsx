import React from "react";
import { BarChart3 } from "lucide-react";
import QuizCard from "./QuizCard";

const QuizGrid = ({ quizzes }) => {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <BarChart3 className="h-6 w-6 mr-2 text-blue-400" />
          Available Quizzes
          <span className="ml-3 text-sm text-gray-400 bg-gray-700 px-3 py-1 rounded-full">
            {quizzes.length} {quizzes.length === 1 ? "Quiz" : "Quizzes"}
          </span>
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {quizzes.map((quiz) => (
          <QuizCard key={quiz._id} quiz={quiz} />
        ))}
      </div>
    </>
  );
};

export default QuizGrid;
