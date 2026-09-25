import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {AuthContext} from '../../../Backend/AuthContent';
import {useApi} from '../../../Backend/Api';
import {COLOR} from '../../../Constants/Colors';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const CATEGORIES = [
  {key: 'property', label: 'Properties', aliases: ['property', 'properties', 'flat', 'house', 'room']},
  {key: 'hostel', label: 'Hostels', aliases: ['hostel', 'hostels', 'pg']},
  {key: 'hotel', label: 'Hotels', aliases: ['hotel', 'hotels']},
  {key: 'convention', label: 'Convention halls', aliases: ['convention', 'hall', 'banquet']},
  {key: 'resort', label: 'Resorts', aliases: ['resort', 'resorts']},
  {key: 'farm', label: 'Farm houses', aliases: ['farm house', 'farmhouse', 'farm']},
];

const ENDPOINTS = {
  property: {method: 'post', url: 'public/api/properties'},
  hostel: {method: 'post', url: 'public/api/hostels/list'},
  hotel: {method: 'get', url: 'public/api/hotels'},
  convention: {method: 'post', url: 'public/api/hall_listing'},
  resort: {method: 'post', url: 'public/api/resort_listing'},
  farm: {method: 'post', url: 'public/api/farm_listing'},
};

const DETAIL_ENDPOINTS = {
  property: id => `public/api/properties/${id}`,
  hostel: id => `public/api/hostels/${id}`,
  hotel: id => `public/api/hotels/${id}`,
  convention: id => `public/api/hall_deatils/${id}`,
  resort: id => `public/api/hall_deatils/${id}`,
  farm: id => `public/api/hall_deatils/${id}`,
};

const WELCOME_MESSAGE = {
  id: 'welcome',
  sender: 'bot',
  text: 'Hi! I can find a place, explain its complete details, or show your bookings with customer and vendor contact information.',
};

const isBookingRequest = text =>
  /\b(?:my\s+bookings?|show\s+(?:me\s+)?(?:my\s+)?bookings?|booking\s+(?:list|details?))\b/i.test(
    text,
  );

const getCategory = text => {
  const normalized = text.toLowerCase();
  const matches = CATEGORIES.flatMap(category =>
    category.aliases
      .filter(alias => normalized.includes(alias))
      .map(alias => ({category, matchLength: alias.length})),
  );

  if (!matches.length) {
    const genericPropertyRequest = /\b(?:show|find|search|nearby|around me|rent|rental|listing|available)\b/.test(normalized);
    return genericPropertyRequest ? CATEGORIES[0] : null;
  }

  matches.sort((first, second) => second.matchLength - first.matchLength);
  return matches[0].category;
};

const toAmount = value => {
  if (!value || typeof value === 'object') {
    return null;
  }
  const normalized = String(value)
    .replace(/,/g, '')
    .toLowerCase()
    .replace(/[^\d.k]/g, '');
  const number = Number.parseFloat(normalized);
  if (Number.isNaN(number)) {
    return null;
  }
  return normalized.endsWith('k') ? number * 1000 : number;
};

const parseFilters = text => {
  const normalized = text.toLowerCase();
  const filters = {};
  const between = normalized.match(/(?:between|from)\s*(\d[\d,]*(?:\.\d+)?k?)\s*(?:and|to|-)\s*(\d[\d,]*(?:\.\d+)?k?)/i);
  const maximum = normalized.match(/(?:under|below|less than|up to|max(?:imum)?(?: price)?(?: of)?)\s*₹?\s*(\d[\d,]*(?:\.\d+)?k?)/i);
  const minimum = normalized.match(/(?:above|over|more than|at least|min(?:imum)?(?: price)?(?: of)?)\s*₹?\s*(\d[\d,]*(?:\.\d+)?k?)/i);
  const bhk = normalized.match(/\b([1-9])\s*bhk\b/i);
  const capacity = normalized.match(/(?:for|capacity(?: of)?)\s*(\d+)\s*(?:people|persons|guests)/i);

  if (between) {
    filters.minPrice = toAmount(between[1]);
    filters.maxPrice = toAmount(between[2]);
  } else {
    if (maximum) {
      filters.maxPrice = toAmount(maximum[1]);
    }
    if (minimum) {
      filters.minPrice = toAmount(minimum[1]);
    }
  }
  if (bhk) {
    filters.bhk = bhk[1];
  }
  if (capacity) {
    filters.minCapacity = capacity[1];
  }
  if (/\bfurnished\b/.test(normalized) && !/unfurnished/.test(normalized)) {
    filters.furnishing = 'Furnished';
  }
  if (/\bunfurnished\b/.test(normalized)) {
    filters.furnishing = 'Unfurnished';
  }
  if (/\b(?:women|woman|girls|female)\b/.test(normalized)) {
    filters.gender = 'Female';
  } else if (/\b(?:men|man|boys|male)\b/.test(normalized)) {
    filters.gender = 'Male';
  }
  if (/\b(?:ac|air conditioned|air conditioning)\b/.test(normalized)) {
    filters.acAvailable = 1;
  }
  if (/\bparking\b/.test(normalized)) {
    filters.parking = 1;
  }
  if (/\b(?:food|meals)\b/.test(normalized)) {
    filters.food = 1;
  }
  return filters;
};

