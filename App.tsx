import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
} from 'react-native';
import {LanguageProvider} from './src/localization/LanguageContext';
import {AuthProvider} from './src/Backend/AuthContent';
import {NavigationContainer} from '@react-navigation/native';
import MainNavigation from './src/navigators/MainNavigation';

const App = () => {

  return (
    <LanguageProvider>
      <AuthProvider>
          <NavigationContainer>
            <MainNavigation />
          </NavigationContainer>
      </AuthProvider>
    </LanguageProvider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'red',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
