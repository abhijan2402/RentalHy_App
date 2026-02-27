import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import Header from '../../Components/FeedHeader';
import Input from '../../Components/Input';
import CustomButton from '../../Components/CustomButton';
import {COLOR} from '../../Constants/Colors';
import {useApi} from '../../Backend/Api';

const ShopProfileNew = ({navigation, route}) => {
  const {postRequest} = useApi();

  const [shopName, setShopName] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  // Mock user_id — you can replace with dynamic value from context or props
  const user_id = route?.params?.user_id;

  const handleSubmit = async () => {
    if (!shopName || !address) {
      Alert.alert('Validation Error', 'Please enter all fields');
      return;
    }

    const payload = {
      user_id,
      shop_name: shopName,
      address,
    };
    console.log(payload, 'PAYLOADDDD');

    setLoading(true);
    const response = await postRequest('api/create-shop', payload);
    setLoading(false);

    if (response?.success) {
      Alert.alert('Success', 'Shop profile created successfully');
      navigation.pop(2);
    } else {
      Alert.alert('Error', response?.error || 'Failed to create shop');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1, backgroundColor: COLOR.white}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={{paddingBottom: 30}}>
          <Header title={'Create Shop'} showBack />
          <View style={styles.container}>
            <Input
              label="Shop Name"
              placeholder="Enter your shop name"
              value={shopName}
              onChangeText={setShopName}
            />
            <Input
              label="Shop Address"
              placeholder="Enter your shop address"
              value={address}
              onChangeText={setAddress}
            />
            <CustomButton
              title="Create Shop"
              loading={loading}
              onPress={handleSubmit}
              style={{marginTop: 20}}
            />
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default ShopProfileNew;

const styles = StyleSheet.create({
  container: {
    // paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: COLOR.white,
    flex: 1,
  },
});
