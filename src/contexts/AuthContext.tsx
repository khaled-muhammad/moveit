import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { api } from '../consts.js';
import toast from 'react-hot-toast';

interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  profile_picture?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  register: (userData: {
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    password: string;
    profile_picture?: File;
  }) => Promise<{ success: boolean; errors?: Record<string, string[]> }>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<boolean>;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuthStatus = async (): Promise<{ isAuthenticated: boolean; user?: User }> => {
    try {
      const response = await api.get('/auth/me', {
        withCredentials: true
      });

      if (response.data.user) {
        return {
          isAuthenticated: true,
          user: response.data.user
        };
      }

      return { isAuthenticated: false };
    } catch (error) {
      if (error.response?.status === 401) {
        return { isAuthenticated: false };
      }
      return { isAuthenticated: false };
    }
  };

  const initializeAuth = async () => {
    setIsLoading(true);
    
    try {
      const authStatus = await checkAuthStatus();
      
      if (authStatus.isAuthenticated && authStatus.user) {
        setUser(authStatus.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
    }
    
    setIsLoading(false);
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const response = await api.post('/auth/login/', {
        username,
        password
      }, {
        withCredentials: true
      });
      console.log("HEREEEEEE")
      if (response.data.user) {
        const userData = response.data.user;
        setUser(userData);
        setIsAuthenticated(true);
        toast.success('Login successful!');
        return true;
      } else {
        console.log(response)
        toast.error(response.data.detail || 'Login failed 1');
        return false;
      }
    } catch (error: any) {
      // console.log(error)
      const errorMessage = error.response?.data?.detail || 'Login failed 2';
      toast.error(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: {
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    password: string;
    profile_picture?: File;
  }): Promise<{ success: boolean; errors?: Record<string, string[]> }> => {
    try {
      setIsLoading(true);
      
      const formData = new FormData();
      formData.append('first_name', userData.first_name);
      formData.append('last_name', userData.last_name);
      formData.append('username', userData.username);
      formData.append('email', userData.email);
      formData.append('password', userData.password);

      if (userData.profile_picture) {
        formData.append('profile_picture', userData.profile_picture);
      }

      const response = await api.post('/auth/register/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true
      });

      if (response.data.user) {
        const userData = response.data.user;
        setUser(userData);
        setIsAuthenticated(true);
        toast.success('Registration successful!');
        return { success: true };
      } else {
        toast.error(response.data.detail || 'Registration failed');
        return { success: false };
      }
    } catch (error: any) {
      if (error.response?.data && error.response.status === 400) {
        return {
          success: false, 
          errors: error.response.data 
        }
      } else {
        const errorMessage = error.response?.data?.detail || 'Registration failed'
        toast.error(errorMessage)
        return { success: false }
      }
    } finally {
      setIsLoading(false)
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout/', {}, { 
        withCredentials: true 
      }).then((res) => {
        window.location.href = window.location.origin + '/login';
      });
    } catch (error) { /* continue with local storage */ } finally {
      setUser(null);
      setIsAuthenticated(false);
      toast('Logged out successfully');
      
      window.dispatchEvent(new CustomEvent('authLogout'));
    }
  };

  const refreshAuth = async (): Promise<boolean> => {
    try {
      const refreshResponse = await api.post('/auth/refresh/', {}, {
        withCredentials: true
      });

      if (refreshResponse.data.success) {
        const authStatus = await checkAuthStatus();
        
        if (authStatus.isAuthenticated && authStatus.user) {
          setUser(authStatus.user);
          setIsAuthenticated(true);
          return true;
        }
      }
      
      setUser(null);
      setIsAuthenticated(false);
      return false;
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      return false;
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    const checkAuth = async () => {
      const authStatus = await checkAuthStatus();
      
      if (!authStatus.isAuthenticated) {
        setUser(null);
        setIsAuthenticated(false);
        toast.error('Session expired. Please login again.');
      } else if (authStatus.user) {
        setUser(authStatus.user);
      }
    };

    checkAuth();

    const interval = setInterval(checkAuth, 5 * 60 * 1000); // as backend is set to 5 mins too

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  useEffect(() => {
    const handleAuthLogout = () => {
      setUser(null);
      setIsAuthenticated(false);
    };

    const handleTokenRefreshed = (e: CustomEvent) => {
      if (e.detail?.user) {
        setUser(e.detail.user);
        setIsAuthenticated(true);
      }
    };

    window.addEventListener('authLogout', handleAuthLogout as EventListener);
    window.addEventListener('tokenRefreshed', handleTokenRefreshed as EventListener);
    
    return () => {
      window.removeEventListener('authLogout', handleAuthLogout as EventListener);
      window.removeEventListener('tokenRefreshed', handleTokenRefreshed as EventListener);
    };
  }, []);

  useEffect(() => {
    initializeAuth();
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    refreshAuth,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};