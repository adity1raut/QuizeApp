import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import SignupForm from '../../components/SignupForm';
import OtpForm from '../../components/OtpForm';
import Message from '../../components/Message';

const SignupPage = () => {
  const [view, setView] = useState('signup');
  const [userEmail, setUserEmail] = useState('');
  const [message, setMessage] = useState({ text: '', isError: false });
  const navigate = useNavigate();

  const handleSignupSuccess = (email) => {
    setUserEmail(email);
    setView('otp');
  };

  const handleVerificationSuccess = (successMessage) => {
    setMessage({ 
      text: successMessage + ' Redirecting to login...', 
      isError: false 
    });
    setTimeout(() => {
      navigate('/login');
    }, 2000);
  };

  const handleGoBack = () => {
    setUserEmail('');
    setView('signup');
    setMessage({ text: '', isError: false });
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen font-sans">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg relative overflow-hidden">
        {view === 'signup' ? (
          <SignupForm 
            onSignupSuccess={handleSignupSuccess} 
            setGlobalMessage={setMessage} 
          />
        ) : (
          <OtpForm 
            email={userEmail} 
            onVerificationSuccess={handleVerificationSuccess} 
            setGlobalMessage={setMessage} 
            onGoBack={handleGoBack} 
          />
        )}
        
        <Message message={message} />
      </div>
    </div>
  );
};

export default SignupPage;