import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  AlertCircle,
  Calendar,
  User,
  ArrowRight,
  BookOpen,
  Loader2,
  Star,
  BarChart3
} from 'lucide-react';

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const response = await axios.get('/api/quizzes');
      setQuizzes(response.data.quizzes);
    } catch (error) {
      setError('Failed to fetch quizzes');
      console.error('Error fetching quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-blue-500 animate-spin mx-auto" />
          <p className="mt-4 text-gray-300">Loading quizzes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-red-400 mb-2">Error Loading Quizzes</h3>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={fetchQuizzes}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center">
            <BookOpen className="h-10 w-10 mr-3 text-blue-400" />
            Quiz Portal
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Test your knowledge with our curated collection of quizzes. Select a quiz below to get started!
          </p>
        </div>
        
        {quizzes.length === 0 ? (
          <div className="text-center py-16 bg-gray-800 rounded-xl border border-gray-700">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-gray-700 rounded-full">
                <BookOpen className="h-8 w-8 text-gray-400" />
              </div>
            </div>
            <h3 className="text-xl font-medium text-gray-300 mb-2">No Quizzes Available</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              There are no active quizzes at the moment. Please check back later.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <BarChart3 className="h-6 w-6 mr-2 text-blue-400" />
                Active Quizzes
              </h2>
              <span className="text-sm text-gray-400 bg-gray-800 px-3 py-1 rounded-full">
                {quizzes.length} {quizzes.length === 1 ? 'Quiz' : 'Quizzes'}
              </span>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {quizzes.map((quiz) => (
                <div key={quiz._id} className="bg-gray-800 overflow-hidden shadow-lg rounded-xl border border-gray-700 hover:border-blue-500 transition-all duration-300 hover:translate-y-1">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold text-white line-clamp-2">{quiz.title}</h3>
                      {quiz.isPremium && (
                        <span className="flex items-center text-amber-400 text-sm bg-amber-900 bg-opacity-30 px-2 py-1 rounded-full">
                          <Star className="h-3 w-3 mr-1 fill-current" />
                          Premium
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm mb-5 line-clamp-3">{quiz.description}</p>
                    
                    <div className="flex items-center text-xs text-gray-500 mb-5">
                      <div className="flex items-center mr-4">
                        <User className="h-3 w-3 mr-1" />
                        <span>By: {quiz.createdBy.username}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>{new Date(quiz.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-400">
                        {quiz.questions.length} {quiz.questions.length === 1 ? 'Question' : 'Questions'}
                      </div>
                      <Link
                        to={`/quiz/${quiz._id}`}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors group"
                      >
                        Start Quiz
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default QuizList;