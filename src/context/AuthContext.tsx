"use client"
import React, { createContext, useEffect, useState, ReactNode } from 'react';
import { auth } from '../firebaseConfig';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword , updateProfile} from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  signupWithEmail: (email: string, password: string, displayName: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  signupWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithEmail = async (email: string, password: string) => {
    setError(null); // Reset error
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(err.message); // Capture the error message
    }
  };

  const signupWithEmail = async (email: string, password: string, displayName: string) => {
    setError(null); // Reset error
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      if (user) {
        // Update profile with displayName
        await updateProfile(user, { displayName });
        setUser(user);
      }
    } catch (err: any) {
      setError(err.message); // Capture the error message
    }
  };

  const loginWithGoogle = async () => {
    setError(null); // Reset error
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      setError(err.message); // Capture the error message
    }
  };

  const signupWithGoogle = async () => {
    setError(null); // Reset error
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      setUser(user);
    } catch (err: any) {
      setError(err.message); // Capture the error message
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, loginWithEmail, signupWithEmail, loginWithGoogle, signupWithGoogle, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
