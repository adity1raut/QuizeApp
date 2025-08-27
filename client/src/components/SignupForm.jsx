import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Spinner from './Spinner';

const SignupForm = ({ onSignupSuccess, setGlobalMessage }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGlobalMessage({ text: '', isError: false });
    setIsLoading(true);

    try {
      const response = await axios.post('/api/auth/signup', formData);

      // Axios automatically parses JSON response
      setGlobalMessage({ text: response.data.message, isError: false });
      onSignupSuccess(formData.email);
    } catch (error) {
      // Handle different types of errors
      if (error.response) {
        // Server responded with error status
        setGlobalMessage({ 
          text: error.response.data.message || 'Signup failed.', 
          isError: true 
        });
      } else if (error.request) {
        // Network error
        setGlobalMessage({ 
          text: 'Network error. Please check your connection.', 
          isError: true 
        });
      } else {
        // Other errors
        setGlobalMessage({ 
          text: 'An error occurred. Please try again.', 
          isError: true 
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-center text-gray-800">
        Create a New Account
      </h2>
      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div>
          <label htmlFor="signupUsername" className="text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            id="signupUsername"
            name="username"
            type="text"
            required
            value={formData.username}
            onChange={handleChange}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="signupEmail" className="text-sm font-medium text-gray-700">
            Email address
          </label>
          <input
            id="signupEmail"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="signupPassword" className="text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="signupPassword"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center items-center px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition disabled:bg-blue-400"
        >
          {isLoading ? <Spinner /> : 'Send Verification Code'}
        </button>
      </form>

      <div className="text-center mt-6">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link 
            to="/login" 
            className="text-blue-600 hover:underline font-medium"
          >
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;