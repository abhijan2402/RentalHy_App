import React, {useEffect, useRef, useState} from 'react';
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
import {COLOR} from '../../Constants/Colors';
import CustomButton from '../../Components/CustomButton';
import LottieView from 'lottie-react-native';
import Input from '../../Components/Input';
import {useApi} from '../../Backend/Api';
import Header from '../../Components/FeedHeader';
import {useToast} from '../../Constants/ToastContext';

const {height, width} = Dimensions.get('window');

const SignUp = ({navigation}) => {
  const {postRequest} = useApi();
  const animationRef = useRef(null);
  const {showToast} = useToast();

  const [ email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [FullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpTarget, setOtpTarget] = useState(''); // 'email' or 'phone'
  const [otpInput, setOtpInput] = useState('');
  const [UserID, setUserID] = useState(null);

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

    const res = await postRequest(endpoint, formData , true);
    if (res.success) {
      setUserID(res?.data?.user_id)
      setOtpTarget(type);
      setShowOtpModal(true);
      showToast(res?.data?.message, "success")
      // Alert.alert('Success', `OTP sent to your ${type}`);
    } else {
      Alert.alert('Error', res.error || `Failed to send ${type} OTP`);
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

    const res = await postRequest(endpoint, formData , true);
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

  if (password.length < 6) {
    showToast(`Password must be at least 8 characters`, 'error');
    return;
  }

  if (password !== confirmPassword) {
    Alert.alert('Validation', 'Passwords do not match');
    return;
  }

  const formData = new FormData();
  formData.append('name', FullName);
  formData.append('user_id', UserID);
  formData.append('phone_number', phone);
  formData.append('email', email);
  formData.append('password', password);
  formData.append('password_confirmation', confirmPassword);

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
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView style={{flex: 1, backgroundColor: COLOR.white}}>
          <Header title={'Create New Account'} showBack />
          {/* <LottieView
            ref={animationRef}
            source={require('../../assets/Lottie/SignUp.json')}
            style={styles.image}
          /> */}


          <View style={{paddingTop: 15}}>
            {/* <Text style={styles.heading}>Create New Account</Text> */}


             <Input
              mainStyle={{}}
              label="Full name"
              placeholder="Enter your full name"
              value={FullName}
              onChangeText={setFullName}
            />

            <Input
              mainStyle={{}}
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
              mainStyle={{}}
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
              label="Password"
              placeholder="Enter password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <Input
              label="Confirm Password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />

            <CustomButton
              title="Create Account"
              loading={loading}
              onPress={registerUser}
              style={{marginTop: 15}}
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
            onPress={() => navigation.navigate('SupportList')} // or your query screen
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
                  style={{fontWeight: 'bold', fontSize: 16, marginBottom: 10}}>
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
    fontSize: 14,
    color: '#333',
    alignSelf: 'center',
  },
  linkText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  footerText: {
    marginTop: 20,
    fontSize: 14,
    color: '#333',
    alignSelf: 'center',
    marginBottom: 20,
  },
  linkText: {
    color: COLOR.royalBlue,
    fontWeight: 'bold',
  },
  heading: {
    fontSize: 22,
    color: COLOR.royalBlue,
    fontWeight: '700',
    marginBottom: 10,
    paddingHorizontal: 15,
  },
  verifyText: {
    color: COLOR.royalBlue,
    fontWeight: 'bold',
    textAlign: 'right',
    marginRight: 30,
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
  },
  cancel: {
    color: 'red',
    fontWeight: 'bold',
  },
  verify: {
    color: 'green',
    fontWeight: 'bold',
  },
});
