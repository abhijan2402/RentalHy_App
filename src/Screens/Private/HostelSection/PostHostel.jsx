import React, {useState} from 'react';
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
} from 'react-native';
import Header from '../../../Components/FeedHeader';
import {COLOR} from '../../../Constants/Colors';
import ImagePicker from 'react-native-image-crop-picker';
import CustomButton from '../../../Components/CustomButton';

const PostHostel = ({navigation}) => {
  const [images, setImages] = useState([]);
  const [title, setTitle] = useState('');
  const [contact, setContact] = useState('');
  const [altContact, setAltContact] = useState('');
  const [description, setDescription] = useState('');

  // Pricing
  const [singleRoom, setSingleRoom] = useState('');
  const [doubleRoom, setDoubleRoom] = useState('');
  const [tripleRoom, setTripleRoom] = useState('');
  const [fourRoom, setFourRoom] = useState('');
  const [roomDeposit, setRoomDeposit] = useState('');
  const [dormDay, setDormDay] = useState('');
  const [dormWeek, setDormWeek] = useState('');
  const [dormMonth, setDormMonth] = useState('');
  const [dormDeposit, setDormDeposit] = useState('');

  // Location
  const [mapLink, setMapLink] = useState('');
  const [location, setLocation] = useState('');
  const [landmark, setLandmark] = useState('');
  const [roomSizeMin, setRoomSizeMin] = useState('');
  const [roomSizeMax, setRoomSizeMax] = useState('');

  // Hostel type
  const hostelTypes = ['Male Hostel', 'Female Hostel', 'Co-living Hostel'];
  const [selectedTypes, setSelectedTypes] = useState([]);

  // Furnishing
  const furnishingOptions = [
    'Bed with mattress & pillow',
    'Bed frame only',
    'Study table & chair',
    'Wardrobe / cupboard',
    'Fan',
    'Lights',
    'Curtains',
    'AC',
    'Geyser (Hot water)',
    'Basic appliances',
    'Limited storage space',
    'Only room (no furniture/appliance)',
    'Tenant brings own setup',
  ];
  const [selectedFurnishing, setSelectedFurnishing] = useState([]);

  // Bathroom
  const [bathroomType, setBathroomType] = useState('');

  // Toggles Yes/No
  const toggleOptions = [
    'Kitchen',
    'WiFi',
    'AC / Non-AC',
    'Laundry service',
    'Housekeeping',
    'Hot water / Geyser',
    'Power backup',
    'Parking (2W/4W)',
    'Gym',
    'Play area',
    'TV',
    'Dining Table',
    'Security',
    'RO Drinking Water',
    'Study Area',
  ];
  const RULES_POLICIES_OPTIONS = [
    'Gate Closing Time (curfew)',
    'Visitors allowed/not allowed',
    'Smoking/Alcohol policy',
    'Pets allowed or not',
    'Refund policy for deposit',
  ];
  const [rulesPolicies, setRulesPolicies] = useState([]);

  const [toggleStates, setToggleStates] = useState(
    Object.fromEntries(toggleOptions.map(opt => [opt, 'no'])),
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
      });
      setImages(res.map(img => ({uri: img.path})));
    } catch (err) {
      console.log(err);
    }
  };

  const pickMenuImage = async () => {
    try {
      const res = await ImagePicker.openPicker({mediaType: 'photo'});
      setMenuImage({uri: res.path});
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
          multiline && {height: 100, textAlignVertical: 'top'},
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

  return (
    <View style={{flex: 1, backgroundColor: COLOR.white}}>
      <Header
        title={'Post Hostel'}
        showBack
        onBackPress={() => navigation.goBack()}
      />
      <KeyboardAvoidingView
        style={{flex: 1}}
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
          {renderInput('Single room (Day/Month)', singleRoom, setSingleRoom)}
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
          {renderInput('Map Link', mapLink, setMapLink)}
          {renderInput('Location', location, setLocation)}
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
            [bathroomType],
            val => setBathroomType(val[0]),
          )}

          {/* Toggles */}
          {toggleOptions.map(opt =>
            renderToggle(opt, toggleStates[opt], v =>
              setToggleStates({...toggleStates, [opt]: v}),
            ),
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
          {renderInput('Breakfast Timing', foodTimings.breakfast, val =>
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
          )}

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
        <CustomButton title={'Upload Hostel'} />
      </KeyboardAvoidingView>
    </View>
  );
};

export default PostHostel;

const styles = StyleSheet.create({
  container: {padding: 16, paddingBottom: 100},
  section: {marginBottom: 16},
  label: {fontSize: 14, color: COLOR.black, marginBottom: 6, fontWeight: '600'},
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
  row: {flexDirection: 'row', justifyContent: 'space-between'},
  halfInput: {flex: 1, marginRight: 8},
  toggleRow: {flexDirection: 'row', gap: 10},
  toggleBtn: {
    borderWidth: 1,
    borderColor: COLOR.grey,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 10,
  },
  selectedBtn: {backgroundColor: COLOR.primary, borderColor: COLOR.primary},
  toggleText: {fontSize: 14, color: COLOR.black},
  selectedText: {color: COLOR.white, fontWeight: '600'},
  multiRow: {flexDirection: 'row', flexWrap: 'wrap', gap: 8},
  multiBtn: {
    borderWidth: 1,
    borderColor: COLOR.grey,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 6,
  },
  multiSelected: {backgroundColor: COLOR.primary, borderColor: COLOR.primary},
  multiText: {fontSize: 13, color: COLOR.black},
  multiSelectedText: {color: COLOR.white},
  uploadBtn: {
    borderWidth: 1,
    borderColor: COLOR.primary,
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadText: {color: COLOR.primary, fontWeight: '600'},
  imageRow: {flexDirection: 'row', flexWrap: 'wrap', marginTop: 8, gap: 8},
  imagePreview: {width: 80, height: 80, borderRadius: 6},
});
