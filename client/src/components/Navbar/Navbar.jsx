import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "../../contexts/AuthContext";
import { 
  Menu, 
  X, 
  Home, 
  LogOut, 
  User, 
  BarChart3, 
  FileText, 
  ClipboardList,
  Shield
} from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, logout, loading, user, isAdmin, isUser } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const linkStyles = "flex items-center text-gray-300 hover:text-white transition-colors duration-200 py-2 px-3 rounded-md";
  const buttonStyles = "flex items-center justify-center py-2 px-4 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-300";
  const logoutButtonStyles = "flex items-center justify-center py-2 px-4 rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors duration-300";

  if (loading) {
    return (
      <header className="bg-gray-900 shadow-lg h-20 flex items-center sticky top-0 z-50"></header>
    );
  }

  // Admin Navbar
  const AdminNavbar = () => (
    <nav className="bg-gray-900 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/admin/dashboard" className="flex items-center text-2xl font-bold text-white">
            <Shield className="mr-2 h-6 w-6" />
            Admin Panel
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/admin/dashboard" className={linkStyles}>
              <BarChart3 className="mr-1 h-4 w-4" />
              Dashboard
            </Link>
            <Link to="/profile" className={linkStyles}>
              <User className="mr-1 h-4 w-4" />
              Profile
            </Link>
            <span className="text-gray-400 text-sm px-3 py-2">
              Welcome, {user?.name || user?.email}
            </span>
            <button onClick={handleLogout} className={logoutButtonStyles}>
              <LogOut className="mr-1 h-4 w-4" />
              Logout
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-gray-800 px-2 pt-2 pb-4 space-y-2 shadow-lg rounded-b-md">
            <Link 
              to="/admin/dashboard" 
              className={`block ${linkStyles}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <BarChart3 className="mr-2 h-5 w-5" />
              Dashboard
            </Link>
            <Link 
              to="/profile" 
              className={`block ${linkStyles}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <User className="mr-2 h-5 w-5" />
              Profile
            </Link>
            <div className="px-3 py-2 text-gray-400 text-sm border-t border-gray-700 mt-2">
              Welcome, {user?.name || user?.email}
            </div>
            <button 
              onClick={handleLogout} 
              className={`block w-full text-left ${logoutButtonStyles}`}
            >
              <LogOut className="mr-2 h-5 w-5" />
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );

  // User Navbar
  const UserNavbar = () => (
    <nav className="bg-gray-900 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center text-xl font-bold text-white">
            <Home className="mr-2 h-6 w-6" />
            MyApp
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className={linkStyles}>
              <Home className="mr-1 h-4 w-4" />
              Home
            </Link>
            <Link to="/quiz" className={linkStyles}>
              <FileText className="mr-1 h-4 w-4" />
              Quizzes
            </Link>
            <Link to="/submissions" className={linkStyles}>
              <ClipboardList className="mr-1 h-4 w-4" />
              My Submissions
            </Link>
            <Link to="/profile" className={linkStyles}>
              <User className="mr-1 h-4 w-4" />
              Profile
            </Link>
            <span className="text-gray-400 text-sm px-3 py-2">
              Hi, {user?.name || user?.email}
            </span>
            <button onClick={handleLogout} className={logoutButtonStyles}>
              <LogOut className="mr-1 h-4 w-4" />
              Logout
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-gray-800 px-2 pt-2 pb-4 space-y-2 shadow-lg rounded-b-md">
            <Link 
              to="/" 
              className={`block ${linkStyles}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Home className="mr-2 h-5 w-5" />
              Home
            </Link>
            <Link 
              to="/quiz" 
              className={`block ${linkStyles}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <FileText className="mr-2 h-5 w-5" />
              Quizzes
            </Link>
            <Link 
              to="/submissions" 
              className={`block ${linkStyles}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <ClipboardList className="mr-2 h-5 w-5" />
              My Submissions
            </Link>
            <Link 
              to="/profile" 
              className={`block ${linkStyles}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <User className="mr-2 h-5 w-5" />
              Profile
            </Link>
            <div className="px-3 py-2 text-gray-400 text-sm border-t border-gray-700 mt-2">
              Hi, {user?.name || user?.email}
            </div>
            <button 
              onClick={handleLogout} 
              className={`block w-full text-left ${logoutButtonStyles}`}
            >
              <LogOut className="mr-2 h-5 w-5" />
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );

  // Guest Navbar
  const GuestNavbar = () => (
    <nav className="bg-gray-900 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center text-xl font-bold text-white">
            <Home className="mr-2 h-6 w-6" />
            MyApp
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className={linkStyles}>
              <Home className="mr-1 h-4 w-4" />
              Home
            </Link>
            <Link to="/login" className={linkStyles}>
              Login
            </Link>
            <Link to="/signup" className={buttonStyles}>
              Register
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-gray-800 px-2 pt-2 pb-4 space-y-2 shadow-lg rounded-b-md">
            <Link 
              to="/" 
              className={`block ${linkStyles}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Home className="mr-2 h-5 w-5" />
              Home
            </Link>
            <Link 
              to="/login" 
              className={`block ${linkStyles}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Login
            </Link>
            <Link 
              to="/signup" 
              className={`block ${buttonStyles} mt-2`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );

  // Fallback Navbar for unknown roles
  const FallbackNavbar = () => (
    <nav className="bg-gray-900 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center text-xl font-bold text-white">
            <Home className="mr-2 h-6 w-6" />
            MyApp
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/profile" className={linkStyles}>
              <User className="mr-1 h-4 w-4" />
              Profile
            </Link>
            <span className="text-gray-400 text-sm px-3 py-2">
              Welcome, {user?.name || user?.email}
            </span>
            <button onClick={handleLogout} className={logoutButtonStyles}>
              <LogOut className="mr-1 h-4 w-4" />
              Logout
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-gray-800 px-2 pt-2 pb-4 space-y-2 shadow-lg rounded-b-md">
            <Link 
              to="/profile" 
              className={`block ${linkStyles}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <User className="mr-2 h-5 w-5" />
              Profile
            </Link>
            <div className="px-3 py-2 text-gray-400 text-sm border-t border-gray-700 mt-2">
              Welcome, {user?.name || user?.email}
            </div>
            <button 
              onClick={handleLogout} 
              className={`block w-full text-left ${logoutButtonStyles}`}
            >
              <LogOut className="mr-2 h-5 w-5" />
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );

  // Render appropriate navbar based on authentication status and role
  if (!isAuthenticated) {
    return <GuestNavbar />;
  }

  if (isAdmin()) {
    return <AdminNavbar />;
  }

  if (isUser()) {
    return <UserNavbar />;
  }

  return <FallbackNavbar />;
};

export default Navbar;