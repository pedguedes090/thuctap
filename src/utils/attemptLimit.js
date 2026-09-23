const STORAGE_KEY = 'authstudio.attempts';

export const MAX_ATTEMPTS = 8;
export const LOCK_MS = 60_000;

const emptyEntry = () => ({ attempts: 0, lockedUntil: 0 });

function readAll() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function writeAll(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    return null;
  }
  return null;
}

export function readLimit(scope) {
  const entry = readAll()[scope];
  if (!entry) return emptyEntry();

  return {
    attempts: Number(entry.attempts) || 0,
    lockedUntil: Number(entry.lockedUntil) || 0,
  };
}

export function recordAttempt(scope) {
  const all = readAll();
  const entry = { ...emptyEntry(), ...all[scope] };
  const now = Date.now();

  if (Number(entry.lockedUntil) > now) return entry;

  const attempts = (Number(entry.attempts) || 0) + 1;
  const next =
    attempts > MAX_ATTEMPTS
      ? { attempts: 0, lockedUntil: now + LOCK_MS }
      : { attempts, lockedUntil: 0 };

  all[scope] = next;
  writeAll(all);
  return next;
}

export function clearAttempts(scope) {
  const all = readAll();
  delete all[scope];
  writeAll(all);
  return emptyEntry();
}

export function secondsUntil(timestamp) {
  const diff = (Number(timestamp) || 0) - Date.now();
  return Math.max(0, Math.ceil(diff / 1000));
}
