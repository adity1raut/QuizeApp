import React, { useState } from 'react';

// You can place this in a separate config file in a larger application
const API_BASE_URL = 'http://localhost:4000/api';

// A simple reusable spinner component
const Spinner = () => (
    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

// --- Signup Form Component ---
const SignupForm = ({ onSignupSuccess, setGlobalMessage }) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setGlobalMessage({ text: '', isError: false });
        setIsLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (response.ok) {
                setGlobalMessage({ text: result.message, isError: false });
                onSignupSuccess(formData.email); // Pass email to parent to switch view
            } else {
                setGlobalMessage({ text: result.message || 'Signup failed.', isError: true });
            }
        } catch (error) {
            setGlobalMessage({ text: 'An error occurred. Please try again.', isError: true });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-center text-gray-800">Create a New Account</h2>
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <div>
                    <label htmlFor="signupUsername" className="text-sm font-medium text-gray-700">Username</label>
                    <input id="signupUsername" name="username" type="text" required value={formData.username} onChange={handleChange} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                    <label htmlFor="signupEmail" className="text-sm font-medium text-gray-700">Email address</label>
                    <input id="signupEmail" name="email" type="email" autoComplete="email" required value={formData.email} onChange={handleChange} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                    <label htmlFor="signupPassword" className="text-sm font-medium text-gray-700">Password</label>
                    <input id="signupPassword" name="password" type="password" autoComplete="new-password" required value={formData.password} onChange={handleChange} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition disabled:bg-blue-400">
                    {isLoading ? <Spinner /> : 'Send Verification Code'}
                </button>
            </form>
        </div>
    );
};

// --- OTP Verification Form Component ---
const OtpForm = ({ email, onVerificationSuccess, setGlobalMessage, onGoBack }) => {
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setGlobalMessage({ text: '', isError: false });
        setIsLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp }),
            });

            const result = await response.json();

            if (response.ok) {
                onVerificationSuccess(result.message);
            } else {
                setGlobalMessage({ text: result.message || 'OTP verification failed.', isError: true });
            }
        } catch (error) {
            setGlobalMessage({ text: 'An error occurred. Please try again.', isError: true });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-center text-gray-800">Verify Your Email</h2>
            <p className="text-center text-gray-600 mt-2">An OTP has been sent to <strong>{email}</strong>.</p>
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <div>
                    <label htmlFor="otpInput" className="text-sm font-medium text-gray-700">Enter 6-Digit OTP</label>
                    <input id="otpInput" name="otp" type="text" pattern="\d{6}" maxLength="6" required value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full px-3 py-2 mt-1 text-center text-lg tracking-[0.5em] border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition disabled:bg-green-400">
                    {isLoading ? <Spinner /> : 'Verify & Create Account'}
                </button>
            </form>
            <button onClick={onGoBack} className="text-center w-full mt-4 text-sm text-blue-600 hover:underline">Go Back</button>
        </div>
    );
};


// --- Main App Component ---
export default function App() {
    const [view, setView] = useState('signup'); // 'signup' or 'otp'
    const [userEmail, setUserEmail] = useState('');
    const [message, setMessage] = useState({ text: '', isError: false });

    const handleSignupSuccess = (email) => {
        setUserEmail(email);
        setView('otp');
    };

    const handleVerificationSuccess = (successMessage) => {
        setMessage({ text: successMessage + ' Redirecting to login...', isError: false });
        setTimeout(() => {
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
                    <SignupForm onSignupSuccess={handleSignupSuccess} setGlobalMessage={setMessage} />
                ) : (
                    <OtpForm email={userEmail} onVerificationSuccess={handleVerificationSuccess} setGlobalMessage={setMessage} onGoBack={handleGoBack} />
                )}

                {message.text && (
                    <div className={`mt-4 text-center text-sm font-medium ${message.isError ? 'text-red-600' : 'text-green-600'}`}>
                        {message.text}
                    </div>
                )}
            </div>
        </div>
    );
}
