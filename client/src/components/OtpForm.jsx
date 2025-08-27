import React, { useState } from 'react';
import axios from 'axios';
import Spinner from './Spinner';

const OtpForm = ({ email, onVerificationSuccess, setGlobalMessage, onGoBack }) => {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGlobalMessage({ text: '', isError: false });
    setIsLoading(true);

    try {
      const response = await axios.post('/api/auth/verify-otp', {
        email,
        otp,
      });

      // Axios automatically parses JSON response
      onVerificationSuccess(response.data.message);
    } catch (error) {
      // Handle different types of errors
      if (error.response) {
        // Server responded with error status
        setGlobalMessage({ 
          text: error.response.data.message || 'OTP verification failed.', 
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
        Verify Your Email
      </h2>
      <p className="text-center text-gray-600 mt-2">
        An OTP has been sent to <strong>{email}</strong>.
      </p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div>
          <label htmlFor="otpInput" className="text-sm font-medium text-gray-700">
            Enter 6-Digit OTP
          </label>
          <input
            id="otpInput"
            name="otp"
            type="text"
            pattern="\d{6}"
            maxLength="6"
            required
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full px-3 py-2 mt-1 text-center text-lg tracking-[0.5em] border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center items-center px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition disabled:bg-green-400"
        >
          {isLoading ? <Spinner /> : 'Verify & Create Account'}
        </button>
      </form>
      <button
        onClick={onGoBack}
        className="text-center w-full mt-4 text-sm text-blue-600 hover:underline"
      >
        Go Back
      </button>
    </div>
  );
};

export default OtpForm;