const appendFilters = (target, filters) => {
  const values = {
    min_price: filters.minPrice,
    price_min: filters.minPrice,
    max_price: filters.maxPrice,
    price_max: filters.maxPrice,
    'bhk[0]': filters.bhk,
    'furnishing_status[0]': filters.furnishing,
    'genders[0]': filters.gender,
    seating_capacity_min: filters.minCapacity,
    ac_available: filters.acAvailable,
    parking_available: filters.parking,
    'facilities[0]': filters.parking ? 'Parking' : null,
    'food_option[0]': filters.food ? 'Food' : null,
  };
  Object.entries(values).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      target.append(key, String(value));
    }
  });
};

const getNumericPrice = item => {
  const values = [
    item?.price,
    item?.rent,
    item?.min_amount,
    item?.starting_price,
    item?.day_visit_price,
  ].map(toAmount).filter(value => value !== null);
  return values.length ? Math.min(...values) : null;
};

const applyPriceFilter = (items, filters) => items.filter(item => {
  const price = getNumericPrice(item);
  if (price === null) {
    return true;
  }
  return (!filters.minPrice || price >= filters.minPrice) &&
    (!filters.maxPrice || price <= filters.maxPrice);
});

const unpackResults = response => {
  const payload = response?.data?.data;
  if (Array.isArray(payload)) {
    return payload;
  }
  if (Array.isArray(payload?.data)) {
    return payload.data;
  }
  return [];
};

const unpackBookings = response => {
  const payload = response?.data;
  if (Array.isArray(payload?.data)) {
    return payload.data;
  }
  if (Array.isArray(payload?.data?.data)) {
    return payload.data.data;
  }
  return [];
};

const firstValue = (...values) =>
  values.find(value => value !== undefined && value !== null && value !== '');

const formatValue = value => {
  if (value === undefined || value === null || value === '') {
    return '';
  }
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }
  if (Array.isArray(value)) {
    return value
      .map(item =>
        typeof item === 'object'
          ? firstValue(item?.name, item?.title, item?.package_name, item?.value)
          : item,
      )
      .filter(Boolean)
      .join(', ');
  }
  if (typeof value === 'object') {
    return firstValue(value?.name, value?.title, value?.value, '') || '';
  }
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return formatValue(parsed) || value;
    } catch (error) {
      return value;
    }
  }
  return String(value);
};

const makeRows = (data, definitions) =>
  definitions
    .map(([key, label]) => ({label, value: formatValue(data?.[key])}))
    .filter(row => row.value !== '');

const makeBooleanRows = (data, definitions) =>
  definitions
    .filter(([key]) => data?.[key] !== undefined && data?.[key] !== null)
    .map(([key, label]) => {
      const value = data[key];
      const enabled = [true, 1, '1', 'yes', 'true'].includes(
        typeof value === 'string' ? value.toLowerCase() : value,
      );
      return {label, value: enabled ? 'Yes' : 'No'};
    });

const humanizeKey = key =>
  String(key)
    .replace(/_/g, ' ')
    .replace(/\b\w/g, letter => letter.toUpperCase());

const flattenNamedOptions = value => {
  if (!value) {
    return '';
  }
  let parsed = value;
  if (typeof value === 'string') {
    try {
      parsed = JSON.parse(value);
    } catch (error) {
      return value;
    }
  }
  if (Array.isArray(parsed)) {
    return formatValue(parsed);
  }
  if (typeof parsed === 'object') {
    return Object.entries(parsed)
      .flatMap(([key, item]) => {
        if (Array.isArray(item)) {
          return item;
        }
        return [item === true || item === 1 || item === '1' ? key : item];
      })
      .map(item => formatValue(item))
      .filter(Boolean)
      .join(', ');
  }
  return formatValue(parsed);
};

