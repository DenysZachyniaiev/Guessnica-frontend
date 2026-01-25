const SETTINGS_KEY = 'guessnica_admin_settings';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8082';

let cache = {
  timeLimitSeconds: 3600,
  maxDistanceMeters: 100,
  basePoints: 500,
  allowHints: true
};

const subscribers = new Set();

function notify() {
  subscribers.forEach((cb) => {
    try { cb(cache); } catch (e) { console.error('settings subscriber error', e); }
  });
}

export async function loadSettings() {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/settings`, { headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` } });
    if (res.ok) {
      const data = await res.json();
      cache = { ...cache, ...data };
      try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(cache)); } catch {};
      notify();
      return cache;
    }
  } catch (e) {
    // ignore, fallback to localStorage
  }
  try {
    const s = localStorage.getItem(SETTINGS_KEY);
    if (s) cache = { ...cache, ...JSON.parse(s) };
  } catch (e) { console.error('Failed to load settings from localStorage', e); }
  notify();
  return cache;
}

export function getSettings() {
  return cache;
}

export async function saveSettings(newSettings) {
  cache = { ...cache, ...newSettings };
  notify();
  try {
    const res = await fetch(`${API_BASE_URL}/admin/settings`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(cache)
    });
    if (!res.ok) {
      try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(cache)); } catch (e) { console.error(e); }
    }
  } catch (e) {
    try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(cache)); } catch (err) { console.error(err); }
  }
  return cache;
}

export function subscribeSettings(cb) {
  subscribers.add(cb);
  try { cb(cache); } catch {}
  return () => subscribers.delete(cb);
}

export default {
  loadSettings,
  getSettings,
  saveSettings,
  subscribeSettings
};
