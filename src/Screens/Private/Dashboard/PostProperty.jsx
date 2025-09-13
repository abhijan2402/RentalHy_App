import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import Header from '../../../Components/FeedHeader';
import ImagePicker from 'react-native-image-crop-picker';
import {COLOR} from '../../../Constants/Colors';
import CustomButton from '../../../Components/CustomButton';
import {useApi} from '../../../Backend/Api';
import {useToast} from '../../../Constants/ToastContext';
import KeyValueInput from '../../../Components/KeyValueComponent';
import GooglePlacePicker from '../../../Components/GooglePicker';

const PostProperty = ({navigation}) => {
  const {postRequest} = useApi();
  const {showToast} = useToast();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [area, setArea] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedBHK, setSelectedBHK] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [furnishing, setFurnishing] = useState('');
  const [availability, setAvailability] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [parking, setParking] = useState('');
  const [facing, setFacing] = useState('');
  const [advanceValue, setAdvanceValue] = useState('');
  const [familyTypeValue, setFamilyTypeValue] = useState('');
  const [landmark, setLandmark] = useState('');
  const [mapData, setMapData] = useState([]);

  const [commercialOptions, setCommercialOptions] = useState([
  'Shop',
  'Office',
  'Showroom',
  'Hotel',
  'Restaurant',
  ]);


  const [commercialSpace, setCommercialSpace] = useState([]);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customCommercial, setCustomCommercial] = useState('');

  const [selectedFloor, setSelectedFloor] = useState('');

  const [securityAvailable, setSecurityAvailable] = useState(false);
  const [waterFilter, setWaterFilter] = useState(false);
  const [maintainance, setMaintainance] = useState(false);
  const [maintainanceValue, setMaintainanceValue] = useState('');

  const [address, setAddress] = useState({});

  const bhkOptions = ['1 RK', '1 BHK', '2 BHK', '3 BHK', '4 BHK+'];
  const propertyTypes = [
    'Apartment',
    'Flat',
    'Villa',
    'Independent House',
    'Duplex',
    'Roof sheets',
    'Tiled House',
  ];
  const furnishingOptions = ['Furnished', 'Semi-Furnished', 'Unfurnished'];
  const availabilityOptions = ['Ready to Move', 'Under Construction'];
  const bathroomOptions = ['1', '2', '3', '4+'];
  const floorOptions = [
    'Ground Floor',
    '1st',
    '2nd',
    '3rd',
    '4th',
    '5th',
    '6th+',
  ];

  const parkingOptions = ['Car', 'Bike', 'Both', 'None'];
  const advance = ['1 month', '2 months', '3 months+', 'No Advance'];
  const familyType = ['Family', 'Bachelors male', 'Bachelors female'];
  const facingOptions = [
    'North',
    'East',
    'West',
    'South',
    'North-East',
    'South-East',
    'North-West',
    'South-West',
  ];

  const renderOptions = (
    label,
    options,
    selected,
    setSelected,
    multiSelect = false,
  ) => {
    const handlePress = option => {
      if (multiSelect) {
        if (selected.includes(option)) {
          setSelected(selected.filter(item => item !== option));
        } else {
          setSelected([...selected, option]);
        }
      } else {
        setSelected(option);
      }
    };

    const isSelected = option => {
      return multiSelect ? selected.includes(option) : selected === option;
    };

    return (
      <>
        <Text style={styles.label}>{label}</Text>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          horizontal
          style={styles.optionRow}>
          {options.map(option => (
            <TouchableOpacity
              key={option}
              style={[
                styles.optionButton,
                isSelected(option) && styles.optionSelected,
              ]}
              onPress={() => handlePress(option)}>
              <Text
                style={[
                  styles.optionText,
                  isSelected(option) && styles.optionTextSelected,
                ]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </>
    );
  };

  const pickImages = () => {
    ImagePicker.openPicker({
      multiple: true,
      mediaType: 'photo',
      cropping: false,
    }).then(selectedImages => {
      const newImages = selectedImages.map(img => ({
        uri: img.path,
        type: img.mime,
        name: 'images',
      }));
      setImages(prev => [...prev, ...newImages]);
    });
  };

  const removeImage = index => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handlePostProperty = async () => {
    if (!title || !description || !price || !location) {
      Alert.alert('Error', 'Please fill all required fields.');
      return;
    }
    setLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('location', location);
    formData.append('area_sqft', area);
    formData.append('property_type', propertyType);
    formData.append('availability', availability);
    formData.append('bathrooms', bathrooms);
    formData.append('parking_available', parking);
    formData.append('facing_direction', facing);
    formData.append('advance', advanceValue);
    formData.append('landmark', landmark);
    if (address?.lat && address?.lng) {
      formData.append('lat', address.lat);
      formData.append('long', address.lng);
    }

    if (maintainance) {
      formData.append('mentains_chargers', 1);
      formData.append('mentains_amount', maintainanceValue || '0');
    } else {
      formData.append('mentains_chargers', 0);
      formData.append('mentains_amount', maintainanceValue || '0');
    }

    formData.append('security_avl', securityAvailable ? 1 : 0);
    formData.append('water_filter', waterFilter ? 1 : 0);

    if (Array.isArray(commercialSpace) && commercialSpace.length > 0) {
      commercialSpace.forEach((item, index) => {
        formData.append(`commercial_space[${index}]`, item);
      });
    } else {
      if (commercialSpace?.length > 0)
        formData.append('commercial_space[0]', commercialSpace);
    }

    if (Array.isArray(selectedFloor) && selectedFloor.length > 0) {
      selectedFloor.forEach((item, index) => {
        formData.append(`floor[${index}]`, item);
      });
    } else {
      if (selectedFloor?.length > 0) formData.append('floor[0]', selectedFloor);
    }

    if (Array.isArray(selectedBHK)) {
      selectedBHK.forEach((item, index) => {
        formData.append(`bhk[${index}]`, item);
      });
    } else {
      formData.append('bhk[0]', selectedBHK);
    }

    if (Array.isArray(furnishing)) {
      furnishing.forEach((item, index) => {
        formData.append(`furnishing_status[${index}]`, item);
      });
    } else {
      formData.append('furnishing_status[0]', furnishing);
    }

    if (Array.isArray(familyTypeValue)) {
      familyTypeValue.forEach((item, index) => {
        formData.append(`preferred_tenant_type[${index}]`, item);
      });
    } else {
      formData.append('preferred_tenant_type[0]', familyTypeValue);
    }

    images.forEach((img, index) => {
      formData.append(`images[${index}]`, {
        uri: img.uri,
        type: img.type || 'image/jpeg',
        name: img.name || `image_${index}.jpg`,
      });
    });

    if (Array.isArray(mapData)) {
      mapData
        .filter(item => item.key?.trim() !== '' && item.value?.trim() !== '')
        .forEach(item => {
          formData.append(`amenities[${item.key}]`, item.value);
        });
    }

    const response = await postRequest(
      'public/api/properties/add',
      formData,
      true,
    );

    if (response?.data?.status == true) {
      showToast(response?.data?.message, 'success');
      setLoading(false);
      navigation?.goBack();
    }
    setLoading(false);

    // Alert.alert('Success', 'Your property has been posted successfully!');
    // navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Header
        title={'Post Property'}
        showBack
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        nestedScrollEnabled={true}>
        <Text style={styles.label}>Property Title *</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Enter property title"
          placeholderTextColor={COLOR.grey}
        />

        <Text style={styles.label}>Description *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Enter property description"
          placeholderTextColor={COLOR.grey}
          multiline
        />

        <Text style={styles.label}>Price *</Text>
        <TextInput
          style={styles.input}
          value={price}
          onChangeText={setPrice}
          placeholder="Enter price"
          placeholderTextColor={COLOR.grey}
          keyboardType="numeric"
        />

        <Text style={styles.label}>location *</Text>
        <GooglePlacePicker
          placeholder="Search location..."
          onPlaceSelected={place => {
            setAddress(place);
            setLocation(place.address);
          }}
        />

        <Text style={styles.label}>Area (sq ft) *</Text>
        <TextInput
          style={styles.input}
          value={area}
          onChangeText={setArea}
          placeholder="Enter area size"
          placeholderTextColor={COLOR.grey}
          keyboardType="numeric"
        />

        <Text style={styles.label}>landmark</Text>
        <TextInput
          style={styles.input}
          value={landmark}
          onChangeText={setLandmark}
          placeholder="Enter landmark"
          placeholderTextColor={COLOR.grey}
        />

       <View style={styles.section}>
  <Text style={styles.label}>Commercial Space (Suitable For)</Text>
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    style={styles.toggleRow}
  >
    {commercialOptions.map(option => (
      <TouchableOpacity
        key={option}
        style={[
          styles.optionButton,
          commercialSpace.includes(option) && styles.selectedBtn,
        ]}
        onPress={() => {
          if (commercialSpace.includes(option)) {
            // Unselect
            setCommercialSpace(prev => prev.filter(item => item !== option));
            // If it was a custom one, also remove it from options
            if (
              !['Shop', 'Office', 'Showroom', 'Hotel', 'Restaurant'].includes(option)
            ) {
              setCommercialOptions(prev => prev.filter(item => item !== option));
            }
          } else {
            // Select
            setCommercialSpace(prev => [...prev, option]);
          }
        }}
      >
        <Text
          style={[
            styles.toggleText,
            commercialSpace.includes(option) && styles.selectedText,
          ]}
        >
          {option}
        </Text>
      </TouchableOpacity>
    ))}

    {/* + Add custom button */}
    <TouchableOpacity
      key="add-custom"
      style={[styles.optionButton, styles.addButton]}
      onPress={() => setShowCustomInput(true)}
    >
      <Text style={styles.toggleText}>＋</Text>
    </TouchableOpacity>
  </ScrollView>

  {showCustomInput && (
    <View style={styles.customRow}>
      <TextInput
        style={[styles.input, {flex: 1, marginRight: 8}]}
        value={customCommercial}
        onChangeText={setCustomCommercial}
        placeholder="Enter custom space type"
        placeholderTextColor={COLOR.grey}
        onSubmitEditing={() => {
          const trimmed = customCommercial.trim();
          if (!trimmed) return;
          // Add to options and select it
          setCommercialOptions(prev => [...prev, trimmed]);
          setCommercialSpace(prev => [...prev, trimmed]);
          setCustomCommercial('');
          setShowCustomInput(false);
        }}
      />
      <TouchableOpacity
        style={styles.addConfirm}
        onPress={() => {
          const trimmed = customCommercial.trim();
          if (!trimmed) return;
          setCommercialOptions(prev => [...prev, trimmed]);
          setCommercialSpace(prev => [...prev, trimmed]);
          setCustomCommercial('');
          setShowCustomInput(false);
        }}
      >
        <Text style={{color: '#fff'}}>Add</Text>
      </TouchableOpacity>
    </View>
  )}
</View>

        {renderOptions('BHK', bhkOptions, selectedBHK, setSelectedBHK, true)}
        {renderOptions(
          'Property Type',
          propertyTypes,
          propertyType,
          setPropertyType,
        )}
        {renderOptions(
          'Floor Options',
          floorOptions,
          selectedFloor,
          setSelectedFloor,
          true,
        )}
        {renderOptions(
          'Furnishing Status',
          furnishingOptions,
          furnishing,
          setFurnishing,
          true,
        )}
        {renderOptions(
          'Availability',
          availabilityOptions,
          availability,
          setAvailability,
        )}
        {renderOptions('Bathrooms', bathroomOptions, bathrooms, setBathrooms)}
        {renderOptions(
          'Parking Available',
          parkingOptions,
          parking,
          setParking,
        )}
        {renderOptions('Facing Direction', facingOptions, facing, setFacing)}
        {renderOptions('Advance', advance, advanceValue, setAdvanceValue)}
        {renderOptions(
          'Preferred Tenant Type',
          familyType,
          familyTypeValue,
          setFamilyTypeValue,
          true,
        )}

        <View style={styles.section}>
          <Text style={styles.label}>Security Available</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.toggleRow}>
            {['Yes', 'No'].map(option => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.toggleBtn,
                  securityAvailable === (option === 'Yes') &&
                    styles.selectedBtn,
                ]}
                onPress={() => {
                  setSecurityAvailable(option === 'Yes' ? true : false);
                }}>
                <Text
                  style={[
                    styles.toggleText,
                    securityAvailable === (option === 'Yes') &&
                      styles.selectedText,
                  ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Water Filter</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.toggleRow}>
            {['Yes', 'No'].map(option => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.toggleBtn,
                  waterFilter === (option === 'Yes') && styles.selectedBtn,
                ]}
                onPress={() => {
                  setWaterFilter(option == 'Yes' ? true : false);
                }}>
                <Text
                  style={[
                    styles.toggleText,
                    waterFilter === (option === 'Yes') && styles.selectedText,
                  ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Maintainance Fees</Text>
          <View
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.toggleRow}>
            {['Yes', 'No'].map(option => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.toggleBtn,
                  maintainance === (option === 'Yes') && styles.selectedBtn,
                ]}
                onPress={() => {
                  setMaintainance(option == 'Yes' ? true : false);
                  if (option === 'No') setMaintainanceValue('');
                }}>
                <Text
                  style={[
                    styles.toggleText,
                    maintainance === (option === 'Yes') && styles.selectedText,
                  ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {maintainance && (
            <TextInput
              style={[styles.input, {marginTop: 10}]}
              value={maintainanceValue}
              onChangeText={setMaintainanceValue}
              placeholder="Enter Monthly Maintainance Amount"
              placeholderTextColor={COLOR.grey}
              keyboardType="numeric"
            />
          )}
        </View>

        {/* Upload Images */}
        <Text style={styles.label}>Property Images*</Text>
        <TouchableOpacity style={styles.uploadBtn} onPress={pickImages}>
          <Text style={styles.uploadText}>+ Add Images</Text>
        </TouchableOpacity>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {images.map((img, index) => (
            <View key={index} style={styles.imageWrapper}>
              <Image source={{uri: img.uri}} style={styles.image} />
              <TouchableOpacity
                style={styles.crossContainer}
                onPress={() => removeImage(index)}>
                <Image
                  source={{
                    uri: 'https://cdn-icons-png.flaticon.com/512/1828/1828778.png',
                  }}
                  style={styles.crossIcon}
                />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        <ScrollView showsHorizontalScrollIndicator={false}>
          <Text style={[styles.label, {top: 10}]}>Add if any</Text>

          <KeyValueInput onChange={setMapData} />
        </ScrollView>

        {/* Post Button */}
        <CustomButton
          loading={loading}
          title={'Post Property'}
          style={{marginTop: 20}}
          onPress={handlePostProperty}
        />
      </ScrollView>
    </View>
  );
};

export default PostProperty;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.white,
  },
  content: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLOR.black,
    marginTop: 15,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: COLOR.grey,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: COLOR.white,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  optionRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  optionButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: COLOR.grey,
    borderRadius: 20,
    marginRight: 10,
  },
  optionSelected: {
    backgroundColor: COLOR.primary,
    borderColor: COLOR.primary,
  },
  optionText: {
    color: COLOR.black,
    fontSize: 13,
  },
  optionTextSelected: {
    color: COLOR.white,
  },
  uploadBtn: {
    borderWidth: 1,
    borderColor: COLOR.primary,
    borderRadius: 8,
    padding: 10,
    marginTop: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  uploadText: {
    color: COLOR.primary,
    fontWeight: '600',
  },
  imageWrapper: {
    position: 'relative',
    marginRight: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  crossContainer: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: COLOR.white,
    borderRadius: 12,
    padding: 5,
    elevation: 2,
  },
  crossIcon: {
    width: 10,
    height: 10,
    tintColor: COLOR.black,
  },

  section: {marginVertical: 10},
  label: {fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#333'},
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#fafafa',
  },
  dateBox: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 10,
    backgroundColor: '#f9f9f9',
  },
  dateText: {fontSize: 14, color: '#333'},
  selectedBox: {
    backgroundColor: COLOR.primary || '#007AFF',
    borderColor: COLOR.primary || '#007AFF',
  },
  selectedText: {color: '#fff', fontWeight: '600'},
  toggleRow: {flexDirection: 'row', marginTop: 10},
  toggleBtn: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 10,
  },
  selectedBtn: {
    backgroundColor: COLOR.primary || '#007AFF',
    borderColor: COLOR.primary || '#007AFF',
  },
  toggleText: {fontSize: 14, color: '#333'},
addButton: {
  borderStyle: 'dashed',
  borderWidth: 1,
  borderColor: COLOR.primary,
  backgroundColor: 'transparent',
},
customRow: {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 10,
},
addConfirm: {
  backgroundColor: COLOR.primary,
  paddingHorizontal: 12,
  paddingVertical: 10,
  borderRadius: 8,
},
});
