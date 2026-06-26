import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Header from '../../../Components/FeedHeader';
import { COLOR } from '../../../Constants/Colors';
import ImagePicker from 'react-native-image-crop-picker';
import CustomButton from '../../../Components/CustomButton';
import { Calendar } from 'react-native-calendars';
import { useToast } from '../../../Constants/ToastContext';
import { useApi } from '../../../Backend/Api';
import GooglePlacePicker from '../../../Components/GooglePicker';
import moment from 'moment';

const CreateConvention = ({ navigation, route }) => {
  const activeTab = route?.params?.activeTabKey || 'Function/Convention Hall';
  const editItem = route?.params?.item;
  const isEdit = !!editItem;

  const { postRequest } = useApi();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(false);

  const [uploadType, setUploadType] = useState(
    activeTab === 'farmhouse' || activeTab === 'farm'
      ? 'Farm House'
      : activeTab === 'resort'
      ? 'resort'
      : 'Function/Convention Hall',
  );

  const isFarm = uploadType === 'Farm House';
  const isResort = uploadType === 'resort';
  const isHall = uploadType === 'Function/Convention Hall';
  const isStayType = isFarm || isResort;

  const [hallImages, setHallImages] = useState([]);
  const [kitchenImages, setKitchenImages] = useState([]);
  const [parkingImages, setParkingImages] = useState([]);
  const [BridGroomImages, setBridGroomImages] = useState([]);
  const [roomImages, setRoomImages] = useState([]);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contact, setContact] = useState('');

  const [prices, setPrices] = useState({});
  const [capacity, setCapacity] = useState('');

  const [parkingAvailable, setParkingAvailable] = useState('no');
  const [cars, setCars] = useState('');
  const [bikes, setBikes] = useState('');
  const [buses, setBuses] = useState('');
  const [valet, setValet] = useState('yes');
  const [parkingCapacity, setParkingCapacity] = useState('');
  const [parkingType, setParkingType] = useState('');
  const [parkingCharges, setParkingCharges] = useState('');

  const [royaltyDecoration, setRoyaltyDecoration] = useState('no');
  const [decorationContact, setDecorationContact] = useState('');
  const [royaltyKitchen, setRoyaltyKitchen] = useState('yes');
  const [generator, setGenerator] = useState('yes');
  const [normalWater, setNormalWater] = useState('yes');
  const [drinkingWater, setDrinkingWater] = useState('yes');
  const [catering, setCatering] = useState('yes');
  const [acAvailable, setAcAvailable] = useState('yes');

  const [swimmingPool, setSwimmingPool] = useState('no');
  const [foodAvailable, setFoodAvailable] = useState('no');
  const [foodDescription, setFoodDescription] = useState('');
  const [cctv, setCctv] = useState('no');
  const [soundSystem, setSoundSystem] = useState('no');
  const [soundSystemAllowed, setSoundSystemAllowed] = useState('no');
  const [childrenGames, setChildrenGames] = useState('no');
  const [childrenGamesDesc, setChildrenGamesDesc] = useState('');
  const [adultGames, setAdultGames] = useState('no');
  const [adultGamesDesc, setAdultGamesDesc] = useState('');
  const [kitchenSetup, setKitchenSetup] = useState('no');
  const [area, setArea] = useState('');
  const [plotArea, setPlotArea] = useState('');
  const [builtUpArea, setBuiltUpArea] = useState('');
  const [carpetArea, setCarpetArea] = useState('');

  const [unavailableDates, setUnavailableDates] = useState({});
  const [timeBlocks, setTimeBlocks] = useState({});
  const [rows, setRows] = useState([{ field: 'Any Other', value: '' }]);
  const [address, setAddress] = useState({});

  const [parkingGuard, setParkingGuard] = useState('no');
  const [alcoholAllowed, setAlcoholAllowed] = useState('no');

  const [freeCancellation, setFreeCancellation] = useState('no');
  const [payLater, setPayLater] = useState('no');
  const [adultPool, setAdultPool] = useState('no');
  const [childPool, setChildPool] = useState('no');
  const [securityGuard, setSecurityGuard] = useState('no');
  const [petFriendly, setPetFriendly] = useState('no');
  const [breakfastIncluded, setBreakfastIncluded] = useState('no');
  const [restaurant, setRestaurant] = useState('no');
  const [cafeteria, setCafeteria] = useState('no');
  const [elevator, setElevator] = useState('no');
  const [reception24, setReception24] = useState('no');
  const [gym, setGym] = useState('no');
  const [tvAvailable, setTvAvailable] = useState('no');
  const [meetingRoom, setMeetingRoom] = useState('no');
  const [wifi, setWifi] = useState('no');
  const [playGround, setPlayGround] = useState('no');
  const [kitchen, setKitchen] = useState('no');
  const [refrigerator, setRefrigerator] = useState('no');
  const [spa, setSpa] = useState('no');
  const [wellnessCentre, setWellnessCentre] = useState('no');
  const [wheelChair, setWheelChair] = useState('no');
  const [otherFacilities, setOtherFacilities] = useState('');
  const [royaltyDecPrice, setRoyaltiDecPrice] = useState('');

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

  const yesNo = value =>
    value === true || value === 1 || value === '1' || value === 'yes'
      ? 'yes'
      : 'no';

  const normalizeKey = str =>
    str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_|_$/g, '');

  const mapGroupedImages = type => {
    const arr = editItem?.images_grouped?.[type] || [];
    return arr.map(img => ({
      uri: img?.image_url,
      id: img?.id,
      isOld: true,
    }));
  };

  useEffect(() => {
    if (!editItem) return;

    if (editItem?.hall_type === 'farm' || editItem?.type === 'farm') {
      setUploadType('Farm House');
    } else if (editItem?.hall_type === 'resort' || editItem?.type === 'resort') {
      setUploadType('resort');
    } else {
      setUploadType('Function/Convention Hall');
    }

    setTitle(editItem?.title || '');
    setDescription(editItem?.description || '');
    setContact(editItem?.contact_number ? String(editItem.contact_number) : '');
    setCapacity(String(editItem?.seating_capacity || editItem?.room_details || ''));

    setAddress({
      address: editItem?.address || '',
      lat: editItem?.lat,
      lng: editItem?.long,
    });

    setHallImages(
      mapGroupedImages('hall')?.length
        ? mapGroupedImages('hall')
        : mapGroupedImages('main'),
    );
    setKitchenImages(mapGroupedImages('kitchen'));
    setParkingImages(mapGroupedImages('parking'));
    setBridGroomImages(mapGroupedImages('bride'));
    setRoomImages(mapGroupedImages('room'));

    setAcAvailable(
      editItem?.ac_available === undefined || editItem?.ac_available === null
        ? 'yes'
        : yesNo(editItem.ac_available),
    );
    setRoyaltyDecoration(yesNo(editItem?.royalty_decoration));
    setDecorationContact(
      editItem?.hall_decorator_name || editItem?.hall_decorator_number || '',
    );
    setRoyaltyKitchen(yesNo(editItem?.royalty_kitchen));
    setGenerator(yesNo(editItem?.generator_available));
    setNormalWater(yesNo(editItem?.water_for_cooking));
    setDrinkingWater(yesNo(editItem?.drinking_water_available));
    setCatering(yesNo(editItem?.provides_catering_persons));

    setParkingAvailable(yesNo(editItem?.parking_available));
    setCars(editItem?.cars ? String(editItem.cars) : '');
    setBikes(editItem?.bikes ? String(editItem.bikes) : '');
    setBuses(editItem?.buses ? String(editItem.buses) : '');
    setValet(yesNo(editItem?.valet_parking));
    setParkingCapacity(
      editItem?.parking_capacity ? String(editItem.parking_capacity) : '',
    );
    setParkingType(editItem?.parking_type || '');
    setParkingCharges(editItem?.parking_charges || '');
    setParkingGuard(yesNo(editItem?.parking_guard));
    setAlcoholAllowed(yesNo(editItem?.alcohol_allowed));

    setSwimmingPool(yesNo(editItem?.swimming_pool));
    setFoodAvailable(yesNo(editItem?.food_available));
    setCctv(yesNo(editItem?.cctv_available));
    setSoundSystem(yesNo(editItem?.sound_system_available));
    setSoundSystemAllowed(yesNo(editItem?.sound_system_allowed));
    setChildrenGames(yesNo(editItem?.children_games));
    setAdultGames(yesNo(editItem?.adult_games));
    setKitchenSetup(yesNo(editItem?.kitchen_setup));
    setFreeCancellation(yesNo(editItem?.free_cancellation));
    setPayLater(yesNo(editItem?.pay_later));
    setAdultPool(yesNo(editItem?.adult_pool));
    setChildPool(yesNo(editItem?.child_pool));
    setSecurityGuard(yesNo(editItem?.security_guard));
    setPetFriendly(yesNo(editItem?.pet_friendly));
    setBreakfastIncluded(yesNo(editItem?.breakfast_included));
    setRestaurant(yesNo(editItem?.restaurant));
    setCafeteria(yesNo(editItem?.cafeteria));
    setElevator(yesNo(editItem?.elevator));
    setReception24(yesNo(editItem?.reception_24_hours));
    setGym(yesNo(editItem?.gym_available));
    setTvAvailable(yesNo(editItem?.tv_available));
    setMeetingRoom(yesNo(editItem?.meeting_room));
    setWifi(yesNo(editItem?.free_wifi));
    setPlayGround(yesNo(editItem?.play_ground));
    setKitchen(yesNo(editItem?.kitchen));
    setRefrigerator(yesNo(editItem?.refrigerator));
    setSpa(yesNo(editItem?.spa));
    setWellnessCentre(yesNo(editItem?.wellness_centre));
    setWheelChair(yesNo(editItem?.wheel_chair_access));

    setArea(editItem?.area_sq_ft ? String(editItem.area_sq_ft) : '');
    setPlotArea(editItem?.plot_area ? String(editItem.plot_area) : '');
    setBuiltUpArea(editItem?.built_up_area ? String(editItem.built_up_area) : '');
    setCarpetArea(editItem?.carpet_area ? String(editItem.carpet_area) : '');
    setOtherFacilities(editItem?.other || '');

    const priceMap = {};
    priceOptions.forEach(opt => {
      const key = `${normalizeKey(opt)}_price`;
      if (editItem?.[key] !== null && editItem?.[key] !== undefined) {
        priceMap[opt] = String(editItem[key]);
      }
    });

    priceOptionsFarm.forEach(opt => {
      const key = normalizeKey(opt);
      if (editItem?.[key] !== null && editItem?.[key] !== undefined) {
        priceMap[opt] = String(editItem[key]);
      }
    });

    setPrices(priceMap);

    if (editItem?.dates) {
      const markedDates = {};
      const blocks = {};

      Object.entries(editItem.dates).forEach(([date, value]) => {
        const formattedDate = moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD');

        markedDates[formattedDate] = {
          selected: true,
          selectedColor: 'red',
        };

        blocks[formattedDate] = Array.isArray(value)
          ? value
          : String(value)
              .split(',')
              .map(v => v.trim());
      });

      setUnavailableDates(markedDates);
      setTimeBlocks(blocks);
    }
  }, [editItem]);

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
              <Text
                style={[
                  selected && styles.optionTextSelected,
                  { color: selected ? 'white' : 'black' },
                ]}>
                {opt}
              </Text>
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

  const appendImages = (formData, key, images, prefix) => {
    images
      .filter(img => !img.isOld)
      .forEach((img, index) => {
        formData.append(`${key}[${index}]`, {
          uri: img.uri,
          type: img.type || 'image/jpeg',
          name: img.name || `${prefix}_${index}.jpg`,
        });
      });
  };

  const postSpace = async () => {
    try {
      setLoading(true);

      const formData = new FormData();

      formData.append('title', title);
      formData.append('description', description);
      if(capacity){
        formData.append('seating_capacity', capacity?capacity:0);
      }
      formData.append('address', address?.address || '');
      formData.append('lat', address?.lat || '');
      formData.append('long', address?.lng || '');

      if (contact) {
        formData.append('contact_number', contact);
      }

      const hallType = isFarm ? 'farm' : isResort ? 'resort' : 'hall';
      formData.append('hall_type', hallType);

      formData.append('parking_available', parkingAvailable === 'yes' ? 1 : 0);
      if (parkingAvailable === 'yes') {
        formData.append('cars', cars || '0');
        formData.append('bikes', bikes || '0');
        formData.append('buses', buses || '0');
        formData.append('valet_parking', valet === 'yes' ? 1 : 0);
        formData.append('parking_capacity', parkingCapacity || '');
        formData.append('parking_type', parkingType || '');
        formData.append('parking_guard', parkingGuard === 'yes' ? 1 : 0);
        formData.append('parking_charges', parkingCharges || '');
      }

      if (isHall) {
        formData.append('ac_available', acAvailable === 'yes' ? 1 : 0);
        formData.append(
          'royalty_decoration',
          royaltyDecoration === 'yes' ? 1 : 0,
        );
        formData.append('hall_decorator_name', decorationContact);
        formData.append('hall_decorator_number', decorationContact);
        formData.append('royalty_kitchen', royaltyKitchen === 'yes' ? 1 : 0);
        formData.append('generator_available', generator === 'yes' ? 1 : 0);
        formData.append('water_for_cooking', normalWater === 'yes' ? 1 : 0);
        formData.append(
          'drinking_water_available',
          drinkingWater === 'yes' ? 1 : 0,
        );
        formData.append(
          'provides_catering_persons',
          catering === 'yes' ? 1 : 0,
        );
        formData.append('alcohol_allowed', alcoholAllowed === 'yes' ? 1 : 0);
      }

      if (isStayType) {
        formData.append('swimming_pool', swimmingPool === 'yes' ? 1 : 0);
        formData.append('food_available', foodAvailable === 'yes' ? 1 : 0);
        formData.append('food_description', foodDescription || '');
        formData.append('cctv_available', cctv === 'yes' ? 1 : 0);
        formData.append(
          'sound_system_available',
          soundSystem === 'yes' ? 1 : 0,
        );
        formData.append(
          'sound_system_allowed',
          soundSystemAllowed === 'yes' ? 1 : 0,
        );
        formData.append('adult_games', adultGames === 'yes' ? 1 : 0);
        formData.append('adult_games_desc', adultGamesDesc || '');
        if (adultGamesDesc) {
          formData.append('adult_games_names[0]', adultGamesDesc);
        }
        formData.append('children_games', childrenGames === 'yes' ? 1 : 0);
        formData.append('children_games_desc', childrenGamesDesc || '');
        if (childrenGamesDesc) {
          formData.append('children_games_names[0]', childrenGamesDesc);
        }
        formData.append('kitchen_setup', kitchenSetup === 'yes' ? 1 : 0);
        formData.append('free_cancellation', freeCancellation === 'yes' ? 1 : 0);
        formData.append('pay_later', payLater === 'yes' ? 1 : 0);
        formData.append('adult_pool', adultPool === 'yes' ? 1 : 0);
        formData.append('child_pool', childPool === 'yes' ? 1 : 0);
        formData.append('security_guard', securityGuard === 'yes' ? 1 : 0);
        formData.append('pet_friendly', petFriendly === 'yes' ? 1 : 0);
        formData.append(
          'breakfast_included',
          breakfastIncluded === 'yes' ? 1 : 0,
        );
        formData.append('restaurant', restaurant === 'yes' ? 1 : 0);
        formData.append('cafeteria', cafeteria === 'yes' ? 1 : 0);
        formData.append('elevator', elevator === 'yes' ? 1 : 0);
        formData.append('reception_24_hours', reception24 === 'yes' ? 1 : 0);
        formData.append('gym_available', gym === 'yes' ? 1 : 0);
        formData.append('ac_available', acAvailable === 'yes' ? 1 : 0);
        formData.append('tv_available', tvAvailable === 'yes' ? 1 : 0);
        formData.append('meeting_room', meetingRoom === 'yes' ? 1 : 0);
        formData.append('free_wifi', wifi === 'yes' ? 1 : 0);
        formData.append('play_ground', playGround === 'yes' ? 1 : 0);
        formData.append('kitchen', kitchen === 'yes' ? 1 : 0);
        formData.append('refrigerator', refrigerator === 'yes' ? 1 : 0);
        formData.append('spa', spa === 'yes' ? 1 : 0);
        formData.append('wellness_centre', wellnessCentre === 'yes' ? 1 : 0);
        formData.append('wheel_chair_access', wheelChair === 'yes' ? 1 : 0);
        formData.append('area_sq_ft', area || '');
        formData.append('plot_area', plotArea || '');
        formData.append('built_up_area', builtUpArea || '');
        formData.append('carpet_area', carpetArea || '');
        formData.append('other', otherFacilities || '');
      }

      const selectedOptions = isStayType ? priceOptionsFarm : priceOptions;

      if (isStayType) {
        selectedOptions.forEach(opt => {
          if (prices[opt]) {
            formData.append(normalizeKey(opt), prices[opt]);
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

      appendImages(
        formData,
        isStayType ? 'main_images' : 'hall_images',
        hallImages,
        'main_image',
      );

      if (isHall) {
        appendImages(formData, 'kitchen_images', kitchenImages, 'kitchen_image');
        appendImages(formData, 'bride_image', BridGroomImages, 'bride_image');
        appendImages(formData, 'praking_image', parkingImages, 'parking_image');
      }

      if (isStayType) {
        appendImages(formData, 'room_images', roomImages, 'room_image');
      }
        if (isStayType) {
        appendImages(formData, 'farm_images', hallImages, 'farm_images');
      }
      

      Object.entries(timeBlocks).forEach(([date, value]) => {
        formData.append(
          `dates[${moment(date).format('DD/MM/YYYY')}]`,
          Array.isArray(value) ? value.join(',') : value,
        );
      });

      const url = isFarm ? 'farm' : isResort ? 'resort' : 'hall';

      const apiUrl = isEdit
        ? `public/api/hall-update/${editItem?.id}`
        : `public/api/hall_add/${url}`;

      const response = await postRequest(apiUrl, formData, true);

      if (response?.data?.success === true) {
        showToast(response?.data?.message, 'success');
        navigation?.goBack();
      } else {
        showToast(response?.data?.message || 'Something went wrong', 'error');
      }
    } catch (error) {
      console.log('POST_SPACE_ERROR', error);
      showToast('Something went wrong', 'error');
    } finally {
      setLoading(false);
    }
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
          placeholderTextColor={COLOR.grey}
        />
      )}

      {field === 'Dex' && value === 'yes' && (
        <TextInput
          style={[styles.input, { marginTop: 10 }]}
          value={royaltyDecPrice}
          onChangeText={setRoyaltiDecPrice}
          placeholder="Enter royalty decorator price"
          placeholderTextColor={COLOR.grey}
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

  const screenTitle = isEdit
    ? isFarm
      ? 'Update Farm House'
      : isResort
      ? 'Update Resort'
      : 'Update Convention Hall'
    : isFarm
    ? 'Upload Farm House'
    : isResort
    ? 'Upload Resort'
    : 'Upload Convention Hall';

  const buttonTitle = isEdit
    ? isFarm
      ? 'Update Farm'
      : isResort
      ? 'Update Resort'
      : 'Update Convention Hall'
    : isFarm
    ? 'Post Farm'
    : isResort
    ? 'Post Resort'
    : 'Post Convention Hall';

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header
        title={screenTitle}
        showBack
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 20 }}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets={false}
        keyboardDismissMode="on-drag">
        {renderImagePicker(
          isFarm ? 'Farm Images' : isResort ? 'Resort Images' : 'Hall Images',
          hallImages,
          setHallImages,
        )}

        {isStayType && renderImagePicker('Room Images', roomImages, setRoomImages)}

        {isHall && (
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

        <View style={styles.section}>
          <Text style={styles.label}>Title *</Text>
          <TextInput
            style={styles.input}
            placeholderTextColor={COLOR.grey}
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
            placeholderTextColor={COLOR.grey}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Contact Number *</Text>
          <TextInput
            style={styles.input}
            value={contact}
            keyboardType="numeric"
            onChangeText={setContact}
            placeholder="Enter Contact Number"
            placeholderTextColor={COLOR.grey}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Location *</Text>
          <GooglePlacePicker
            placeholder="Search location..."
            onPlaceSelected={place => setAddress(place)}
          />
          {!!address?.address && (
            <Text style={{ marginTop: 8, color: COLOR.black }}>
              {address.address}
            </Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Price Options</Text>

          {isStayType ? (
            <>
              {priceOptionsFarm.map(opt => (
                <View key={opt} style={styles.priceRow}>
                  <Text style={{ flex: 1, color: COLOR.black }}>{opt}</Text>
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="Enter Price"
                    keyboardType="numeric"
                    placeholderTextColor={COLOR.grey}
                    value={prices[opt] || ''}
                    onChangeText={val => setPrices({ ...prices, [opt]: val })}
                  />
                </View>
              ))}
            </>
          ) : (
            <>
              {priceOptions.map(opt => (
                <View key={opt} style={styles.priceRow}>
                  <Text style={{ flex: 1, color: COLOR.black }}>{opt}</Text>
                  <TextInput
                    placeholderTextColor={COLOR.grey}
                    style={[styles.input, { flex: 1 }]}
                    placeholder="Enter Price"
                    keyboardType="numeric"
                    value={prices[opt] || ''}
                    onChangeText={val => setPrices({ ...prices, [opt]: val })}
                  />
                </View>
              ))}
            </>
          )}

          <View style={{ marginTop: 10 }}>
            {rows.map((row, index) => (
              <View key={index} style={styles.row}>
                <TextInput
                  placeholderTextColor={COLOR.grey}
                  style={[styles.inputVal, { flex: 1 }]}
                  placeholder="Enter Field Name"
                  value={row.field}
                  onChangeText={text => handleChange(text, index, 'field')}
                />
                <TextInput
                  placeholderTextColor={COLOR.grey}
                  style={[styles.inputVal, { flex: 1 }]}
                  placeholder="Enter Price"
                  value={row.value}
                  keyboardType="numeric"
                  onChangeText={text => handleChange(text, index, 'value')}
                />
                <TouchableOpacity onPress={addRow}>
                  <Image
                    source={{
                      uri: 'https://cdn-icons-png.flaticon.com/512/992/992651.png',
                    }}
                    style={styles.icon}
                  />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {isStayType && (
          <View style={styles.section}>
            <Text style={styles.label}>Room Available *</Text>
            <TextInput
              placeholderTextColor={COLOR.grey}
              style={styles.input}
              value={capacity}
              keyboardType="numeric"
              onChangeText={setCapacity}
              placeholder="Room Availability"
            />
          </View>
        )}

        {isHall && (
          <>
            <View style={styles.section}>
              <Text style={styles.label}>Hall Capacity (No. of People) *</Text>
              <TextInput
                placeholderTextColor={COLOR.grey}
                style={styles.input}
                value={capacity}
                keyboardType="numeric"
                onChangeText={setCapacity}
                placeholder="Enter Capacity"
              />
            </View>

            {renderToggle('A/C Available', acAvailable, setAcAvailable)}
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
          </>
        )}

        {isStayType && (
          <>
            {renderToggle('Swimming Pool', swimmingPool, setSwimmingPool)}
            {renderToggle('Food Available', foodAvailable, setFoodAvailable)}

            {foodAvailable === 'yes' && (
              <View style={styles.section}>
                <Text style={styles.label}>
                  Mention if any (Tiffins, Lunch, Snacks, Dinner)
                </Text>
                <TextInput
                  style={styles.input}
                  value={foodDescription}
                  onChangeText={setFoodDescription}
                  placeholder="Food Available"
                  placeholderTextColor={COLOR.grey}
                />
              </View>
            )}

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

            {adultGames === 'yes' && (
              <View style={styles.section}>
                <Text style={styles.label}>Mention if any (Adult Games)</Text>
                <TextInput
                  style={styles.input}
                  value={adultGamesDesc}
                  onChangeText={setAdultGamesDesc}
                  placeholder="Adult Games"
                  placeholderTextColor={COLOR.grey}
                />
              </View>
            )}

            {renderToggle('Children Games', childrenGames, setChildrenGames)}

            {childrenGames === 'yes' && (
              <View style={styles.section}>
                <Text style={styles.label}>Mention if any (Children Games)</Text>
                <TextInput
                  style={styles.input}
                  value={childrenGamesDesc}
                  onChangeText={setChildrenGamesDesc}
                  placeholder="Children Games"
                  placeholderTextColor={COLOR.grey}
                />
              </View>
            )}

            {renderToggle(
              'Kitchen Setup with all Materials',
              kitchenSetup,
              setKitchenSetup,
            )}

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

            <View style={styles.section}>
              <Text style={styles.label}>Other (if any)</Text>
              <TextInput
                placeholderTextColor={COLOR.grey}
                style={styles.input}
                value={otherFacilities}
                onChangeText={setOtherFacilities}
                placeholder="Mention other facilities"
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Area</Text>
              <TextInput
                placeholderTextColor={COLOR.grey}
                style={styles.input}
                value={area}
                onChangeText={setArea}
                placeholder="Enter Area"
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Plot Area</Text>
              <TextInput
                placeholderTextColor={COLOR.grey}
                style={styles.input}
                value={plotArea}
                onChangeText={setPlotArea}
                placeholder="Enter Plot Area"
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Built Up Area</Text>
              <TextInput
                placeholderTextColor={COLOR.grey}
                style={styles.input}
                value={builtUpArea}
                onChangeText={setBuiltUpArea}
                placeholder="Enter Built Up Area"
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Carpet Area</Text>
              <TextInput
                placeholderTextColor={COLOR.grey}
                style={styles.input}
                value={carpetArea}
                onChangeText={setCarpetArea}
                placeholder="Enter Carpet Area"
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
                placeholderTextColor={COLOR.grey}
              />
              <TextInput
                style={styles.input}
                value={bikes}
                onChangeText={setBikes}
                keyboardType="numeric"
                placeholder="Bikes"
                placeholderTextColor={COLOR.grey}
              />
              <TextInput
                style={styles.input}
                value={buses}
                onChangeText={setBuses}
                keyboardType="numeric"
                placeholder="Buses"
                placeholderTextColor={COLOR.grey}
              />
              <TextInput
                style={styles.input}
                value={parkingCapacity}
                onChangeText={setParkingCapacity}
                keyboardType="numeric"
                placeholder="Parking Capacity"
                placeholderTextColor={COLOR.grey}
              />
              <TextInput
                style={styles.input}
                value={parkingType}
                onChangeText={setParkingType}
                placeholder="Parking Type"
                placeholderTextColor={COLOR.grey}
              />
              <TextInput
                style={styles.input}
                value={parkingCharges}
                onChangeText={setParkingCharges}
                placeholder="Parking Charges"
                placeholderTextColor={COLOR.grey}
              />
            </View>
            {renderToggle('Valet Parking Available', valet, setValet)}
            {renderToggle('Parking Guard', parkingGuard, setParkingGuard)}
          </>
        )}

        {isHall && (
          <>
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
            markingType="multi-dot"
          />
          <Text style={[styles.note, { color: 'black' }]}>
            Note: Please select only those dates on which your place is NOT
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
          title={buttonTitle}
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  priceRow: {
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
    color: 'black',
  },
  dateText: { fontSize: 16, width: 110, color: 'black' },
  inputVal: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 6,
    marginRight: 6,
    paddingVertical: 10,
    color: COLOR.black,
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
  note: {
    marginTop: 8,
    fontSize: 13,
  },
});
