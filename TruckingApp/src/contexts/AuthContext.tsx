import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login as loginApi } from '../api/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await AsyncStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
        // Here you might want to fetch user data based on the token
        // For now, we'll just set a dummy user
        setUser({ name: 'Driver' });
      }
      setLoading(false);
    };
    loadToken();
  }, []);

  const login = async (credentials) => {
    try {
      const data = await loginApi(credentials);
      setToken(data.token);
      setUser({ name: 'Driver' }); // You might want to get user from response
      await AsyncStorage.setItem('token', data.token);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    await AsyncStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
