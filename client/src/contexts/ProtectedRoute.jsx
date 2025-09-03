import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export const ProtectedRoute = ({ children, redirectTo = "/login" }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page with return url
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return children;
};

// Role-Based Protected Route Component
export const RoleProtectedRoute = ({
  children,
  allowedRoles = [],
  redirectTo = "/unauthorized",
}) => {
  const { isAuthenticated, loading, user, hasAnyRole } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !hasAnyRole(allowedRoles)) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

// Admin Only Route Component
export const AdminRoute = ({ children }) => {
  return (
    <RoleProtectedRoute allowedRoles={["Admin"]}>{children}</RoleProtectedRoute>
  );
};

// User Only Route Component
export const UserRoute = ({ children }) => {
  return (
    <RoleProtectedRoute allowedRoles={["User"]}>{children}</RoleProtectedRoute>
  );
};

// Redirect authenticated users based on their role
export const RoleBasedRedirect = () => {
  const { isAuthenticated, loading, isAdmin, isUser } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (isAdmin()) {
    return <Navigate to="/profile" replace />;
  }

  if (isUser()) {
    return <Navigate to="/profile" replace />;
  }

  // Default redirect
  return <Navigate to="/login" replace />;
};

// Unauthorized Access Component
export const UnauthorizedPage = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Access Denied
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            You don't have permission to access this page.
          </p>
          {isAuthenticated && (
            <p className="mt-2 text-xs text-gray-400">
              Current role: {user?.role || "Unknown"}
            </p>
          )}
          <div className="mt-6">
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
