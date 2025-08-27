import React from 'react'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './contexts/ProtectedRoute';
import SignupPage from './pages/SignUpPage/SignUpPage';
import LoginPage from './pages/LoginPage/LoginPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import Navbar from './components/Navbar/Navbar';

// A simple placeholder for the home page
const HomePage = () => (
  <div className="p-8 text-center">
    <h1 className="text-4xl font-bold">Welcome to MyApp</h1>
    <p className="mt-4">Navigate using the links in the header.</p>
  </div>
);

export default function App() {
  return (
    <AuthProvider>
      <Router>
        {/* Place Navbar here so it's visible on every page */}
        <Navbar />

        {/* Wrap page content in a main tag for semantics and styling */}
        <main>
          <Routes>
            {/* Added a Home page route */}
            <Route path="/" element={<HomePage />} />
            
            <Route 
              path="/signup" 
              element={
                <ProtectedRoute requireAuth={false}>
                  <SignupPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/login" 
              element={
                <ProtectedRoute requireAuth={false}>
                  <LoginPage />
                </ProtectedRoute>
              } 
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute requireAuth={true}>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </Router>
    </AuthProvider>
  );
}