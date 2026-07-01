import React, {useContext, useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
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
  const { user  , setUser } =  useContext(AuthContext)
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const {showToast} = useToast();

  const [profilePic, setProfilePic] = useState(
    'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
  );


  useEffect(() => {
    const profileUser = user?.user || user?.data?.user || user;

    if (profileUser) {
      setName(profileUser?.first_name || '');
      setPhone(String(profileUser?.phone_number || profileUser?.phone || ''));
      setEmail(profileUser?.email || '');
      setProfilePic(
        profileUser?.image ||
          'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
      );
    }
  }, [user]);

  const uploadImage = async (image) => {
    const formData = new FormData();
    formData.append('image',{
      type:image?.mime,
      uri:image?.path,
      name:'image'
    })

    const response  = await postRequest('public/api/profile/image', formData , true);

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
      formData.append('phone_number',trimmedNumber);
      formData.append('first_name',trimmedName);

      const response = await postRequest('public/api/profile' , formData , true);

      if(response?.success && (response?.data?.status || response?.data?.success)){
        const currentUser = user?.user || user?.data?.user || user || {};
        const apiUser =
          response?.data?.user || response?.data?.data?.user || {};
        const updatedUser = {
          ...currentUser,
          ...apiUser,
          first_name: trimmedName,
          phone_number: trimmedNumber,
          email: trimmedEmail,
        };

        setUser(updatedUser)
        showToast(response?.data?.message,"success")
         setLoading(false)
      }else{
         showToast(response?.error || response?.data?.message || 'Unable to update profile', 'error');
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

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}>
        <View style={styles.introSection}>
        <TouchableOpacity
          style={styles.profilePicContainer}
          onPress={pickImage}>
          <View style={styles.profilePicRing}>
            <Image source={{uri: profilePic}} style={styles.profilePic} />
          </View>
          <View style={styles.editIcon}>
            <Image
              source={{
                uri: 'https://cdn-icons-png.flaticon.com/512/84/84380.png',
              }}
              style={styles.editIconImage}
            />
          </View>
        </TouchableOpacity>
          <Text style={styles.heading}>Personal information</Text>
          <Text style={styles.subheading}>
            Keep your contact details accurate and up to date.
          </Text>
        </View>

        <View style={styles.formCard}>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter your phone number"
              placeholderTextColor="#9CA3AF"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.fieldGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Email Address</Text>
              <View style={styles.readOnlyBadge}>
                <Text style={styles.readOnlyText}>Read only</Text>
              </View>
            </View>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={email}
              placeholder="Enter your email id"
              placeholderTextColor="#9CA3AF"
              editable={false}
            />
            <Text style={styles.helperText}>Email cannot be changed here.</Text>
          </View>
        </View>

        <CustomButton
          title={'Save Changes'}
          style={styles.saveBtn}
          loading={loading}
          onPress={handleSave}
        />
      </ScrollView>
    </View>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F7FB',
  },
  content: {
    padding: 18,
    paddingBottom: 36,
  },
  introSection: {
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 22,
  },
  profilePicContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profilePicRing: {
    padding: 4,
    borderRadius: 66,
    backgroundColor: COLOR.white,
    shadowColor: '#111827',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  profilePic: {
    width: 112,
    height: 112,
    borderRadius: 56,
  },
  editIcon: {
    position: 'absolute',
    bottom: 3,
    right: 3,
    backgroundColor: COLOR.primary,
    borderRadius: 18,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: COLOR.white,
  },
  editIconImage: {
    width: 15,
    height: 15,
    tintColor: COLOR.white,
  },
  heading: {
    fontSize: 21,
    fontWeight: '700',
    color: '#111827',
  },
  subheading: {
    maxWidth: 290,
    marginTop: 6,
    fontSize: 13,
    lineHeight: 19,
    color: '#6B7280',
    textAlign: 'center',
  },
  formCard: {
    padding: 18,
    borderRadius: 18,
    backgroundColor: COLOR.white,
    shadowColor: '#111827',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  fieldGroup: {
    marginBottom: 18,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
    color: '#374151',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#DDE1E7',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    backgroundColor: '#FAFAFB',
    color: '#111827',
  },
  disabledInput: {
    color: '#6B7280',
    backgroundColor: '#F1F3F5',
  },
  readOnlyBadge: {
    marginBottom: 7,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    backgroundColor: '#EAF8EF',
  },
  readOnlyText: {
    color: '#248A4B',
    fontSize: 10,
    fontWeight: '700',
  },
  helperText: {
    marginTop: 6,
    fontSize: 11,
    color: '#9CA3AF',
  },
  saveBtn: {
    marginTop: 24,
    width: '100%',
    backgroundColor: COLOR.primary,
    borderRadius: 15,
    shadowColor: COLOR.primary,
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
});
