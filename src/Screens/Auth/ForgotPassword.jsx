import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
} from 'react-native';
import {COLOR} from '../../Constants/Colors';
import CustomButton from '../../Components/CustomButton';
import Input from '../../Components/Input';
import {useApi} from '../../Backend/Api';
import {useToast} from '../../Constants/ToastContext';

const ForgotPassword = ({navigation}) => {
  const {postRequest} = useApi();
  const {showToast} = useToast();

  // States
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1 = Email, 2 = OTP, 3 = New Password

  /** Step 1: Send OTP to email/phone */
  const handleSendOtp = async () => {
    const trimmedIdentifier = identifier.trim();

    if (!trimmedIdentifier) {
      showToast('Please enter your registered email', 'error');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('email', trimmedIdentifier);

    try {
      const response = await postRequest(
        'public/api/forgot-password',
        formData,
        true,
      );
      console.log(response, 'SUCCCCCC');

      if (response?.success) {
        showToast(response?.message || 'OTP sent successfully', 'success');
        setStep(2); // Move to OTP step
      } else {
        showToast(response?.error || 'Failed to send OTP', 'error');
      }
    } catch (error) {
      console.log('Forgot Password Error:', error);
      showToast('Something went wrong', 'error');
    } finally {
      setLoading(false);
    }
  };

  /** Step 2: Verify OTP */
  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      showToast('Please enter the OTP', 'error');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('email', identifier.trim());
    formData.append('otp', otp.trim());

    try {
      const response = await postRequest(
        'public/api/verify-reset-otp',
        formData,
        true,
      );
      console.log(response, 'VEIRRIIIII');

      if (response?.success) {
        showToast(response?.message || 'OTP verified successfully', 'success');
        setStep(3); // Move to reset password step
      } else {
        showToast(response?.error || 'Invalid OTP', 'error');
      }
    } catch (error) {
      console.log('Verify OTP Error:', error);
      showToast('Something went wrong', 'error');
    } finally {
      setLoading(false);
    }
  };

  /** Step 3: Reset Password */
  const handleResetPassword = async () => {
    if (!newPassword.trim()) {
      showToast('Please enter your new password', 'error');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('email', identifier.trim());
    formData.append('otp', otp.trim());
    formData.append('new_password', newPassword.trim());

    try {
      const response = await postRequest(
        'public/api/reset-password',
        formData,
        true,
      );
      console.log(response, 'RSSSS_RESET__PASS');

      if (response?.success) {
        showToast(
          response?.message || 'Password reset successfully',
          'success',
        );
        navigation.goBack();
      } else {
        showToast(response?.error || 'Failed to reset password', 'error');
      }
    } catch (error) {
      console.log('Reset Password Error:', error);
      showToast('Something went wrong', 'error');
    } finally {
      setLoading(false);
    }
  };

  /** Handle Back to Previous Step */
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigation.goBack();
    }
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1, backgroundColor: COLOR.white}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Forgot Password</Text>
          <Text style={styles.subtitle}>
            {step === 1
              ? 'Enter your registered email to receive an OTP.'
              : step === 2
              ? 'Enter the OTP sent to your registered email.'
              : 'Enter a new password to reset your account.'}
          </Text>

          {/* Step 1: Email */}
          {step === 1 && (
            <Input
              label="Email"
              placeholder="Enter your email"
              value={identifier}
              onChangeText={setIdentifier}
              keyboardType="default"
            />
          )}

          {/* Step 2: OTP */}
          {step === 2 && (
            <Input
              label="OTP"
              placeholder="Enter OTP"
              value={otp}
              onChangeText={setOtp}
              keyboardType="numeric"
            />
          )}

          {/* Step 3: New Password */}
          {step === 3 && (
            <Input
              label="New Password"
              placeholder="Enter new password"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
            />
          )}

          {/* Main Button */}
          <CustomButton
            title={
              step === 1
                ? 'Send OTP'
                : step === 2
                ? 'Verify OTP'
                : 'Reset Password'
            }
            loading={loading}
            onPress={
              step === 1
                ? handleSendOtp
                : step === 2
                ? handleVerifyOtp
                : handleResetPassword
            }
            style={{marginTop: 20}}
          />

          {/* Back Button */}
          <TouchableOpacity
            style={{alignItems: 'center', marginTop: 20}}
            onPress={handleBack}>
            <Text style={styles.backToLogin}>
              {step === 1 ? 'Back to Login' : 'Back'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    // paddingHorizontal: 15,
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    color: COLOR.primary,
    marginBottom: 10,
    paddingHorizontal: 15,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 30,
    paddingHorizontal: 15,
  },
  backToLogin: {
    color: COLOR.primary,
    fontWeight: '500',
  },
});
