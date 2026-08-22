/**
 * AuthContext — provides auth state to the whole app.
 *
 * Teammates use:
 *   import { useAuth } from '../context/AuthContext';
 *   const { user, token, signin, signout } = useAuth();
 *
 * user shape: { _id, employeeId, name, email, role, department, jobTitle, phone, address, profilePicture }
 */
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  });

  const signin = (newToken, newUser) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const signout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  // Allow teammates to update the cached user (e.g. after profile edit)
  const updateUser = (updated) => {
    localStorage.setItem('user', JSON.stringify(updated));
    setUser(updated);
  };

  return (
    <AuthContext.Provider value={{ user, token, signin, signout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
