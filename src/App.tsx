import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { TemplateImageProvider } from './contexts/TemplateImageContext';
import { LandingPage } from './pages/LandingPage';
import { EditorPage } from './pages/EditorPage';
import { CardViewPage } from './pages/CardViewPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { SettingsPage } from './pages/SettingsPage';
import { AdminPanelPage } from './pages/AdminPanelPage';
import { Watermark } from './components/Watermark';

import { DashboardPage } from './pages/DashboardPage';
import { BuilderPage } from './pages/builder/BuilderPage';
import { TemplatesPage } from './pages/builder/TemplatesPage';
import { AssetsPage } from './pages/builder/AssetsPage';
import { TemplateShowcasePage } from './pages/TemplateShowcasePage';

const ProtectedRoute = ({ children, requireAdmin = false }: { children: React.ReactNode, requireAdmin?: boolean }) => {
  const { user, profile, loading, isAdmin } = useAuth();

  if (loading) return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center transition-colors">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>
  );
  if (!user) return <Navigate to="/login" />;
  if (requireAdmin && !isAdmin) return <Navigate to="/dashboard" />;
  
  return <>{children}</>;
};

export default function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <TemplateImageProvider>
          <Router>
            <Watermark />
            <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/auth" element={<Navigate to="/login" />} />
            
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />
            <Route path="/create" element={
              <ProtectedRoute>
                <EditorPage />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute requireAdmin>
                <AdminPanelPage />
              </ProtectedRoute>
            } />

            {/* Builder Routes */}
            <Route path="/builder" element={
              <ProtectedRoute>
                <BuilderPage />
              </ProtectedRoute>
            } />
            <Route path="/builder/templates" element={
              <ProtectedRoute>
                <TemplatesPage />
              </ProtectedRoute>
            } />
            <Route path="/builder/assets" element={
              <ProtectedRoute>
                <AssetsPage />
              </ProtectedRoute>
            } />

            <Route path="/view/:id" element={<CardViewPage />} />
            <Route path="/showcase" element={<TemplateShowcasePage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
        </TemplateImageProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}
