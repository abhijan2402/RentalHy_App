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
import ConventionFilter from '../Screens/Private/Dashboard/ConventionFilter';
import ConventionMainFilter from '../Screens/Private/Dashboard/ConventionMainFilter';
import Convention from '../Screens/Private/ConventionSection/Convention';
import Home from '../Screens/Private/Dashboard/Home';
import PostBookPage from '../Screens/Private/ConventionSection/PostBookPage';
import Hostel from '../Screens/Private/HostelSection/Hostel';
import PostHostel from '../Screens/Private/HostelSection/PostHostel';
import HostelFilterScreen from '../Screens/Private/HostelSection/HostelFilter';
import Wishlist from '../Screens/Private/Wishlist';
import BankAccountList from '../Screens/Private/Account/Banks/BankAccountList';
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
                <Stack.Screen name="ConventionFilter" component={ConventionFilter} />
                <Stack.Screen name="ConventionMainFilter" component={ConventionMainFilter} />
                <Stack.Screen name="Convention" component={Convention} />
                <Stack.Screen name="PostBookPage" component={PostBookPage} />
                <Stack.Screen name="Hostel" component={Hostel} />
                <Stack.Screen name="PostHostel" component={PostHostel} />
                <Stack.Screen name="HostelFilterScreen" component={HostelFilterScreen} />
                <Stack.Screen name="Wishlist" component={Wishlist} />
                <Stack.Screen name="BankAccount" component={BankAccountList} />


                <Stack.Screen name="Home" component={Home} />


            </Stack.Navigator>
            <View style={{ marginBottom: 50 }}>
            </View>
        </>
    );
};

export default RootNavigation;
