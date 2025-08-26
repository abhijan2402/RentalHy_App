import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentStatus, setCurrentStatus] = useState(-1);


  // 👇 New state for DemoCard
  const [showDemoCard, setShowDemoCard] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        const storedToken = await AsyncStorage.getItem('token');
        const seenDemo = await AsyncStorage.getItem('seenDemo'); // 👈 check demo flag

        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
          setCurrentStatus(1)

          // show demo only if user has not seen it yet
          if (!seenDemo) {
            setShowDemoCard(true);
            await AsyncStorage.setItem('seenDemo', 'true');
          } else {
            setShowDemoCard(false);
          }
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

        // Reset demo when user logs in again
        await AsyncStorage.removeItem('seenDemo');
        setShowDemoCard(true);
        await AsyncStorage.setItem('seenDemo', 'true');
      } else {
        await AsyncStorage.removeItem('user');
        setUser(null);

        // Reset demo flag on logout
        await AsyncStorage.removeItem('seenDemo');
        setShowDemoCard(false);
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
        showDemoCard,      // 👈 expose state
        setShowDemoCard,   // 👈 expose setter
        currentStatus,
        setCurrentStatus: setCurrentStatus
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
