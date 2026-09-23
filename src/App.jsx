import React from 'react';
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import { AuthProvider } from './context/AuthContext';
import { APP_ROUTES } from './constants/navigation';
import { useAuth } from './hooks/useAuth';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import ProjectsPage from './pages/ProjectsPage';
import RegisterPage from './pages/RegisterPage';
import SecurityPage from './pages/SecurityPage';
import SkillsPage from './pages/SkillsPage';

const ROUTE_ELEMENTS = {
  dashboard: <DashboardPage />,
  projects: <ProjectsPage />,
  skills: <SkillsPage />,
  profile: <ProfilePage />,
  security: <SecurityPage />,
};

function RequireAuth() {
  const { user } = useAuth();
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

function GuestOnly() {
  const { user } = useAuth();
  return user ? <Navigate to="/dashboard" replace /> : <Outlet />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<GuestOnly />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          <Route element={<RequireAuth />}>
            <Route element={<AppShell />}>
              {APP_ROUTES.map((route) => (
                <Route key={route.id} path={route.path} element={ROUTE_ELEMENTS[route.id]} />
              ))}
            </Route>
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
