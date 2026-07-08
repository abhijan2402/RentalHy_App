import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import { COLOR } from '../../Constants/Colors';
import CustomButton from '../../Components/CustomButton';
import Input from '../../Components/Input';
import { useApi } from '../../Backend/Api';
import Header from '../../Components/FeedHeader';
import { useToast } from '../../Constants/ToastContext';
import messaging from '@react-native-firebase/messaging';

const { height, width } = Dimensions.get('window');

const SignUp = ({ navigation }) => {
  const { postRequest } = useApi();
  const animationRef = useRef(null);
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [FullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);


  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpTarget, setOtpTarget] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [UserID, setUserID] = useState(null);
const getFcmToken = async () => {
    const token = await messaging().getToken();
    console.log('FCM TOKEN:', token);
    return token;
  };
  useEffect(() => {
    animationRef.current?.play(30, 120);
  }, []);

  const sendOtp = async type => {
    const formData = new FormData();
    if (type === 'email') {
      formData.append('email', email);
    } else {
      formData.append('phone', phone);
    }

    const endpoint =
      type === 'email' ? 'public/api/signup/email' : 'api/send-phone-otp';

    if ((type === 'email' && !email) || (type === 'phone' && !phone)) {
      showToast(`Please enter ${type} first`, 'error');
      return;
    }

    const res = await postRequest(endpoint, formData, true);
    if (res.success) {
      setUserID(res?.data?.user_id)
      setOtpTarget(type);
      setShowOtpModal(true);
      showToast(res?.data?.message, "success")
      // Alert.alert('Success', `OTP sent to your ${type}`);
    } else {
      // Alert.alert('Error', res.error || `Failed to send ${type} OTP`);
    }
  };

  const verifyOtp = async () => {
    const formData = new FormData();
    if (otpTarget === 'email') {
      formData.append('user_id', UserID);
      formData.append('verification_code', otpInput);
    } else {
      formData.append('user_id', UserID);
      formData.append('verification_code', otpInput);
    }

    const endpoint =
      otpTarget === 'email' ? 'public/api/signup/verify-email' : 'api/verify-phone-otp';

    const res = await postRequest(endpoint, formData, true);
    if (res.success) {
      showToast(`${otpTarget} verified successfully`, 'success');
      // Alert.alert('Verified', `${otpTarget} verified successfully`);
      otpTarget === 'email' ? setEmailVerified(true) : setPhoneVerified(true);
      setShowOtpModal(false);
      setOtpInput('');
    } else {
      // Alert.alert('Error', res.error || 'OTP verification failed');
      showToast(res.error, 'error');
    }
  };

  const registerUser = async () => {
    if (!emailVerified) {
      showToast(`Please verify email first`, 'error');
      return;
    }

    if (!acceptTerms) {
      showToast(`Please accept Terms & Conditions and Privacy Policy`, 'error');
      return;
    }

    if (password.length < 8) {
      showToast(`Password must be at least 8 characters`, 'error');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Validation', 'Passwords do not match');
      return;
    }
const token =await getFcmToken()

    const formData = new FormData();
    formData.append('name', FullName);
    formData.append('user_id', UserID);
    formData.append('phone_number', phone);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('password_confirmation', confirmPassword);
 formData.append('device_id', token||"i0909");
    // formData.append('device_type', Platform.OS=="android"?"android":"ios");
    setLoading(true);

    try {
      const res = await postRequest('public/api/signup/complete', formData, true);
      setLoading(false);

      if (res.success) {
        Alert.alert('Success', 'Account created successfully, please login!');
        navigation.goBack();
      } else {
        if (res.errors) {
          const errorMessages = Object.values(res.errors)
            .flat()
            .join('\n');
          showToast(errorMessages, 'error');
        } else {
          // Alert.alert('Error', res.error || 'Registration failed');
        }
      }
    } catch (error) {
      setLoading(false);
      console.error('Registration error:', error);
      showToast('Something went wrong. Please try again later.', 'error');
    }
  };


  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Header title="Create Account" showBack onBackPress={() => navigation.goBack()} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          {/* <LottieView
            ref={animationRef}
            source={require('../../assets/Lottie/SignUp.json')}
            style={styles.image}
          /> */}


          <View style={styles.introSection}>
            <Text style={styles.heading}>Let’s get you started</Text>
            <Text style={styles.subtitle}>
              Create your RentalHy account to find, book and manage spaces.
            </Text>
          </View>

          <View style={styles.formCard}>
            <Input
              fullWidth
              label="Full name"
              placeholder="Enter your full name"
              value={FullName}
              onChangeText={setFullName}
            />

            <Input
              fullWidth
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
            />
            <TouchableOpacity onPress={() => sendOtp('email')}>
              <Text style={styles.verifyText}>
                {emailVerified ? '✅ Email Verified' : 'Verify Email'}
              </Text>
            </TouchableOpacity>

            <Input
              fullWidth
              label="Phone Number"
              placeholder="Enter phone number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
            {/* <TouchableOpacity onPress={() => sendOtp('phone')}>
              <Text style={styles.verifyText}>
                {phoneVerified ? '✅ Phone Verified' : 'Verify Phone'}
              </Text>
            </TouchableOpacity> */}

            <Input
              fullWidth
              label="Password"
              placeholder="Enter password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <Input
              fullWidth
              label="Confirm Password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />

            <View style={styles.termsContainer}>
              <View
                style={styles.checkRow}
              >
                <Text style={[styles.checkbox, acceptTerms && styles.checkedBox]} onPress={() => setAcceptTerms(!acceptTerms)} />
                <Text style={styles.checkLabel}>
                  I accept the  <Text style={styles.linkText} onPress={() => {
                    navigation.navigate('Cms',
                      {
                        title: `Terms & Conditions`,
                        slug: 'terms-conditions',
                      },

                    );
                  }}>Terms & Conditions</Text>

                  {' '} and {' '}

                  <Text style={styles.linkText} onPress={() => {
                    navigation.navigate('Cms',
                      {
                        title: `Privacy Policy`,
                        slug: 'privacy-policy',
                      },

                    );
                  }}  >Privacy Policy</Text>
                </Text>


              </View>

            </View>

            <CustomButton
              title="Create Account"
              loading={loading}
              onPress={registerUser}
              style={{ marginTop: 15 }}
            />

            <Text style={styles.footerText}>
              Already have an account?{' '}
              <Text
                onPress={() => navigation.navigate('Login')}
                style={styles.linkText}>
                Login
              </Text>
            </Text>
          </View>

          <TouchableOpacity
            style={{ marginBottom: 50 }}
            onPress={() => navigation.navigate('CreateTicket')}
          >
            <Text
              style={{
                color: COLOR.royalBlue,
                fontSize: 13,
                textAlign: 'center',
                marginTop: 10,
                textDecorationLine: 'underline',
              }}>
              Facing issues while signing up? Raise a ticket
            </Text>
          </TouchableOpacity>
          {/* OTP Modal */}
          <Modal visible={showOtpModal} transparent animationType="slide">
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text
                  style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 10 }}>
                  Enter OTP for {otpTarget}
                </Text>
                <TextInput
                  style={styles.otpInput}
                  placeholder="Enter OTP"
                  keyboardType="numeric"
                  value={otpInput}
                  onChangeText={setOtpInput}
                  maxLength={6}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <TouchableOpacity onPress={() => setShowOtpModal(false)}>
                    <Text style={styles.cancel}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={verifyOtp}>
                    <Text style={styles.verify}>Verify</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f6f7fb',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 36,
  },
  introSection: {
    paddingHorizontal: 4,
    paddingTop: 8,
    paddingBottom: 18,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 19,
    color: '#777e89',
  },
  formCard: {
    backgroundColor: COLOR.white,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e9ebef',
    shadowColor: '#111827',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 12,
    elevation: 3,
  },
  termsContainer: {
    marginVertical: 8,
  },
  container: {
    height: height,
    backgroundColor: COLOR.white,
  },
  image: {
    width: width,
    height: height * 0.4,
  },
  button: {
    marginTop: 30,
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    width: width / 1.5,
    alignSelf: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: COLOR.white,
    fontSize: 14,
    fontWeight: '600',
  },
  footerText: {
    marginTop: 20,
    fontSize: 13,
    color: '#6f7681',
    textAlign: 'center',
    marginBottom: 4,
  },
  heading: {
    fontSize: 25,
    color: '#20242a',
    fontWeight: '700',
  },
  verifyText: {
    color: COLOR.primary,
    fontWeight: '700',
    textAlign: 'right',
    marginTop: -9,
    marginBottom: 13,
    fontSize: 12,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  otpInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    height: 40
  },
  cancel: {
    color: 'red',
    fontWeight: 'bold',
  },
  verify: {
    color: 'green',
    fontWeight: 'bold',
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 6,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: COLOR.royalBlue,
    borderRadius: 4,
    marginRight: 10,
  },
  checkedBox: {
    backgroundColor: COLOR.royalBlue,
  },
  checkLabel: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    color: '#4f5661',
  },
  linkText: {
    color: COLOR.primary,
    fontWeight: '700',
  },
  supportLink: {
    color: COLOR.royalBlue,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 10,
    textDecorationLine: 'underline',
  },
});
