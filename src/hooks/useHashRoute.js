import { useCallback, useEffect, useState } from 'react';

const readRoute = () => window.location.hash.replace(/^#\/?/, '').trim();

export function useHashRoute(defaultRoute) {
  const [route, setRoute] = useState(() => readRoute() || defaultRoute);

  useEffect(() => {
    const handleHashChange = () => setRoute(readRoute() || defaultRoute);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [defaultRoute]);

  const navigate = useCallback((nextRoute) => {
    if (readRoute() === nextRoute) {
      setRoute(nextRoute);
      return;
    }
    window.location.hash = `/${nextRoute}`;
  }, []);

  return [route, navigate];
}
