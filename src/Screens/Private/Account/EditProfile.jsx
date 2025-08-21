import React, {useContext, useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import Header from '../../../Components/FeedHeader';
import ImagePicker from 'react-native-image-crop-picker';
import {COLOR} from '../../../Constants/Colors';
import { AuthContext } from '../../../Backend/AuthContent';
import { useApi } from '../../../Backend/Api';
import { useToast } from '../../../Constants/ToastContext';
import CustomButton from '../../../Components/CustomButton';

const EditProfile = ({navigation}) => {
  const {postRequest} = useApi();
  const [loading, setLoading] = useState(false);
  const { user  , setUser , token } =  useContext(AuthContext)
  console.log(user,"tokentoken")
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const {showToast} = useToast();

  const [profilePic, setProfilePic] = useState(
    'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
  );


  useEffect(() => {
    if(user){
      setName(user?.name)
      setPhone(user?.phone_number)
      setEmail(user?.email)
      setProfilePic(user?.image)
    }
  },[user])

  const uploadImage = async (image) => {
    const formData = new FormData();
    formData.append('image',{
      type:image?.mime,
      uri:image?.path,
      name:'image'
    })

    const response  = await postRequest('public/api/profile/image', formData , true);

    console.log(response?.data,"responseresponseresponseresponse")
    if(response?.data?.status){
      setUser(response?.data?.user)
    }

  }

  const pickImage = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: false,
      compressImageQuality: 0.8,
    })
      .then(image => {
        setProfilePic(image.path);
         uploadImage(image)
      })
      .catch(err => {
        if (err.code !== 'E_PICKER_CANCELLED') {
          Alert.alert('Error', 'Unable to select image');
        }
      });
  };

  const handleSave = async () => {
    setLoading(true)
    const trimmedName = name?.trim();
    const trimmedEmail = email?.trim(); 
    const trimmedNumber = phone?.trim(); 

    if(!trimmedEmail || !trimmedNumber){
      setLoading(false);
      showToast('Email or Mobile number is required', 'error');
      return
    }

    if(!trimmedName){
      setLoading(false);
      showToast('Name is required', 'error');
      return
    }


    const formData = new FormData();
      formData?.append('email',trimmedEmail);
      formData.append('phone_number',phone);
      formData.append('name',trimmedName);

      const response = await postRequest('public/api/profile' , formData , true);

      if(response?.data?.status){
        setUser(response?.data?.user)
        showToast(response?.data?.message,"success")
         setLoading(false)
      }else{
         setLoading(false)
      }
  };

  return (
    <View style={styles.container}>
      <Header
        title={'Edit Profile'}
        showBack
        onBackPress={() => navigation.goBack()}
      />

      <View style={styles.content}>
        {/* Profile Picture */}
        <TouchableOpacity
          style={styles.profilePicContainer}
          onPress={pickImage}>
          <Image source={{uri: profilePic}} style={styles.profilePic} />
          <View style={styles.editIcon}>
            <Image
              source={{
                uri: 'https://cdn-icons-png.flaticon.com/512/84/84380.png',
              }}
              style={styles.editIconImage}
            />
          </View>
        </TouchableOpacity>

        {/* Name Input */}
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
          placeholderTextColor={COLOR.grey}
        />

        {/* Phone Input */}
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder="Enter your phone number"
          placeholderTextColor={COLOR.grey}
          keyboardType="phone-pad"
        />
        <Text style={styles.label}>Email Id</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email id"
          placeholderTextColor={COLOR.grey}
        />
        {/* Save Button */}
        {/* <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Save Changes</Text>
        </TouchableOpacity> */}
        <CustomButton title={'Save Changes'} style={styles.saveBtn} loading={loading} onPress={handleSave} />
      </View>
    </View>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.white,
  },
  content: {
    alignItems: 'center',
    padding: 20,
  },
  profilePicContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  profilePic: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: COLOR.lightGrey,
  },
  editIcon: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: COLOR.primary,
    borderRadius: 12,
    padding: 4,
  },
  editIconImage: {
    width: 14,
    height: 14,
    tintColor: COLOR.white,
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
    marginTop: 10,
    color: COLOR.black,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: COLOR.grey,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: COLOR.lightGrey + '20',
    color: COLOR.black,
  },
  saveBtn: {
    marginTop: 20,
    backgroundColor: COLOR.primary,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  saveBtnText: {
    color: COLOR.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
