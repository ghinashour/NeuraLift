import React, { createContext, useState, useEffect } from "react";

export const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = () => {
    try {
      const savedToken = localStorage.getItem("adminToken");
      const savedAdmin = localStorage.getItem("admin");

      if (savedToken && savedAdmin) {
        if (isTokenValid(savedToken)) {
          setToken(savedToken);
          setAdmin(JSON.parse(savedAdmin));
        } else {
          clearAuthData();
        }
      }
    } catch (error) {
      console.error("Error initializing auth:", error);
      clearAuthData();
    } finally {
      setLoading(false);
    }
  };

  const isTokenValid = (token) => {
    if (!token) return false;

    if (token.split('.').length !== 3) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.exp && Date.now() >= payload.exp * 1000) {
        return false;
      }
      return true;
    } catch {
      return false;
    }
  };

  const clearAuthData = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");
    setAdmin(null);
    setToken(null);
  };

  const login = (data) => {
    if (!data.token || !data.admin) {
      console.error("Invalid login data: missing token or admin info");
      return false;
    }

    try {
      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("admin", JSON.stringify(data.admin));
      setAdmin(data.admin);
      setToken(data.token);
      return true;
    } catch (error) {
      console.error("Error saving auth data:", error);
      return false;
    }
  };

  const logout = () => {
    clearAuthData();
  };

  const isAuthenticated = () => {
    return !!(token && admin);
  };

  const getAuthHeader = () => {
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const value = {
    admin,
    token,
    loading,
    login,
    logout,
    isAuthenticated: isAuthenticated(),
    getAuthHeader
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};