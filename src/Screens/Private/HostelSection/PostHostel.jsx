import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  Modal,
} from 'react-native';
import Header from '../../../Components/FeedHeader';
import { COLOR } from '../../../Constants/Colors';
import ImagePicker from 'react-native-image-crop-picker';
import CustomButton from '../../../Components/CustomButton';
import { useApi } from '../../../Backend/Api';
import { useToast } from '../../../Constants/ToastContext';
import GooglePlacePicker from '../../../Components/GooglePicker';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
const PostHostel = ({ navigation }) => {
  const { postRequest } = useApi();
  const { showToast } = useToast();
  const [images, setImages] = useState([]);
  const [title, setTitle] = useState('');
  const [contact, setContact] = useState('');
  const [altContact, setAltContact] = useState('');
  const [description, setDescription] = useState('');
  const [buttonLoading, setButtonLoading] = useState(false);
  const [singleRoom, setSingleRoom] = useState('');
  const [singleRoomDay, setSingleRoomDay] = useState('');
  const [doubleRoom, setDoubleRoom] = useState('');
  const [tripleRoom, setTripleRoom] = useState('');
  const [fourRoom, setFourRoom] = useState('');
  const [roomDeposit, setRoomDeposit] = useState('');
  const [dormDay, setDormDay] = useState('');
  const [dormWeek, setDormWeek] = useState('');
  const [dormMonth, setDormMonth] = useState('');
  const [dormDeposit, setDormDeposit] = useState('');

  const [mapLink, setMapLink] = useState('');
  const [location, setLocation] = useState('');
  const [landmark, setLandmark] = useState('');
  const [roomSizeMin, setRoomSizeMin] = useState('');
  const [roomSizeMax, setRoomSizeMax] = useState('');
  const hostelTypes = ['Male', 'Female', 'Coliving'];
  const [selectedTypes, setSelectedTypes] = useState([]);

  const furnishingOptions = [
    'Bed with mattress & pillow',
    'Bed frame only',
    'Study table & chair',
    'Wardrobe / cupboard',
    'Fan',
    'Lights',
    'Curtains',
    'A/C',
    'Geyser (Hot water)',
    'Basic appliances',
    'Limited storage space',
    'Only room (no furniture/appliance)',
    'Tenant brings own setup',
  ];
  const [selectedFurnishing, setSelectedFurnishing] = useState([]);

  // Bathroom
  const [bathroomType, setBathroomType] = useState([]);

  const toggleOptions = [
    { label: 'Kitchen', key: 'kitchen' },
    { label: 'WiFi', key: 'wifi' },
    { label: 'A/C', key: 'A/C' },
    { label: 'Laundry Service', key: 'laundry_service' },
    { label: 'Housekeeping', key: 'housekeeping' },
    { label: 'Hot Water', key: 'hot_water' },
    { label: 'Power Backup', key: 'power_backup' },
    { label: 'Parking', key: 'parking' },
    { label: 'Gym', key: 'gym' },
    { label: 'Play Area', key: 'play_area' },
    { label: 'TV', key: 'tv' },
    { label: 'Dining Table', key: 'dining_table' },
    { label: 'Security', key: 'security' },
    { label: 'RO Water', key: 'ro_water' },
    { label: 'Study Area', key: 'study_area' },
  ];

  const RULES_POLICIES_OPTIONS = ['Visitors allowed/not allowed'];
  const [rulesPolicies, setRulesPolicies] = useState([]);

  const [toggleStates, setToggleStates] = useState(
    Object.fromEntries(toggleOptions.map(opt => [opt?.key, 'no'])),
  );

  // Food
  const [foodType, setFoodType] = useState('Veg');
  const [mess, setMess] = useState('no');
  const [breakfast, setBreakfast] = useState('no');
  const [lunch, setLunch] = useState('no');
  const [dinner, setDinner] = useState('no');
  const [tea, setTea] = useState('no');
  const [snacks, setSnacks] = useState('no');
  const [foodTimings, setFoodTimings] = useState({
    breakfast: '',
    tea: '',
    lunch: '',
    snacks: '',
    dinner: '',
  });

  const [showPicker, setShowPicker] = useState(false);
  const [currentKey, setCurrentKey] = useState(null); 
  const [pickerMode, setPickerMode] = useState('time'); 
  const [smokingAllowed, setSmokingAllowed] = useState(false);
  const [alcoholAllowed, setAlcoholAllowed] = useState(false);
  const [visitersAllowed, setvisitersAllowed] = useState(false);

  const [PetsAllowed, setPetsAllowed] = useState(false);
  const [refundPolicy, setRefundPolicy] = useState(null);
  const [gateTimings, setGateTimings] = useState({
    opening: '',
    closing: '',
  });

  // Open picker for a specific field
  const openTimePicker = key => {
    setCurrentKey(key);
    setPickerMode('time');
    setShowPicker(true);
  };

  // Handle time selection
  const onChange = (event, selectedDate) => {
    setShowPicker(false);

    if (selectedDate) {
      const formattedTime = moment(selectedDate).format('HH:mm');
      setFoodTimings({ ...foodTimings, [currentKey]: formattedTime });
    }
  };
  const renderTimingInput = (label, key) => (
    <TouchableOpacity
      style={styles.inputContainer}
      onPress={() => openTimePicker(key)}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{foodTimings[key] || 'Select Time'}</Text>
    </TouchableOpacity>
  );

  // Docs & Rules
  const [documents, setDocuments] = useState('');
  const [rules, setRules] = useState('');

  // Menu image
  const [menuImage, setMenuImage] = useState(null);

  const pickImages = async () => {
    try {
      const res = await ImagePicker.openPicker({
        multiple: true,
        mediaType: 'photo',
      compressImageQuality: 0.8,

      });
      setImages(res.map(img => ({ uri: img.path })));
    } catch (err) {
      console.log(err);
    }
  };

  const pickMenuImage = async () => {
    try {
      const res = await ImagePicker.openPicker({ mediaType: 'photo', 
            compressImageQuality: 0.8,

       });
      setMenuImage({ uri: res.path });
    } catch (err) {
      console.log(err);
    }
  };

  const renderInput = (label, value, setValue, multiline = false) => (
    <View style={styles.section}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          multiline && { height: 100, textAlignVertical: 'top' },
        ]}
        value={value}
        onChangeText={setValue}
        placeholder={`Enter ${label}`}
        placeholderTextColor={COLOR.grey}
        multiline={multiline}
      />
    </View>
  );

  const renderToggle = (label, value, setValue) => (
    <View style={styles.section}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.toggleRow}>
        {['yes', 'no'].map(opt => (
          <TouchableOpacity
            key={opt}
            style={[styles.toggleBtn, value === opt && styles.selectedBtn]}
            onPress={() => setValue(opt)}>
            <Text
              style={[styles.toggleText, value === opt && styles.selectedText]}>
              {opt.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderMultiSelect = (label, options, selected, setSelected) => (
    <View style={styles.section}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.multiRow}>
        {options.map(opt => (
          <TouchableOpacity
            key={opt}
            style={[
              styles.multiBtn,
              selected.includes(opt) && styles.multiSelected,
            ]}
            onPress={() =>
              setSelected(
                selected.includes(opt)
                  ? selected.filter(i => i !== opt)
                  : [...selected, opt],
              )
            }>
            <Text
              style={[
                styles.multiText,
                selected.includes(opt) && styles.multiSelectedText,
              ]}>
              {opt}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const postHostel = async () => {
    setButtonLoading(true);

    const formData = new FormData();
    if (title) formData.append('title', title);
    if (contact) formData.append('contact_number', contact);
    if (altContact) formData.append('alternate_contact_number', altContact);
    if (description) formData.append('description', description);
    if (singleRoom) formData.append('single_room_price', singleRoom);
    if (doubleRoom) formData.append('double_sharing_price', doubleRoom);
    if (tripleRoom) formData.append('triple_sharing_price', tripleRoom);
    if (fourRoom) formData.append('four_sharing_price', fourRoom);
    if (roomDeposit) formData.append('security_deposit', roomDeposit);

    if (dormDay) formData.append('one_day_stay', dormDay);
    if (dormWeek) formData.append('one_week_stay', dormWeek);
    if (dormMonth) formData.append('one_month_stay', dormMonth);

    if (location?.address) formData.append('location', location?.address);
    if (location?.lat) formData.append('lat', location?.lat);
    if (location?.lng) formData.append('long', location?.lng);
    if (landmark) formData.append('landmark', landmark);

    if (roomSizeMin) formData.append('room_size_min', roomSizeMin);
    if (roomSizeMax) formData.append('room_size_max', roomSizeMax);

    if (selectedTypes) formData.append('hostel_type', selectedTypes);
  
    if (Array.isArray(selectedTypes) && selectedTypes.length > 0) {
      selectedTypes.forEach((item, index) => {
        formData.append(`hostel_type[${index}]`, item);
      });
    } else {
      if (selectedTypes?.length > 0)
        formData.append('hostel_type[0]', selectedTypes);
    }


     if (Array.isArray(furnishingOptions) && furnishingOptions.length > 0) {
      furnishingOptions.forEach((item, index) => {
        formData.append(`furnishing[${index}]`, item);
      });
    } else {
      if (furnishingOptions?.length > 0)
        formData.append('furnishing[0]', furnishingOptions);
    }


     if (Array.isArray(bathroomType) && bathroomType.length > 0) {
      bathroomType.forEach((item, index) => {
        formData.append(`bathroom_type[${index}]`, item);
      });
    } else {
      if (bathroomType?.length > 0)
        formData.append('bathroom_type[0]', bathroomType);
    }


    if (breakfast) formData.append('breakfast_timing', foodTimings.breakfast);
    if (tea) formData.append('tea_coffee_timing', foodTimings.tea);
    if (lunch) formData.append('lunch_timing', foodTimings.lunch);
    if (snacks) formData.append('snacks_timing', foodTimings.snacks);
    if (dinner) formData.append('dinner_timing', foodTimings.dinner);
    if (documents) formData.append('documents_required', documents);
    if (rules) formData.append('rules_policies', rules);
    if (smokingAllowed)
      formData.append('smoking_alcohol_policy', smokingAllowed);
    if (alcoholAllowed) formData.append('alcohol', alcoholAllowed);
    if (refundPolicy) formData.append('deposit_refund_policy', refundPolicy);
    if (PetsAllowed) formData.append('pet_allowed', PetsAllowed);
    if (gateTimings?.opening) {
      formData.append('get_open_time', gateTimings.opening);
    }
    if (visitersAllowed) formData.append('visitors_allowed', visitersAllowed == 'yes' ? 1 : 0);
    // Gate Closing Time
    if (gateTimings?.closing) {
      formData.append('gate_closing_time', gateTimings.closing);
    }
    Object.entries(toggleStates).forEach(([key, value]) => {
      formData.append(key, value === 'yes' ? 1 : 0);
    });

    images.forEach((img, index) => {
      formData.append(`images[${index}]`, {
        uri: img.uri,
        type: img.type || 'image/jpeg',
        name: img.name || `image_${index}.jpg`,
      });
    });
    formData.append('menu_images[0]', {
      type: 'image/jpeg',
      uri: menuImage?.uri,
      name: 'image',
    });
    console.log(formData, 'FROMMMM');

    const response = await postRequest('public/api/hostels', formData, true);

    if (response?.data?.success) {
      setButtonLoading(false);

      showToast(response?.data?.message, 'success');
      navigation.goBack();
    } else {
      // navigation.goBack()
      setButtonLoading(false);
    }
    setButtonLoading(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLOR.white }}>
      <Header
        title={'Post Hostel'}
        showBack
        onBackPress={() => navigation.goBack()}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={100}>
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}>
          {/* Upload images */}
          <View style={styles.section}>
            <Text style={styles.label}>Upload Images</Text>
            <TouchableOpacity style={styles.uploadBtn} onPress={pickImages}>
              <Text style={styles.uploadText}>+ Upload</Text>
            </TouchableOpacity>
            <View style={styles.imageRow}>
              {images.map((img, idx) => (
                <Image key={idx} source={img} style={styles.imagePreview} />
              ))}
            </View>
          </View>

          {renderInput('Hostel Title *', title, setTitle)}
          {renderInput('Contact Number *', contact, setContact)}
          {renderInput('Alternate Contact Number', altContact, setAltContact)}
          {renderInput('Description', description, setDescription, true)}

          {/* Room pricing */}
          <Text style={styles.sectionTitle}>Room Price</Text>
          {renderInput('Single room (Day)', singleRoomDay, setSingleRoomDay)}
          {renderInput('Single room (Month)', singleRoom, setSingleRoom)}
          {renderInput('Double sharing / month', doubleRoom, setDoubleRoom)}
          {renderInput('Triple sharing / month', tripleRoom, setTripleRoom)}
          {renderInput('4 sharing / month', fourRoom, setFourRoom)}
          {renderInput('Security Deposit', roomDeposit, setRoomDeposit)}

          {/* Dormitory pricing */}
          <Text style={styles.sectionTitle}>Dormitory Price</Text>
          {renderInput('1 Day Stay', dormDay, setDormDay)}
          {renderInput('1 Week Stay', dormWeek, setDormWeek)}
          {renderInput('1 Month Stay', dormMonth, setDormMonth)}
          {renderInput('Security Deposit', dormDeposit, setDormDeposit)}

          {/* Location */}
          {/* {renderInput('Location', location, setLocation)} */}
          <View style={styles.section}>
            <Text style={styles.label}>Location</Text>
            <GooglePlacePicker
              onPlaceSelected={location => setLocation(location)}
            />
          </View>
          {renderInput('Landmark', landmark, setLandmark)}

          {/* Room Size */}
          <View style={styles.section}>
            <Text style={styles.label}>Room Size (sq.ft)</Text>
            <View style={styles.row}>
              <TextInput
                style={[styles.input, styles.halfInput]}
                value={roomSizeMin}
                onChangeText={setRoomSizeMin}
                placeholder="Min"
                placeholderTextColor={COLOR.grey}
                keyboardType="numeric"
              />
              <TextInput
                style={[styles.input, styles.halfInput]}
                value={roomSizeMax}
                onChangeText={setRoomSizeMax}
                placeholder="Max"
                placeholderTextColor={COLOR.grey}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Hostel type */}
          {renderMultiSelect(
            'Hostel Type',
            hostelTypes,
            selectedTypes,
            setSelectedTypes,
          )}

          {/* Furnishing status */}
          {renderMultiSelect(
            'Furnishing Status',
            furnishingOptions,
            selectedFurnishing,
            setSelectedFurnishing,
          )}

          {/* Bathroom type */}
          {renderMultiSelect(
            'Bathroom Type',
            ['Attached', 'Common', 'Both'],
            bathroomType,
            setBathroomType,
          )}

          {/* Toggles */}
          {toggleOptions.map(opt =>
            renderToggle(opt?.label, toggleStates[opt?.key], v => {
              console.log(v, 'VVVV');

              setToggleStates({ ...toggleStates, [opt?.key]: v });
            }),
          )}

          {/* Food Options */}
          <Text style={styles.sectionTitle}>Food Options</Text>
          {renderToggle('Mess', mess, setMess)}
          {renderToggle('Breakfast', breakfast, setBreakfast)}
          {renderToggle('Lunch', lunch, setLunch)}
          {renderToggle('Dinner', dinner, setDinner)}
          {renderToggle('Tea / Coffee', tea, setTea)}
          {renderToggle('Snacks', snacks, setSnacks)}

          {/* Food Timings */}
          {/* {renderInput('Breakfast Timing', foodTimings.breakfast, val =>
            setFoodTimings({...foodTimings, breakfast: val}),
          )}
          {renderInput('Tea/Coffee Timing', foodTimings.tea, val =>
            setFoodTimings({...foodTimings, tea: val}),
          )}
          {renderInput('Lunch Timing', foodTimings.lunch, val =>
            setFoodTimings({...foodTimings, lunch: val}),
          )}
          {renderInput('Snacks Timing', foodTimings.snacks, val =>
            setFoodTimings({...foodTimings, snacks: val}),
          )}
          {renderInput('Dinner Timing', foodTimings.dinner, val =>
            setFoodTimings({...foodTimings, dinner: val}),
          )} */}

          {renderTimingInput('Breakfast Timing', 'breakfast')}
          {renderTimingInput('Tea/Coffee Timing', 'tea')}
          {renderTimingInput('Lunch Timing', 'lunch')}
          {renderTimingInput('Snacks Timing', 'snacks')}
          {renderTimingInput('Dinner Timing', 'dinner')}

          {/* Date Time Picker */}
          {/* {showPicker && (
            <DateTimePicker
              value={new Date()}
              mode={pickerMode}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onChange}
            />
          )} */}

          <Modal
            visible={showPicker}
            transparent
            animationType="slide"
            onRequestClose={() => setShowPicker(false)}>
            <View style={styles.modalBackdrop}>
              <View style={styles.modalContent}>
                <DateTimePicker
                  value={new Date()}
                  mode={pickerMode}
                  display="spinner"
                  onChange={(e, date) => {
                    onChange(e, date);
                    if (Platform.OS === 'ios' || Platform?.OS == 'android') setShowPicker(false);
                  }}
                />
              </View>
            </View>
          </Modal>

          {/* Documents */}
          {renderInput('Documents Required', documents, setDocuments, true)}

          {/* Rules */}
          {/* {renderInput('Rules & Policies', rules, setRules, true)} */}
          {renderMultiSelect(
            'Rules & Policies',
            RULES_POLICIES_OPTIONS,
            rulesPolicies,
            setRulesPolicies,
          )}
          {renderTimingInput('Gate Opening Time', 'opening')}
          {renderTimingInput('Gate Closing Time', 'closing')}
          {renderToggle('Pets Allowed', PetsAllowed, setPetsAllowed)}

          {renderToggle('Smoking Allowed', smokingAllowed, setSmokingAllowed)}

          {renderToggle('Alcohol Allowed', alcoholAllowed, setAlcoholAllowed)}
          {renderInput(' Refund policy', refundPolicy, setRefundPolicy, true)}
          {/* Menu Image */}
          <View style={styles.section}>
            <Text style={styles.label}>Menu Image</Text>
            <TouchableOpacity style={styles.uploadBtn} onPress={pickMenuImage}>
              <Text style={styles.uploadText}>+ Upload</Text>
            </TouchableOpacity>
            {menuImage && (
              <Image source={menuImage} style={styles.imagePreview} />
            )}
          </View>
        </ScrollView>
        <CustomButton
          title={'Upload Hostel'}
          onPress={postHostel}
          loading={buttonLoading}
        />
      </KeyboardAvoidingView>
    </View>
  );
};

export default PostHostel;

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 20 },
  section: { marginBottom: 16 },
  label: { fontSize: 14, color: COLOR.black, marginBottom: 6, fontWeight: '600' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#fafafa',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLOR.primary,
    marginVertical: 8,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  halfInput: { flex: 1, marginRight: 8 },
  toggleRow: { flexDirection: 'row', gap: 10 },
  toggleBtn: {
    borderWidth: 1,
    borderColor: COLOR.grey,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 10,
  },
  selectedBtn: { backgroundColor: COLOR.primary, borderColor: COLOR.primary },
  toggleText: { fontSize: 14, color: COLOR.black },
  selectedText: { color: COLOR.white, fontWeight: '600' },
  multiRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  multiBtn: {
    borderWidth: 1,
    borderColor: COLOR.grey,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 6,
  },
  multiSelected: { backgroundColor: COLOR.primary, borderColor: COLOR.primary },
  multiText: { fontSize: 13, color: COLOR.black },
  multiSelectedText: { color: COLOR.white },
  uploadBtn: {
    borderWidth: 1,
    borderColor: COLOR.primary,
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadText: { color: COLOR.primary, fontWeight: '600' },
  imageRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 8, gap: 8 },
  imagePreview: { width: 80, height: 80, borderRadius: 6 },

  inputContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  value: {
    fontSize: 16,
    color: '#555',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    width: '90%',
  },
});
