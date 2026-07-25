import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '../../../Components/FeedHeader';
import {COLOR} from '../../../Constants/Colors';
import ImagePicker from 'react-native-image-crop-picker';
import CustomButton from '../../../Components/CustomButton';
import {Calendar} from 'react-native-calendars';
import {useToast} from '../../../Constants/ToastContext';
import {useApi} from '../../../Backend/Api';
import GooglePlacePicker from '../../../Components/GooglePicker';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';

const createEmptyPackage = () => ({
  name: '',
  images: [],
  price: '',
  gst: '',
  maxPeople: '',
  description: '',
  services: [],
  customServices: [''],
});

const normalizeDescription = value => {
  if (Array.isArray(value)) {
    return value.filter(Boolean).join(', ');
  }

  if (typeof value === 'string') {
    try {
      const parsedValue = JSON.parse(value);
      return Array.isArray(parsedValue)
        ? parsedValue.filter(Boolean).join(', ')
        : value;
    } catch (error) {
      return value;
    }
  }

  return value ? String(value) : '';
};

const CreateConvention = ({navigation, route}) => {
  const activeTab = route?.params?.activeTabKey || 'Function/Convention Hall';
  const editItem = route?.params?.item;
  const isEdit = !!editItem;

  const {postRequest} = useApi();
  const {showToast} = useToast();

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
  const nonContactNumericInputProps = {
    autoComplete: 'off',
    importantForAutofill: 'no',
    textContentType: 'none',
  };

  const [hallImages, setHallImages] = useState([]);
  const [kitchenImages, setKitchenImages] = useState([]);
  const [parkingImages, setParkingImages] = useState([]);
  const [BridGroomImages, setBridGroomImages] = useState([]);
  const [roomImages, setRoomImages] = useState([]);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contact, setContact] = useState('');
  const [managerContact, setManagerContact] = useState('');

  const [prices, setPrices] = useState({});
  const [capacity, setCapacity] = useState('');

  const [parkingAvailable, setParkingAvailable] = useState('no');
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
  const [rows, setRows] = useState([{field: 'Any Other', value: ''}]);
  const [address, setAddress] = useState({});

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
  const [customAmenities, setCustomAmenities] = useState(['']);
  const [packages, setPackages] = useState([createEmptyPackage()]);
  const defaultAddOns = [
    'Horse Ride',
    'Personal Swimming Pool',
    'Tiffin',
    'Lunch',
    'Snacks',
    'Dinner',
    'Rain Dance',
    'Indoor Games',
    'Outdoor Games',
    'Music / DJ Arrangements',
    'Mini BAR Arrangements',
  ];
  const [addOns, setAddOns] = useState(
    defaultAddOns.map(name => ({name, price: ''})),
  );
  const [idProofsRequired, setIdProofsRequired] = useState('');
  const [rulesAndRegulations, setRulesAndRegulations] = useState('');
  const [checkInTime, setCheckInTime] = useState('');
  const [checkOutTime, setCheckOutTime] = useState('');
  const [showCheckInPicker, setShowCheckInPicker] = useState(false);
  const [showCheckOutPicker, setShowCheckOutPicker] = useState(false);

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
    } else if (
      editItem?.hall_type === 'resort' ||
      editItem?.type === 'resort'
    ) {
      setUploadType('resort');
    } else {
      setUploadType('Function/Convention Hall');
    }

    setTitle(editItem?.title || '');
    setDescription(editItem?.description || '');
    setContact(editItem?.contact_number ? String(editItem.contact_number) : '');
    setManagerContact(
      editItem?.manager_contact_number
        ? String(editItem.manager_contact_number)
        : editItem?.owner_contact_number
        ? String(editItem.owner_contact_number)
        : '',
    );
    setCapacity(
      String(editItem?.seating_capacity || editItem?.room_details || ''),
    );

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

    setParkingAvailable(
      yesNo(editItem?.parking ?? editItem?.parking_available),
    );
    setValet(yesNo(editItem?.valet_parking));
    setParkingCapacity(
      editItem?.parking_capacity ? String(editItem.parking_capacity) : '',
    );
    setParkingType(editItem?.parking_type || '');
    setParkingCharges(editItem?.parking_charges || '');
    setAlcoholAllowed(yesNo(editItem?.alcohol_allowed));

    setSwimmingPool(yesNo(editItem?.swimming_pool));
    setFoodAvailable(yesNo(editItem?.food_available));
    setFoodDescription(normalizeDescription(editItem?.food_description));
    setCctv(yesNo(editItem?.cctv_available));
    setSoundSystem(yesNo(editItem?.sound_system_available));
    setSoundSystemAllowed(yesNo(editItem?.sound_system_allowed));
    setChildrenGames(yesNo(editItem?.children_games));
    setAdultGames(yesNo(editItem?.adult_games));
    setAdultGamesDesc(
      normalizeDescription(
        editItem?.adult_games_desc || editItem?.adult_games_names,
      ),
    );
    setChildrenGamesDesc(
      normalizeDescription(
        editItem?.children_games_desc || editItem?.children_games_names,
      ),
    );
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
    setBuiltUpArea(
      editItem?.built_up_area ? String(editItem.built_up_area) : '',
    );
    setCarpetArea(editItem?.carpet_area ? String(editItem.carpet_area) : '');
    setOtherFacilities(editItem?.other || '');
    setIdProofsRequired(editItem?.id_proofs_required || '');
    setRulesAndRegulations(editItem?.rules_and_regulations || '');
    setCheckInTime(editItem?.check_in_time || '');
    setCheckOutTime(editItem?.check_out_time || '');

    const savedAmenities = editItem?.other_amenities;
    if (Array.isArray(savedAmenities) && savedAmenities.length) {
      setCustomAmenities(savedAmenities.map(item => item?.name || item));
    }

    if (Array.isArray(editItem?.packages) && editItem.packages.length) {
      setPackages(
        editItem.packages.map(item => ({
          name: item?.name || item?.package_name || '',
          images: Array.isArray(item?.images)
            ? item.images.map(image => ({
                uri: image?.image_url || image?.uri || image,
                id: image?.id,
                isOld: true,
              }))
            : [],
          price: String(item?.price || ''),
          gst: String(item?.gst || ''),
          maxPeople: String(item?.max_people || ''),
          description: item?.description || '',
          services: item?.services || [],
          customServices: item?.custom_services?.length
            ? item.custom_services
            : [''],
        })),
      );
    }

    if (Array.isArray(editItem?.add_on_services)) {
      const saved = editItem.add_on_services.map(item => ({
        name: item?.name || '',
        price: String(item?.price || ''),
      }));
      const savedNames = saved.map(item => item.name);
      setAddOns([
        ...defaultAddOns.map(name =>
          savedNames.includes(name)
            ? saved.find(item => item.name === name)
            : {name, price: ''},
        ),
        ...saved.filter(item => !defaultAddOns.includes(item.name)),
      ]);
    }

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
    // The edit form is intentionally hydrated only when the edited record changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editItem]);

  const toggleDate = day => {
    const date = day.dateString;
    setUnavailableDates(prev => {
      const newDates = {...prev};
      if (newDates[date]) {
        delete newDates[date];
        const updatedTimes = {...timeBlocks};
        delete updatedTimes[date];
        setTimeBlocks(updatedTimes);
      } else {
        newDates[date] = {selected: true, selectedColor: 'red'};
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
                  {color: selected ? 'white' : 'black'},
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
        setter(prev => [...prev, ...res.map(img => ({uri: img.path}))]),
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
      if (capacity) {
        formData.append('seating_capacity', capacity ? capacity : 0);
      }
      formData.append('address', address?.address || '');
      formData.append('lat', address?.lat || '');
      formData.append('long', address?.lng || '');

      if (contact) {
        formData.append('contact_number', contact);
      }

      if (isResort) {
        formData.append('reception_contact_number', contact);
        formData.append('manager_contact_number', managerContact);
        formData.append('owner_contact_number', managerContact);
      }

      const hallType = isFarm ? 'farm' : isResort ? 'resort' : 'hall';
      formData.append('hall_type', hallType);
      // The create/update API uses `type` to persist Farm-specific fields.
      formData.append('type', hallType);

      formData.append('parking', parkingAvailable === 'yes' ? 1 : 0);
      formData.append('parking_available', parkingAvailable === 'yes' ? 1 : 0);
      formData.append(
        'valet_parking',
        parkingAvailable === 'yes' && valet === 'yes' ? 1 : 0,
      );
      formData.append('parking_capacity', parkingCapacity || '0');
      formData.append('parking_type', parkingType || '');
      formData.append('parking_charges', parkingCharges || '0');
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
        const foodAvailableValue = isFarm
          ? Boolean(foodDescription.trim())
          : foodAvailable === 'yes';
        const adultGamesValue = isFarm
          ? Boolean(adultGamesDesc.trim())
          : adultGames === 'yes';
        const childrenGamesValue = isFarm
          ? Boolean(childrenGamesDesc.trim())
          : childrenGames === 'yes';

        formData.append('swimming_pool', swimmingPool === 'yes' ? 1 : 0);
        formData.append(
          'food_available',
          foodAvailableValue ? 1 : 0,
        );
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
        formData.append(
          'adult_games',
          adultGamesValue ? 1 : 0,
        );
        formData.append('adult_games_desc', adultGamesDesc || '');
        if (adultGamesDesc) {
          formData.append('adult_games_names[0]', adultGamesDesc);
        }
        formData.append(
          'children_games',
          childrenGamesValue ? 1 : 0,
        );
        formData.append('children_games_desc', childrenGamesDesc || '');
        if (childrenGamesDesc) {
          formData.append('children_games_names[0]', childrenGamesDesc);
        }
        formData.append('kitchen_setup', kitchenSetup === 'yes' ? 1 : 0);
        formData.append(
          'free_cancellation',
          freeCancellation === 'yes' ? 1 : 0,
        );
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
        formData.append('area_sqft', area || '');
        formData.append('plot_area', plotArea || '');
        formData.append('built_up_area', builtUpArea || '');
        formData.append('carpet_area', carpetArea || '');
        formData.append('other', otherFacilities || '');
        formData.append('rules_and_regulations', rulesAndRegulations);
      }

      if (isResort) {
        customAmenities.forEach((amenity, index) => {
          if (amenity.trim()) {
            formData.append(`other_amenities[${index}]`, amenity.trim());
          }
        });
        packages.forEach((item, packageIndex) => {
          formData.append(
            `packages[${packageIndex}][package_name]`,
            item.name,
          );
          formData.append(`packages[${packageIndex}][price]`, item.price);
          formData.append(`packages[${packageIndex}][gst]`, item.gst);
          formData.append(
            `packages[${packageIndex}][max_people]`,
            item.maxPeople,
          );
          formData.append(
            `packages[${packageIndex}][description]`,
            item.description,
          );
          const packageServices = [
            ...item.services,
            ...item.customServices
              .map(service => service.trim())
              .filter(Boolean),
          ];
          packageServices.forEach((service, serviceIndex) => {
            formData.append(
              `packages[${packageIndex}][services][${serviceIndex}]`,
              service,
            );
          });
          formData.append(`packages[${packageIndex}][is_active]`, '1');
          item.images
            .filter(image => !image.isOld)
            .forEach((image, imageIndex) => {
              formData.append(
                `packages[${packageIndex}][images][${imageIndex}]`,
                {
                  uri: image.uri,
                  type: image.type || 'image/jpeg',
                  name:
                    image.name || `package_${packageIndex}_${imageIndex}.jpg`,
                },
              );
            });
        });
        addOns.forEach((item, index) => {
          if (item.name.trim()) {
            formData.append(`add_on_services[${index}][name]`, item.name);
            formData.append(`add_on_services[${index}][price]`, item.price);
          }
        });
        formData.append('id_proofs_required', idProofsRequired);
        formData.append('check_in_time', checkInTime);
        formData.append('check_out_time', checkOutTime);
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

      // if (isHall) {
      appendImages(formData, 'kitchen_images', kitchenImages, 'kitchen_image');
      appendImages(formData, 'bride_image', BridGroomImages, 'bride_image');
      appendImages(formData, 'praking_image', parkingImages, 'parking_image');
      // }

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
      console.log(formData,"DORMMMMMMM");
      
      const url = isFarm ? 'farm' : isResort ? 'resort' : 'hall';

      const apiUrl = isEdit
        ? `public/api/hall-update/${editItem?.id}`
        : `public/api/hall_add/${url}`;

      const response = await postRequest(apiUrl, formData, true);
console.log(response,"RESSSPPP");

      if (response?.data?.success === true) {
        showToast(response?.data?.message, 'success');
        navigation?.goBack();
      } else {
        showToast(
          response?.error ||
            response?.data?.message ||
            'Something went wrong',
          'error',
        );
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
            <Image source={{uri: img.uri}} style={styles.image} />
            <TouchableOpacity
              style={styles.removeBtn}
              onPress={() => removeImage(setter, index)}>
              <Text style={{color: 'red', fontSize: 10}}>X</Text>
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity
          style={styles.addImageBox}
          onPress={() => pickImages(setter)}>
          <Text style={{fontSize: 28, color: COLOR.primary || '#007AFF'}}>
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
          style={[styles.input, {marginTop: 10}]}
          value={descriptionVal}
          onChangeText={setDescriptionVal}
          placeholder="Enter Name and Number of hall decorator"
          placeholderTextColor={COLOR.grey}
        />
      )}

      {field === 'Dex' && value === 'yes' && (
        <TextInput
          style={[styles.input, {marginTop: 10}]}
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
    setRows([...rows, {field: '', value: ''}]);
  };

  const resortAmenities = [
    ['Swimming Pool', swimmingPool],
    ['Food Available', foodAvailable],
    ['CCTV Available', cctv],
    ['Sound System Available', soundSystem],
    ['Sound System Allowed', soundSystemAllowed],
    ['Adult Games', adultGames],
    ['Children Games', childrenGames],
    ['Kitchen Setup with all Materials', kitchenSetup],
    ['Free Cancellation', freeCancellation],
    ['Pay Later', payLater],
    ['Adult Pool', adultPool],
    ['Child Pool', childPool],
    ['Security Guard', securityGuard],
    ['Pet Friendly', petFriendly],
    ['Breakfast Included', breakfastIncluded],
    ['Restaurant', restaurant],
    ['Cafeteria', cafeteria],
    ['Elevator', elevator],
    ['24 Hours Reception', reception24],
    ['Gym / Fitness Available', gym],
    ['A/C Available', acAvailable],
    ['TV Available', tvAvailable],
    ['Meeting Room', meetingRoom],
    ['Free Wifi', wifi],
    ['Play Ground', playGround],
    ['Kitchen', kitchen],
    ['Refrigerator', refrigerator],
    ['Spa', spa],
    ['Wellness Centre', wellnessCentre],
    ['Wheel Chair Access', wheelChair],
  ]
    .filter(([, value]) => value === 'yes')
    .map(([name]) => name)
    .concat(customAmenities.filter(Boolean));

  const updatePackage = (index, key, value) => {
    setPackages(current =>
      current.map((item, itemIndex) =>
        itemIndex === index ? {...item, [key]: value} : item,
      ),
    );
  };

  const pickPackageImages = index => {
    ImagePicker.openPicker({
      multiple: true,
      cropping: true,
      compressImageQuality: 0.8,
    })
      .then(result => {
        const images = result.map(image => ({
          uri: image.path,
          type: image.mime,
        }));
        updatePackage(index, 'images', [...packages[index].images, ...images]);
      })
      .catch(error => console.log(error));
  };

  const addPackage = () =>
    setPackages(current => [...current, createEmptyPackage()]);

  const handleTimeChange = (type, event, selectedTime) => {
    if (type === 'checkIn') {
      setShowCheckInPicker(false);
    } else {
      setShowCheckOutPicker(false);
    }

    if (event?.type === 'dismissed' || !selectedTime) {
      return;
    }

    const formattedTime = moment(selectedTime).format('HH:mm');
    if (type === 'checkIn') {
      setCheckInTime(formattedTime);
    } else {
      setCheckOutTime(formattedTime);
    }
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
    <View style={styles.screen}>
      <Header
        title={screenTitle}
        showBack
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets={false}
        keyboardDismissMode="on-drag">
        <View style={styles.introCard}>
          <View style={styles.introBadge}>
            <Text style={styles.introBadgeText}>
              {isResort ? 'RESORT' : isFarm ? 'FARM HOUSE' : 'VENUE'}
            </Text>
          </View>
          <Text style={styles.introTitle}>{screenTitle}</Text>
          <Text style={styles.introText}>
            Add clear details and quality photos to help guests understand your
            property.
          </Text>
        </View>
        {renderImagePicker(
          isFarm ? 'Farm Images' : isResort ? 'Resort Images' : 'Hall Images',
          hallImages,
          setHallImages,
        )}

        {isStayType &&
          renderImagePicker('Room Images', roomImages, setRoomImages)}

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
            style={[styles.input, {height: 80, textAlignVertical: 'top'}]}
            value={description}
            onChangeText={setDescription}
            multiline
            placeholder="Enter description"
            placeholderTextColor={COLOR.grey}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>
            {isResort ? 'Reception Contact Number *' : 'Contact Number *'}
          </Text>
          <TextInput
            style={styles.input}
            value={contact}
            autoComplete="tel"
            importantForAutofill="yes"
            keyboardType="phone-pad"
            onChangeText={setContact}
            placeholder={
              isResort
                ? 'Enter Reception Contact Number'
                : 'Enter Contact Number'
            }
            placeholderTextColor={COLOR.grey}
            textContentType="telephoneNumber"
          />
        </View>

        {isResort && (
          <View style={styles.section}>
            <Text style={styles.label}>Manager / Owner Contact Number *</Text>
            <Text style={styles.helperText}>
              For application purpose only. This number will be displayed on the
              admin website only.
            </Text>
            <TextInput
              style={styles.input}
              value={managerContact}
              autoComplete="tel"
              importantForAutofill="yes"
              keyboardType="phone-pad"
              onChangeText={setManagerContact}
              placeholder="Enter Manager / Owner Contact Number"
              placeholderTextColor={COLOR.grey}
              textContentType="telephoneNumber"
            />
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.label}>Location *</Text>
          <GooglePlacePicker
            placeholder="Search location..."
            initialLocation={address}
            useCurrentLocation={!isEdit}
            onPlaceSelected={place => setAddress(place)}
          />
          {!!address?.address && (
            <Text style={{marginTop: 8, color: COLOR.black}}>
              {address.address}
            </Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Price Options</Text>
          <Text style={styles.helperText}>
            Add prices only for the booking types you offer.
          </Text>

          {isStayType ? (
            <>
              {priceOptionsFarm.map(opt => (
                <View key={opt} style={styles.priceRow}>
                  <Text style={{flex: 1, color: COLOR.black}}>{opt}</Text>
                  <TextInput
                    {...nonContactNumericInputProps}
                    style={[styles.input, {flex: 1}]}
                    placeholder="Enter Price"
                    keyboardType="numeric"
                    placeholderTextColor={COLOR.grey}
                    value={prices[opt] || ''}
                    onChangeText={val => setPrices({...prices, [opt]: val})}
                  />
                </View>
              ))}
            </>
          ) : (
            <>
              {priceOptions.map(opt => (
                <View key={opt} style={styles.priceRow}>
                  <Text style={{flex: 1, color: COLOR.black}}>{opt}</Text>
                  <TextInput
                    {...nonContactNumericInputProps}
                    placeholderTextColor={COLOR.grey}
                    style={[styles.input, {flex: 1}]}
                    placeholder="Enter Price"
                    keyboardType="numeric"
                    value={prices[opt] || ''}
                    onChangeText={val => setPrices({...prices, [opt]: val})}
                  />
                </View>
              ))}
            </>
          )}

          <View style={{marginTop: 10}}>
            {rows.map((row, index) => (
              <View key={index} style={styles.row}>
                <TextInput
                  placeholderTextColor={COLOR.grey}
                  style={[styles.inputVal, {flex: 1}]}
                  placeholder="Enter Field Name"
                  value={row.field}
                  onChangeText={text => handleChange(text, index, 'field')}
                />
                <TextInput
                  {...nonContactNumericInputProps}
                  placeholderTextColor={COLOR.grey}
                  style={[styles.inputVal, {flex: 1}]}
                  placeholder="Enter Price"
                  value={row.value}
                  keyboardType="numeric"
                  onChangeText={text => handleChange(text, index, 'value')}
                />
                <TouchableOpacity style={styles.rowAddButton} onPress={addRow}>
                  <Text style={styles.rowAddText}>+</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {isStayType && (
          <View style={styles.section}>
            <Text style={styles.label}>
              {isResort ? 'Rooms Available *' : 'Room Available *'}
            </Text>
            <TextInput
              {...nonContactNumericInputProps}
              placeholderTextColor={COLOR.grey}
              style={styles.input}
              value={capacity}
              keyboardType="numeric"
              onChangeText={setCapacity}
              placeholder={
                isResort
                  ? 'Enter number of available rooms'
                  : 'Room Availability'
              }
            />
          </View>
        )}

        {isHall && (
          <>
            <View style={styles.section}>
              <Text style={styles.label}>Hall Capacity (No. of People) *</Text>
              <TextInput
                {...nonContactNumericInputProps}
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
            {!isFarm &&
              renderToggle('Food Available', foodAvailable, setFoodAvailable)}

            {(isFarm || foodAvailable === 'yes') && (
              <View style={styles.section}>
                <Text style={styles.label}>
                  {isFarm
                    ? 'Food Available Description'
                    : 'Mention if any (Tiffins, Lunch, Snacks, Dinner)'}
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    isFarm ? styles.multilineInput : null,
                  ]}
                  value={foodDescription}
                  onChangeText={setFoodDescription}
                  multiline={isFarm}
                  placeholder="Describe the available food options"
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

            {!isFarm &&
              renderToggle('Adult Games', adultGames, setAdultGames)}

            {(isFarm || adultGames === 'yes') && (
              <View style={styles.section}>
                <Text style={styles.label}>
                  {isFarm
                    ? 'Adult Games Description'
                    : 'Mention if any (Adult Games)'}
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    isFarm ? styles.multilineInput : null,
                  ]}
                  value={adultGamesDesc}
                  onChangeText={setAdultGamesDesc}
                  multiline={isFarm}
                  placeholder="Describe the available adult games"
                  placeholderTextColor={COLOR.grey}
                />
              </View>
            )}

            {!isFarm &&
              renderToggle(
                'Children Games',
                childrenGames,
                setChildrenGames,
              )}

            {(isFarm || childrenGames === 'yes') && (
              <View style={styles.section}>
                <Text style={styles.label}>
                  {isFarm
                    ? 'Children Games Description'
                    : 'Mention if any (Children Games)'}
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    isFarm ? styles.multilineInput : null,
                  ]}
                  value={childrenGamesDesc}
                  onChangeText={setChildrenGamesDesc}
                  multiline={isFarm}
                  placeholder="Describe the available children games"
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

            {isResort && (
              <View style={styles.section}>
                <Text style={styles.label}>Other Amenities</Text>
                {customAmenities.map((amenity, index) => (
                  <View key={index} style={styles.dynamicRow}>
                    <TextInput
                      style={[styles.input, {marginRight: 8}]}
                      value={amenity}
                      onChangeText={value =>
                        setCustomAmenities(current =>
                          current.map((item, itemIndex) =>
                            itemIndex === index ? value : item,
                          ),
                        )
                      }
                      placeholder="Enter other amenity"
                      placeholderTextColor={COLOR.grey}
                    />
                    {index === customAmenities.length - 1 && (
                      <TouchableOpacity
                        style={styles.plusButton}
                        onPress={() =>
                          setCustomAmenities(current => [...current, ''])
                        }>
                        <Text style={styles.plusText}>+</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </View>
            )}

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

        {isFarm && (
          <View style={styles.section}>
            <Text style={styles.label}>Rules and Regulations</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              value={rulesAndRegulations}
              onChangeText={setRulesAndRegulations}
              multiline
              placeholder="Describe the rules and regulations"
              placeholderTextColor={COLOR.grey}
            />
          </View>
        )}

        {isResort && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Packages</Text>
              {packages.map((item, packageIndex) => (
                <View key={packageIndex} style={styles.card}>
                  <Text style={styles.cardTitle}>
                    Package {packageIndex + 1}
                  </Text>
                  <TextInput
                    style={styles.input}
                    value={item.name}
                    onChangeText={value =>
                      updatePackage(packageIndex, 'name', value)
                    }
                    placeholder="Package Name (e.g. Basic Room with amenities)"
                    placeholderTextColor={COLOR.grey}
                  />
                  <Text style={styles.subLabel}>Room Images</Text>
                  <View style={styles.imageContainer}>
                    {item.images.map((image, imageIndex) => (
                      <View key={imageIndex} style={styles.imageWrapper}>
                        <Image source={{uri: image.uri}} style={styles.image} />
                        <TouchableOpacity
                          style={styles.removeBtn}
                          onPress={() =>
                            updatePackage(
                              packageIndex,
                              'images',
                              item.images.filter((_, i) => i !== imageIndex),
                            )
                          }>
                          <Text style={{color: 'red', fontSize: 10}}>X</Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                    <TouchableOpacity
                      style={styles.addImageBox}
                      onPress={() => pickPackageImages(packageIndex)}>
                      <Text style={styles.plusText}>+</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.dynamicRow}>
                    <TextInput
                      {...nonContactNumericInputProps}
                      style={[styles.input, {marginRight: 8}]}
                      value={item.price}
                      onChangeText={value =>
                        updatePackage(packageIndex, 'price', value)
                      }
                      keyboardType="numeric"
                      placeholder="Price"
                      placeholderTextColor={COLOR.grey}
                    />
                    <TextInput
                      {...nonContactNumericInputProps}
                      style={styles.input}
                      value={item.gst}
                      onChangeText={value =>
                        updatePackage(packageIndex, 'gst', value)
                      }
                      keyboardType="numeric"
                      placeholder="GST %"
                      placeholderTextColor={COLOR.grey}
                    />
                  </View>
                  <TextInput
                    {...nonContactNumericInputProps}
                    style={styles.input}
                    value={item.maxPeople}
                    onChangeText={value =>
                      updatePackage(packageIndex, 'maxPeople', value)
                    }
                    keyboardType="numeric"
                    placeholder="Maximum Number of People Allowed"
                    placeholderTextColor={COLOR.grey}
                  />
                  <TextInput
                    style={[styles.input, styles.multilineInput]}
                    value={item.description}
                    onChangeText={value =>
                      updatePackage(packageIndex, 'description', value)
                    }
                    multiline
                    placeholder="Room Description"
                    placeholderTextColor={COLOR.grey}
                  />
                  <Text style={styles.subLabel}>Services Included</Text>
                  <View style={styles.chipContainer}>
                    {resortAmenities.length ? (
                      resortAmenities.map(service => {
                        const selected = item.services.includes(service);
                        return (
                          <TouchableOpacity
                            key={service}
                            style={[
                              styles.chip,
                              selected && styles.selectedChip,
                            ]}
                            onPress={() =>
                              updatePackage(
                                packageIndex,
                                'services',
                                selected
                                  ? item.services.filter(
                                      value => value !== service,
                                    )
                                  : [...item.services, service],
                              )
                            }>
                            <Text
                              style={[
                                styles.chipText,
                                selected && styles.selectedText,
                              ]}>
                              {service}
                            </Text>
                          </TouchableOpacity>
                        );
                      })
                    ) : (
                      <Text style={styles.helperText}>
                        Select amenities above to show them here.
                      </Text>
                    )}
                  </View>
                  {item.customServices.map((service, serviceIndex) => (
                    <View key={serviceIndex} style={styles.dynamicRow}>
                      <TextInput
                        style={[styles.input, {marginRight: 8}]}
                        value={service}
                        onChangeText={value => {
                          const values = [...item.customServices];
                          values[serviceIndex] = value;
                          updatePackage(packageIndex, 'customServices', values);
                        }}
                        placeholder="Any other service"
                        placeholderTextColor={COLOR.grey}
                      />
                      {serviceIndex === item.customServices.length - 1 && (
                        <TouchableOpacity
                          style={styles.plusButton}
                          onPress={() =>
                            updatePackage(packageIndex, 'customServices', [
                              ...item.customServices,
                              '',
                            ])
                          }>
                          <Text style={styles.plusText}>+</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  ))}
                </View>
              ))}
              <TouchableOpacity
                style={styles.outlineButton}
                onPress={addPackage}>
                <Text style={styles.outlineButtonText}>
                  + Add Another Package
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Add-On Services</Text>
              <Text style={styles.helperText}>
                Enter a price for each applicable service.
              </Text>
              {addOns.map((item, index) => (
                <View key={index} style={styles.dynamicRow}>
                  <TextInput
                    style={[styles.input, styles.addOnNameInput]}
                    value={item.name}
                    editable={index >= defaultAddOns.length}
                    onChangeText={value =>
                      setAddOns(current =>
                        current.map((addOn, itemIndex) =>
                          itemIndex === index ? {...addOn, name: value} : addOn,
                        ),
                      )
                    }
                    placeholder="Service Name"
                    placeholderTextColor={COLOR.grey}
                  />
                  <TextInput
                    {...nonContactNumericInputProps}
                    style={[styles.input, styles.addOnPriceInput]}
                    value={item.price}
                    onChangeText={value =>
                      setAddOns(current =>
                        current.map((addOn, itemIndex) =>
                          itemIndex === index
                            ? {...addOn, price: value}
                            : addOn,
                        ),
                      )
                    }
                    keyboardType="numeric"
                    placeholder="Price"
                    placeholderTextColor={COLOR.grey}
                  />
                  {index === addOns.length - 1 && (
                    <TouchableOpacity
                      style={[styles.plusButton, {marginLeft: 8}]}
                      onPress={() =>
                        setAddOns(current => [
                          ...current,
                          {name: '', price: ''},
                        ])
                      }>
                      <Text style={styles.plusText}>+</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>ID Proofs Required</Text>
              <TextInput
                style={[styles.input, styles.multilineInput]}
                value={idProofsRequired}
                onChangeText={setIdProofsRequired}
                multiline
                placeholder="Write multiple points"
                placeholderTextColor={COLOR.grey}
              />
            </View>
            <View style={styles.section}>
              <Text style={styles.label}>Rules and Regulations</Text>
              <TextInput
                style={[styles.input, styles.multilineInput]}
                value={rulesAndRegulations}
                onChangeText={setRulesAndRegulations}
                multiline
                placeholder="Write multiple points"
                placeholderTextColor={COLOR.grey}
              />
            </View>
            <View style={styles.section}>
              <Text style={styles.label}>Normal Timings</Text>
              <View style={styles.dynamicRow}>
                <TouchableOpacity
                  style={[
                    styles.input,
                    styles.timePickerInput,
                    styles.inputSpacing,
                  ]}
                  onPress={() => setShowCheckInPicker(true)}>
                  <Text
                    style={
                      checkInTime ? styles.timeText : styles.timePlaceholder
                    }>
                    {checkInTime || 'Select Check-in Time'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.input, styles.timePickerInput]}
                  onPress={() => setShowCheckOutPicker(true)}>
                  <Text
                    style={
                      checkOutTime ? styles.timeText : styles.timePlaceholder
                    }>
                    {checkOutTime || 'Select Check-out Time'}
                  </Text>
                </TouchableOpacity>
              </View>
              {showCheckInPicker && (
                <DateTimePicker
                  value={new Date()}
                  mode="time"
                  is24Hour
                  display="default"
                  onChange={(event, time) =>
                    handleTimeChange('checkIn', event, time)
                  }
                />
              )}
              {showCheckOutPicker && (
                <DateTimePicker
                  value={new Date()}
                  mode="time"
                  is24Hour
                  display="default"
                  onChange={(event, time) =>
                    handleTimeChange('checkOut', event, time)
                  }
                />
              )}
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
            <View style={{marginHorizontal: 20}}>
              <TextInput
                {...nonContactNumericInputProps}
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
          <Text style={[styles.note, {color: 'black'}]}>
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

        <View style={styles.submitArea}>
          <CustomButton
            title={buttonTitle}
            loading={loading}
            onPress={postSpace}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default CreateConvention;

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: '#F4F7FB'},
  scrollView: {flex: 1},
  scrollContent: {padding: 14, paddingBottom: 36},
  introCard: {
    backgroundColor: COLOR.primary || '#2563EB',
    borderRadius: 18,
    padding: 20,
    marginBottom: 8,
  },
  introBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 12,
  },
  introBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  introTitle: {color: '#FFFFFF', fontSize: 23, fontWeight: '800'},
  introText: {
    color: 'rgba(255,255,255,0.86)',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
  },
  section: {
    marginTop: 10,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E8EDF4',
    shadowColor: '#172B4D',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 9,
    color: '#1E293B',
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  imageWrapper: {position: 'relative', marginRight: 10, marginBottom: 10},
  image: {width: 94, height: 94, borderRadius: 12},
  removeBtn: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 3,
    paddingHorizontal: 7,
  },
  addImageBox: {
    width: 94,
    height: 94,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#AAB8CC',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    marginBottom: 10,
  },
  toggleRow: {flexDirection: 'row', marginTop: 2},
  toggleBtn: {
    minWidth: 76,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: '#D7DFEA',
    borderRadius: 22,
    alignItems: 'center',
    marginRight: 10,
    justifyContent: 'center',
  },
  selectedBtn: {
    backgroundColor: COLOR.primary || '#007AFF',
    borderColor: COLOR.primary || '#007AFF',
  },
  toggleText: {fontSize: 13, color: '#64748B', fontWeight: '700'},
  selectedText: {color: '#fff', fontWeight: '600'},
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F7',
    gap: 12,
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
    borderColor: '#D7DFEA',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 48,
    color: '#172033',
    backgroundColor: '#FAFCFF',
    fontSize: 14,
  },
  dateText: {fontSize: 16, width: 110, color: 'black'},
  inputVal: {
    borderWidth: 1,
    borderColor: '#D7DFEA',
    padding: 12,
    borderRadius: 10,
    marginRight: 6,
    paddingVertical: 10,
    color: COLOR.black,
    backgroundColor: '#FAFCFF',
  },
  rowAddButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#EAF3FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowAddText: {
    color: COLOR.primary || '#2563EB',
    fontSize: 25,
    lineHeight: 27,
    fontWeight: '600',
  },
  optionButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    marginRight: 8,
  },
  optionButtonSelected: {
    backgroundColor: COLOR?.primary,
    borderColor: COLOR?.primary,
  },
  optionTextSelected: {color: 'white'},
  optionRow: {flexDirection: 'row', gap: 8},
  note: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 19,
  },
  helperText: {
    color: '#64748B',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#172033',
    marginBottom: 6,
  },
  subLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLOR.black,
    marginTop: 12,
    marginBottom: 8,
  },
  dynamicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  addOnNameInput: {
    flex: 2,
    marginRight: 8,
    fontSize: 12,
  },
  addOnPriceInput: {flex: 1},
  plusButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLOR.primary || '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusText: {fontSize: 26, color: COLOR.primary || '#007AFF'},
  card: {
    borderWidth: 1,
    borderColor: '#DDE5EF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    gap: 10,
    backgroundColor: '#F8FAFD',
  },
  cardTitle: {fontSize: 17, fontWeight: '800', color: '#172033'},
  multilineInput: {
    height: 90,
    textAlignVertical: 'top',
    paddingTop: 10,
    marginTop: 10,
  },
  chipContainer: {flexDirection: 'row', flexWrap: 'wrap'},
  chip: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginRight: 7,
    marginBottom: 7,
  },
  chipText: {color: '#172033', fontWeight: '600'},
  selectedChip: {
    backgroundColor: COLOR.primary || '#007AFF',
    borderColor: COLOR.primary || '#007AFF',
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: COLOR.primary || '#007AFF',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    backgroundColor: '#F2F7FF',
  },
  outlineButtonText: {
    color: COLOR.primary || '#007AFF',
    fontWeight: '700',
  },
  timePickerInput: {justifyContent: 'center'},
  inputSpacing: {marginRight: 8},
  timeText: {color: COLOR.black},
  timePlaceholder: {color: COLOR.grey},
  submitArea: {marginTop: 20, marginBottom: 8},
});
