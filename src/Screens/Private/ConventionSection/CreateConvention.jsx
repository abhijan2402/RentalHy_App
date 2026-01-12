import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import React, { useState } from 'react';
import Header from '../../../Components/FeedHeader';
import { COLOR } from '../../../Constants/Colors';
import ImagePicker from 'react-native-image-crop-picker';
import CustomButton from '../../../Components/CustomButton';
import { Calendar } from 'react-native-calendars';
import { useToast } from '../../../Constants/ToastContext';
import { useApi } from '../../../Backend/Api';
import GooglePlacePicker from '../../../Components/GooglePicker';
import moment from 'moment';

const getYears = () => {
  const currentYear = new Date().getFullYear();
  return [currentYear + 1, currentYear + 2];
};

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const CreateConvention = ({ navigation, route }) => {
  const activeTab = route?.params?.activeTabKey || 'Function/Convention Hall';
  const { postRequest } = useApi();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  // Images
  const [hallImages, setHallImages] = useState([]);
  const [kitchenImages, setKitchenImages] = useState([]);
  const [parkingImages, setParkingImages] = useState([]);
  const [BridGroomImages, setBridGroomImages] = useState([]);
  const [uploadType, setUploadType] = useState(
    activeTab == 'farmhouse' ? 'Farm House' : 'Function/Convention Hall',
  );

  // General info
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contact, setContact] = useState(null);

  // Price options
  const priceOptions = [
    'Wedding',
    'Wedding Anniversary',
    'Wedding Reception',
    'Pre Wedding Mehendi Party',
    'Birthday Party',
    'Ring Ceremony',
    'Engagement',
    'Family Function',
    'First Birthday Party',
    'Naming Ceremony',
    'Sangeet Ceremony',
    'Baby Shower',
    'Bridal Shower',
    'Kids Birthday Party',
    'Dhoti Event',
    'Upanayam',
    'Corporate Event',
    'Corporate Party',
    'Farewell',
    'Stage Event',
    'Childrens Party',
    'Annual Fest',
    'Family Get Together',
    'New Year Party',
    'Freshers Party',
    'Brand Promotion',
    'Get Together',
    'Meeting',
    'Diwali Party',
    'Conference',
    'Kitty Party',
    'Bachelor Party',
    'Christmas Party',
    'Product Launch',
    'Corporate Offsite',
    'Lohri Party',
    'Class Reunion',
    "Valentine's Day",
    'Dealers Meet',
    'House Party',
    'MICE',
    'Group Dining',
    'Adventure Party',
    'Residential Conference',
    'Corporate Training',
    'Business Dinner',
    'Musical Concert',
    'Exhibition',
    'Cocktail Dinner',
    'Holi Party',
    'Team Outing',
    'Social Mixer',
    'Photo Shoots',
    'Fashion Show',
    'Team Building',
    'Training',
    'Aqueeqa Ceremony',
    'Video Shoots',
    'Walkin Interview',
    'Game Watch',
    'Pool Party',
  ];

  const priceOptionsFarm = [
    'Day Visit Price',
    'Night Visit Price',
    'Full Day Price',
    'Corporate Outing Price',
    'Banquet Hall Charges',
    'Occasion Charges',
  ];
  const [prices, setPrices] = useState({});

  // Seating Capacity
  const [capacity, setCapacity] = useState(50);

  // Parking
  const [parkingAvailable, setParkingAvailable] = useState(false);
  const [cars, setCars] = useState('');
  const [bikes, setBikes] = useState('');
  const [buses, setBuses] = useState('');
  const [valet, setValet] = useState('yes');

  const [adultPool, setAdultPool] = useState();

  // Facilities
  const [royaltyDecoration, setRoyaltyDecoration] = useState('no');
  const [decorationContact, setDecorationContact] = useState('');
  const [royaltyKitchen, setRoyaltyKitchen] = useState('yes');
  const [generator, setGenerator] = useState('yes');
  const [normalWater, setNormalWater] = useState('yes');
  const [drinkingWater, setDrinkingWater] = useState('yes');
  const [catering, setCatering] = useState('yes');
  const [PhotographersReq, setPhotographersReq] = useState('yes');
  const [acAvailable, setAcAvailable] = useState('yes');
  // Availability Slots
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [slots, setSlots] = useState([]);

  const [swimmingPool, setSwimmingPool] = useState(false);
  const [foodAvailable, setFoodAvailable] = useState(false);
  const [foodDescription, setFoodDescription] = useState('');
  const [cctv, setCctv] = useState(false);
  const [soundSystem, setSoundSystem] = useState(false);
  const [soundSystemAllowed, setSoundSystemAllowed] = useState(false);
  const [childrenGames, setChildrenGames] = useState(false);
  const [childrenGamesDesc, setChildrenGamesDesc] = useState('');
  const [adultGames, setAdultGames] = useState(false);
  const [adultGamesDesc, setAdultGamesDesc] = useState('');
  const [kitchenSetup, setKitchenSetup] = useState(false);
  const [area, setArea] = useState(null);
  const years = getYears();
  const [unavailableDates, setUnavailableDates] = useState({});
  const [rows, setRows] = useState([{ field: 'Any Other', value: '' }]);
  const [address, setAddress] = useState({});

  const [parkingGuard, setParkingGuard] = useState(false);
  const [alcoholAllowed, setAlcoholAllowed] = useState(false);
  const [roomImages, setRoomImages] = useState([]);

  //Farm houses
  const [freeCancellation, setFreeCancellation] = useState(false);
  const [payLater, setPayLater] = useState(false);
  const [childPool, setChildPool] = useState(false);
  const [securityGuard, setSecurityGuard] = useState(false);
  const [petFriendly, setPetFriendly] = useState(false);
  const [breakfastIncluded, setBreakfastIncluded] = useState(false);
  const [restaurant, setRestaurant] = useState(false);
  const [cafeteria, setCafeteria] = useState(false);
  const [elevator, setElevator] = useState(false);
  const [reception24, setReception24] = useState(false);
  const [gym, setGym] = useState(false);
  const [tvAvailable, setTvAvailable] = useState(false);
  const [meetingRoom, setMeetingRoom] = useState(false);
  const [wifi, setWifi] = useState(false);
  const [playGround, setPlayGround] = useState(false);
  const [kitchen, setKitchen] = useState(false);
  const [refrigerator, setRefrigerator] = useState(false);
  const [spa, setSpa] = useState(false);
  const [wellnessCentre, setWellnessCentre] = useState(false);
  const [wheelChair, setWheelChair] = useState(false);
  const [otherFacilities, setOtherFacilities] = useState('');
  const [timeBlocks, setTimeBlocks] = useState({});

  const [royaltyDecPrice, setRoyaltiDecPrice] = useState('');

  const toggleDate = day => {
    const date = day.dateString;
    setUnavailableDates(prev => {
      const newDates = { ...prev };
      if (newDates[date]) {
        delete newDates[date];
        const updatedTimes = { ...timeBlocks };
        delete updatedTimes[date];
        setTimeBlocks(updatedTimes);
      } else {
        newDates[date] = { selected: true, selectedColor: 'red' };
      }
      return newDates;
    });
  };

  const toggleTimeBlock = (date, block) => {
    setTimeBlocks(prev => {
      const current = prev[date] || [];
      const exists = current.includes(block);
      return {
        ...prev,
        [date]: exists ? current.filter(b => b !== block) : [...current, block],
      };
    });
  };

  const renderTimeOptions = date => {
    const options = ['Day', 'Night', 'Full Day'];
    return (
      <View style={styles.optionRow}>
        {options.map(opt => {
          const selected = timeBlocks[date]?.includes(opt);
          return (
            <TouchableOpacity
              key={opt}
              style={[
                styles.optionButton,
                selected && styles.optionButtonSelected,
              ]}
              onPress={() => toggleTimeBlock(date, opt)}>
              <Text style={selected && styles.optionTextSelected}>{opt}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const pickImages = setter => {
    ImagePicker.openPicker({
      multiple: true,
      cropping: true,
      compressImageQuality: 0.8,
    })
      .then(res =>
        setter(prev => [...prev, ...res.map(img => ({ uri: img.path }))]),
      )
      .catch(err => console.log(err));
  };

  const removeImage = (setter, index) => {
    setter(prev => prev.filter((_, i) => i !== index));
  };

  const addSlot = () => {
    if (!selectedYear || !selectedMonth || !selectedDate) return;
    const dateStr = `${selectedYear}-${String(
      months.indexOf(selectedMonth) + 1,
    ).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}`;
    if (!slots.includes(dateStr)) setSlots([...slots, dateStr]);
  };

  const postSpace = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('seating_capacity', capacity);
    formData.append('ac_available', acAvailable === 'yes' ? 1 : 0);
    formData.append('royalty_decoration', royaltyDecoration === 'yes' ? 1 : 0);
    formData.append('hall_decorator_name', decorationContact);
    formData.append('hall_decorator_number', decorationContact);
    formData.append('royalty_kitchen', royaltyKitchen === 'yes' ? 1 : 0);
    formData.append('generator_available', generator === 'yes' ? 1 : 0);
    formData.append('water_for_cooking', normalWater === 'yes' ? 1 : 0);
    formData.append('address', address?.address);
    formData.append(
      'drinking_water_available',
      drinkingWater === 'yes' ? 1 : 0,
    );
    formData.append('provides_catering_persons', catering === 'yes' ? 1 : 0);
    // formData.append(
    //   'photographers_required',
    //   PhotographersReq === 'yes' ? 1 : 0,
    // );
    formData.append('children_games', childrenGames === true ? 1 : 0);
    formData.append('parking_available', parkingAvailable === true ? 1 : 0);
    formData.append('parking_guard', parkingGuard === true ? 1 : 0);
    formData.append('alcohol_allowed', alcoholAllowed === true ? 1 : 0);

    formData.append('hall_type', 'hall');
    const normalizeKey = str =>
      str
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_|_$/g, '');

    const selectedOptions =
      uploadType === 'Farm House' ? priceOptionsFarm : priceOptions;
    if (uploadType === 'Farm House') {
      selectedOptions.forEach(opt => {
        if (prices[opt]) {
          formData.append(`${normalizeKey(opt)}`, prices[opt]);
        }
      });
    } else {
      selectedOptions.forEach(opt => {
        if (prices[opt]) {
          formData.append(`${normalizeKey(opt)}_price`, prices[opt]);
        }
      });
    }

    rows.forEach(row => {
      if (row.field && row.value) {
        formData.append(`${normalizeKey(row.field)}_price`, row.value);
      }
    });
    if (contact) {
      formData.append('contact_number', contact);
    }

    formData.append('lat', address.lat);
    formData.append('long', address.lng);

    hallImages.forEach((img, index) => {
      formData.append(
        uploadType == 'Farm House'
          ? `main_images[${index}]`
          : `hall_images[${index}]`,
        {
          uri: img.uri,
          type: img.type || 'image/jpeg',
          name: img.name || `hall_image_${index}.jpg`,
        },
      );
    });

    kitchenImages.forEach((img, index) => {
      formData.append(`kitchen_images[${index}]`, {
        uri: img.uri,
        type: img.type || 'image/jpeg',
        name: img.name || `kitchen_image_${index}.jpg`,
      });
    });

    BridGroomImages.forEach((img, index) => {
      formData.append(`bride_image[${index}]`, {
        uri: img.uri,
        type: img.type || 'image/jpeg',
        name: img.name || `bride_image${index}.jpg`,
      });
    });

    parkingImages.forEach((img, index) => {
      formData.append(`praking_image[${index}]`, {
        uri: img.uri,
        type: img.type || 'image/jpeg',
        name: img.name || `praking_image${index}.jpg`,
      });
    });

    roomImages.forEach((img, index) => {
      formData.append(`room_images[${index}]`, {
        uri: img.uri,
        type: img.type || 'image/jpeg',
        name: img.name || `room_image_${index}.jpg`,
      });
    });

    if (timeBlocks) {
      Object.entries(timeBlocks).forEach(([date, value]) => {
        formData.append(`dates[${moment(date)?.format('DD/MM/YYYY')}]`, value);
      });
    }
    console.log(formData, "FFNIFN");

    let url = uploadType === 'Farm House' ? 'farm' : 'hall';

    console.log(formData, 'formdataformdata');
    const response = await postRequest(
      `public/api/hall_add/${url}`,
      formData,
      true,
    );

    if (response?.data?.success == true) {
      showToast(response?.data?.message, 'success');
      setLoading(false);
      navigation?.goBack();
    }
    setLoading(false);
  };

  const renderImagePicker = (label, imagesArray, setter) => (
    <View style={styles.section}>
      <Text style={styles.label}>{label} *</Text>
      <View style={styles.imageContainer}>
        {imagesArray.map((img, index) => (
          <View key={index} style={styles.imageWrapper}>
            <Image source={{ uri: img.uri }} style={styles.image} />
            <TouchableOpacity
              style={styles.removeBtn}
              onPress={() => removeImage(setter, index)}>
              <Text style={{ color: 'red', fontSize: 10 }}>X</Text>
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity
          style={styles.addImageBox}
          onPress={() => pickImages(setter)}>
          <Text style={{ fontSize: 28, color: COLOR.primary || '#007AFF' }}>
            +
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderToggle = (
    label,
    value,
    setValue,
    descriptionInput = false,
    descriptionVal = '',
    setDescriptionVal,
    field = '',
  ) => (
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
      {descriptionInput && value === 'no' && (
        <TextInput
          style={[styles.input, { marginTop: 10 }]}
          value={descriptionVal}
          onChangeText={setDescriptionVal}
          placeholder="Enter Name and Number of hall decorator"
        />
      )}
      {field === 'Dex' && value === 'yes' && (
        <TextInput
          style={[styles.input, { marginTop: 10 }]}
          value={royaltyDecPrice}
          onChangeText={setRoyaltiDecPrice}
          placeholder="Enter royalty decorator price"
        />
      )}
    </View>
  );
  const handleChange = (text, index, key) => {
    const updatedRows = [...rows];
    updatedRows[index][key] = text;
    setRows(updatedRows);
  };

  const addRow = () => {
    setRows([...rows, { field: '', value: '' }]);
  };
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header
        title={
          uploadType !== 'Farm House'
            ? 'Upload Convention Hall'
            : 'Upload Resort/Farm House'
        }
        showBack
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView
        contentContainerStyle={{ paddingBottom: 20 }}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets={false}
        keyboardDismissMode="on-drag">
        {/* <Text style={[styles.label, { paddingHorizontal: 20 }]}>
          Choose Upload Type *
        </Text> */}
        {/* <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 20,
            marginVertical: 10,
          }}>
          {['Function/Convention Hall', 'Farm House'].map(type => (
            <TouchableOpacity
              key={type}
              style={[
                styles.toggleBtn,
                uploadType === type && styles.selectedBtn,
                {
                  flex: 1,
                  marginRight: type === 'Function/Convention Hall' ? 10 : 0,
                },
              ]}
              onPress={() => setUploadType(type)}>
              <Text
                style={[
                  styles.toggleText,
                  uploadType === type && styles.selectedText,
                ]}>
                {type == 'Farm House' ? 'Resort/Farm House' : type}
              </Text>
            </TouchableOpacity>
          ))}
        </View> */}
        {/* Images */}
        {renderImagePicker(
          `${uploadType == 'Farm House' ? 'Farm Images' : 'Hall Images'}`,
          hallImages,
          setHallImages,
        )}
        {uploadType == 'Farm House' &&
          renderImagePicker('Room Images', roomImages, setRoomImages)}
        {uploadType !== 'Farm House' && (
          <>
            {renderImagePicker(
              'Kitchen Images',
              kitchenImages,
              setKitchenImages,
            )}
            {renderImagePicker(
              'Bride / Groom Room Images',
              BridGroomImages,
              setBridGroomImages,
            )}
            {renderImagePicker(
              'Parking Images',
              parkingImages,
              setParkingImages,
            )}
          </>
        )}

        {/* Title & Description */}
        <View style={styles.section}>
          <Text style={styles.label}>Title *</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter title"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
            value={description}
            onChangeText={setDescription}
            multiline
            placeholder="Enter description"
          />
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Contact Number *</Text>
          <TextInput
            style={[styles.input, { textAlignVertical: 'top' }]}
            value={contact}
            keyboardType='numeric'
            onChangeText={setContact}
            placeholder="Enter Contact Number"
          />
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>location *</Text>
          <GooglePlacePicker
            placeholder="Search location..."
            onPlaceSelected={place => {
              setAddress(place);
              // setLocation(place.address);
            }}
          />
        </View>

        {/* Price Options */}
        <View style={styles.section}>
          <Text style={styles.label}>Price Options</Text>
          {uploadType == 'Farm House' ? (
            <>
              {priceOptionsFarm.map(opt => (
                <View
                  key={opt}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 8,
                  }}>
                  <Text style={{ flex: 1 }}>{opt}</Text>
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="Enter Price"
                    keyboardType="numeric"
                    value={prices[opt] || ''}
                    onChangeText={val => setPrices({ ...prices, [opt]: val })}
                  />
                </View>
              ))}
              {
                <View style={{ marginTop: 10 }}>
                  {rows.map((row, index) => (
                    <View key={index} style={styles.row}>
                      <TextInput
                        style={[styles.inputVal, { flex: 1 }]}
                        placeholder="Enter Field Name"
                        value={row.field}
                        onChangeText={text =>
                          handleChange(text, index, 'field')
                        }
                      />
                      <TextInput
                        style={[styles.inputVal, { flex: 1 }]}
                        placeholder="Enter Price"
                        value={row.value}
                        keyboardType="numeric"
                        onChangeText={text =>
                          handleChange(text, index, 'value')
                        }
                      />
                      <TouchableOpacity onPress={addRow}>
                        <Image
                          source={{
                            uri: 'https://cdn-icons-png.flaticon.com/512/992/992651.png', // + icon
                          }}
                          style={styles.icon}
                        />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              }
            </>
          ) : (
            <>
              {priceOptions.map(opt => (
                <View
                  key={opt}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 8,
                  }}>
                  <Text style={{ flex: 1 }}>{opt}</Text>
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="Enter Price"
                    keyboardType="numeric"
                    value={prices[opt] || ''}
                    onChangeText={val => setPrices({ ...prices, [opt]: val })}
                  />
                </View>
              ))}
              {
                <View style={{ marginTop: 10 }}>
                  {rows.map((row, index) => (
                    <View key={index} style={styles.row}>
                      <TextInput
                        style={[styles.inputVal, { flex: 1 }]}
                        placeholder="Enter Field Name"
                        value={row.field}
                        onChangeText={text =>
                          handleChange(text, index, 'field')
                        }
                      />
                      <TextInput
                        style={[styles.inputVal, { flex: 1 }]}
                        placeholder="Enter Price"
                        value={row.value}
                        keyboardType="numeric"
                        onChangeText={text =>
                          handleChange(text, index, 'value')
                        }
                      />
                      <TouchableOpacity onPress={addRow}>
                        <Image
                          source={{
                            uri: 'https://cdn-icons-png.flaticon.com/512/992/992651.png', // + icon
                          }}
                          style={styles.icon}
                        />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              }
            </>
          )}
        </View>
        {uploadType == 'Farm House' && (
          <View style={styles.section}>
            <Text style={styles.label}>Room Available *</Text>
            <TextInput
              style={styles.input}
              value={capacity}
              keyboardType="numeric"
              onChangeText={setCapacity}
              placeholder="Enter Capacity"
            />
          </View>
        )}
        {uploadType != 'Farm House' && (
          <>
            <View style={styles.section}>
              <Text style={styles.label}>Rooms availability *</Text>
              <TextInput
                style={styles.input}
                value={capacity}
                keyboardType="numeric"
                onChangeText={setCapacity}
                placeholder="Enter Capacity"
              />
            </View>
            {renderToggle('A/C Available', acAvailable, setAcAvailable)}
            {/* Parking */}

            {/* Facilities */}
            {renderToggle(
              'Royalty for Decoration',
              royaltyDecoration,
              setRoyaltyDecoration,
              true,
              decorationContact,
              setDecorationContact,
              'Dex',
            )}
            {renderToggle(
              'Royalty for Kitchen',
              royaltyKitchen,
              setRoyaltyKitchen,
            )}
            {renderToggle('Generator Available', generator, setGenerator)}
            {renderToggle('Water for Cooking', normalWater, setNormalWater)}
            {renderToggle(
              'Drinking Water Available',
              drinkingWater,
              setDrinkingWater,
            )}
            {renderToggle('Provides Catering Persons', catering, setCatering)}
            {/* {renderToggle(
              'Photographers Required',
              PhotographersReq,
              setPhotographersReq,
            )} */}
          </>
        )}

        {uploadType == 'Farm House' && (
          <>
            {/* Existing ones */}
            {renderToggle('Swimming Pool', swimmingPool, setSwimmingPool)}

            {renderToggle('Food Available', foodAvailable, setFoodAvailable)}
            {foodAvailable && (
              <View style={styles.section}>
                <Text style={styles.label}>
                  Mention if any (Tiffins, Lunch, Snacks, Dinner)
                </Text>
                <TextInput
                  style={styles.input}
                  value={foodDescription}
                  onChangeText={setFoodDescription}
                  placeholder="Food Available"
                />
              </View>
            )}

            {/* {renderToggle('Outside Food Allowed', outsideFood, setOutsideFood)} */}

            {renderToggle('CCTV Available', cctv, setCctv)}

            {renderToggle(
              'Sound System Available',
              soundSystem,
              setSoundSystem,
            )}

            {renderToggle(
              'Sound System Allowed',
              soundSystemAllowed,
              setSoundSystemAllowed,
            )}

            {renderToggle('Adult Games', adultGames, setAdultGames)}
            {adultGames && (
              <View style={styles.section}>
                <Text style={styles.label}>Mention if any (Adult Games)</Text>
                <TextInput
                  style={styles.input}
                  value={adultGamesDesc}
                  onChangeText={setAdultGamesDesc}
                  placeholder="Adult Games"
                />
              </View>
            )}

            {renderToggle('Children Games', childrenGames, setChildrenGames)}
            {childrenGames && (
              <View style={styles.section}>
                <Text style={styles.label}>
                  Mention if any (Children Games)
                </Text>
                <TextInput
                  style={styles.input}
                  value={childrenGamesDesc}
                  onChangeText={setChildrenGamesDesc}
                  placeholder="Children Games"
                />
              </View>
            )}

            {renderToggle(
              'Kitchen Setup with all Materials',
              kitchenSetup,
              setKitchenSetup,
            )}

            {/* New ones */}
            {renderToggle(
              'Free Cancellation',
              freeCancellation,
              setFreeCancellation,
            )}

            {renderToggle('Pay Later', payLater, setPayLater)}

            {renderToggle('Adult Pool', adultPool, setAdultPool)}

            {renderToggle('Child Pool', childPool, setChildPool)}

            {renderToggle('Security Guard', securityGuard, setSecurityGuard)}

            {renderToggle('Pet Friendly', petFriendly, setPetFriendly)}

            {renderToggle(
              'Breakfast Included',
              breakfastIncluded,
              setBreakfastIncluded,
            )}

            {renderToggle('Restaurant', restaurant, setRestaurant)}

            {renderToggle('Cafeteria', cafeteria, setCafeteria)}

            {renderToggle('Elevator', elevator, setElevator)}

            {renderToggle('24 Hours Reception', reception24, setReception24)}

            {renderToggle('Gym / Fitness Available', gym, setGym)}

            {renderToggle('A/C Available', acAvailable, setAcAvailable)}

            {renderToggle('TV Available', tvAvailable, setTvAvailable)}

            {renderToggle('Meeting Room', meetingRoom, setMeetingRoom)}

            {renderToggle('Free Wifi', wifi, setWifi)}

            {renderToggle('Play Ground', playGround, setPlayGround)}

            {renderToggle('Kitchen', kitchen, setKitchen)}

            {renderToggle('Refrigerator', refrigerator, setRefrigerator)}

            {renderToggle('Spa', spa, setSpa)}

            {renderToggle('Wellness Centre', wellnessCentre, setWellnessCentre)}

            {renderToggle('Wheel Chair Access', wheelChair, setWheelChair)}

            {/* Add other if any */}
            <View style={styles.section}>
              <Text style={styles.label}>Other (if any)</Text>
              <TextInput
                style={styles.input}
                value={otherFacilities}
                onChangeText={setOtherFacilities}
                placeholder="Mention other facilities"
              />
            </View>

            {/* Area */}
            <View style={styles.section}>
              <Text style={styles.label}>Area </Text>
              <TextInput
                style={styles.input}
                value={area}
                onChangeText={setArea}
                placeholder="Enter Area"
              />
            </View>
          </>
        )}

        {renderToggle(
          'Parking Available',
          parkingAvailable,
          setParkingAvailable,
        )}

        {parkingAvailable === 'yes' && (
          <>
            <View style={{ marginHorizontal: 20 }}>
              <TextInput
                style={styles.input}
                value={cars}
                onChangeText={setCars}
                keyboardType="numeric"
                placeholder="Cars"
              />
              <TextInput
                style={styles.input}
                value={bikes}
                onChangeText={setBikes}
                keyboardType="numeric"
                placeholder="Bikes"
              />
              <TextInput
                style={styles.input}
                value={buses}
                onChangeText={setBuses}
                keyboardType="numeric"
                placeholder="Buses"
              />
            </View>
            {renderToggle('Valet Parking Available', valet, setValet)}
          </>
        )}
        {uploadType != 'Farm House' && (
          <>
            {renderToggle('Parking Guard', parkingGuard, setParkingGuard)}

            {renderToggle('Alcohol Allowed', alcoholAllowed, setAlcoholAllowed)}
          </>
        )}
        <View style={styles.section}>
          <Text style={styles.label}>
            Unavailable : Day-time Night-time Full-day
          </Text>
          <Calendar
            onDayPress={toggleDate}
            markedDates={unavailableDates}
            markingType={'multi-dot'}
          />
          <Text style={styles.note}>
            Note: Please select only those dates on which your hall is NOT
            available for booking. All other dates will be considered available.
          </Text>
        </View>

        <View style={styles.section}>
          {Object.keys(unavailableDates).map(date => (
            <View key={date} style={styles.deltaRow}>
              <Text style={styles.dateText}>{date}</Text>
              {renderTimeOptions(date)}
            </View>
          ))}
        </View>
        <CustomButton
          title={
            uploadType !== 'Farm House' ? 'Post Convention Hall' : 'Post Farm'
          }
          loading={loading}
          onPress={postSpace}
        />
      </ScrollView>
    </View>
  );
};

export default CreateConvention;

const styles = StyleSheet.create({
  section: { marginVertical: 10, paddingHorizontal: 20 },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#333' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#fafafa',
    marginTop: 10,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  imageWrapper: { position: 'relative', marginRight: 10, marginBottom: 10 },
  image: { width: 90, height: 90, borderRadius: 8 },
  removeBtn: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 3,
    paddingHorizontal: 7,
  },
  addImageBox: {
    width: 90,
    height: 90,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    marginBottom: 10,
  },
  toggleRow: { flexDirection: 'row', marginTop: 10 },
  toggleBtn: {
    // flex: 0.5,
    paddingVertical: 5,
    paddingHorizontal: 13,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 10,
    justifyContent: 'center',
  },
  selectedBtn: {
    backgroundColor: COLOR.primary || '#007AFF',
    borderColor: COLOR.primary || '#007AFF',
  },
  toggleText: { fontSize: 14, color: '#333' },
  selectedText: { color: '#fff', fontWeight: '600' },
  dateBox: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 10,
    backgroundColor: '#f9f9f9',
    marginBottom: 13,
  },
  dateText: { fontSize: 14, color: '#333' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  deltaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    justifyContent: 'space-between',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 8,
    height: 40,
  },
  dateText: { fontSize: 16, width: 110 },
  inputVal: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 6,
    marginRight: 6,
    paddingVertical: 10,
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: 'green',
  },
  optionButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLOR.black,
    marginRight: 8,
  },
  optionButtonSelected: {
    backgroundColor: COLOR?.primary,
    borderColor: COLOR?.primary,
  },
  optionTextSelected: { color: 'white' },
  optionRow: { flexDirection: 'row', gap: 8 },
});
