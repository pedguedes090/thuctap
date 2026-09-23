const ARRIVAL_KEY = 'authstudio.arrival';

export function shouldPlayArrival() {
  try {
    return sessionStorage.getItem(ARRIVAL_KEY) !== 'played';
  } catch {
    return true;
  }
}

export function markArrivalPlayed() {
  try {
    sessionStorage.setItem(ARRIVAL_KEY, 'played');
  } catch {
    return null;
  }
  return null;
}

export function resetArrival() {
  try {
    sessionStorage.removeItem(ARRIVAL_KEY);
  } catch {
    return null;
  }
  return null;
}
