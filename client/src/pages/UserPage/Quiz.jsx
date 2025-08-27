
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Quiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchQuiz();
  }, [id]);

  const fetchQuiz = async () => {
    try {
      const response = await axios.get(`/api/quiz/${id}/start`);
      setQuiz(response.data.quiz);
    } catch (error) {
      setError('Failed to load quiz');
      console.error('Error fetching quiz:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionId, selectedAnswer) => {
    setAnswers({
      ...answers,
      [questionId]: selectedAnswer
    });
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // Format answers for submission
      const formattedAnswers = Object.entries(answers).map(([questionId, selectedAnswer]) => ({
        questionId,
        selectedAnswer
      }));

      const response = await axios.post(`/api/quiz/${id}/submit`, {
        answers: formattedAnswers
      });

      navigate(`/results/${response.data.results.submissionId}`);
    } catch (error) {
      if (error.response?.data?.previousScore) {
        alert(`You've already submitted this quiz. Your previous score was ${error.response.data.previousScore}%`);
        navigate('/');
      } else {
        setError('Failed to submit quiz');
        console.error('Error submitting quiz:', error);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-center">
            <div className="text-red-500">{error || 'Quiz not found'}</div>
          </div>
        </div>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{quiz.title}</h2>
          <p className="text-gray-600">{quiz.description}</p>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">
              Question {currentQuestion + 1} of {quiz.questions.length}
            </span>
            <span className="text-sm font-medium text-gray-700">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {question.questionText}
          </h3>
          
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <div key={index} className="flex items-center">
                <input
                  id={`option-${index}`}
                  name="answer"
                  type="radio"
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                  checked={answers[question._id] === option}
                  onChange={() => handleAnswerSelect(question._id, option)}
                />
                <label
                  htmlFor={`option-${index}`}
                  className="ml-3 block text-sm font-medium text-gray-700"
                >
                  {option}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className={`px-4 py-2 rounded-md text-sm font-medium ${currentQuestion === 0 
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            Previous
          </button>
          
          {currentQuestion < quiz.questions.length - 1 ? (
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting || Object.keys(answers).length < quiz.questions.length}
              className={`px-4 py-2 rounded-md text-sm font-medium ${submitting || Object.keys(answers).length < quiz.questions.length
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                : 'bg-green-600 text-white hover:bg-green-700'}`}
            >
              {submitting ? 'Submitting...' : 'Submit Quiz'}
            </button>
          )}
        </div>

        {/* Answer status */}
        <div className="mt-6">
          <p className="text-sm text-gray-600">
            Answered: {Object.keys(answers).length} / {quiz.questions.length} questions
          </p>
        </div>
      </div>
    </div>
  );
};

export default Quiz;