import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
  TouchableOpacity,
  Image,
} from 'react-native';
import {COLOR} from '../../Constants/Colors';
import CustomButton from '../../Components/CustomButton';
import LottieView from 'lottie-react-native';
import Input from '../../Components/Input';
import {AuthContext} from '../../Backend/AuthContent';
import {useApi} from '../../Backend/Api';
import {useToast} from '../../Constants/ToastContext';
import Header from '../../Components/FeedHeader';
import {windowHeight, windowWidth} from '../../Constants/Dimensions';

const {height, width} = Dimensions.get('window');

const Login = ({navigation}) => {
  const {postRequest} = useApi();
  const animationRef = useRef(null);
  const {showToast} = useToast();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const {setUser, setToken, setCurrentStatus} = useContext(AuthContext);

  useEffect(() => {
    animationRef.current?.play(30, 120);
  }, []);

  const loginUser = async () => {
    setUser(null);
    const trimmedIdentifier = identifier?.trim();
    const trimmedPassword = password?.trim();

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
      style={{flex: 1, backgroundColor: COLOR.white}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      {/* <Header title={'Sign In'} /> */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          {/* <LottieView
            ref={animationRef}
            source={require('../../assets/Lottie/Login.json')}
            style={styles.image}
          /> */}
          <Image
            style={{
              width: windowWidth,
              height: 200,
              alignSelf: 'center',
              marginBottom: windowHeight / 9,
              marginTop: windowHeight * 0.08,
            }}
            source={{uri: 'https://i.postimg.cc/59BKnJZJ/second-page-1.jpg'}}
          />
          <Text
            style={{
              fontSize: 30,
              color: COLOR.primary,
              fontWeight: '600',
              paddingHorizontal: 30,
              borderTopWidth: 1,
              paddingTop: 20,
            }}>
            Sign In
          </Text>
          <View style={{paddingTop: 15}}>
            <Input
              label="Email"
              placeholder="Enter your email"
              value={identifier}
              onChangeText={setIdentifier}
              keyboardType="default"
            />
            <Input
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <CustomButton
              loading={loading}
              title="Login"
              onPress={loginUser}
              style={{marginTop: 15}}
            />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 20,
              }}>
              <Text style={styles.footerText}>Not having an account? </Text>
              <TouchableOpacity
                style={{alignItems: 'center'}}
                onPress={() => navigation.navigate('SignUp')}>
                <Text style={styles.linkText}>Create One</Text>
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
  heading: {
    fontSize: 22,
    color: COLOR.royalBlue,
    fontWeight: '700',
  },
  image: {
    width: width,
    height: height * 0.5,
  },
  footerText: {
    // marginTop: 20,
    fontSize: 14,
    color: '#333',
    alignSelf: 'center',
  },
  linkText: {
    color: COLOR.royalBlue,
    fontWeight: 'bold',
    // marginTop: 15,
  },
});
