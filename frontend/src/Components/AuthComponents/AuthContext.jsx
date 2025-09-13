// src/context/AuthProvider.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

const API_BASE = "https://dratifshahzad.com/api";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));
  const [loading, setLoading] = useState(true);

  // Create Axios instance
  const api = axios.create({
    baseURL: API_BASE,
    headers: { "Content-Type": "application/json" },
  });

  // Add Authorization header
  api.interceptors.request.use((config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  });

  // Auto refresh token on 401
  api.interceptors.response.use(
    (res) => res,
    async (err) => {
      const originalRequest = err.config;

      if (err.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          await refreshAccessToken();
          originalRequest.headers.Authorization = `Bearer ${localStorage.getItem("accessToken")}`;
          return api(originalRequest);
        } catch (refreshErr) {
          logout();
        }
      }
      return Promise.reject(err);
    }
  );

  // Refresh token handler
  const refreshAccessToken = useCallback(async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) throw new Error("No refresh token");

    const res = await axios.post(
      `${API_BASE}/refresh`,
      {},
      { headers: { Authorization: `Bearer ${refreshToken}` } }
    );

    setAccessToken(res.data.access_token);
    localStorage.setItem("accessToken", res.data.access_token);
    return res.data.access_token;
  }, []);

  // Load user
  const loadUser = useCallback(async () => {
    try {
      const res = await api.get("/me");
      setUser(res.data.user);
    } catch (err) {
      console.error("Load user failed", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    if (accessToken) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, [accessToken, loadUser]);

  // Handle successful auth (login/signup)
  const handleAuthSuccess = (data) => {
    setAccessToken(data.access_token);
    localStorage.setItem("accessToken", data.access_token);
    localStorage.setItem("refreshToken", data.refresh_token);
    setUser(data.user);
  };

  // Signup
  const signup = async (data) => {
    const res = await api.post("/register", data);
    handleAuthSuccess(res.data);
  };

  // Login
  const login = async (email, password) => {
    const res = await api.post("/login", { email, password });
    handleAuthSuccess(res.data);
  };

  // Logout
  const logout = () => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        loading,
        login,
        signup,
        logout,
        refreshAccessToken,
        api, // expose axios instance for API calls
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
