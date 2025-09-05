import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Shield,
  Calendar,
  Save,
  Trash2,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Loader2,
  LogOut,
  Edit3,
  Key,
  Crown,
  Award,
  Star,
  Settings,
} from "lucide-react";

const ProfilePage = () => {
  const { user, loading, isAuthenticated, logout, checkAuthStatus } = useAuth();
  const navigate = useNavigate();

  // State for the update form
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  // State for handling messages and loading for the update/delete actions
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isUpdating, setIsUpdating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // When the user data from the context is available, populate the form
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        email: user.email,
        password: "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handler for the profile update form submission
  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setMessage({ text: "", type: "" });

    // Filter out the password if it's empty
    const updateData = {
      username: formData.username,
      email: formData.email,
    };
    if (formData.password) {
      updateData.password = formData.password;
    }

    try {
      const response = await axios.put("/api/auth/profile", updateData, {
        withCredentials: true,
      });

      setMessage({ text: response.data.message, type: "success" });
      setIsEditing(false);
      // Refresh the user data in the context after a successful update
      await checkAuthStatus();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Update failed. Please try again.";
      setMessage({ text: errorMessage, type: "error" });
    } finally {
      setIsUpdating(false);
      // Clear the password field after submission
      setFormData((prev) => ({ ...prev, password: "" }));
    }
  };

  // Handler for the delete account button
  const handleDelete = async () => {
    // Ask for confirmation before deleting
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone.",
      )
    ) {
      try {
        const response = await axios.delete("/api/auth/profile", {
          withCredentials: true,
        });

        alert(response.data.message);
        await logout();
        navigate("/login");
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "Failed to delete account.";
        setMessage({ text: errorMessage, type: "error" });
      }
    }
  };

  // Handle initial loading state from AuthContext
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="flex flex-col items-center">
          <div className="relative">
            <Loader2 className="h-10 w-10 text-purple-500 animate-spin mb-3" />
            <div className="absolute inset-0 bg-purple-500/20 rounded-full animate-ping"></div>
          </div>
          <p className="text-gray-400 mt-2">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // Handle case where user is not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4">
        <div className="max-w-md w-full bg-gray-800/70 backdrop-blur-sm rounded-xl shadow-2xl p-8 border border-gray-700">
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <AlertCircle className="h-16 w-16 text-yellow-400" />
              <div className="absolute -inset-2 bg-yellow-500/10 rounded-full animate-pulse"></div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2 text-center">
              Authentication Required
            </h2>
            <p className="text-gray-400 text-center mb-6">
              Please log in to view your profile.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-purple-500/20"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Get user role icon
  const getRoleIcon = () => {
    switch (user.role) {
      case "admin":
        return <Crown className="h-5 w-5 text-yellow-400" />;
      case "premium":
        return <Star className="h-5 w-5 text-yellow-300" />;
      default:
        return <User className="h-5 w-5 text-purple-400" />;
    }
  };

  // Render the profile page for the authenticated user
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-8 border-b border-gray-700 relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-40 h-40 bg-purple-600/10 rounded-full"></div>
          <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-indigo-600/10 rounded-full"></div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative z-10">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center">
                <Settings className="mr-3 h-8 w-8 text-purple-400" />
                My Profile
              </h1>
              <p className="text-gray-400 mt-2 text-lg">
                Manage your account information and preferences
              </p>
            </div>
            <button
              onClick={logout}
              className="flex items-center px-4 py-2.5 mt-4 md:mt-0 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-600/50 transition-all border border-gray-600 hover:border-gray-500"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Logout
            </button>
          </div>
        </div>

        {/* User Information Section */}
        <div className="p-8 border-b border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <User className="mr-3 h-6 w-6 text-purple-400" />
              Account Information
            </h2>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center text-purple-400 hover:text-purple-300 transition-colors bg-purple-900/20 hover:bg-purple-900/30 px-4 py-2 rounded-lg border border-purple-800/50"
            >
              <Edit3 className="h-4 w-4 mr-2" />
              {isEditing ? "Cancel Edit" : "Edit Profile"}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex items-center p-4 bg-gray-700/50 rounded-xl border border-gray-600 hover:border-gray-500 transition-colors">
              <div className="bg-gray-600 p-3 rounded-lg mr-4">
                <User className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Username</p>
                <p className="font-medium text-white text-lg">
                  {user.username}
                </p>
              </div>
            </div>

            <div className="flex items-center p-4 bg-gray-700/50 rounded-xl border border-gray-600 hover:border-gray-500 transition-colors">
              <div className="bg-gray-600 p-3 rounded-lg mr-4">
                <Mail className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Email</p>
                <p className="font-medium text-white text-lg">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center p-4 bg-gray-700/50 rounded-xl border border-gray-600 hover:border-gray-500 transition-colors">
              <div className="bg-gray-600 p-3 rounded-lg mr-4">
                {getRoleIcon()}
              </div>
              <div>
                <p className="text-sm text-gray-400">Role</p>
                <p className="font-medium text-white text-lg capitalize">
                  {user.role}
                </p>
              </div>
            </div>

            <div className="flex items-center p-4 bg-gray-700/50 rounded-xl border border-gray-600 hover:border-gray-500 transition-colors">
              <div className="bg-gray-600 p-3 rounded-lg mr-4">
                <Calendar className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Member Since</p>
                <p className="font-medium text-white text-lg">
                  {new Date(user.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Update Profile Form - Only show when editing */}
        {isEditing && (
          <div className="p-8 border-b border-gray-700 bg-gray-750/30">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Save className="mr-3 h-6 w-6 text-purple-400" />
              Update Profile
            </h2>

            <form onSubmit={handleUpdate} className="space-y-6">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-700/60 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition placeholder-gray-500"
                  placeholder="Enter your username"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-700/60 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition placeholder-gray-500"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  New Password (optional)
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-700/60 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition placeholder-gray-500 pr-12"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 p-1 rounded-md"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Leave blank to keep your current password
                </p>
              </div>

              <button
                type="submit"
                disabled={isUpdating}
                className="w-full flex items-center justify-center py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all shadow-md hover:shadow-lg hover:shadow-purple-500/20 disabled:opacity-70"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="-ml-1 mr-2 h-5 w-5" />
                    Update Profile
                  </>
                )}
              </button>
            </form>

            {message.text && (
              <div
                className={`mt-6 p-4 rounded-lg flex items-start border ${
                  message.type === "success"
                    ? "bg-green-900/20 text-green-300 border-green-800/50"
                    : "bg-red-900/20 text-red-300 border-red-800/50"
                }`}
              >
                {message.type === "success" ? (
                  <CheckCircle className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
                )}
                <p>{message.text}</p>
              </div>
            )}
          </div>
        )}

        {/* Delete Account Section */}
        <div className="p-8 bg-red-900/10 border-t border-red-800/30">
          <h2 className="text-xl font-semibold text-white mb-3 flex items-center">
            <AlertCircle className="mr-3 h-6 w-6 text-red-400" />
            Danger Zone
          </h2>
          <p className="text-gray-400 mb-6">
            Once you delete your account, there is no going back. Please be
            certain.
          </p>

          <button
            onClick={handleDelete}
            className="flex items-center px-5 py-2.5 bg-red-900/30 text-red-300 rounded-lg hover:bg-red-900/40 transition-all border border-red-800/50 hover:border-red-700/50 hover:text-white"
          >
            <Trash2 className="mr-2 h-5 w-5" />
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
