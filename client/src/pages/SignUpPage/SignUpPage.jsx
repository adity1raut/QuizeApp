import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SignupForm from "../../components/SignupForm";
import OtpForm from "../../components/OtpForm";
import Message from "../../components/Message";
import { ArrowLeft, Shield, UserPlus, Lock, Sparkles } from "lucide-react";

const SignupPage = () => {
  const [view, setView] = useState("signup");
  const [userEmail, setUserEmail] = useState("");
  const [message, setMessage] = useState({ text: "", isError: false });
  const navigate = useNavigate();

  const handleSignupSuccess = (email) => {
    setUserEmail(email);
    setView("otp");
    setMessage({ text: "", isError: false });
  };

  const handleVerificationSuccess = (successMessage) => {
    setMessage({
      text: successMessage + " Redirecting to login...",
      isError: false,
    });
    setTimeout(() => {
      navigate("/login");
    }, 2000);
  };

  const handleGoBack = () => {
    setUserEmail("");
    setView("signup");
    setMessage({ text: "", isError: false });
  };

  return (
    <div className="bg-gray-900 min-h-screen flex font-sans">
      {/* Left side - Decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-800 to-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iMS41Ij48cGF0aCBkPSJNMTUgMTV2MzBtMzAgMHYtMzBNMzAgMTV2MzBNMTUgMzBoMzBNMTUgMTVoMzAiLz48L2c+PC9zdmc+')] opacity-10"></div>

        <div className="relative z-10 flex flex-col justify-center items-center text-center px-16 text-white w-full">
          <div className="mb-8 p-4 bg-blue-600/20 rounded-full backdrop-blur-sm">
            {view === "signup" ? (
              <UserPlus size={48} className="text-blue-400" />
            ) : (
              <Shield size={48} className="text-purple-400" />
            )}
          </div>
          <h1 className="text-4xl font-bold mb-4">
            {view === "signup" ? "Create Your Account" : "Verify Your Identity"}
          </h1>
          <p className="text-gray-400 text-lg">
            {view === "signup"
              ? "Join our community and access exclusive features"
              : "Secure your account with two-factor authentication"}
          </p>

          <div className="flex flex-col mt-12 space-y-3">
            {[
              { icon: Lock, text: "End-to-end encryption" },
              { icon: Shield, text: "Advanced security protocols" },
              { icon: Sparkles, text: "Premium features" },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-center">
                <item.icon size={16} className="text-blue-400 mr-2" />
                <span className="text-sm text-gray-400">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Animated background elements */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/3 w-24 h-24 bg-purple-500/10 rounded-full animate-pulse delay-1000"></div>
      </div>

      {/* Right side - Form content */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white">
              {view === "signup" ? "Create Account" : "Verify Email"}
            </h1>
          </div>

          {view === "signup" ? (
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
    </div>
  );
};

export default SignupPage;
