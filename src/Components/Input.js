import React, { useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { COLOR } from '../Constants/Colors';

const eyeOpen = 'https://cdn-icons-png.flaticon.com/128/159/159604.png';
const eyeClosed = 'https://cdn-icons-png.flaticon.com/128/10812/10812267.png';

const Input = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  style,
  labelStyle,
  mainStyle,
  inputContainerStyle,
  showPasswordToggle = true,
  fullWidth = false,
  ...rest
}) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const canTogglePassword = secureTextEntry && showPasswordToggle;

  return (
    <View
      style={[styles.inputWrapper, fullWidth && styles.fullWidth, mainStyle]}>
      {!!label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
      <View style={[styles.inputContainer, inputContainerStyle]}>
        <TextInput
          placeholder={placeholder}
          placeholderTextColor="#9aa0aa"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !passwordVisible}
          keyboardType={keyboardType}
          style={[styles.input, canTogglePassword && styles.passwordInput, style]}
          {...rest}
        />
        {canTogglePassword && (
          <TouchableOpacity
            activeOpacity={0.65}
            accessibilityRole="button"
            accessibilityLabel={passwordVisible ? 'Hide password' : 'Show password'}
            style={styles.eyeButton}
            onPress={() => setPasswordVisible(visible => !visible)}>
            <Image
              source={{ uri: passwordVisible ? eyeOpen : eyeClosed }}
              style={styles.eyeIcon}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  inputWrapper: {
    width: '84%',
    alignSelf: 'center',
    marginBottom: 15,
  },
  fullWidth: {
    width: '100%',
  },
  label: {
    marginBottom: 7,
    fontSize: 13,
    fontWeight: '600',
    color: '#343840',
  },
  inputContainer: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLOR.white,
    borderWidth: 1,
    borderColor: '#dfe2e7',
    borderRadius: 14,
  },
  input: {
    flex: 1,
    minHeight: 50,
    paddingHorizontal: 15,
    paddingVertical: 11,
    fontSize: 15,
    color: COLOR.black,
  },
  passwordInput: {
    paddingRight: 6,
  },
  eyeButton: {
    width: 46,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyeIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: '#737a85',
  },
});
