const SESSION_KEY = 'authstudio.session';

export function readSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function writeSession(user) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } catch {
    return null;
  }
  return user;
}

export function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    return null;
  }
  return null;
}
