import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import {
  ProtectedRoute,
  AdminRoute,
  RoleBasedRedirect,
  UnauthorizedPage,
} from "./contexts/ProtectedRoute";

import SignupPage from "./pages/SignUpPage/SignUpPage";
import LoginPage from "./pages/LoginPage/LoginPage";

import ProfilePage from "./pages/ProfilePage/ProfilePage";
import Quiz from "./pages/UserPage/Quize/Quiz";
import Results from "./pages/UserPage/Other/Result";
import Submissions from "./pages/UserPage/Submission/Submissions";
import ActiveQuizzesPage from "./pages/UserPage/Other/ActiveQuizzesPage";
import SubmissionDetails from "./pages/UserPage/Submission/SubmissionDetails";

import QuizStatsPage from "./pages/Admin/Quize/QuizStatsPage";
import AdminDashboard from "./pages/Admin/AdminMain";
import QuizDetail from "./pages/Admin/Quize/QuizDetail";
import QuestionsManagement from "./pages/Admin/Quiestions/QuestionsManagement";
import AdminLeaderboard from "./pages/Admin/Leaderboard/AdminLeaderboard";


import { HomePage, NotFoundPage } from "./pages/ExtraPage/Homepage";
import Sidebar from "./components/Sidebar/Sidebar";
import GlobalStyles from "./components/Sidebar/GlobalStyles";
import UserManagement from "./pages/Admin/UserManagment/UserManagement";
import UserStatsDashboard from "./pages/UserPage/Dashboard/UserStatsDashboard";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <GlobalStyles />
        <div className="flex min-h-screen bg-gray-100">
          <Sidebar />
        
          <main className="flex-1 transition-all duration-300">
            <div className="min-h-screen">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                
                {/* Auth Routes - Public Only */}
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/login" element={<LoginPage />} />
                
                {/* Protected Routes - All Authenticated Users */}
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/dhashboard" 
                  element={
                    <ProtectedRoute>
                      <UserStatsDashboard />
                    </ProtectedRoute>
                  } 
                />
                
                {/* User Protected Routes */}
                <Route 
                  path="/quiz" 
                  element={
                    <ProtectedRoute>
                      <ActiveQuizzesPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/quiz/:id" 
                  element={
                    <ProtectedRoute>
                      <Quiz />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/results/:id" 
                  element={
                    <ProtectedRoute>
                      <Results />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/submissions" 
                  element={
                    <ProtectedRoute>
                      <Submissions />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/submission/:id" 
                  element={
                    <ProtectedRoute>
                      <SubmissionDetails />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Admin Protected Routes */}
                <Route 
                  path="/admin/dashboard" 
                  element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  } 
                />
                <Route 
                  path="/admin/quiz/:quizId" 
                  element={
                    <AdminRoute>
                      <QuizDetail />
                    </AdminRoute>
                  } 
                />
                <Route 
                  path="/admin/quiz/:quizId/stats" 
                  element={
                    <AdminRoute>
                      <QuizStatsPage />
                    </AdminRoute>
                  } 
                />
                <Route 
                  path="/admin/quiz/:quizId/questions" 
                  element={
                    <AdminRoute>
                      <QuestionsManagement />
                    </AdminRoute>
                  } 
                />
                <Route 
                  path="/admin/users" 
                  element={
                    <AdminRoute>
                      <UserManagement />
                    </AdminRoute>
                  } 
                />
                <Route 
                  path="/admin/leaderboard" 
                  element={
                    <AdminRoute>
                      <AdminLeaderboard/>
                    </AdminRoute>
                  } 
                />
                
                {/* Role Based Redirect */}
                <Route path="/dashboard" element={<RoleBasedRedirect />} />
                
                {/* Utility Routes */}
                <Route path="/unauthorized" element={<UnauthorizedPage />} />
                
                {/* Fallback Routes */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </div>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;