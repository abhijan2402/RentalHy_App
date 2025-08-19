import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaView, StatusBar, StyleSheet, Text} from 'react-native';
import MainNavigation from './src/navigators/MainNavigation';
import {AuthProvider} from './src/Backend/AuthContent';

const App = () => {
  return (
    // <LanguageProvider>
      <AuthProvider>
        <SafeAreaView style={styles.safeArea}>
          <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
          <NavigationContainer>
            <MainNavigation />
          </NavigationContainer>
        </SafeAreaView>
      </AuthProvider>
    // {/* </LanguageProvider> */}
  );
};

export default App;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});
