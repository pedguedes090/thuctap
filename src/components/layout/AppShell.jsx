import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useAuth } from '../../hooks/useAuth';

export default function AppShell({ route, onNavigate, children }) {
  const { user, logout } = useAuth();
  const [navOpen, setNavOpen] = useState(false);

  const handleNavigate = (nextRoute) => {
    setNavOpen(false);
    onNavigate(nextRoute);
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar
        route={route}
        open={navOpen}
        user={user}
        onNavigate={handleNavigate}
        onClose={() => setNavOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          route={route}
          user={user}
          onOpenNav={() => setNavOpen(true)}
          onNavigate={handleNavigate}
          onLogout={logout}
        />

        <main key={route} className="animate-route flex-1 px-5 py-8 sm:px-8">
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
