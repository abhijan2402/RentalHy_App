import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomNavigation from './BottomNavigation';
import { View } from 'react-native';
import PropertyDetail from '../Screens/Private/Dashboard/PropertyDetail';
import Cms from '../Components/Cms';
import EditProfile from '../Screens/Private/Account/EditProfile';
import PostProperty from '../Screens/Private/Dashboard/PostProperty';
import Account from '../Screens/Private/Account/Account';
import SupportList from '../Screens/Private/Account/SupportList';
import CreateTicket from '../Screens/Private/Account/CreateTicket';
import Filter from '../Screens/Private/Dashboard/Filter';
import Chat from '../Screens/Private/Dashboard/Chat';
import PropertyAnalytics from '../Screens/Private/Account/PropertyAnalytics';
import Booking from '../Screens/Private/ConventionSection/Booking';
import CreateConvention from '../Screens/Private/ConventionSection/CreateConvention';
import SpaceOrders from '../Screens/Private/ConventionSection/SpaceOrders';
import MyBooking from '../Screens/Private/ConventionSection/MyBooking';
const Stack = createNativeStackNavigator();

const RootNavigation = () => {
    return (
        <>
            <Stack.Navigator
                initialRouteName="BottomNavigation"
                screenOptions={{
                    headerShown: false,
                }}>
                <Stack.Screen name="BottomNavigation" component={BottomNavigation} />
                <Stack.Screen name="Cms" component={Cms} />
                <Stack.Screen name="EditProfile" component={EditProfile} />
                <Stack.Screen name="PostProperty" component={PostProperty} />
                <Stack.Screen name="PropertyDetail" component={PropertyDetail} />
                <Stack.Screen name="Profile" component={Account} />
                <Stack.Screen name="SupportList" component={SupportList} />
                <Stack.Screen name="CreateTicket" component={CreateTicket} />
                <Stack.Screen name="Filter" component={Filter} />
                <Stack.Screen name="Chat" component={Chat} />
                <Stack.Screen name="PropertyAnalytics" component={PropertyAnalytics} />
                <Stack.Screen name="Booking" component={Booking} />
                <Stack.Screen name="CreateConvention" component={CreateConvention} />
                <Stack.Screen name="SpaceOrders" component={SpaceOrders} />
                <Stack.Screen name="MyBooking" component={MyBooking} />


            </Stack.Navigator>
            <View style={{ marginBottom: 50 }}>
            </View>
        </>
    );
};

export default RootNavigation;
