'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from './types';
import { SEED_USERS } from './seed';
import { supabase, isSupabaseConfigured } from './supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  resetPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  switchRole: (role: Role) => void;
  isAdmin: boolean;
}

const AUTH_STORAGE_KEY = 'fortune_active_user_session';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check saved session in localStorage or Supabase
    const initAuth = async () => {
      try {
        if (isSupabaseConfigured && supabase) {
          const { data } = await supabase.auth.getSession();
          if (data.session?.user) {
            const email = data.session.user.email || '';
            const match = SEED_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
            setUser(
              match || {
                id: data.session.user.id,
                email,
                name: email.split('@')[0],
                role: 'advisor',
              }
            );
            setLoading(false);
            return;
          }
        }

        const saved = localStorage.getItem(AUTH_STORAGE_KEY);
        if (saved) {
          setUser(JSON.parse(saved));
        } else {
          // Default to Rahul Sharma (Advisor) for immediate interactive demo experience
          setUser(SEED_USERS[1]);
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(SEED_USERS[1]));
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password?: string) => {
    try {
      const cleanEmail = email.trim().toLowerCase();
      
      // Match from seed users or dynamic lookup
      const found = SEED_USERS.find((u) => u.email.toLowerCase() === cleanEmail);
      if (found) {
        setUser(found);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(found));
        return { success: true };
      }

      // If user typed custom email
      const customUser: User = {
        id: `usr_${Date.now()}`,
        email: cleanEmail,
        name: cleanEmail.split('@')[0],
        role: cleanEmail.includes('admin') ? 'admin' : 'advisor',
      };
      setUser(customUser);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(customUser));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Login failed' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    if (isSupabaseConfigured && supabase) {
      supabase.auth.signOut();
    }
  };

  const resetPassword = async (email: string) => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) return { success: false, message: error.message };
    }
    return {
      success: true,
      message: `Password reset instructions have been sent to ${email}. Please check your inbox.`,
    };
  };

  const switchRole = (role: Role) => {
    if (!user) return;
    const updated = { ...user, role };
    setUser(updated);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        resetPassword,
        switchRole,
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
