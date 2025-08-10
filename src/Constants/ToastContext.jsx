import React, {createContext, useContext, useRef, useState} from 'react';
import {Animated, Text, StyleSheet, View, Dimensions} from 'react-native';
import {COLOR} from './Colors';

const ToastContext = createContext(null); // set initial value to null

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const {width} = Dimensions.get('window');

export const ToastProvider = ({children}) => {
  const [toast, setToast] = useState({message: '', type: 'info'});
  const [visible, setVisible] = useState(false);
  const opacity = useRef(new Animated.Value(0)).current;

  const showToast = (message, type = 'info') => {
    setToast({message, type});
    setVisible(true);

    Animated.timing(opacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => setVisible(false));
      }, 3000);
    });
  };

  const getBackgroundColor = () => {
    switch (toast.type) {
      case 'success':
        return COLOR.royalBlue;
      case 'error':
        return '#FF3B30';
      case 'info':
      default:
        return '#007AFF';
    }
  };

  return (
    <ToastContext.Provider value={{showToast}}>
      {children}
      {visible && (
        <Animated.View
          style={[
            styles.toastContainer,
            {backgroundColor: getBackgroundColor(), opacity},
          ]}>
          <Text style={styles.toastText}>{toast.message}</Text>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: 50,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    zIndex: 9999,
    maxWidth: width - 40,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 2},
    elevation: 5,
  },
  toastText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
  },
});
