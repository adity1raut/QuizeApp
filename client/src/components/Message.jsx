// import React from 'react';

// const Message = ({ message }) => {
//   if (!message.text) return null;

//   return (
//     <div className={`mt-4 text-center text-sm font-medium ${
//       message.isError ? 'text-red-600' : 'text-green-600'
//     }`}>
//       {message.text}
//     </div>
//   );
// };

// export default Message;

import React, { useEffect, useState } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

const Message = ({ message, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message.text) {
      setIsVisible(true);

      // Auto-dismiss after 5 seconds unless it's an error (errors stay longer)
      const timer = setTimeout(() => {
        if (!message.isError) {
          handleDismiss();
        }
      }, 5000);

      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [message.text, message.isError]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => {
      if (onDismiss) onDismiss();
    }, 300);
  };

  if (!message.text || !isVisible) return null;

  const messageConfig = {
    error: {
      icon: <AlertCircle size={20} />,
      bg: "bg-red-900/30",
      border: "border-red-800",
      text: "text-red-200",
      iconColor: "text-red-400",
    },
    success: {
      icon: <CheckCircle size={20} />,
      bg: "bg-green-900/30",
      border: "border-green-800",
      text: "text-green-200",
      iconColor: "text-green-400",
    },
    info: {
      icon: <Info size={20} />,
      bg: "bg-blue-900/30",
      border: "border-blue-800",
      text: "text-blue-200",
      iconColor: "text-blue-400",
    },
  };

  const type = message.isError ? "error" : message.isInfo ? "info" : "success";
  const config = messageConfig[type];

  return (
    <div
      className={`fixed top-4 right-4 left-4 md:left-auto z-50 animate-fade-in-down`}
    >
      <div
        className={`flex items-start p-4 rounded-lg border ${config.bg} ${config.border} backdrop-blur-sm shadow-lg max-w-md mx-auto md:mx-0`}
      >
        <div className={`flex-shrink-0 mt-0.5 ${config.iconColor}`}>
          {config.icon}
        </div>
        <div className={`ml-3 flex-1 ${config.text}`}>
          <p className="text-sm font-medium">{message.text}</p>
        </div>
        <button
          onClick={handleDismiss}
          className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-300 transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default Message;
