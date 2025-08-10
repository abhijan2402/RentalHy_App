import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import Input from '../../Components/Input';
import CustomButton from '../../Components/CustomButton';
import {COLOR} from '../../Constants/Colors';
import Header from '../../Components/FeedHeader';
import {useApi} from '../../Backend/Api';

const CreateProfile = ({navigation, route}) => {
  const {postRequest} = useApi();

  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [loading, setLoading] = useState(false);

  // Assume this comes from context or params
  const user_id = route?.params?.userId;

  const handleSubmit = async () => {
    if (!fullName || !age || !gender) {
      Alert.alert('Validation Error', 'All fields are required.');
      return;
    }

    if (isNaN(age) || parseInt(age) <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid age.');
      return;
    }

    const payload = {
      user_id: user_id,
      full_name: fullName,
      age: parseInt(age),
      gender: gender.toLowerCase(),
    };

    setLoading(true);
    const response = await postRequest('api/create-profile', payload);
    setLoading(false);

    if (response?.success) {
      Alert.alert('Success', 'Profile created successfully.');
      navigation.navigate('ShopProfileNew', {user_id: user_id});
      // navigation.navigate('BottomNavigation');
    } else {
      Alert.alert('Error', response?.error || 'Failed to create profile.');
    }
  };

  return (
    <View style={styles.safeArea}>
      <Header title={'Create Profile'} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={{paddingBottom: 30}}>
        <Input
          label="Full Name"
          value={fullName}
          onChangeText={setFullName}
          placeholder="Enter your full name"
        />
        <Input
          label="Age"
          value={age}
          onChangeText={setAge}
          placeholder="Enter your age"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Select Gender</Text>
        <View style={styles.genderContainer}>
          {['Male', 'Female', 'Other'].map(option => (
            <TouchableOpacity
              key={option}
              style={[
                styles.genderOption,
                gender === option.toLowerCase() && styles.genderSelected,
              ]}
              onPress={() => setGender(option.toLowerCase())}>
              <Text
                style={{
                  color:
                    gender === option.toLowerCase() ? COLOR.white : COLOR.black,
                }}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <CustomButton
          title="Submit Profile"
          onPress={handleSubmit}
          loading={loading}
          style={{marginTop: 20, marginBottom: 30}}
        />
      </ScrollView>
    </View>
  );
};

export default CreateProfile;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLOR.white,
  },
  container: {
    flex: 1,
    backgroundColor: COLOR.white,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLOR.black,
    marginBottom: 8,
  },
  uploadContainer: {
    marginTop: 15,
    marginHorizontal: 30,
  },
  uploadButton: {
    backgroundColor: '#f1f1f1',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  uploadText: {
    color: COLOR.royalBlue,
    fontWeight: '600',
  },
  imagePreview: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginTop: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLOR.black,
    marginBottom: 8,
    marginHorizontal: 30,
    marginTop: 15,
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 30,
    marginBottom: 20,
  },
  genderOption: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#f1f1f1',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  genderSelected: {
    backgroundColor: COLOR.royalBlue,
    borderColor: COLOR.royalBlue,
  },
});
