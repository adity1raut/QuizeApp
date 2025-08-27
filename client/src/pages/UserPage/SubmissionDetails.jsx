
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const SubmissionDetails = () => {
  const { id } = useParams();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSubmission();
  }, [id]);

  const fetchSubmission = async () => {
    try {
      const response = await axios.get(`/api/submission/${id}`);
      setSubmission(response.data.submission);
    } catch (error) {
      setError('Failed to load submission details');
      console.error('Error fetching submission:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !submission) {
    return (
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-center">
            <div className="text-red-500">{error || 'Submission not found'}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Submission Details: {submission.quiz.title}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Submitted on {new Date(submission.submittedAt).toLocaleString()}
            </p>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Score</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <span className={`text-xl font-bold ${submission.score >= 70 ? 'text-green-600' : submission.score >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {submission.score}%
                  </span>
                  <span className="ml-2 text-gray-600">
                    ({submission.correctAnswers} out of {submission.totalQuestions} correct)
                  </span>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mt-8">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Question Details</h4>
          
          <div className="space-y-6">
            {submission.detailedResults.map((result, index) => (
              <div key={index} className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className={`px-4 py-3 ${result.isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
                  <h5 className="text-sm font-medium">
                    Question {index + 1}: {result.isCorrect ? 'Correct' : 'Incorrect'}
                  </h5>
                </div>
                <div className="px-4 py-4">
                  <p className="text-gray-800 font-medium mb-3">{result.questionText}</p>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-2">Your Answer</p>
                      <p className={`p-2 rounded ${result.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {result.userAnswer || 'Not answered'}
                      </p>
                    </div>
                    
                    {!result.isCorrect && (
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-2">Correct Answer</p>
                        <p className="p-2 rounded bg-green-100 text-green-800">
                          {result.correctAnswer}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            to="/submissions"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Back to Submissions
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SubmissionDetails;