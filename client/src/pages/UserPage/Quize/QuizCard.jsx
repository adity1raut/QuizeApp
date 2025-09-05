import React from "react";
import { Link } from "react-router-dom";
import {
  User,
  Calendar,
  BookOpen,
  Clock,
  ArrowRight,
  Star,
} from "lucide-react";

const QuizCard = ({ quiz }) => {
  return (
    <div className="bg-gray-800/70 backdrop-blur-sm overflow-hidden shadow-xl rounded-2xl border border-gray-700 hover:border-blue-500/50 transition-all duration-300 hover:scale-[1.02] group">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-white line-clamp-2 group-hover:text-blue-300 transition-colors">
            {quiz.title}
          </h3>
          {quiz.isPremium && (
            <span className="flex items-center text-amber-400 text-sm bg-amber-900/30 px-2.5 py-1 rounded-full border border-amber-700/50">
              <Star className="h-3.5 w-3.5 mr-1 fill-current" />
              Premium
            </span>
          )}
        </div>
        <p className="text-gray-400 text-sm mb-5 line-clamp-3">
          {quiz.description}
        </p>

        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center text-xs text-gray-500">
            <div className="flex items-center mr-4">
              <User className="h-3.5 w-3.5 mr-1.5" />
              <span>{quiz.createdBy.username}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-3.5 w-3.5 mr-1.5" />
              <span>{new Date(quiz.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-sm text-gray-400">
            <BookOpen className="h-4 w-4 mr-1.5" />
            <span>
              {quiz.questions.length}{" "}
              {quiz.questions.length === 1 ? "Question" : "Questions"}
            </span>
          </div>
          {quiz.timeLimit && (
            <div className="flex items-center text-sm text-gray-400">
              <Clock className="h-4 w-4 mr-1.5" />
              <span>{quiz.timeLimit} min</span>
            </div>
          )}
        </div>

        <Link
          to={`/quiz/${quiz._id}`}
          className="w-full inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg hover:shadow-blue-500/20 group/btn"
        >
          Start Quiz
          <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default QuizCard;
