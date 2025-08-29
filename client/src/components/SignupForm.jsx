import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Spinner from './Spinner';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, UserPlus } from 'lucide-react';

const SignupForm = ({ onSignupSuccess, setGlobalMessage }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
    <div className="bg-gray-900 text-gray-100 p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-800">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="bg-blue-600 p-3 rounded-full">
            <UserPlus size={30} className="text-white" />
          </div>
        </div>
        <h2 className="text-2xl font-bold">Create Your Account</h2>
        <p className="text-gray-400 mt-2">Join us and start your journey</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="signupUsername" className="text-sm font-medium text-gray-300">
            Username
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User size={18} className="text-gray-500" />
            </div>
            <input
              id="signupUsername"
              name="username"
              type="text"
              required
              value={formData.username}
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Enter your username"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="signupEmail" className="text-sm font-medium text-gray-300">
            Email address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail size={18} className="text-gray-500" />
            </div>
            <input
              id="signupEmail"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Enter your email"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="signupPassword" className="text-sm font-medium text-gray-300">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock size={18} className="text-gray-500" />
            </div>
            <input
              id="signupPassword"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-10 pr-10 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Create a password"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-400"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center items-center space-x-2 px-4 py-3 bg-blue-600 rounded-lg text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition disabled:bg-blue-800 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Spinner />
          ) : (
            <>
              <UserPlus size={18} />
              <span>Create Account</span>
            </>
          )}
        </button>
      </form>

      <div className="text-center mt-8 pt-6 border-t border-gray-800">
        <p className="text-sm text-gray-400">
          Already have an account?{' '}
          <Link 
            to="/login" 
            className="inline-flex items-center text-blue-400 hover:text-blue-300 font-medium transition group"
          >
            Sign in here
            <ArrowRight size={14} className="ml-1 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;