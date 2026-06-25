"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { getToken, getUser, logout as removeAuth } from "@/lib/auth";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  refreshUser: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = () => {
    const token = getToken();

    setIsAuthenticated(!!token);

    setUser(getUser());

    setIsLoading(false);
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const logout = () => {
    removeAuth();

    setUser(null);

    setIsAuthenticated(false);

    setIsLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        refreshUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