const buildPropertySections = (data, category) => {
  const sections = [];
  const addSection = (title, rows) => {
    if (rows.length) {
      sections.push({title, rows});
    }
  };
  const name = firstValue(data?.title, data?.hotel_name, data?.name, 'Property');

  addSection('Overview', [
    {label: 'Name', value: formatValue(name)},
    ...makeRows(data, [
      ['description', 'Description'],
      ['property_type', 'Property type'],
      ['hotel_type_text', 'Hotel type'],
      ['hostel_type', 'Hostel type'],
      ['room_type', 'Room type'],
      ['bhk', 'BHK'],
      ['furnishing_status', 'Furnishing'],
      ['area_sqft', 'Area (sq.ft)'],
      ['seating_capacity', 'Seating capacity'],
      ['guests_per_room', 'Guests per room'],
    ]),
  ]);

  addSection('Price and payment', makeRows(data, [
    ['formatted_price', 'Price'],
    ['price', 'Price'],
    ['min_price', 'Minimum price'],
    ['max_price', 'Maximum price'],
    ['min_amount', 'Minimum amount'],
    ['max_amount', 'Maximum amount'],
    ['single_room_price', 'Single room'],
    ['double_sharing_price', 'Double sharing'],
    ['triple_sharing_price', 'Triple sharing'],
    ['four_sharing_price', 'Four sharing'],
    ['security_deposit', 'Security deposit'],
    ['advance', 'Advance'],
    ['mentains_amount', 'Maintenance'],
    ['day_visit_price', 'Day visit'],
    ['night_visit_price', 'Night visit'],
    ['full_day_price', 'Full day'],
    ['24_hours_visit_price', '24 hours'],
  ]));

  addSection('Stay, room and timing details', makeRows(data, [
    ['room_size_min', 'Minimum room size'],
    ['room_size_max', 'Maximum room size'],
    ['room_size', 'Room size'],
    ['bed_type', 'Bed type'],
    ['bathrooms', 'Bathrooms'],
    ['bathroom_type', 'Bathroom type'],
    ['floor', 'Floor'],
    ['facing_direction', 'Facing'],
    ['availability', 'Availability'],
    ['preferred_tenant_type', 'Preferred tenant'],
    ['booking_type_text', 'Booking type'],
    ['check_in_time', 'Check-in'],
    ['check_out_time', 'Check-out'],
    ['gate_closing_time', 'Gate closing time'],
  ]));

  const amenities = [
    flattenNamedOptions(data?.amenities),
    flattenNamedOptions(data?.facilities),
  ].filter(Boolean).join(', ');
  const availableFeatures = [
    ['parking_available', 'Parking'], ['security_avl', 'Security'],
    ['wifi', 'Wi-Fi'], ['free_wifi', 'Free Wi-Fi'], ['ac', 'AC'],
    ['ac_available', 'AC'], ['kitchen', 'Kitchen'], ['food_available', 'Food'],
    ['power_backup', 'Power backup'], ['hot_water', 'Hot water'],
    ['laundry_service', 'Laundry'], ['housekeeping', 'Housekeeping'],
    ['gym', 'Gym'], ['gym_available', 'Gym'], ['swimming_pool', 'Swimming pool'],
    ['cctv_available', 'CCTV'], ['generator_available', 'Generator'],
    ['sound_system_available', 'Sound system'], ['pet_friendly', 'Pet friendly'],
  ].filter(([key]) => [true, 1, '1', 'yes'].includes(
    typeof data?.[key] === 'string' ? data[key].toLowerCase() : data?.[key],
  )).map(([, label]) => label);
  addSection('Amenities and facilities', [
    ...(amenities ? [{label: 'Included', value: amenities}] : []),
    ...(availableFeatures.length
      ? [{label: 'Available', value: [...new Set(availableFeatures)].join(', ')}]
      : []),
  ]);

  addSection('Rules and policies', makeRows(data, [
    ['hotel_rules', 'Hotel rules'],
    ['rules_policies', 'Rules and policies'],
    ['documents_required', 'Documents required'],
    ['smoking_alcohol_policy', 'Smoking/alcohol policy'],
    ['identity_proof_required', 'Identity proof required'],
    ['foreigners_passport_required', 'Passport required'],
    ['visitors_allowed', 'Visitors allowed'],
    ['outside_food_allowed', 'Outside food allowed'],
    ['alcohol_allowed', 'Alcohol allowed'],
    ['free_cancellation', 'Free cancellation'],
    ['pay_later', 'Pay later'],
  ]));

  addSection('Room features and services', [
    ...makeBooleanRows(data, [
      ['is_ac', 'Air conditioning'],
      ['is_bathroom_attached', 'Attached bathroom'],
      ['is_water_24x7', 'Water 24x7'],
      ['is_geyser_available', 'Geyser'],
      ['has_window_mosquito_net', 'Window mosquito net'],
      ['has_balcony', 'Balcony'],
      ['is_balcony_view_beautiful', 'Balcony view'],
      ['has_ventilation', 'Ventilation'],
      ['has_emergency_exit', 'Emergency exit'],
      ['laundry_service', 'Laundry service'],
      ['housekeeping', 'Housekeeping'],
      ['hot_water', 'Hot water'],
      ['power_backup', 'Power backup'],
      ['ro_water', 'RO water'],
      ['study_area', 'Study area'],
      ['mess', 'Mess'],
      ['play_area', 'Play area'],
      ['tv', 'Television'],
      ['dining_table', 'Dining table'],
    ]),
    ...makeRows(data, [
      ['food_available_text', 'Food availability'],
      ['status_text', 'Status'],
    ]),
  ]);

  addSection('Meals and timings', [
    ...makeBooleanRows(data, [
      ['breakfast', 'Breakfast'],
      ['lunch', 'Lunch'],
      ['dinner', 'Dinner'],
      ['tea_coffee', 'Tea/coffee'],
      ['snacks', 'Snacks'],
    ]),
    ...makeRows(data, [
      ['breakfast_timing', 'Breakfast timing'],
      ['tea_coffee_timing', 'Tea/coffee timing'],
      ['lunch_timing', 'Lunch timing'],
      ['snacks_timing', 'Snacks timing'],
      ['dinner_timing', 'Dinner timing'],
      ['one_day_stay', 'One-day stay'],
      ['one_week_stay', 'One-week stay'],
      ['one_month_stay', 'One-month stay'],
      ['get_open_time', 'Opening time'],
      ['pet_allowed', 'Pets allowed'],
    ]),
  ]);

  addSection('Venue capacity, parking and duration', makeRows(data, [
    ['room_details', 'Rooms available'],
    ['area_sq_ft', 'Area (sq.ft)'],
    ['plot_area', 'Plot area'],
    ['built_up_area', 'Built-up area'],
    ['carpet_area', 'Carpet area'],
    ['floating_capacity', 'Floating capacity'],
    ['dining_capacity', 'Dining capacity'],
    ['parking', 'Parking'],
    ['valet_parking', 'Valet parking'],
    ['parking_capacity', 'Parking capacity'],
    ['parking_type', 'Parking type'],
    ['parking_charges', 'Parking charges'],
    ['day_duration', 'Day duration (hours)'],
    ['night_duration', 'Night duration (hours)'],
    ['full_day_duration', 'Full-day duration (hours)'],
    ['food_description', 'Food details'],
    ['adult_games_names', 'Adult games'],
    ['children_games_names', 'Children games'],
    ['rules_and_regulations', 'Rules and regulations'],
  ]));

  const summarizedPriceKeys = new Set([
    'formatted_price', 'price', 'min_price', 'max_price', 'min_amount',
    'max_amount', 'single_room_price', 'double_sharing_price',
    'triple_sharing_price', 'four_sharing_price', 'day_visit_price',
    'night_visit_price', 'full_day_price', '24_hours_visit_price',
  ]);
  const eventPrices = Object.entries(data || {})
    .filter(([key, value]) =>
      ['convention', 'resort', 'farm'].includes(category) &&
      !summarizedPriceKeys.has(key) &&
      (key.endsWith('_price') || key.endsWith('_charges')) &&
      value !== undefined && value !== null && value !== '',
    )
    .map(([key, value]) => ({label: humanizeKey(key), value: `₹${formatValue(value)}`}));
  addSection('Event and service prices', eventPrices);

  const extraAmenities = flattenNamedOptions(data?.other_amenities);
  const addOnServices = flattenNamedOptions(data?.add_on_services);
  addSection('Other amenities and add-on services', [
    ...(extraAmenities ? [{label: 'Other amenities', value: extraAmenities}] : []),
    ...(addOnServices ? [{label: 'Add-on services', value: addOnServices}] : []),
  ]);

  const unavailableDates = data?.dates && typeof data.dates === 'object'
    ? Object.entries(data.dates)
        .filter(([date, value]) => /^\d{2}\/\d{2}\/\d{4}$|^\d{4}-\d{2}-\d{2}$/.test(date) && value)
        .map(([date, value]) => ({label: date, value: formatValue(value)}))
    : [];
  addSection('Unavailable dates', unavailableDates);

  const packages = Array.isArray(data?.packages)
    ? data.packages.map(item => ({
        label: firstValue(item?.package_name, item?.name, 'Package'),
        value: [
          firstValue(item?.formatted_final_price, item?.formatted_price, item?.final_price, item?.price),
          item?.max_people ? `up to ${item.max_people} people` : '',
          formatValue(item?.services),
        ].filter(Boolean).join(' · '),
      }))
    : [];
  addSection('Packages', packages);

  addSection('Address and location', [
    {label: 'Address', value: formatValue(firstValue(data?.address, data?.location))},
    {label: 'Map link', value: formatValue(data?.map_link)},
  ].filter(row => row.value));

  if (!['convention', 'resort', 'farm', 'hotel'].includes(category)) {
    addSection('Vendor contact', [
      {label: 'Name', value: formatValue(firstValue(data?.user?.name, data?.vendor?.name))},
      {label: 'Phone', value: formatValue(firstValue(
        data?.contact_number,
        data?.phone_number,
        data?.user?.phone_number,
        data?.vendor?.phone_number,
      ))},
      {label: 'Email', value: formatValue(firstValue(data?.user?.email, data?.vendor?.email))},
    ].filter(row => row.value));
  }
  return sections;
};

