'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth, firebaseEnabled } from '@/lib/firebase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firebaseEnabled) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signup = (email, password) => {
    if (!firebaseEnabled) {
      return Promise.reject(new Error('Firebase is not configured. Please add your Firebase credentials to enable signup.'));
    }
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const login = (email, password) => {
    if (!firebaseEnabled) {
      return Promise.reject(new Error('Firebase is not configured. Please add your Firebase credentials to enable login.'));
    }
    return signInWithEmailAndPassword(auth, email, password);
  };
  
  const loginWithGoogle = () => {
    if (!firebaseEnabled) {
        return Promise.reject(new Error('Firebase is not configured.'));
    }
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  const logout = async () => {
    setUser(null);
    if (!firebaseEnabled) return;
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout, firebaseEnabled, loginWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
