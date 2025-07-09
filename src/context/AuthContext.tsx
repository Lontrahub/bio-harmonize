
"use client";

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, onSnapshot } from "firebase/firestore";

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  createdAt: any; // Firestore Timestamp
  role: 'user' | 'admin';
  cleanseStartDate?: any; // Optional: Firestore Timestamp
  personalShoppingItems?: { text: string; completed: boolean }[];
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({ user: null, userProfile: null, loading: true });

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth || !db) {
      setLoading(false);
      return;
    }

    const authUnsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        const userDocRef = doc(db, "users", user.uid);
        // Use onSnapshot to listen for real-time updates to the user profile
        const unsub = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            setUserProfile(docSnap.data() as UserProfile);
          } else {
            setUserProfile(null);
          }
          setLoading(false);
        }, (error) => {
          console.error("Error fetching user profile:", error);
          setUserProfile(null);
          setLoading(false);
        });
        
        // Return the onSnapshot listener's unsubscribe function
        // It will be called when the user logs out.
        return unsub;

      } else {
        setUser(null);
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => authUnsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, userProfile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