const getImage = item =>
  item?.image ||
  item?.thumbnail ||
  item?.images?.[0]?.image_path ||
  item?.images?.[0]?.image ||
  item?.images_grouped?.room?.[0]?.image_path ||
  item?.images_grouped?.hall?.[0]?.image_path ||
  item?.images_grouped?.kitchen?.[0]?.image_path;

const ResultCard = ({item, onPress, onExplain}) => {
  const image = getImage(item);
  const price = item?.price || item?.rent || item?.min_amount || item?.starting_price;
  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        {image ? <Image source={{uri: image}} style={styles.cardImage} /> : null}
        <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item?.title || item?.name || item?.property_name || 'Property'}
        </Text>
        <Text style={styles.cardLocation} numberOfLines={2}>
          📍 {item?.location || item?.address || item?.city || 'Location available in details'}
        </Text>
        {price ? <Text style={styles.cardPrice}>₹ {price}</Text> : null}
        </View>
      </TouchableOpacity>
      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.cardAction} onPress={onExplain}>
          <Text style={styles.cardActionText}>Explain all details</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cardAction} onPress={onPress}>
          <Text style={styles.cardActionText}>Open</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const BookingResultCard = ({booking, onPress}) => {
  const property = booking?.property || booking?.convention_hall || booking?.hotel || {};
  const vendor = booking?.vendor || property?.vendor || property?.user || {};
  const requestedServices = [
    [firstValue(booking?.services?.groceries_needed, booking?.groceries_needed), 'Groceries'],
    [firstValue(booking?.services?.decoration_needed, booking?.decore_needed), 'Decoration'],
    [firstValue(booking?.services?.photographer_needed, booking?.photograper_needed), 'Photographer'],
    [firstValue(booking?.services?.chef_needed, booking?.chef_needed), 'Chef'],
    [firstValue(booking?.services?.catering_needed, booking?.catering_needed), 'Catering'],
  ]
    .filter(([value]) => [true, 1, '1', 'yes'].includes(
      typeof value === 'string' ? value.toLowerCase() : value,
    ))
    .map(([, label]) => label)
    .join(', ');
  const venueName = firstValue(
    property?.title,
    property?.hotel_name,
    property?.name,
    'Booked property',
  );
  const rows = [
    ['Order', `#${booking?.id || '—'}`],
    ['Status', firstValue(booking?.order_status_text, booking?.order_status, 'Pending')],
    ['Cancellation status', firstValue(
      booking?.cancel_request_status,
      booking?.cancellation_status,
      booking?.cancel_status,
    )],
    ['Booking date', booking?.booking_date],
    ['Event time', booking?.event_time],
    ['Guests', firstValue(booking?.number_of_attendees, booking?.number_of_attendess)],
    ['Amount', firstValue(booking?.total_amount, booking?.amount)],
    ['Payment mode', firstValue(booking?.payment_mode, booking?.payment_method)],
    ['Requested services', requestedServices],
    ['Comment', booking?.comment],
    ['Cancellation reason', firstValue(booking?.cancellation_reason, booking?.rejection_note)],
    ['Customer', booking?.full_name],
    ['Customer phone', firstValue(booking?.mobile, booking?.mobail_number)],
    ['Alternate phone', firstValue(booking?.alternate, booking?.alt_number)],
    ['Customer address', booking?.address],
    ['Vendor', firstValue(vendor?.name, booking?.vendor_name)],
    ['Vendor phone', firstValue(
      vendor?.phone_number,
      vendor?.mobile_number,
      property?.contact_number,
      property?.phone_number,
      property?.mobile_number,
      booking?.vendor_phone_number,
      booking?.vendor_mobile_number,
    )],
    ['Vendor email', firstValue(vendor?.email, booking?.vendor_email)],
  ].filter(([, value]) => value !== undefined && value !== null && value !== '');

  return (
    <TouchableOpacity style={styles.bookingCard} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.bookingVenue}>{venueName}</Text>
      {rows.map(([label, value]) => (
        <View key={label} style={styles.bookingRow}>
          <Text style={styles.bookingLabel}>{label}</Text>
          <Text style={styles.bookingValue}>{label === 'Amount' ? `₹${value}` : String(value)}</Text>
        </View>
      ))}
      <Text style={styles.manageBooking}>Open My Bookings ›</Text>
    </TouchableOpacity>
  );
};

