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

  // Axios instance
  const api = useMemo(() => {
    const instance = axios.create({
      baseURL: API_BASE,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true, // ✅ send cookies automatically
    });

    // Interceptor to attach fresh CSRF token to modifying requests
    instance.interceptors.request.use(async (config) => {
      const method = config.method?.toLowerCase();
      if (method && ["post", "put", "patch", "delete"].includes(method)) {
        try {
          // Fetch fresh CSRF token from backend before the request
          const res = await instance.get("/csrf-token");
          const token = res.data.csrfToken;
          config.headers["X-CSRF-TOKEN"] = token;
        } catch (err) {
          console.warn("⚠️ Failed to fetch CSRF token:", err);
        }
      }
      return config;
    });

    return instance;
  }, [API_BASE]);

  // Fetch current user
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

  // Initialize app
  useEffect(() => {
    if (!isInitialized) {
      fetchCurrentUser();
    }
  }, [isInitialized, fetchCurrentUser]);

  // Login
  const login = async (email, password) => {
    try {
      setLoading(true);
      const res = await api.post("/login", { email, password });
      if (res.data.user) {
        setUser(res.data.user);
        return { success: true, user: res.data.user };
      } else {
        return { success: false, error: "Invalid response from server" };
      }
    } catch (err) {
      let errorMessage = "Login failed. Please try again.";
      if (err.response) {
        const errorData = err.response.data;
        errorMessage =
          errorData?.error ||
          errorData?.message ||
          errorData?.msg ||
          errorData?.detail ||
          (typeof errorData === "string"
            ? errorData
            : `Invalid credentials (${err.response.status})`);
        if (!errorMessage || errorMessage.includes("undefined")) {
          errorMessage =
            err.response.status === 401
              ? "Invalid email or password"
              : `Login failed (Error ${err.response.status})`;
        }
      } else if (err.request) {
        errorMessage = "No response from server. Please check your connection.";
      } else {
        errorMessage = err.message || "An unexpected error occurred.";
      }
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Register
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

  // Logout
  const logout = useCallback(async () => {
    try {
      await api.post("/logout");
    } catch (err) {
      console.error("Logout API error:", err);
    } finally {
      setUser(null);
      setIsInitialized(false); // allow re-fetch after logout
    }
  }, [api]);

  // Change password
  const changePassword = async (current_password, new_password) => {
    try {
      const res = await api.post("/change-password", {
        current_password,
        new_password,
      });
      return {
        success: true,
        message: res.data?.message || "Password changed",
      };
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
