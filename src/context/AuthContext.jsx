import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();
// Ensure API_URL doesn't end with a slash for consistent concatenation
const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "");
if (!API_URL) {
  console.warn("[AuthContext]: VITE_API_URL is undefined. API calls may fail.");
} else {
  console.log(`[AuthContext]: Using backend at ${API_URL}`);
}

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('inventory_user');
    const token = localStorage.getItem('inventory_token');
    
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      console.log(`Attempting login at: ${API_URL}/auth/login`);
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('inventory_token', data.token);
        localStorage.setItem('inventory_user', JSON.stringify(data.user));
        setUser(data.user);
        return { success: true };
      } else {
        return { success: false, message: data.message || 'Login failed' };
      }
    } catch (err) {
      console.error("Login context error:", err);
      return { success: false, message: `Connection error: ${err.message}` };
    }
  };

  const signup = async (username, email, password) => {
    try {
      console.log(`Attempting signup at: ${API_URL}/auth/signup`);
      const res = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('inventory_token', data.token);
        localStorage.setItem('inventory_user', JSON.stringify(data.user));
        setUser(data.user);
        return { success: true };
      } else {
        return { success: false, message: data.message || 'Signup failed' };
      }
    } catch (err) {
      console.error("Signup context error:", err);
      return { success: false, message: `Connection error: ${err.message}` };
    }
  };

  const logout = () => {
    localStorage.removeItem('inventory_token');
    localStorage.removeItem('inventory_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};
