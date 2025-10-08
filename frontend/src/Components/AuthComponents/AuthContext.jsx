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
  // explicit, stable base URL: prefer env, else detect prod hostname, else use relative /api for local dev
  const API_BASE =
    import.meta?.env?.VITE_API_BASE ||
    (typeof window !== "undefined" && window.location.hostname.includes("dratifshahzad")
      ? "https://api.dratifshahzad.com/api"
      : "/api");

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [csrfToken, setCsrfToken] = useState(null);

  const api = useMemo(() => {
    const instance = axios.create({
      baseURL: API_BASE,
      headers: { "Content-Type": "application/json" },
      withCredentials: true, // crucial so cookies are sent/received across subdomains
    });

    // Let axios auto-read cookie named XSRF-TOKEN and send X-XSRF-TOKEN header if cookie exists
    instance.defaults.xsrfCookieName = "XSRF-TOKEN";
    instance.defaults.xsrfHeaderName = "X-XSRF-TOKEN";

    return instance;
  }, [API_BASE]);

  const fetchCsrfToken = useCallback(async () => {
    try {
      // Server should return the token in body and (preferably) set the same cookie.
      const res = await api.get("/csrf-token");
      const token = res?.data?.csrfToken || null;
      if (token) {
        setCsrfToken(token);
        // Make token authoritative for all future requests
        api.defaults.headers.common["X-CSRF-TOKEN"] = token;
        api.defaults.headers.common["X-XSRF-TOKEN"] = token;
        api.defaults.headers.common["X-CSRFToken"] = token;
      }
      return token;
    } catch (err) {
      console.warn("fetchCsrfToken failed:", err);
      return null;
    }
  }, [api]);

  const fetchCurrentUser = useCallback(async () => {
    try {
      const res = await api.get("/me");
      setUser(res.data.user || null);
    } catch (err) {
      if (err?.response?.status === 401) setUser(null);
      else console.error("fetchCurrentUser error:", err);
    } finally {
      setIsInitialized(true);
    }
  }, [api]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await fetchCsrfToken();
      await fetchCurrentUser();
      setLoading(false);
    })();
  }, [fetchCsrfToken, fetchCurrentUser]);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const res = await api.post("/login", { email, password });
      if (res.data.user) {
        setUser(res.data.user);
        await fetchCsrfToken(); // refresh token after login
        return { success: true, user: res.data.user };
      }
      return { success: false, error: "Invalid response from server" };
    } catch (err) {
      let errorMessage = "Login failed. Please try again.";
      if (err.response) {
        const data = err.response.data;
        errorMessage =
          data?.error || data?.message || `Login failed (${err.response.status})`;
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
        await fetchCsrfToken();
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
    csrfToken,
    fetchCsrfToken,
    login,
    register,
    logout,
    fetchCurrentUser,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
