"use client"
import React, { createContext, useContext, useState } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => void;
  signUp: (email: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC | any = ({ children }:any) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const signIn = (email: string, password: string) => {
    setIsAuthenticated(true);
  };

  const signUp = (email: string, password: string) => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, signIn, signUp, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
