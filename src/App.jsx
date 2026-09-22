import React, { useState, useEffect } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';

export default function App() {
  const [currentPage, setCurrentPage] = useState('login'); // 'login' | 'register' | 'home'
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('pagedone_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (currentUser) {
      setCurrentPage('home');
    }
  }, [currentUser]);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    localStorage.setItem('pagedone_current_user', JSON.stringify(user));
    setCurrentPage('home');
  };

  const handleRegisterSuccess = (newUser) => {
    setCurrentPage('login');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('pagedone_current_user');
    setCurrentPage('login');
  };

  if (currentPage === 'home') {
    return <Home user={currentUser} onLogout={handleLogout} />;
  }

  if (currentPage === 'register') {
    return (
      <Register
        onSwitchToLogin={() => setCurrentPage('login')}
        onRegisterSuccess={handleRegisterSuccess}
      />
    );
  }

  return (
    <Login
      onSwitchToRegister={() => setCurrentPage('register')}
      onLoginSuccess={handleLoginSuccess}
    />
  );
}
