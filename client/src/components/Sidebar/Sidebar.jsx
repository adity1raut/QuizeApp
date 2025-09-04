import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Menu, X, Home, MessageSquare, User, LogOut, LogIn, UserPlus, 
  Shield, BarChart3, FileText, ClipboardList, Brain
} from "lucide-react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from "../../contexts/AuthContext";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const location = useLocation();
  const navigate = useNavigate();
  const { 
    logout, 
    adminLogout, 
    isAuthenticated, 
    loading, 
    userType, 
    isAdmin, 
    isUser,
    user 
  } = useAuth();

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    try {
      if (isAdmin()) {
        await adminLogout();
      } else {
        await logout();
      }
      toast.success("Successfully logged out!");
      navigate("/login");
      if (isMobile) setIsOpen(false);
    } catch (error) {
      toast.error("Failed to logout. Please try again.");
    }
  };

  const handleNavigation = () => {
    if (isMobile) setIsOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getNavLinks = () => {
    if (!isAuthenticated) {
      return [
        { to: "/", icon: Home, label: "Home" },
        { to: "/login", icon: LogIn, label: "Login" },
        { to: "/signup", icon: UserPlus, label: "Sign Up" }
      ];
    }

    if (isAdmin()) {
      return [
        { to: "/admin/dashboard", icon: BarChart3, label: "Dashboard" },
        { to: "/admin/users", icon: User, label: "User Management" },
        { to: "/admin/leaderboard", icon: BarChart3, label: "Leaderboard" },
        { to: "/profile", icon: User, label: "Profile" }
      ];
    }

    if (isUser()) {
      return [
        { to: "/", icon: Home, label: "Home" },
        { to: "/quiz", icon: Brain, label: "Quizzes" },
        { to: "/submissions", icon: ClipboardList, label: "My Submissions" },
        { to: "/dhashboard", icon: BarChart3, label: "Dhashboard" },
        { to: "/profile", icon: User, label: "Profile" }
      ];
    }

    return [{ to: "/profile", icon: User, label: "Profile" }];
  };

  const getBrandName = () => {
    if (isAdmin()) return "Admin Panel";
    if (isUser()) return "QuizeApp";
    return "QuizeApp";
  };

  const getBrandIcon = () => {
    if (isAdmin()) return Shield;
    if (isUser()) return Brain;
    return Home;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8 text-gray-400 fixed left-0 top-0 w-64 h-full bg-gradient-to-b from-gray-900 to-gray-800 z-50">
        <div className="animate-pulse flex items-center">
          <div className="h-4 w-4 bg-blue-500 rounded-full mr-2"></div>
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  const navLinks = getNavLinks();
  const BrandIcon = getBrandIcon();

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Mobile Header */}
      <div className="fixed top-0 left-0 w-full p-4 flex items-center z-40 lg:hidden bg-gradient-to-r from-gray-900 to-gray-800 shadow-md">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 mr-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-gray-700 transition-colors"
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <span className="text-white text-xl font-bold flex items-center">
          <BrandIcon className="mr-2 h-6 w-6 text-blue-400" />
          {getBrandName()}
        </span>
      </div>
      
      <div className="h-16 lg:hidden"></div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-gray-900 to-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out z-50 
                  ${isOpen ? "translate-x-0" : "-translate-x-full"} 
                  lg:translate-x-0 lg:static lg:w-64 h-screen 
                  ${isMobile ? "pt-16" : ""}`}
      >
        {/* Desktop Header */}
        <div className="p-6 border-b border-gray-700 hidden lg:block">
          <Link to="/" className="text-white text-2xl font-bold flex items-center">
            <BrandIcon className="mr-2 h-7 w-7 text-blue-400" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              {getBrandName()}
            </span>
          </Link>
        </div>

        <div className="p-4 space-y-1 overflow-y-auto" style={{ maxHeight: "calc(100% - 160px)" }}>
          {navLinks.map(({ to, icon: Icon, label }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center p-3 text-gray-300 hover:bg-gray-750 hover:text-white rounded-lg transition-all duration-200 group ${
                isActive(to) 
                  ? "bg-gradient-to-r from-blue-900/40 to-blue-800/30 text-white border-l-4 border-blue-500" 
                  : "hover:border-l-4 hover:border-gray-600"
              }`}
              onClick={handleNavigation}
            >
              <Icon 
                size={18} 
                className={`mr-3 transition-colors ${
                  isActive(to) ? "text-blue-400" : "text-gray-400 group-hover:text-white"
                }`} 
              />
              <span className="font-medium">{label}</span>
            </Link>
          ))}
        </div>

        {/* Bottom Section */}
        {isAuthenticated && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700 bg-gray-850/50 backdrop-blur-sm">
            {user && (
              <div className="text-gray-400 text-sm mb-3 px-3 truncate">
                <span className="font-medium text-gray-300">
                  {isAdmin() ? "Welcome" : "Hi"}, {user?.name || user?.email}
                </span>
              </div>
            )}
            <button
              className="w-full flex items-center p-3 text-gray-300 hover:bg-red-900/40 hover:text-white rounded-lg transition-all duration-200 group"
              onClick={handleLogout}
            >
              <LogOut size={18} className="mr-3 text-gray-400 group-hover:text-white" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        )}
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden backdrop-blur-sm"
        />
      )}
    </>
  );
};

export default Sidebar;