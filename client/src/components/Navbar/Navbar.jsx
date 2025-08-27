import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "../../contexts/AuthContext";

const Navbar = () => {
  const { isAuthenticated, logout, loading, user, isAdmin, isUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const linkStyles = "text-gray-300 hover:text-white transition-colors duration-200";
  const buttonStyles = "py-2 px-4 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-300";
  const logoutButtonStyles = "py-2 px-4 rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors duration-300";

  if (loading) {
    return (
      <header className="bg-gray-900 shadow-md h-20 flex items-center"></header>
    );
  }

  // Admin Navbar
  const AdminNavbar = () => (
    <nav className="bg-gray-900 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/admin/dashboard" className="text-2xl font-bold text-white">
          Admin Panel
        </Link>

        <ul className="flex items-center space-x-6">
          <li>
            <Link to="/admin/dashboard" className={linkStyles}>
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/profile" className={linkStyles}>
              Profile
            </Link>
          </li>
          <li>
            <span className="text-gray-400 text-sm">
              Welcome, {user?.name || user?.email}
            </span>
          </li>
          <li>
            <button onClick={handleLogout} className={logoutButtonStyles}>
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
  const UserNavbar = () => (
    <nav className="bg-gray-900 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-white">
          MyApp
        </Link>

        <ul className="flex items-center space-x-6">
          <li>
            <Link to="/" className={linkStyles}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/quiz/:id" className={linkStyles}>
              Quizzes
            </Link>
          </li>
          <li>
            <Link to="/submissions" className={linkStyles}>
              My Submissions
            </Link>
          </li>
          <li>
            <Link to="/profile" className={linkStyles}>
              Profile
            </Link>
          </li>
          <li>
            <span className="text-gray-400 text-sm">
              Hi, {user?.name || user?.email}
            </span>
          </li>
          <li>
            <button onClick={handleLogout} className={logoutButtonStyles}>
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );

  // Guest Navbar
  const GuestNavbar = () => (
    <nav className="bg-gray-900 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-white">
          MyApp
        </Link>

        <ul className="flex items-center space-x-6">
          <li>
            <Link to="/" className={linkStyles}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/login" className={linkStyles}>
              Login
            </Link>
          </li>
          <li>
            <Link to="/signup" className={buttonStyles}>
              Register
            </Link>
          </li>
        </ul>
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

  // Fallback for unknown roles
  return (
    <nav className="bg-gray-900 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-white">
          MyApp
        </Link>
        <ul className="flex items-center space-x-6">
          <li>
            <Link to="/profile" className={linkStyles}>
              Profile
            </Link>
          </li>
          <li>
            <span className="text-gray-400 text-sm">
              Welcome, {user?.name || user?.email}
            </span>
          </li>
          <li>
            <button onClick={handleLogout} className={logoutButtonStyles}>
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;