import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import DashboardPage from '@/pages/DashboardPage';
import CourseCatalogPage from '@/pages/CourseCatalogPage';
import CourseDetailPage from '@/pages/CourseDetailPage';
import ChapterPage from '@/pages/ChapterPage';
import LeaderboardPage from '@/pages/LeaderboardPage';
import ExamTrainerPage from '@/pages/ExamTrainerPage';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen bg-[#08080A] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#FFD700] border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!user || user === false) return <Navigate to="/login" replace />;
  return children;
}

function GuestRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen bg-[#08080A] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#FFD700] border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (user && user !== false) return <Navigate to="/dashboard" replace />;
  return children;
}

function AppContent() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/school" element={<ProtectedRoute><CourseCatalogPage pathFilter="school" /></ProtectedRoute>} />
        <Route path="/exam" element={<ProtectedRoute><CourseCatalogPage pathFilter="exam" /></ProtectedRoute>} />
        <Route path="/courses" element={<ProtectedRoute><CourseCatalogPage /></ProtectedRoute>} />
        <Route path="/courses/:courseId" element={<ProtectedRoute><CourseDetailPage /></ProtectedRoute>} />
        <Route path="/chapters/:chapterId" element={<ProtectedRoute><ChapterPage /></ProtectedRoute>} />
        <Route path="/exam-trainer" element={<ProtectedRoute><ExamTrainerPage /></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
