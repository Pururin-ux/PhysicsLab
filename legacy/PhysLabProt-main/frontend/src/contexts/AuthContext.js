import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api';

const AuthContext = createContext(null);
const SESSION_FLAG = 'physicslab.session';

const GENERIC_ERROR = "\u041f\u0440\u043e\u0438\u0437\u043e\u0448\u043b\u0430 \u043e\u0448\u0438\u0431\u043a\u0430. \u041f\u043e\u043f\u0440\u043e\u0431\u0443\u0439\u0442\u0435 \u0435\u0449\u0451 \u0440\u0430\u0437.";
const NETWORK_ERROR = "\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u043f\u043e\u0434\u043a\u043b\u044e\u0447\u0438\u0442\u044c\u0441\u044f \u043a backend. \u041f\u0440\u043e\u0432\u0435\u0440\u044c\u0442\u0435, \u0447\u0442\u043e http://127.0.0.1:8000 \u0437\u0430\u043f\u0443\u0449\u0435\u043d.";

function formatApiErrorDetail(detail) {
  if (detail == null) return GENERIC_ERROR;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    return detail.map((e) => (e && typeof e.msg === "string" ? e.msg : JSON.stringify(e))).filter(Boolean).join(" ");
  }
  if (detail && typeof detail.msg === "string") return detail.msg;
  return String(detail);
}

function formatAuthError(error) {
  if (!error.response) return NETWORK_ERROR;
  return formatApiErrorDetail(error.response?.data?.detail);
}

function hasStoredSession() {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(SESSION_FLAG) === '1';
}

function rememberSession() {
  if (typeof window !== 'undefined') window.localStorage.setItem(SESSION_FLAG, '1');
}

function forgetSession() {
  if (typeof window !== 'undefined') window.localStorage.removeItem(SESSION_FLAG);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    if (!hasStoredSession()) {
      setUser(false);
      setLoading(false);
      return;
    }

    try {
      const { data } = await apiClient.get('/auth/me');
      setUser(data);
    } catch {
      forgetSession();
      setUser(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { checkAuth(); }, [checkAuth]);

  const login = async (email, password) => {
    try {
      const { data } = await apiClient.post('/auth/login', { email, password });
      rememberSession();
      setUser(data);
      return { success: true };
    } catch (error) {
      return { success: false, error: formatAuthError(error) };
    }
  };

  const register = async (email, password, name) => {
    try {
      const { data } = await apiClient.post('/auth/register', { email, password, name });
      rememberSession();
      setUser(data);
      return { success: true };
    } catch (error) {
      return { success: false, error: formatAuthError(error) };
    }
  };

  const logout = async () => {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      forgetSession();
    }
    setUser(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, setUser, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
