
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "../../contexts/AuthContext";

const Navbar = () => {
  const { isAuthenticated, logout, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  
  // You can define common styles to keep the JSX cleaner
  const linkStyles = "text-gray-300 hover:text-white transition-colors duration-200";
  const buttonStyles = "py-2 px-4 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-300";

  if (loading) {
    return (
      <header className="bg-gray-900 shadow-md h-20 flex items-center"></header>
    );
  }

  return (
    <nav className="bg-gray-900 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo or App Name */}
        <Link to="/" className="text-2xl font-bold text-white">
          MyApp
        </Link>

        {/* Navigation Links */}
        <ul className="flex items-center space-x-6">
          <li>
            <Link to="/" className={linkStyles}>
              Home
            </Link>
          </li>
          
          {isAuthenticated ? (
            // Authenticated User Links
            <>
              <li>
                <Link to="/profile" className={linkStyles}>
                  Profile
                </Link>
              </li>
              <li>
                <button onClick={handleLogout} className={buttonStyles}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            // Guest User Links
            <>
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
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;