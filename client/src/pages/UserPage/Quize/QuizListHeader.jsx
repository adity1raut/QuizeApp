import React from "react";
import { Brain } from "lucide-react";

const QuizListHeader = () => {
  return (
    <div className="text-center mb-12">
      <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-full mb-5">
        <Brain className="h-10 w-10 text-blue-400" />
      </div>
      <h1 className="text-4xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
        Quiz Portal
      </h1>
      <p className="text-gray-400 max-w-2xl mx-auto text-lg">
        Test your knowledge with our curated collection of quizzes. Select a
        quiz below to get started on your learning journey!
      </p>
    </div>
  );
};

export default QuizListHeader;