import {
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

export const AuthProvider = ({ children }) => {
  const API_BASE = "https://api.dratifshahzad.com/api";

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [csrfToken, setCsrfToken] = useState(null);

  // Axios instance
  const api = useMemo(() => {
    const instance = axios.create({
      baseURL: API_BASE,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    // Attach CSRF token for modifying requests
    instance.interceptors.request.use((config) => {
      const method = config.method?.toLowerCase();
      if (method && ["post", "put", "patch", "delete"].includes(method)) {
        if (!csrfToken) {
          console.warn("⚠️ CSRF token missing. Request may fail.");
        } else {
          config.headers["X-CSRF-TOKEN"] = csrfToken;
        }
      }
      return config;
    });

    return instance;
  }, [API_BASE, csrfToken]);

  // Fetch current user (only if cookies exist)
  const fetchCurrentUser = useCallback(async () => {
    try {
      const res = await api.get("/me");
      setUser(res.data.user || null);
    } catch (err) {
      if (err?.response?.status === 401) {
        setUser(null); // not logged in
      } else {
        console.error("fetchCurrentUser error:", err);
      }
    } finally {
      setLoading(false);
      setIsInitialized(true);
    }
  }, [api]);

  // Fetch CSRF token after login or registration
  const fetchCsrfToken = useCallback(async () => {
    try {
      const res = await api.get("/csrf-token");
      setCsrfToken(res.data.csrfToken);
    } catch (err) {
      console.error("Failed to fetch CSRF token:", err);
    }
  }, [api]);

  useEffect(() => {
    // Only fetch user if cookies exist
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const res = await api.post("/login", { email, password });
      if (res.data.user) {
        setUser(res.data.user);
        await fetchCsrfToken(); // ✅ fetch CSRF token immediately after login
        return { success: true, user: res.data.user };
      }
      return { success: false, error: "Invalid response from server" };
    } catch (err) {
      let errorMessage = "Login failed. Please try again.";
      if (err.response) {
        const data = err.response.data;
        errorMessage =
          data?.error ||
          data?.message ||
          `Invalid credentials (${err.response.status})`;
      }
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const res = await api.post("/register", userData);
      if (res.data.user) {
        setUser(res.data.user);
        await fetchCsrfToken(); // fetch CSRF token after registration
        return { success: true, user: res.data.user };
      }
      return { success: false, error: "Registration failed" };
    } catch (err) {
      const message = err?.response?.data?.error || "Registration failed";
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const logout = useCallback(async () => {
    try {
      await api.post("/logout");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
      setCsrfToken(null);
      setIsInitialized(false);
    }
  }, [api]);

  const changePassword = async (current_password, new_password) => {
    try {
      const res = await api.post("/change-password", {
        current_password,
        new_password,
      });
      return { success: true, message: res.data?.message || "Password changed" };
    } catch (err) {
      const message = err?.response?.data?.error || "Password change failed";
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
