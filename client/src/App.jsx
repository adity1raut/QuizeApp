import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import {
  ProtectedRoute,
  AdminRoute,
  RoleBasedRedirect,
  UnauthorizedPage
} from './contexts/ProtectedRoute';
import SignupPage from './pages/SignUpPage/SignUpPage';
import LoginPage from './pages/LoginPage/LoginPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import Navbar from './components/Navbar/Navbar';
import AdminDashboard from './pages/AdminPAge/AdminMain';
import QuizDetail from './pages/AdminPAge/QuizDetail';
import QuestionsManagement from './pages/AdminPAge/QuestionsManagement';
import Quiz from './pages/UserPage/Quiz';
import Results from './pages/UserPage/Result';
import Submissions from './pages/UserPage/Submissions';
import SubmissionDetails from './pages/UserPage/SubmissionDetails';
import QuizStatsPage from './pages/AdminPAge/QuizStatsPage';
import ActiveQuizzesPage from './pages/UserPage/ActiveQuizzesPage';

const HomePage = () => (
  <div className="p-8 text-center">
    <h1 className="text-4xl font-bold">Welcome to MyApp</h1>
    <p className="mt-4">Navigate using the links in the header.</p>
  </div>
);

const NotFoundPage = () => (
  <div className="p-8 text-center">
    <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
    <p className="mt-4">The page you are looking for does not exist.</p>
  </div>
);

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            
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
              path="/quiz"
              element={
                <ProtectedRoute>
                  <ActiveQuizzesPage/>
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
            
            <Route
              path="/dashboard"
              element={<RoleBasedRedirect />}
            />
            
            <Route
              path="/unauthorized"
              element={<UnauthorizedPage />}
            />
            
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </Router>
    </AuthProvider>
  );
}