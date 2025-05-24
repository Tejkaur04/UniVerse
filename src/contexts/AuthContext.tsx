
"use client";

import type { User as FirebaseUser, AuthError } from "firebase/auth";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import type { z } from "zod";
import type { loginSchema, signupSchema } from "@/lib/auth-schemas"; // We'll create this file next

interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
  login: (data: z.infer<typeof loginSchema>) => Promise<FirebaseUser | AuthError>;
  signup: (data: z.infer<typeof signupSchema>) => Promise<FirebaseUser | AuthError>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (data: z.infer<typeof loginSchema>) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      return userCredential.user;
    } catch (error) {
      return error as AuthError;
    }
  };

  const signup = async (data: z.infer<typeof signupSchema>) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      return userCredential.user;
    } catch (error) {
      return error as AuthError;
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
