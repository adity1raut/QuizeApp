import React from 'react';

const Message = ({ message }) => {
  if (!message.text) return null;

  return (
    <div className={`mt-4 text-center text-sm font-medium ${
      message.isError ? 'text-red-600' : 'text-green-600'
    }`}>
      {message.text}
    </div>
  );
};

export default Message;