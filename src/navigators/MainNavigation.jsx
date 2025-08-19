import React, {useContext} from 'react';
import {View, ActivityIndicator} from 'react-native';
import {AuthContext} from '../Backend/AuthContent'; // 👈 confirm this path!
import RootNavigation from './RootNavigation';
import AuthStack from './AuthNavigation';
import {ToastProvider, useToast} from '../Constants/ToastContext';

const MainNavigation = () => {
  const auth = useContext(AuthContext);

  if (!auth) {
    console.error('AuthContext not found');
    return null;
  }

  const {user, loading} = auth;


  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={{flex: 1}}>
      <ToastProvider>
        {user ? <RootNavigation /> : <AuthStack />}
      </ToastProvider>
    </View>
  );
};

export default MainNavigation;
