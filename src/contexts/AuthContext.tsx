
"use client";

import type { ReactNode } from 'react';
import React, { createContext, useContext, useEffect, useState } from 'react';

// Define a simpler User type for mock auth
interface MockUser {
  uid: string;
  email: string;
}

// Define the shape of the auth context
interface AuthContextType {
  user: MockUser | null;
  loading: boolean; // Keep loading for potential UI consistency, though it will be quick
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<MockUser | { error: string } | null>;
  signup: (credentials: SignupCredentials) => Promise<MockUser | { error: string } | null>;
  logout: () => Promise<void>;
  clearError: () => void;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface SignupCredentials extends LoginCredentials {}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const [user, setUser] = useState<MockUser | null>(null);
  const [loading, setLoading] = useState(false); // Default to false as it's mock
  const [error, setError] = useState<string | null>(null);

  // Simulate checking auth state on mount (e.g., from localStorage if you extend this)
  useEffect(() => {
    // For a truly simple mock, we can start logged out.
    // Or, you could try to load a mock user from localStorage here.
    // For now, just ensure loading is false.
    setLoading(false);
  }, []);

  const clearError = () => {
    setError(null);
  };

  const login = async ({ email, password }: LoginCredentials): Promise<MockUser | { error: string } | null> => {
    setLoading(true);
    setError(null);
    console.log("AuthContext (Mock): Attempting login with email:", email);

    // Basic validation (can be expanded)
    if (!email || !password) {
      setError("Email and password are required.");
      setLoading(false);
      return { error: "Email and password are required." };
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters (mock validation).");
      setLoading(false);
      return { error: "Password must be at least 6 characters (mock validation)." };
    }

    // Simulate a successful login
    const mockUser: MockUser = {
      email: email,
      uid: `mock-uid-${Date.now()}`,
    };
    setUser(mockUser);
    setLoading(false);
    console.log("AuthContext (Mock): Login successful. User:", mockUser);
    return mockUser;
  };

  const signup = async ({ email, password }: SignupCredentials): Promise<MockUser | { error: string } | null> => {
    setLoading(true);
    setError(null);
    console.log("AuthContext (Mock): Attempting signup with email:", email);

    if (!email || !password) {
      setError("Email and password are required.");
      setLoading(false);
      return { error: "Email and password are required." };
    }
     if (password.length < 6) {
        setError("Password must be at least 6 characters (mock validation).");
        setLoading(false);
        return { error: "Password must be at least 6 characters (mock validation)." };
    }


    // Simulate successful signup
    const newUser: MockUser = {
      email: email,
      uid: `mock-uid-${Date.now()}`,
    };
    setUser(newUser); // Log the user in immediately after signup
    setLoading(false);
    console.log("AuthContext (Mock): Signup successful. User:", newUser);
    return newUser;
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    setUser(null);
    console.log("AuthContext (Mock): Logout successful.");
    setLoading(false);
  };

  const value = {
    user,
    loading,
    error,
    login,
    signup,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
