import { useState, useEffect, createContext, useContext, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import type {
  AuthContextValue,
  LoginCredentials,
  UserWithSession,
  PageProps
} from '../types/auth';

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: false,
  login: async () => {
    throw new Error('useAuth must be used within an AuthProvider');
  },
  logout: async () => {
    throw new Error('useAuth must be used within an AuthProvider');
  }
});

export const AuthProvider = ({ children }: PageProps) => {
  const [user, setUser] = useState<UserWithSession | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const initAuth = async () => {
      try {
        const userData = await authService.getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error('Auth initialization failed:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<UserWithSession> => {
    try {
      setLoading(true);
      const userData = await authService.login(credentials);
      setUser(userData);
      navigate('/quiz');
      return userData;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  return context;
};

// Hook version for direct use
export default function useAuthHook() {
  const [user, setUser] = useState<UserWithSession | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const userData = await authService.getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error('Auth initialization failed:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<UserWithSession> => {
    try {
      setLoading(true);
      const userData = await authService.login(credentials);
      setUser(userData);
      navigate('/quiz');
      return userData;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return {
    user,
    loading,
    login,
    logout,
  };
}