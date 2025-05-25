
"use client";

import type { ReactNode } from 'react';
import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  type User,
  type AuthError
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase'; // db is imported for Firestore

// Define the shape of the auth context
interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null; // Add error state to the context
  login: (credentials: LoginCredentials) => Promise<User | AuthError | null>;
  signup: (credentials: SignupCredentials) => Promise<User | AuthError | null>;
  logout: () => Promise<void>;
  clearError: () => void; // Add a function to clear errors
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface SignupCredentials extends LoginCredentials {
  // Potentially add other signup fields here if needed in future
}

// Create the context with a default undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Add error state

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  const clearError = () => {
    setError(null);
  };

  const login = async ({ email, password }: LoginCredentials): Promise<User | AuthError | null> => {
    setLoading(true);
    setError(null); // Clear previous errors
    console.log("AuthContext: Attempting login with email:", email);
    try {
      console.log("AuthContext: Firebase auth.app.options before login:", JSON.stringify(auth.app.options, null, 2));
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user); // Set user on successful login
      return userCredential.user;
    } catch (e) {
      const authError = e as AuthError;
      console.error("AuthContext: Firebase Login Error:", authError);
      setError(authError.message || "An unexpected error occurred during login.");
      return authError;
    } finally {
      setLoading(false);
    }
  };

  const signup = async ({ email, password }: SignupCredentials): Promise<User | AuthError | null> => {
    setLoading(true);
    setError(null); // Clear previous errors
    console.log("AuthContext: Attempting signup with email:", email);
    try {
      console.log("AuthContext: Firebase auth.app.options before signup:", JSON.stringify(auth.app.options, null, 2));
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;
      if (newUser) {
        const userDocRef = doc(db, "users", newUser.uid);
        await setDoc(userDocRef, {
          uid: newUser.uid,
          email: newUser.email,
          courses: ["Astrophysics 101", "Calculus I"], // Default initial courses
          learningStyles: ["Visual"], // Default initial learning style
          createdAt: serverTimestamp(),
        });
        console.log("AuthContext: User profile created in Firestore for UID:", newUser.uid);
        setUser(newUser); // Set user on successful signup
      }
      return newUser;
    } catch (e) {
      const authError = e as AuthError;
      console.error("AuthContext: Firebase Signup Error:", authError);
      setError(authError.message || "An unexpected error occurred during signup.");
      return authError;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await signOut(auth);
      setUser(null);
    } catch (e) {
      const authError = e as AuthError;
      console.error("AuthContext: Firebase Logout Error:", authError);
      setError(authError.message || "An unexpected error occurred during logout.");
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error, // Expose error state
    login,
    signup,
    logout,
    clearError, // Expose clearError function
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use the auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
