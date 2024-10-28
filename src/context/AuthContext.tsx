"use client"
import React, { createContext, useEffect, useState, ReactNode } from 'react';
import { auth } from '@/firebaseConfig';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  GithubAuthProvider, 
  signOut, 
  User, 
  signInWithPopup, 
  GoogleAuthProvider, 
  createUserWithEmailAndPassword, 
  updateProfile, 
  getAuth
} from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  signupWithEmail: (email: string, password: string, displayName: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithGithub: () => Promise<void>; // Add this
  signupWithGoogle: () => Promise<void>;
  signupWithGithub: () => Promise<void>; // Add this
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Create providers outside of the functions to avoid recreating them
  const githubProvider = new GithubAuthProvider();
  const googleProvider = new GoogleAuthProvider();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithEmail = async (email: string, password: string) => {
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(err.message);
      throw err; // Propagate error to component
    }
  };

  const signupWithEmail = async (email: string, password: string, displayName: string) => {
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName });
        setUser(userCredential.user);
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const loginWithGoogle = async () => {
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const loginWithGithub = async () => {
    setError(null);
    try {
      await signInWithPopup(auth, githubProvider);
    } catch (err: any) {
      // Handle specific GitHub errors
      if (err.code === 'auth/account-exists-with-different-credential') {
        setError('An account already exists with the same email address but different sign-in credentials. Try signing in using a different method.');
      } else {
        setError(err.message);
      }
      throw err;
    }
  };

  const signupWithGithub = async () => {
    setError(null);
    try {
      const result = await signInWithPopup(auth, githubProvider);
      setUser(result.user);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const signupWithGoogle = async () => {
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      error,
      loginWithEmail,
      signupWithEmail,
      loginWithGoogle,
      loginWithGithub, // Add this
      signupWithGoogle,
      signupWithGithub, // Add this
      logout
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};