const PropertyAssistant = ({navigation, route}) => {
  const insets = useSafeAreaInsets();
  const messageListRef = useRef(null);
  const chatSessionRef = useRef(0);
  const handledPropertyRef = useRef('');
  const {currentAddress} = useContext(AuthContext);
  const {getRequest, postRequest} = useApi();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);

  const scrollToLatest = useCallback((animated = true) => {
    requestAnimationFrame(() => {
      messageListRef.current?.scrollToEnd({animated});
    });
  }, []);

  useEffect(() => {
    scrollToLatest();
  }, [messages, scrollToLatest]);

  useEffect(() => {
    const eventName = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEventName = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const showSubscription = Keyboard.addListener(eventName, event => {
      setKeyboardVisible(true);
      if (Platform.OS === 'ios') {
        setKeyboardHeight(Math.max(0, event.endCoordinates.height - insets.bottom));
      }
      scrollToLatest();
    });
    const hideSubscription = Keyboard.addListener(hideEventName, () => {
      setKeyboardVisible(false);
      setKeyboardHeight(0);
    });
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [insets.bottom, scrollToLatest]);

  const fetchListings = useCallback(async (category, requestText, filters) => {
    const config = ENDPOINTS[category.key];
    const nearby = /near\s*by|nearby|around me|close to me/i.test(requestText);
    const lat = currentAddress?.lat;
    const long = currentAddress?.lng;

    if (config.method === 'get') {
      const params = new URLSearchParams({status: '1', page: '1', per_page: '20'});
      if (nearby && lat) {
        params.append('lat', String(lat));
      }
      if (nearby && long) {
        params.append('long', String(long));
      }
      appendFilters(params, filters);
      return getRequest(`${config.url}?${params.toString()}`);
    }

    const formData = new FormData();
    formData.append('page', '1');
    formData.append('per_page', '20');
    if (nearby && lat) {
      formData.append('lat', String(lat));
    }
    if (nearby && long) {
      formData.append('long', String(long));
    }
    appendFilters(formData, filters);
    return postRequest(config.url, formData, true);
  }, [currentAddress, getRequest, postRequest]);

  const fetchBookings = useCallback(
    () => getRequest('public/api/payment_list?page=1'),
    [getRequest],
  );

  const showBookings = useCallback(async cleanText => {
    const requestSession = chatSessionRef.current;
    setMessages(previous => [
      ...previous,
      {id: `user-${Date.now()}`, sender: 'user', text: cleanText},
    ]);
    setInput('');
    setLoading(true);
    try {
      const response = await fetchBookings();
      if (requestSession !== chatSessionRef.current) {
        return;
      }
      const bookings = unpackBookings(response);
      setMessages(previous => [
        ...previous,
        {
          id: `bookings-${Date.now()}`,
          sender: 'bot',
          text: response?.success
            ? bookings.length
              ? `You have ${bookings.length} booking${bookings.length === 1 ? '' : 's'}. Here are the booking, customer, and vendor details available from your account.`
              : 'You do not have any bookings yet.'
            : response?.error || 'I could not load your bookings. Please try again.',
          bookings,
        },
      ]);
    } finally {
      if (requestSession === chatSessionRef.current) {
        setLoading(false);
      }
    }
  }, [fetchBookings]);

  const explainProperty = useCallback(async (item, category) => {
    if (!item?.id || loading) {
      return;
    }
    const requestSession = chatSessionRef.current;
    const name = firstValue(item?.title, item?.hotel_name, item?.name, 'this property');
    setMessages(previous => [
      ...previous,
      {id: `user-${Date.now()}`, sender: 'user', text: `Explain all details for ${name}`},
    ]);
    setLoading(true);
    try {
      const normalizedCategory = category === 'conv' ? 'convention' : category;
      const detailEndpoint = DETAIL_ENDPOINTS[normalizedCategory] || DETAIL_ENDPOINTS.property;
      const response = await getRequest(detailEndpoint(item.id));
      if (requestSession !== chatSessionRef.current) {
        return;
      }
      const details = response?.data?.data || item;
      const sections = buildPropertySections(details, normalizedCategory);
      setMessages(previous => [
        ...previous,
        {
          id: `details-${Date.now()}`,
          sender: 'bot',
          text: response?.success
            ? `Here is a complete section-by-section explanation of ${name}.`
            : `I could not refresh the property, so I’m explaining the details already available for ${name}.`,
          sections,
          detailItem: details,
          category: normalizedCategory,
        },
      ]);
    } finally {
      if (requestSession === chatSessionRef.current) {
        setLoading(false);
      }
    }
  }, [getRequest, loading]);

  useEffect(() => {
    const context = route?.params?.propertyContext;
    const contextKey = context?.item?.id
      ? `${context.category}-${context.item.id}-${context.requestId || ''}`
      : '';
    if (!contextKey || handledPropertyRef.current === contextKey) {
      return;
    }
    handledPropertyRef.current = contextKey;
    explainProperty(context.item, context.category || 'property');
  }, [explainProperty, route?.params?.propertyContext]);

  const handleRequest = useCallback(async text => {
    const cleanText = text.trim();
    if (!cleanText || loading) {
      return;
    }

    if (isBookingRequest(cleanText)) {
      await showBookings(cleanText);
      return;
    }

    const category = getCategory(cleanText);
    const filters = parseFilters(cleanText);
    const requestSession = chatSessionRef.current;
    const userMessage = {id: `user-${Date.now()}`, sender: 'user', text: cleanText};
    setMessages(previous => [...previous, userMessage]);
    setInput('');

    if (!category) {
      setMessages(previous => [
        ...previous,
        {
          id: `support-${Date.now()}`,
          sender: 'bot',
          text: 'This question is outside property search. Please ask ToLetIndia Support for help.',
          action: 'support',
        },
      ]);
      return;
    }

    setLoading(true);

    try {
      const response = await fetchListings(category, cleanText, filters);
      if (requestSession !== chatSessionRef.current) {
        return;
      }
      const results = applyPriceFilter(unpackResults(response), filters);
      const nearby = /near\s*by|nearby|around me|close to me/i.test(cleanText);
      const locationNote = nearby && !currentAddress?.lat
        ? ' I could not find your current location, so these are the latest listings.'
        : '';
      const reply = response?.success
        ? results.length
          ? `I found ${results.length} ${category.label.toLowerCase()} for you.${locationNote} Tap “Explain all details” for a section-by-section summary.`
          : `I could not find any ${category.label.toLowerCase()} right now. Try another option or location.`
        : response?.error || 'I could not load listings. Please try again.';

      setMessages(previous => [
        ...previous,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: reply,
          results,
          category: category.key,
        },
      ]);
    } finally {
      if (requestSession === chatSessionRef.current) {
        setLoading(false);
      }
    }
  }, [currentAddress, fetchListings, loading, showBookings]);

  const restartChat = () => {
    chatSessionRef.current += 1;
    Keyboard.dismiss();
    setInput('');
    setLoading(false);
    setMessages([{...WELCOME_MESSAGE, id: `welcome-${Date.now()}`}]);
  };

  const openDetails = (item, category) => {
    navigation.navigate('PropertyDetail', {
      propertyData: item,
      type: ['convention', 'resort', 'farm'].includes(category)
        ? 'convention'
        : category,
      semiType: category === 'farm' ? 'farm' : category,
    });
  };

  const openMyBookings = () => {
    const parentNavigator = navigation.getParent?.();
    const parentRoutes = parentNavigator?.getState?.()?.routeNames || [];
    if (parentRoutes.includes('My Bookings')) {
      parentNavigator.navigate('My Bookings');
      return;
    }
    navigation.navigate('MyBooking');
  };

  const showMore = category => {
    if (category === 'hotel') {
      navigation.navigate('Hotels');
      return;
    }

    if (category === 'property') {
      navigation.navigate('Home');
      return;
    }

    if (category === 'hostel') {
      navigation.navigate('Hostel');
      return;
    }

    const conventionType = category === 'farm' ? 'farm' : category === 'resort' ? 'resort' : 'conv';
    navigation.navigate('Convention', {type: conventionType});
  };

  const renderMessage = ({item}) => (
    <View style={item.sender === 'user' ? styles.userWrap : styles.botWrap}>
      <View style={item.sender === 'user' ? styles.userBubble : styles.botBubble}>
        <Text style={item.sender === 'user' ? styles.userText : styles.botText}>
          {item.text}
        </Text>
      </View>
      {item.action === 'support' ? (
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Ask ToLetIndia Support"
          style={styles.supportButton}
          onPress={() => navigation.navigate('SupportList')}>
          <Text style={styles.supportButtonText}>Ask Support</Text>
          <Text style={styles.supportButtonArrow}>›</Text>
        </TouchableOpacity>
      ) : null}
      {item.results?.length ? (
        <View style={styles.resultBlock}>
          <FlatList
            horizontal
            data={item.results.slice(0, 5)}
            keyExtractor={(result, index) => `${result?.id || index}`}
            renderItem={({item: result}) => (
              <ResultCard
                item={result}
                onPress={() => openDetails(result, item.category)}
                onExplain={() => explainProperty(result, item.category)}
              />
            )}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.results}
          />
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={`Show all ${item.category} listings`}
            style={styles.showMoreButton}
            onPress={() => showMore(item.category)}>
            <Text style={styles.showMoreText}>Show more</Text>
            <Text style={styles.showMoreArrow}>›</Text>
          </TouchableOpacity>
        </View>
      ) : null}
      {item.sections?.length ? (
        <View style={styles.explanationBlock}>
          {item.sections.map(section => (
            <View key={section.title} style={styles.explanationSection}>
              <Text style={styles.explanationTitle}>{section.title}</Text>
              {section.rows.map((row, index) => (
                <View key={`${row.label}-${index}`} style={styles.explanationRow}>
                  <Text style={styles.explanationLabel}>{row.label}</Text>
                  <Text style={styles.explanationValue}>{row.value}</Text>
                </View>
              ))}
            </View>
          ))}
          <TouchableOpacity
            style={styles.showMoreButton}
            onPress={() => openDetails(item.detailItem, item.category)}>
            <Text style={styles.showMoreText}>Open full property page</Text>
            <Text style={styles.showMoreArrow}>›</Text>
          </TouchableOpacity>
        </View>
      ) : null}
      {item.bookings?.length ? (
        <View style={styles.resultBlock}>
          <FlatList
            horizontal
            data={item.bookings}
            keyExtractor={(booking, index) => `${booking?.id || index}`}
            renderItem={({item: booking}) => (
              <BookingResultCard
                booking={booking}
                onPress={openMyBookings}
              />
            )}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.results}
          />
          <TouchableOpacity
            style={styles.showMoreButton}
            onPress={openMyBookings}>
            <Text style={styles.showMoreText}>Manage all bookings</Text>
            <Text style={styles.showMoreArrow}>›</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={[
          styles.container,
          Platform.OS === 'ios' && {paddingBottom: keyboardHeight},
        ]}
        enabled={Platform.OS !== 'ios'}
        behavior={Platform.OS === 'android' ? 'padding' : undefined}
        keyboardVerticalOffset={0}>
        <View style={styles.header}>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Go back"
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
          <View style={styles.botIcon}><Text style={styles.botIconText}>⌂</Text></View>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>ToLetIndia Assistant</Text>
            <Text style={styles.headerSubtitle}>Uses ToLetIndia listings</Text>
          </View>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Restart chat"
            style={styles.restartButton}
            onPress={restartChat}>
            <Text style={styles.restartIcon}>↻</Text>
            <Text style={styles.restartText}>Restart</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          ref={messageListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.messageList}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
          automaticallyAdjustKeyboardInsets={false}
          onContentSizeChange={() => scrollToLatest(false)}
        />

        <View style={styles.quickArea}>
          <FlatList
            horizontal
            data={[{key: 'bookings', label: 'Show my bookings'}, ...CATEGORIES]}
            keyExtractor={item => item.key}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.chip}
                onPress={() => handleRequest(
                  item.key === 'bookings'
                    ? 'Show my bookings'
                    : `Show me nearby ${item.label}`,
                )}>
                <Text style={styles.chipText}>{item.label}</Text>
              </TouchableOpacity>
            )}
            showsHorizontalScrollIndicator={false}
          />
        </View>

        <View
          style={[
            styles.inputRow,
            keyboardVisible && Platform.OS === 'android' && styles.inputRowKeyboard,
          ]}>
          <TextInput
            value={input}
            onChangeText={setInput}
            onFocus={() => scrollToLatest()}
            onSubmitEditing={() => handleRequest(input)}
            placeholder="Ask for a property..."
            placeholderTextColor="#8A9099"
            returnKeyType="send"
            style={styles.input}
          />
          <TouchableOpacity style={styles.sendButton} onPress={() => handleRequest(input)}>
            {loading ? <ActivityIndicator color="#fff" size="small" /> : <Text style={styles.sendText}>➤</Text>}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default PropertyAssistant;

