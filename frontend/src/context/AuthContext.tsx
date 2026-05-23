import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (name: string, avatarUrl: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if session exists in localStorage
    const savedUser = localStorage.getItem('saarthi_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('saarthi_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Simple email checks
    if (!email.includes('@') || password.length < 4) {
      setLoading(false);
      return false;
    }

    // Default mock user credentials or check in localStorage mock db
    const mockUsersStr = localStorage.getItem('saarthi_mock_users') || '[]';
    const mockUsers = JSON.parse(mockUsersStr) as User[];
    
    // Check if user exists in local database, otherwise default to a generated session
    const existingUser = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());

    const loggedInUser: User = existingUser || {
      id: Math.random().toString(36).substring(2, 9),
      email: email.toLowerCase(),
      name: email.split('@')[0].replace(/^\w/, (c) => c.toUpperCase()),
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email)}`,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem('saarthi_user', JSON.stringify(loggedInUser));
    setUser(loggedInUser);
    setLoading(false);
    return true;
  };

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (!email.includes('@') || password.length < 4 || !name.trim()) {
      setLoading(false);
      return false;
    }

    const newUser: User = {
      id: Math.random().toString(36).substring(2, 9),
      email: email.toLowerCase(),
      name: name.trim(),
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`,
      createdAt: new Date().toISOString(),
    };

    // Store in mock users array
    const mockUsersStr = localStorage.getItem('saarthi_mock_users') || '[]';
    const mockUsers = JSON.parse(mockUsersStr) as User[];
    
    // Avoid double signups
    if (mockUsers.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      setLoading(false);
      return false;
    }

    mockUsers.push(newUser);
    localStorage.setItem('saarthi_mock_users', JSON.stringify(mockUsers));

    // Log the user in
    localStorage.setItem('saarthi_user', JSON.stringify(newUser));
    setUser(newUser);
    setLoading(false);
    return true;
  };

  const logout = () => {
    localStorage.removeItem('saarthi_user');
    setUser(null);
  };

  const updateProfile = (name: string, avatarUrl: string) => {
    if (!user) return;
    const updatedUser = { ...user, name, avatarUrl };
    localStorage.setItem('saarthi_user', JSON.stringify(updatedUser));
    setUser(updatedUser);

    // Also update in registered list if exists
    const mockUsersStr = localStorage.getItem('saarthi_mock_users') || '[]';
    const mockUsers = JSON.parse(mockUsersStr) as User[];
    const index = mockUsers.findIndex((u) => u.id === user.id);
    if (index !== -1) {
      mockUsers[index] = { ...mockUsers[index], name, avatarUrl };
      localStorage.setItem('saarthi_mock_users', JSON.stringify(mockUsers));
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    signup,
    logout,
    updateProfile,
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
