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
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.container}>
          <View style={styles.iconContainer}>
            <Text style={styles.lockIcon}>{step === 3 ? '✓' : '✱'}</Text>
          </View>
          <Text style={styles.title}>
            {step === 1
              ? 'Forgot password?'
              : step === 2
                ? 'Check your email'
                : 'Create new password'}
          </Text>
          <Text style={styles.subtitle}>
            {step === 1
              ? 'Enter your registered email and we’ll send you a verification code.'
              : step === 2
                ? 'Enter the verification code sent to your registered email.'
                : 'Choose a strong password you haven’t used before.'}
          </Text>

          <View style={styles.progressRow}>
            {[1, 2, 3].map(progressStep => (
              <View
                key={progressStep}
                style={[
                  styles.progressBar,
                  progressStep <= step && styles.activeProgressBar,
                ]}
              />
            ))}
          </View>

          <View style={styles.formCard}>
          {/* Step 1: Email */}
          {step === 1 && (
            <Input
              fullWidth
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
              fullWidth
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
              fullWidth
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
            style={styles.mainButton}
          />

          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}>
            <Text style={styles.backToLogin}>
              {step === 1 ? 'Back to Login' : 'Back'}
            </Text>
          </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f6f7fb',
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingVertical: 36,
  },
  iconContainer: {
    width: 66,
    height: 66,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: '#fff1e8',
    marginBottom: 18,
  },
  lockIcon: {
    fontSize: 29,
    fontWeight: '700',
    color: COLOR.primary,
  },
  title: {
    fontSize: 25,
    fontWeight: '700',
    color: '#20242a',
    textAlign: 'center',
  },
  subtitle: {
    maxWidth: 340,
    fontSize: 13,
    lineHeight: 20,
    color: '#747b86',
    marginTop: 8,
    textAlign: 'center',
  },
  progressRow: {
    width: '64%',
    flexDirection: 'row',
    marginVertical: 22,
  },
  progressBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#dfe2e7',
    marginHorizontal: 3,
  },
  activeProgressBar: {
    backgroundColor: COLOR.primary,
  },
  formCard: {
    width: '100%',
    maxWidth: 390,
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
  mainButton: {
    marginTop: 10,
    marginHorizontal: 0,
  },
  backButton: {
    alignItems: 'center',
    marginTop: 18,
  },
  backToLogin: {
    color: COLOR.primary,
    fontSize: 13,
    fontWeight: '700',
  },
});
