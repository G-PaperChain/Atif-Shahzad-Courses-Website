import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

// Helper function to get cookies
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
};

export const AuthProvider = ({ children }) => {
  const API_BASE = "https://api.dratifshahzad.com/api";
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  const api = useMemo(() => {
    const instance = axios.create({
      baseURL: API_BASE,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    // Add CSRF token to all requests
    instance.interceptors.request.use((config) => {
      const csrfToken = getCookie('csrf_token');
      if (csrfToken && config.method !== 'get') {
        config.headers['X-CSRF-Token'] = csrfToken;
      }
      return config;
    });

    return instance;
  }, [API_BASE]);

  const logout = useCallback(async () => {
    try {
      await api.post("/logout");
    } catch (err) {
      console.error("Logout API error:", err);
      // Even if API fails, clear local state
    } finally {
      setUser(null);
      setIsInitialized(true);
    }
  }, [api]);

  const fetchCurrentUser = useCallback(async () => {
    try {
      const res = await api.get("/me");
      setUser(res.data.user || null);
    } catch (err) {
      console.error("fetchCurrentUser error:", err?.response?.data || err);

      if (err?.response?.status === 401) {
        setUser(null);
      }
    } finally {
      setLoading(false);
      setIsInitialized(true);
    }
  }, [api]);

  // Initialize auth state
  useEffect(() => {
    if (!isInitialized) {
      // First, try to get CSRF token
      axios.get(`${API_BASE}/csrf-token`, { withCredentials: true })
        .then(() => {
          // Then fetch user
          fetchCurrentUser();
        })
        .catch((error) => {
          console.error("CSRF token fetch failed:", error);
          fetchCurrentUser(); // Still try to fetch user
        });
    }
  }, [fetchCurrentUser, isInitialized, API_BASE]);

  // Auth actions
  const login = async (email, password) => {
    try {
      setLoading(true);
      console.log('AuthContext: Attempting login for:', email);

      const res = await api.post("/login", { email, password });
      console.log('AuthContext: Login API response:', res.data);

      if (res.data.user) {
        setUser(res.data.user);
        console.log('AuthContext: Login successful, user set');
        return { success: true, user: res.data.user };
      } else {
        console.log('AuthContext: No user in response');
        return { success: false, error: "Invalid response from server" };
      }
    } catch (err) {
      console.error('AuthContext: Login API error:', err);

      // DEBUG: Log the complete error response
      console.log('AuthContext: Complete error object:', err);
      console.log('AuthContext: Error response data:', err?.response?.data);
      console.log('AuthContext: Error response status:', err?.response?.status);

      let errorMessage = "Login failed. Please try again.";

      if (err.response) {
        // Try multiple possible error message paths
        const errorData = err.response.data;

        // Check all possible error message locations
        errorMessage = errorData?.error ||
          errorData?.message ||
          errorData?.msg ||  // Added this line for "msg" field
          errorData?.detail ||
          (typeof errorData === 'string' ? errorData : `Invalid credentials (${err.response.status})`);

        console.log('AuthContext: Extracted error message:', errorMessage);

        // If no specific message found, provide a generic one based on status code
        if (!errorMessage || errorMessage.includes('undefined')) {
          errorMessage = err.response.status === 401
            ? 'Invalid email or password'
            : `Login failed (Error ${err.response.status})`;
        }
      } else if (err.request) {
        errorMessage = "No response from server. Please check your connection.";
      } else {
        errorMessage = err.message || "An unexpected error occurred.";
      }

      console.log('AuthContext: Returning error:', errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
      console.log('AuthContext: Login process completed');
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const res = await api.post("/register", userData);
      setUser(res.data.user || null);
      return { success: true, user: res.data.user || null };
    } catch (err) {
      const message =
        err?.response?.data?.error || err.message || "Registration failed";
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (current_password, new_password) => {
    try {
      const res = await api.post("/change-password", {
        current_password,
        new_password,
      });
      return { success: true, message: res.data?.message || "Password changed" };
    } catch (err) {
      const message =
        err?.response?.data?.error || err.message || "Password change failed";
      return { success: false, error: message };
    }
  };

  const value = {
    user,
    loading,
    isInitialized,
    api,
    login,
    register,
    logout,
    fetchCurrentUser,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};