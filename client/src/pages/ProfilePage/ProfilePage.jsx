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
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 text-purple-500 animate-spin mb-2" />
          <p className="text-gray-400">Loading Profile...</p>
        </div>
      </div>
    );
  }

  // Handle case where user is not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-xl p-6">
          <div className="flex flex-col items-center">
            <AlertCircle className="h-12 w-12 text-yellow-500 mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">
              Authentication Required
            </h2>
            <p className="text-gray-400 text-center">
              Please log in to view your profile.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render the profile page for the authenticated user
  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-gray-800 rounded-xl shadow-xl overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 border-b border-gray-700">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center">
                <User className="mr-2 h-7 w-7 text-purple-400" />
                My Profile
              </h1>
              <p className="text-gray-400 mt-1">
                Manage your account information
              </p>
            </div>
            <button
              onClick={logout}
              className="flex items-center px-3 py-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition-colors"
            >
              <LogOut className="h-4 w-4 mr-1" />
              Logout
            </button>
          </div>
        </div>

        {/* User Information Section */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center">
              <User className="mr-2 h-5 w-5 text-purple-400" />
              Account Information
            </h2>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center text-sm text-purple-400 hover:text-purple-300"
            >
              <Edit3 className="h-4 w-4 mr-1" />
              {isEditing ? "Cancel Edit" : "Edit Profile"}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center p-3 bg-gray-700 rounded-lg">
              <User className="h-5 w-5 text-purple-400 mr-3" />
              <div>
                <p className="text-sm text-gray-400">Username</p>
                <p className="font-medium text-white">{user.username}</p>
              </div>
            </div>

            <div className="flex items-center p-3 bg-gray-700 rounded-lg">
              <Mail className="h-5 w-5 text-purple-400 mr-3" />
              <div>
                <p className="text-sm text-gray-400">Email</p>
                <p className="font-medium text-white">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center p-3 bg-gray-700 rounded-lg">
              <Shield className="h-5 w-5 text-purple-400 mr-3" />
              <div>
                <p className="text-sm text-gray-400">Role</p>
                <p className="font-medium text-white capitalize">{user.role}</p>
              </div>
            </div>

            <div className="flex items-center p-3 bg-gray-700 rounded-lg">
              <Calendar className="h-5 w-5 text-purple-400 mr-3" />
              <div>
                <p className="text-sm text-gray-400">Member Since</p>
                <p className="font-medium text-white">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Update Profile Form - Only show when editing */}
        {isEditing && (
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Save className="mr-2 h-5 w-5 text-purple-400" />
              Update Profile
            </h2>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                  placeholder="Username"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                  placeholder="Email"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-300 mb-1"
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
                    className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                    placeholder="New Password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isUpdating}
                className="w-full flex items-center justify-center py-2 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition disabled:opacity-50"
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
                className={`mt-4 p-3 rounded-md flex items-start ${
                  message.type === "success"
                    ? "bg-green-900/30 text-green-300 border border-green-800"
                    : "bg-red-900/30 text-red-300 border border-red-800"
                }`}
              >
                {message.type === "success" ? (
                  <CheckCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                )}
                <p>{message.text}</p>
              </div>
            )}
          </div>
        )}

        {/* Delete Account Section */}
        <div className="p-6">
          <h2 className="text-lg font-semibold text-white mb-2 flex items-center">
            <AlertCircle className="mr-2 h-5 w-5 text-red-400" />
            Danger Zone
          </h2>
          <p className="text-gray-400 mb-4 text-sm">
            Once you delete your account, there is no going back. Please be
            certain.
          </p>

          <button
            onClick={handleDelete}
            className="flex items-center px-4 py-2 bg-red-900/30 text-red-400 rounded-md hover:bg-red-900/40 transition-colors border border-red-800"
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
