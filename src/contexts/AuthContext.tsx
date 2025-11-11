import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthContextType, User, LoginRequest, RegisterRequest } from '../types/auth';
import { authService } from '../services/authService';

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const isAuthenticated = !!token && !!user;

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = authService.getToken();
        const storedUser = authService.getUserData();

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(storedUser);
          
          // Verify token is still valid by fetching current user
          try {
            const currentUser = await authService.getCurrentUser();
            setUser(currentUser);
            authService.setUserData(currentUser);
          } catch (error) {
            // Token is invalid, clear auth state
            authService.removeToken();
            setToken(null);
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        authService.removeToken();
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginRequest): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await authService.login(credentials);
      
      if (response.success) {
        const { user: userData, token: userToken } = response.data;
        
        setUser(userData);
        setToken(userToken);
        
        authService.setToken(userToken);
        authService.setUserData(userData);
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterRequest): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await authService.register(userData);
      
      if (response.success) {
        const { user: newUser, token: userToken } = response.data;
        
        setUser(newUser);
        setToken(userToken);
        
        authService.setToken(userToken);
        authService.setUserData(newUser);
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    try {
      authService.logout().catch(console.error); // Fire and forget
      authService.removeToken();
      setUser(null);
      setToken(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const refreshToken = async (): Promise<void> => {
    try {
      const response = await authService.refreshToken();
      const newToken = response.token;
      
      setToken(newToken);
      authService.setToken(newToken);
    } catch (error) {
      console.error('Token refresh error:', error);
      logout();
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
