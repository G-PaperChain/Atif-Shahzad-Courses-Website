// src/contexts/AuthProvider.jsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback
} from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

/**
 * AuthProvider
 * - Expects Vite env var VITE_API_BASE (optional). Fallback to dratifshahzad.com.
 * - Stores tokens in localStorage (simple approach; consider httpOnly cookies for production).
 */
export const AuthProvider = ({ children }) => {
  const API_BASE = import.meta.env.VITE_API_BASE || 'https://dratifshahzad.com';

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // create axios instance for API calls
  const api = useMemo(() => {
    return axios.create({
      baseURL: API_BASE,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }, [API_BASE]);

  // refs for refresh token flow
  const isRefreshing = useRef(false);
  const refreshSubscribers = useRef([]);

  const subscribeTokenRefresh = (cb) => {
    refreshSubscribers.current.push(cb);
  };

  const onRefreshed = (token) => {
    refreshSubscribers.current.forEach((cb) => cb(token));
    refreshSubscribers.current = [];
  };

  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  }, []);

  // Attach interceptors only once
  useEffect(() => {
    // Request interceptor: attach access token
    const reqId = api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access_token');
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor: try refresh on 401
    const resId = api.interceptors.response.use(
      (res) => res,
      async (error) => {
        const originalRequest = error?.config;
        const status = error?.response?.status;

        // only handle 401s and avoid infinite loop
        if (status === 401 && originalRequest && !originalRequest._retry) {
          originalRequest._retry = true;

          const refreshToken = localStorage.getItem('refresh_token');
          if (!refreshToken) {
            logout();
            return Promise.reject(error);
          }

          if (isRefreshing.current) {
            // queue the request until token refresh done
            return new Promise((resolve, reject) => {
              subscribeTokenRefresh((newToken) => {
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                resolve(api(originalRequest));
              });
            });
          }

          isRefreshing.current = true;

          try {
            // Use default axios (no interceptors attached) to call refresh endpoint
            const refreshRes = await axios.post(
              `${API_BASE}/refresh`,
              null,
              {
                headers: {
                  Authorization: `Bearer ${refreshToken}`,
                  'Content-Type': 'application/json',
                },
              }
            );

            const newAccessToken = refreshRes?.data?.access_token;
            if (!newAccessToken) throw new Error('No access token returned by refresh');

            localStorage.setItem('access_token', newAccessToken);
            // update default header for future requests
            api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;

            // notify queued requests
            onRefreshed(newAccessToken);

            // replay original request with new token
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return api(originalRequest);
          } catch (err) {
            // refresh failed -> log out user
            logout();
            return Promise.reject(err);
          } finally {
            isRefreshing.current = false;
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(reqId);
      api.interceptors.response.eject(resId);
    };
  }, [api, API_BASE, logout]);

  // Fetch current user when provider mounts (if access token exists)
  const fetchCurrentUser = useCallback(async () => {
    try {
      const res = await api.get('/me'); // api will attach access token automatically
      setUser(res.data.user || null);
    } catch (err) {
      // likely expired/invalid token
      console.error('fetchCurrentUser error:', err?.response?.data || err.message);
      logout();
    } finally {
      setLoading(false);
    }
  }, [api, logout]);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount

  // Auth actions -----------------------------------------------------------
  const login = async (email, password) => {
    try {
      const res = await api.post('/login', { email, password });
      const data = res.data;
      if (data?.access_token) {
        localStorage.setItem('access_token', data.access_token);
      }
      if (data?.refresh_token) {
        localStorage.setItem('refresh_token', data.refresh_token);
      }
      setUser(data.user || null);
      return { success: true, user: data.user || null };
    } catch (err) {
      const message = err?.response?.data?.error || err.message || 'Network error';
      return { success: false, error: message };
    }
  };

  const register = async (userData) => {
    try {
      const res = await api.post('/register', userData);
      const data = res.data;
      if (data?.access_token) {
        localStorage.setItem('access_token', data.access_token);
      }
      if (data?.refresh_token) {
        localStorage.setItem('refresh_token', data.refresh_token);
      }
      setUser(data.user || null);
      return { success: true, user: data.user || null };
    } catch (err) {
      const message = err?.response?.data?.error || err.message || 'Network error';
      return { success: false, error: message };
    }
  };

  const changePassword = async (current_password, new_password) => {
    try {
      const res = await api.post('/change-password', { current_password, new_password });
      return { success: true, message: res.data?.message || 'Password changed' };
    } catch (err) {
      const message = err?.response?.data?.error || err.message || 'Network error';
      return { success: false, error: message };
    }
  };

  // expose value
  const value = {
    user,
    loading,
    api, // raw axios instance for authenticated calls
    login,
    register,
    logout,
    fetchCurrentUser,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