const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: COLOR.white},
  container: {flex: 1, backgroundColor: '#F7F8FA'},
  header: {height: 68, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', backgroundColor: COLOR.white, borderBottomWidth: 1, borderBottomColor: '#ECEEF2'},
  backButton: {width: 34, height: 42, alignItems: 'flex-start', justifyContent: 'center'},
  backIcon: {fontSize: 36, lineHeight: 38, color: COLOR.black},
  headerText: {flex: 1},
  botIcon: {width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', backgroundColor: COLOR.primary, marginRight: 11},
  botIconText: {fontSize: 24, color: COLOR.white, fontWeight: '700'},
  headerTitle: {fontSize: 17, fontWeight: '700', color: COLOR.black},
  headerSubtitle: {fontSize: 12, color: '#69707D', marginTop: 2},
  restartButton: {height: 34, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', borderRadius: 17, backgroundColor: '#FFF1E8'},
  restartIcon: {fontSize: 19, lineHeight: 20, color: COLOR.primary, marginRight: 4},
  restartText: {fontSize: 12, fontWeight: '700', color: COLOR.primary},
  messageList: {padding: 14, paddingBottom: 20},
  userWrap: {alignItems: 'flex-end', marginBottom: 13},
  botWrap: {alignItems: 'flex-start', marginBottom: 13},
  userBubble: {maxWidth: '82%', paddingHorizontal: 14, paddingVertical: 11, borderRadius: 18, borderBottomRightRadius: 4, backgroundColor: COLOR.primary},
  botBubble: {maxWidth: '86%', paddingHorizontal: 14, paddingVertical: 11, borderRadius: 18, borderBottomLeftRadius: 4, backgroundColor: COLOR.white, borderWidth: 1, borderColor: '#E7E9ED'},
  userText: {fontSize: 15, lineHeight: 21, color: COLOR.white},
  botText: {fontSize: 15, lineHeight: 21, color: COLOR.black},
  results: {paddingTop: 10, paddingRight: 12},
  resultBlock: {width: '100%'},
  card: {width: 210, marginRight: 10, borderRadius: 13, overflow: 'hidden', backgroundColor: COLOR.white, borderWidth: 1, borderColor: '#E7E9ED'},
  cardImage: {width: '100%', height: 105, backgroundColor: '#ECEEF2'},
  cardContent: {padding: 10},
  cardTitle: {fontSize: 14, fontWeight: '700', color: COLOR.black},
  cardLocation: {fontSize: 12, color: '#69707D', lineHeight: 17, marginTop: 5},
  cardPrice: {fontSize: 14, color: COLOR.primary, fontWeight: '700', marginTop: 6},
  cardActions: {flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#ECEEF2'},
  cardAction: {flex: 1, minHeight: 38, paddingHorizontal: 7, alignItems: 'center', justifyContent: 'center', borderRightWidth: 1, borderRightColor: '#ECEEF2'},
  cardActionText: {fontSize: 11, color: COLOR.primary, fontWeight: '700', textAlign: 'center'},
  bookingCard: {width: 286, marginRight: 10, padding: 13, borderRadius: 13, backgroundColor: COLOR.white, borderWidth: 1, borderColor: '#E7E9ED'},
  bookingVenue: {fontSize: 15, lineHeight: 20, fontWeight: '700', color: COLOR.black, marginBottom: 8},
  bookingRow: {flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 4, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#ECEEF2'},
  bookingLabel: {width: 105, paddingRight: 7, fontSize: 11, lineHeight: 16, color: '#69707D', fontWeight: '600'},
  bookingValue: {flex: 1, fontSize: 12, lineHeight: 16, color: COLOR.black},
  manageBooking: {fontSize: 12, color: COLOR.primary, fontWeight: '700', marginTop: 10},
  explanationBlock: {width: '100%', marginTop: 9},
  explanationSection: {width: '100%', padding: 12, marginBottom: 9, borderRadius: 12, backgroundColor: COLOR.white, borderWidth: 1, borderColor: '#E7E9ED'},
  explanationTitle: {fontSize: 14, fontWeight: '700', color: COLOR.primary, marginBottom: 7},
  explanationRow: {paddingVertical: 5, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#ECEEF2'},
  explanationLabel: {fontSize: 11, lineHeight: 15, fontWeight: '700', color: '#69707D'},
  explanationValue: {fontSize: 13, lineHeight: 19, color: COLOR.black, marginTop: 2},
  showMoreButton: {alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', marginTop: 10, paddingHorizontal: 14, height: 38, borderRadius: 19, backgroundColor: COLOR.primary},
  showMoreText: {fontSize: 13, fontWeight: '700', color: COLOR.white},
  showMoreArrow: {fontSize: 22, lineHeight: 23, marginLeft: 6, color: COLOR.white},
  supportButton: {flexDirection: 'row', alignItems: 'center', marginTop: 8, paddingHorizontal: 14, height: 38, borderRadius: 19, backgroundColor: COLOR.primary},
  supportButtonText: {fontSize: 13, fontWeight: '700', color: COLOR.white},
  supportButtonArrow: {fontSize: 22, lineHeight: 23, marginLeft: 6, color: COLOR.white},
  quickArea: {paddingVertical: 9, paddingLeft: 12, borderTopWidth: 1, borderTopColor: '#ECEEF2', backgroundColor: COLOR.white},
  chip: {paddingHorizontal: 13, paddingVertical: 8, marginRight: 8, borderRadius: 18, backgroundColor: '#FFF1E8', borderWidth: 1, borderColor: '#FFD7BF'},
  chipText: {fontSize: 13, color: COLOR.primary, fontWeight: '600'},
  inputRow: {paddingHorizontal: 12, paddingVertical: 9, flexDirection: 'row', alignItems: 'center', backgroundColor: COLOR.white},
  inputRowKeyboard: {marginBottom: 28},
  input: {flex: 1, height: 44, borderRadius: 22, paddingHorizontal: 16, color: COLOR.black, backgroundColor: '#F1F3F5'},
  sendButton: {width: 44, height: 44, borderRadius: 22, marginLeft: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: COLOR.primary},
  sendText: {fontSize: 20, color: COLOR.white, marginLeft: 2},
});
