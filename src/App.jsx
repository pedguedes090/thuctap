import React, { useEffect } from 'react';
import AppShell from './components/layout/AppShell';
import { AuthProvider } from './context/AuthContext';
import { APP_ROUTE_IDS } from './constants/navigation';
import { useAuth } from './hooks/useAuth';
import { useHashRoute } from './hooks/useHashRoute';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import ProjectsPage from './pages/ProjectsPage';
import RegisterPage from './pages/RegisterPage';
import SecurityPage from './pages/SecurityPage';
import SkillsPage from './pages/SkillsPage';

function Routes() {
  const { user } = useAuth();
  const [route, navigate] = useHashRoute('login');

  const isAppRoute = APP_ROUTE_IDS.includes(route);
  const activeRoute = user ? (isAppRoute ? route : 'dashboard') : isAppRoute ? 'login' : route;

  useEffect(() => {
    if (activeRoute !== route) navigate(activeRoute);
  }, [activeRoute, route, navigate]);

  if (!user) {
    if (activeRoute === 'register') {
      return (
        <RegisterPage
          onSwitchToLogin={() => navigate('login')}
          onRegistered={() => navigate('login')}
        />
      );
    }

    return <LoginPage onSwitchToRegister={() => navigate('register')} />;
  }

  return (
    <AppShell route={activeRoute} onNavigate={navigate}>
      {activeRoute === 'projects' && <ProjectsPage />}
      {activeRoute === 'skills' && <SkillsPage />}
      {activeRoute === 'profile' && <ProfilePage />}
      {activeRoute === 'security' && <SecurityPage />}
      {activeRoute === 'dashboard' && <DashboardPage onNavigate={navigate} />}
    </AppShell>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
}
