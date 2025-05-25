
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
  login: (credentials: LoginCredentials) => Promise<User | AuthError>;
  signup: (credentials: SignupCredentials) => Promise<User | AuthError>;
  logout: () => Promise<void>;
  initialCourses?: string[]; // For passing initial courses during signup for Firestore
  initialLearningStyles?: string[]; // For passing initial learning styles
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface SignupCredentials extends LoginCredentials {
  // Potentially add other signup fields here if needed in future
  // For now, it's same as LoginCredentials
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  const login = async ({ email, password }: LoginCredentials): Promise<User | AuthError> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      return error as AuthError;
    }
  };

  const signup = async ({ email, password }: SignupCredentials): Promise<User | AuthError> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;
      if (newUser) {
        // Create a user profile document in Firestore
        const userDocRef = doc(db, "users", newUser.uid);
        await setDoc(userDocRef, {
          uid: newUser.uid,
          email: newUser.email,
          courses: ["Astrophysics 101", "Calculus I"], // Default initial courses
          learningStyles: ["Visual"], // Default initial learning style
          createdAt: serverTimestamp(), // Use serverTimestamp
        });
      }
      return newUser;
    } catch (error) {
      return error as AuthError;
    }
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    await signOut(auth);
    setUser(null); // Explicitly set user to null after sign out
    setLoading(false);
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
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
