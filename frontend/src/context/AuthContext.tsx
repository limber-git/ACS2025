import { createContext, useContext, useState, ReactNode } from 'react';
import { UserInfo } from '../types/auth';
import { api } from '../services/api';

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserInfo | null;
  login: (token: string, userData: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!sessionStorage.getItem('token'));
  const [user, setUser] = useState<UserInfo | null>(() => {
    const savedUser = sessionStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (token: string, userData: any) => {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = async () => {
    const token = sessionStorage.getItem('token');
    if (token) {
      try {
        await api.logout(token);
      } catch (error) {
        console.error('Error durante logout:', error);
      }
    }
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
