import React, { useContext, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
  TouchableOpacity,
  Image,
} from 'react-native';
import { COLOR } from '../../Constants/Colors';
import CustomButton from '../../Components/CustomButton';
import Input from '../../Components/Input';
import { AuthContext } from '../../Backend/AuthContent';
import { useApi } from '../../Backend/Api';
import { useToast } from '../../Constants/ToastContext';
import messaging from '@react-native-firebase/messaging';

const Login = ({ navigation }) => {
  const { postRequest } = useApi();
  const { showToast } = useToast();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser, setToken, setCurrentStatus } = useContext(AuthContext);
const getFcmToken = async () => {
    const token = await messaging().getToken();
    console.log('FCM TOKEN:', token);
    return token;
  };

  const loginUser = async () => {
    setUser(null);
    const trimmedIdentifier = identifier?.trim();
    const trimmedPassword = password?.trim();
const token =await getFcmToken()
    if (!trimmedIdentifier) {
      showToast('Email or Mobile number is required', 'error');
      return;
    }

    if (!trimmedPassword) {
      showToast('Password is required', 'error');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('email', trimmedIdentifier);
    formData.append('password', trimmedPassword);
    formData.append('device_id', token||"i0909");
    // formData.append('device_type', Platform.OS=="android"?"android":"ios");
console.log(formData,"FOMR____DDD");


    const response = await postRequest('public/api/login', formData, true);

    if (response?.data?.token) {
      setToken(response?.data?.token);
      setUser(response?.data?.user);
      setCurrentStatus(1);
      // console.log(response?.data?.user?.registration_step, 'LOOFFFFF');

      // setUser(response?.data);
      // return;
      if (response?.data?.user?.status == 'PENDING') {
        if (response?.data?.user?.has_shop == false) {
          if (response?.data?.user?.registration_step == 1) {
            navigation.navigate('CreateProfile', {
              userId: response?.data?.user?.id,
            });
          } else if (response?.data?.user?.registration_step == 2) {
            navigation.navigate('ShopProfileNew', {
              user_id: response?.data?.user?.id,
              userDetails: response?.data,
            });
          }
        } else {
          showToast('Your shop is under review', 'error');
          // setUser(response?.data);
        }
      } else if (response?.data?.user?.status == 'VERIFIED') {
        setUser(response?.data);
      }
      setLoading(false);
    } else {
      setLoading(false);
      // Alert.alert('Error', response?.error || 'Login failed');
      showToast(response?.error, 'error');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          <View style={styles.brandSection}>
          <Image
              style={styles.logo}
              source={{ uri: 'https://i.postimg.cc/59BKnJZJ/second-page-1.jpg' }}
              resizeMode="contain"
          />
            <Text style={styles.welcomeTitle}>Welcome back</Text>
            <Text style={styles.welcomeSubtitle}>
              Sign in to continue exploring spaces and managing bookings.
            </Text>
          </View>

          <View style={styles.formCard}>
            <Input
              fullWidth
              label="Email or mobile number"
              placeholder="Enter your email or mobile number"
              value={identifier}
              onChangeText={setIdentifier}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Input
              fullWidth
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />
            <View style={styles.forgotRow}>
              <TouchableOpacity
                onPress={() => navigation.navigate('ForgotPassword')}>
                <Text style={styles.forgotText}>
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            </View>
            <CustomButton
              loading={loading}
              title="Login"
              onPress={loginUser}
              style={styles.loginButton}
            />
            <View style={styles.footerRow}>
              <Text style={styles.footerText}>New to RentalHy? </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('SignUp')}>
                <Text style={styles.linkText}>Create account</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f7fb',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    paddingVertical: 32,
  },
  brandSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 150,
    height: 92,
    marginBottom: 10,
  },
  welcomeTitle: {
    fontSize: 27,
    fontWeight: '700',
    color: '#20242a',
    textAlign: 'center',
  },
  welcomeSubtitle: {
    maxWidth: 330,
    marginTop: 7,
    fontSize: 13,
    lineHeight: 19,
    color: '#777e89',
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: COLOR.white,
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e9ebef',
    shadowColor: '#111827',
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 14,
    elevation: 3,
  },
  forgotRow: {
    alignItems: 'flex-end',
    marginTop: -4,
  },
  forgotText: {
    color: COLOR.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  loginButton: {
    marginTop: 20,
    marginHorizontal: 0,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 13,
    color: '#6f7681',
  },
  linkText: {
    color: COLOR.primary,
    fontSize: 13,
    fontWeight: '700',
  },
});
