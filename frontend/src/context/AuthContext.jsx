import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'ssec.auth';
const AuthContext = createContext(null);

function decodeJwtPayload(token) {
  try {
    const part = token.split('.')[1];
    const json = atob(part.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function loadFromStorage() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const data = JSON.parse(raw);
    const payload = decodeJwtPayload(data.token);
    if (!payload || (payload.exp && Date.now() / 1000 >= payload.exp)) return null;
    return data;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => loadFromStorage());

  useEffect(() => {
    if (auth) localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
    else localStorage.removeItem(STORAGE_KEY);
  }, [auth]);

  const value = useMemo(() => ({
    user: auth?.user ?? null,
    token: auth?.token ?? null,
    role: auth?.user?.role ?? null,
    login: (token, user) => setAuth({ token, user }),
    logout: () => setAuth(null),
  }), [auth]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
