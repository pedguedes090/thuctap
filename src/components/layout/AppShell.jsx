import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useAuth } from '../../hooks/useAuth';

export default function AppShell() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar open={navOpen} user={user} onClose={() => setNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar user={user} onOpenNav={() => setNavOpen(true)} onLogout={logout} />

        <main key={location.pathname} className="animate-route flex-1 px-5 py-8 sm:px-8">
          <div className="mx-auto w-full max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
