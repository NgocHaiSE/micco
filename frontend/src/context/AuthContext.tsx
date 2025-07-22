import React, { createContext, useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

type User = {
  id: string;
  email: string;
};

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData?: Record<string, any>) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userEmail = localStorage.getItem('userEmail');
    
    if (isLoggedIn === 'true' && userEmail) {
      setUser({
        id: '1',
        email: userEmail
      });
    }
    setLoading(false);
  }, []);

  const handleSignIn = async (email: string, password: string) => {
    setError(null);
    if (email === 'admin@gmail.com' && password === '123') {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', email);
      setUser({ id: '1', email });
    } else {
      setError('Invalid credentials. Use admin@gmail.com / 123');
      throw new Error('Invalid credentials');
    }
  };

  const handleSignUp = async (email: string, password: string) => {
    setError(null);
    // Mock signup
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userEmail', email);
    setUser({ id: '1', email });
  };

  const handleSignOut = async () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    setUser(null);
  };

  const handleResetPassword = async (email: string) => {
    setError(null);
    // Mock reset
  };

  const clearError = () => setError(null);

  const value = {
    user,
    loading,
    error,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    resetPassword: handleResetPassword,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }
  
  return <>{children}</>;
};