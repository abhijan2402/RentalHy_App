import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnBoarding from '../Screens/Auth/OnBoarding';
import Login from '../Screens/Auth/Login';
import SignUp from '../Screens/Auth/SignUp';
import SupportList from '../Screens/Private/Account/SupportList';
import ForgotPassword from '../Screens/Auth/ForgotPassword';
import Cms from '../Components/Cms';
const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="OnBoarding"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="OnBoarding" component={OnBoarding} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="SupportList" component={SupportList} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="Cms" component={Cms} />

      {/* <Stack.Screen name="AddFeed" component={AddFeed} />
      <Stack.Screen name="AddEvent" component={AddEvent} />
      <Stack.Screen name="EditProfile" component={Profile} />
      <Stack.Screen name="MyPost" component={MyPost} />
      <Stack.Screen name="Cms" component={Cms} />
      <Stack.Screen name="CreateProfile" component={CreateProfile} />
      <Stack.Screen name="Order" component={Order} />
      <Stack.Screen name="ShopProfile" component={ShopProfile} />
      <Stack.Screen name="ShopProfileNew" component={ShopProfileNew} /> */}



    </Stack.Navigator>
  );
};

export default AuthStack;
