import React, { useState } from "react";
import LoginForm from "../../components/LoginForm";
import Message from "../../components/Message";
import Sidebar from "../../components/Sidebar/Sidebar";
import { Shield, Sparkles } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const LoginPage = () => {
  const [message, setMessage] = useState({ text: "", isError: false });
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen flex font-sans">
      {/* Conditionally render Sidebar for authenticated users */}
      {isAuthenticated && <Sidebar />}

      {/* Main content area - adjusted for sidebar presence */}
      <div className={`flex flex-1 ${isAuthenticated ? "lg:ml-0" : ""}`}>
        {/* Left side - Decorative panel (hidden when sidebar is present on smaller screens) */}
        <div
          className={`hidden ${isAuthenticated ? "lg:flex lg:w-1/2" : "lg:flex lg:w-1/2"} bg-gradient-to-br from-gray-800 to-gray-900 relative overflow-hidden`}
        >
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iMS41Ij48cGF0aCBkPSJNMTUgMTV2MzBtMzAgMHYtMzBNMzAgMTV2MzBNMTUgMzBoMzBNMTUgMTVoMzAiLz48L2c+PC9zdmc+')] opacity-10"></div>

          <div className="relative z-10 flex flex-col justify-center items-center text-center px-16 text-white w-full">
            <div className="mb-8 p-4 bg-blue-600/20 rounded-full backdrop-blur-sm">
              <Shield size={48} className="text-blue-400" />
            </div>
            <h1 className="text-4xl font-bold mb-4">
              {isAuthenticated ? "Dashboard Access" : "Welcome Back"}
            </h1>
            <p className="text-gray-400 text-lg">
              {isAuthenticated
                ? "You're already logged in. Access your dashboard and manage your account."
                : "Secure access to your account with our advanced authentication system"}
            </p>

            <div className="flex mt-12 space-x-2">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center">
                  <Sparkles size={16} className="text-yellow-400 mr-2" />
                  <span className="text-sm text-gray-400">
                    Premium Security
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Animated background elements */}
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/10 rounded-full animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/3 w-24 h-24 bg-purple-500/10 rounded-full animate-pulse delay-1000"></div>
        </div>

        {/* Right side - Login form */}
        <div
          className={`w-full ${isAuthenticated ? "lg:w-1/2" : "lg:w-1/2"} flex items-center justify-center p-8 ${isAuthenticated ? "pt-20 lg:pt-8" : ""}`}
        >
          <div className="w-full max-w-md">
            {isAuthenticated ? (
              // Show a different message for authenticated users
              <div className="text-center text-white">
                <h2 className="text-2xl font-bold mb-4">Already Logged In</h2>
                <p className="text-gray-400 mb-6">
                  You are currently logged in. Use the sidebar to navigate to
                  different sections.
                </p>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-800 rounded-lg text-left">
                    <span className="text-sm text-gray-400">
                      Quick Actions:
                    </span>
                    <ul className="mt-2 space-y-1 text-sm">
                      <li>• Access your dashboard</li>
                      <li>• View your profile</li>
                      <li>• Take quizzes</li>
                      <li>• Check submissions</li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <LoginForm setGlobalMessage={setMessage} />
                <Message message={message} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
