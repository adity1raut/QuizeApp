import React, { useState } from 'react';
import LoginForm from '../../components/LoginForm';
import Message from '../../components/Message';


const LoginPage = () => {
  const [message, setMessage] = useState({ text: '', isError: false });

  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen font-sans">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg relative overflow-hidden">
        <LoginForm setGlobalMessage={setMessage} />
        <Message message={message} />
      </div>
    </div>
  );
};

export default LoginPage;