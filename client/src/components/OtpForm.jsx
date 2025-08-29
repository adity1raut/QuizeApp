import React, { useState } from 'react';
import axios from 'axios';
import Spinner from './Spinner';
import { ArrowLeft, Mail, ShieldCheck, RotateCcw } from 'lucide-react';

const OtpForm = ({ email, onVerificationSuccess, setGlobalMessage, onGoBack }) => {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

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

  const handleResendOtp = async () => {
    setIsResending(true);
    setGlobalMessage({ text: '', isError: false });
    
    try {
      const response = await axios.post('/api/auth/resend-otp', { email });
      setGlobalMessage({ 
        text: response.data.message || 'New OTP sent to your email.', 
        isError: false 
      });
    } catch (error) {
      setGlobalMessage({ 
        text: 'Failed to resend OTP. Please try again.', 
        isError: true 
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(value);
  };

  return (
    <div className="bg-gray-900 text-gray-100 p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-800">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="bg-purple-600 p-3 rounded-full">
            <ShieldCheck size={30} className="text-white" />
          </div>
        </div>
        <h2 className="text-2xl font-bold">Verify Your Email</h2>
        <p className="text-gray-400 mt-2">
          Enter the 6-digit code sent to your email
        </p>
      </div>

      <div className="flex items-center justify-center p-3 mb-6 bg-gray-800 rounded-lg border border-gray-700">
        <Mail size={16} className="text-blue-400 mr-2" />
        <span className="text-sm font-medium text-gray-300">{email}</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="otpInput" className="text-sm font-medium text-gray-300">
            Verification Code
          </label>
          <div className="relative">
            <input
              id="otpInput"
              name="otp"
              type="text"
              inputMode="numeric"
              pattern="\d{6}"
              maxLength="6"
              required
              value={otp}
              onChange={handleOtpChange}
              className="w-full px-4 py-3 text-center text-xl tracking-[0.5em] bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              placeholder="••••••"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || otp.length !== 6}
          className="w-full flex justify-center items-center space-x-2 px-4 py-3 bg-purple-600 rounded-lg text-white font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition disabled:bg-purple-800 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Spinner />
          ) : (
            <>
              <ShieldCheck size={18} />
              <span>Verify & Continue</span>
            </>
          )}
        </button>
      </form>

      <div className="text-center mt-6">
        <button
          onClick={handleResendOtp}
          disabled={isResending}
          className="flex items-center justify-center space-x-1 text-sm text-blue-400 hover:text-blue-300 transition disabled:text-blue-700 disabled:cursor-not-allowed mx-auto"
        >
          <RotateCcw size={14} />
          <span>{isResending ? 'Sending...' : 'Resend Code'}</span>
        </button>
      </div>

      <button
        onClick={onGoBack}
        className="flex items-center justify-center space-x-1 text-sm text-gray-400 hover:text-gray-300 transition mt-6 mx-auto"
      >
        <ArrowLeft size={16} />
        <span>Go Back</span>
      </button>
    </div>
  );
}; 

export default OtpForm;