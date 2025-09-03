import React, { useState } from "react";
import LoginForm from "../../components/LoginForm";
import Message from "../../components/Message";
import { Shield, Sparkles } from "lucide-react";

const LoginPage = () => {
  const [message, setMessage] = useState({ text: "", isError: false });

  return (
    <div className="bg-gray-900 min-h-screen flex font-sans">
      {/* Left side - Decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-800 to-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iMS41Ij48cGF0aCBkPSJNMTUgMTV2MzBtMzAgMHYtMzBNMzAgMTV2MzBNMTUgMzBoMzBNMTUgMTVoMzAiLz48L2c+PC9zdmc+')] opacity-10"></div>

        <div className="relative z-10 flex flex-col justify-center items-center text-center px-16 text-white w-full">
          <div className="mb-8 p-4 bg-blue-600/20 rounded-full backdrop-blur-sm">
            <Shield size={48} className="text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Welcome Back</h1>
          <p className="text-gray-400 text-lg">
            Secure access to your account with our advanced authentication
            system
          </p>

          <div className="flex mt-12 space-x-2">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center">
                <Sparkles size={16} className="text-yellow-400 mr-2" />
                <span className="text-sm text-gray-400">Premium Security</span>
              </div>
            ))}
          </div>
        </div>

        {/* Animated background elements */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/3 w-24 h-24 bg-purple-500/10 rounded-full animate-pulse delay-1000"></div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <LoginForm setGlobalMessage={setMessage} />
          <Message message={message} />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
