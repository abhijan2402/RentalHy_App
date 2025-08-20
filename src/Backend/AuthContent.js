import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        const storedToken = await AsyncStorage.getItem('token');
        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
        }
      } catch (e) {
        console.log('Error loading user data:', e);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Wrapper setters that save to AsyncStorage
  const saveUser = async (userData) => {
    try {
      if (userData) {
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
      } else {
        await AsyncStorage.removeItem('user');
        setUser(null);
      }
    } catch (e) {
      console.log('Error saving user', e);
    }
  };

  const saveToken = async (tokenData) => {
    try {
      if (tokenData) {
        await AsyncStorage.setItem('token', tokenData);
        setToken(tokenData);
      } else {
        await AsyncStorage.removeItem('token');
        setToken(null);
      }
    } catch (e) {
      console.log('Error saving token', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser: saveUser,
        token,
        setToken: saveToken,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
