import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { authService } from '../services/auth.service';

const AuthContext = createContext(null);

const storedUser = () => {
  try {
    return JSON.parse(localStorage.getItem('eventx_user'));
  } catch (_error) {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(storedUser);
  const [isBootstrapping, setIsBootstrapping] = useState(Boolean(localStorage.getItem('eventx_access_token')));

  useEffect(() => {
    const token = localStorage.getItem('eventx_access_token');
    if (!token) return;
    authService
      .me()
      .then(({ user: freshUser }) => {
        setUser(freshUser);
        localStorage.setItem('eventx_user', JSON.stringify(freshUser));
      })
      .catch(() => {
        localStorage.removeItem('eventx_access_token');
        localStorage.removeItem('eventx_user');
        setUser(null);
      })
      .finally(() => setIsBootstrapping(false));
  }, []);

  const persistSession = ({ accessToken, user: nextUser }) => {
    localStorage.setItem('eventx_access_token', accessToken);
    localStorage.setItem('eventx_user', JSON.stringify(nextUser));
    setUser(nextUser);
  };

  const login = async (payload) => {
    const data = await authService.login(payload);
    persistSession(data);
    toast.success(`Welcome back, ${data.user.name}`);
    return data.user;
  };

  const register = async (payload) => {
    const data = await authService.register(payload);
    persistSession(data);
    toast.success('Your EventX account is ready');
    return data.user;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (_error) {
      // Local session cleanup should still happen if the server token expired.
    }
    localStorage.removeItem('eventx_access_token');
    localStorage.removeItem('eventx_user');
    setUser(null);
    toast.success('Signed out');
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isBootstrapping,
      login,
      register,
      logout
    }),
    [user, isBootstrapping]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
