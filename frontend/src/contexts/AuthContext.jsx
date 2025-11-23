import { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await api.get('/auth/me');
      setUser(response.data.data.user);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      localStorage.removeItem('accessToken');
    } finally {
      setLoading(false);
    }
  };

const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  const { user, accessToken } = response.data.data;
  
  console.log('Login successful, token:', accessToken.substring(0, 20) + '...'); // ← Debug
  
  localStorage.setItem('accessToken', accessToken);
  setUser(user);
  
  return user;
};


  const register = async (name, email, password) => {
    const response = await api.post('/auth/register', { name, email, password });
    const { user, accessToken } = response.data.data;
    
    localStorage.setItem('accessToken', accessToken);
    setUser(user);
    
    return user;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
