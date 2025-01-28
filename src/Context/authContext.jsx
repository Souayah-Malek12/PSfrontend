import { createContext, useContext, useState } from "react";
import React from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return JSON.parse(localStorage.getItem("isAuthenticated")) || false; // Ensure it's parsed as a boolean
  });
  const [role, setRole] = useState(() => {
    return localStorage.getItem("role") || null;
  });

  const login = (role) => {
    setIsAuthenticated(true);
    setRole(role);
    localStorage.setItem("isAuthenticated", JSON.stringify(true)); // Save as boolean
    localStorage.setItem("role", role);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setRole(null);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("role");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
