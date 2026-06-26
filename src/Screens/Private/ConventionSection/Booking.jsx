import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Calendar } from 'react-native-calendars';
import Header from '../../../Components/FeedHeader';
import { COLOR } from '../../../Constants/Colors';
import CustomButton from '../../../Components/CustomButton';
import { useApi } from '../../../Backend/Api';
import { useToast } from '../../../Constants/ToastContext';
import RazorpayCheckout from 'react-native-razorpay';

const ADVANCE_PAYMENT_MESSAGE =
  '⚠️ Your booking is not confirmed until the advance payment is successfully made to the vendor. Please contact the number above to proceed with the payment and secure your booking';

const Booking = ({ navigation, route }) => {
  const { postRequest, getRequest } = useApi();
  const { showToast } = useToast();
  const { propertyData, bookingData } = route?.params;
  const [name, setName] = useState('');
  const [buttonLoader, setButtonLoader] = useState(false);
  const [mobile, setMobile] = useState('');
  const [amount, setAmount] = useState('');
  const [altMobile, setAltMobile] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [attendees, setAttendees] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [dayTime, setDayTime] = useState('day');
  const [catering, setCatering] = useState('no');
  const [chef, setChef] = useState('no');
  const [decorations, setDecorations] = useState('no');
  const [groceries, setGroceries] = useState('no');
  const [PhotographersReq, setPhotographersReq] = useState('no');
  const [comments, setComments] = useState('');
  const [disabledSlots, setDisabledSlots] = useState([]);
  const [allDates, setAllDates] = useState({});

  const today = new Date().toISOString().split('T')[0];
  const [additionalAmount, setadditionalAmount] = useState(0);

  const parseDates = dates => {
    if (!dates) return {};

    if (typeof dates === 'string') {
      try {
        return JSON.parse(dates);
      } catch (error) {
        return {};
      }
    }

    return typeof dates === 'object' ? dates : {};
  };

  const parseArray = value => {
    if (!value) return [];

    if (Array.isArray(value)) return value;

    if (typeof value === 'string') {
      try {
        const parsedValue = JSON.parse(value);
        return Array.isArray(parsedValue) ? parsedValue : [];
      } catch (error) {
        return [];
      }
    }

    return [];
  };

  const isDateKey = date => {
    return /^\d{2}\/\d{2}\/\d{4}$/.test(date) || /^\d{4}-\d{2}-\d{2}$/.test(date);
  };

  const addUnavailableSlot = (dates, date, slot) => {
    if (!isDateKey(date) || !slot) return;

    const existingSlots = dates[date]
      ? String(dates[date]).split(',').map(item => item.trim()).filter(Boolean)
      : [];
    const nextSlot = String(slot).trim();

    if (!existingSlots.some(item => item.toLowerCase() === nextSlot.toLowerCase())) {
      dates[date] = [...existingSlots, nextSlot].join(',');
    }
  };

  const getBookedSlots = dateData => {
    const slotTimes = parseArray(dateData?.slots)
      ?.filter(slot => String(slot?.status || '').toLowerCase() === 'booked')
      ?.map(slot => slot?.event_time)
      ?.filter(Boolean);

    return slotTimes?.length ? slotTimes : [dateData?.event_time].filter(Boolean);
  };

  const getUnavailableDates = (dates, availabilitySummary, datesData) => {
    const parsedDates = parseDates(dates);
    const bookedDateRecords = [];
    const unavailableDates = Object.entries(parsedDates).reduce((acc, [date, value]) => {
      if (isDateKey(date) && typeof value === 'string') {
        acc[date] = value;
      }

      if (typeof value === 'object' && value?.date) {
        bookedDateRecords.push(value);
      }

      return acc;
    }, {});

    [...bookedDateRecords, ...parseArray(datesData)].forEach(dateData => {
      getBookedSlots(dateData).forEach(slot => {
        addUnavailableSlot(unavailableDates, dateData?.date, slot);
      });
    });

    availabilitySummary?.booked_dates_list?.forEach(date => {
      if (isDateKey(date) && !unavailableDates[date]) {
        unavailableDates[date] = 'full_day';
      }
    });

    return unavailableDates;
  };

  const getRestrictedSlotsForSelectedDate = date => {
    const apiDate = Object.keys(allDates).find(
      d => formatDateToISO(d) === date,
    );

    return apiDate ? getSlotsForDate(allDates[apiDate]) : [];
  };

  const isSlotRestricted = (slot, restrictedSlots) => {
    const isFullDayBooked = restrictedSlots.includes('full_day');
    const isDayOrNightBooked =
      restrictedSlots.includes('day') || restrictedSlots.includes('night');

    return (
      isFullDayBooked ||
      restrictedSlots.includes(slot) ||
      (slot === 'full_day' && isDayOrNightBooked)
    );
  };

  const handleBooking = async () => {
    if (
      !name ||
      !mobile ||
      !address ||
      !pincode ||
      !attendees ||
      !selectedDate ||
      !dayTime ||
      !amount
    ) {
      showToast('Please fill all required fields.', 'error');
      return;
    }

    const restrictedSlots = getRestrictedSlotsForSelectedDate(selectedDate);
    if (isSlotRestricted(dayTime, restrictedSlots)) {
      showToast('Selected date/time is already booked.', 'error');
      return;
    }

    setButtonLoader(true);
    const formData = new FormData();
    formData.append('full_name', name);
    formData.append('mobail_number', mobile);
    formData.append('alt_number', altMobile);
    formData.append('address', address?.address || '');
    formData.append('pin_code', pincode);
    formData.append('number_of_attendess', attendees);
    formData.append('booking_date', selectedDate);
    formData.append('event_time', dayTime);
    formData.append('property_id', route?.params?.propertyData || '');
    formData.append('comment', comments);
    formData.append('customer_confirmation_note', ADVANCE_PAYMENT_MESSAGE);
    if (additionalAmount) {
      formData.append('amount', Number(additionalAmount) + Number(amount));
    } else {
      formData.append('amount', Number(amount));
    }
    if (additionalAmount)
      formData.append('additional_amount', additionalAmount);
    if (address?.lat) formData.append('lat', address?.lat);
    if (address?.lng) formData.append('lng', address?.lng);
    formData.append('payment_method', "offline");


    try {
      const res = await postRequest(
        'public/api/book-property/create-order',
        formData,
        true,
      );
      setButtonLoader(false);
      console.log(res, "resssssss");

      if (res?.success === true || res?.data?.status === 'success') {
        showToast(
          'Your booking will Confirm Shortly, Thanks for using To-let india.',
          'success',
        );

        navigation?.goBack();
        return;
      } else {
        showToast('Booking failed. Please try again.', 'error');
      }
    } catch (err) {
      setButtonLoader(false);
      console.error('Booking API error:', err);
      showToast('An error occurred. Please try again.', 'error');
    }
  };

  const fetchHallTimings = async (id) => {
    try {
      const res = await getRequest(`public/api/hall-timings/${id}`);
      if (res?.data?.status) {
        const hallData = res.data.data.convention_hall;
        const datesData = [
          ...parseArray(hallData?.dates_data),
          ...parseArray(res.data.data.dates_data),
          ...parseArray(bookingData?.dates_data),
        ];
        const dates = getUnavailableDates(
          hallData?.dates || bookingData?.dates,
          hallData?.availability_summary || res.data.data.availability_summary || bookingData?.availability_summary,
          datesData,
        );
        console.log(res.data.data.convention_hall.dates, "OOOOOOO");
        console.log(dates,"DAESSSSS");
        
        setAllDates(dates);
      } else {
        showToast('Failed to fetch hall timings', 'error');
      }
    } catch (err) {
      console.error('Error fetching timings:', err);
      // showToast('Error fetching timings', 'error');
    }
  };

  const formatDateToISO = date => {
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return date;
    }

    const [d, m, y] = date.split('/');
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  };

  const normalizeSlot = slot =>
    slot?.trim()?.toLowerCase()?.replace(/\s+/g, '_');

  const getSlotsForDate = value => {
    return String(value || '')
      .split(',')
      .map(normalizeSlot)
      .filter(Boolean);
  };

  const isFullyUnavailable = value => {
    const slots = getSlotsForDate(value);
    return slots.includes('full_day') || slots.includes('booked');
  };

  const handleDateSelect = date => {
    setSelectedDate(date.dateString);
    const apiDate = Object.keys(allDates).find(
      d => formatDateToISO(d) === date.dateString,
    );
    if (apiDate) {
      setDisabledSlots(getSlotsForDate(allDates[apiDate]));
    } else {
      setDisabledSlots([]);
    }
  };

  useEffect(() => {
    if (!disabledSlots.length) return;

    if (isSlotRestricted(dayTime, disabledSlots)) {
      const availableSlot = ['day', 'night', 'full_day'].find(option => {
        return !isSlotRestricted(option, disabledSlots);
      });

      if (availableSlot) {
        setDayTime(availableSlot);
      }
    }
  }, [disabledSlots, dayTime]);

  useEffect(() => {
    fetchHallTimings(propertyData);
  }, [propertyData]);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header
        title={'Book Now'}
        showBack
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Name */}
        <View style={styles.section}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter full name"
            value={name}
            onChangeText={setName}
          />
        </View>

        {/* Mobile */}
        <View style={styles.section}>
          <Text style={styles.label}>Mobile Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter mobile number"
            value={mobile}
            onChangeText={setMobile}
            keyboardType="phone-pad"
            autoComplete="off"
            textContentType="none"
            importantForAutofill="no"
          />
        </View>

        {/* Alt Mobile */}
        <View style={styles.section}>
          <Text style={styles.label}>Alternate Mobile Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter alternate mobile"
            value={altMobile}
            onChangeText={setAltMobile}
            keyboardType="phone-pad"
            autoComplete="off"
            textContentType="none"
            importantForAutofill="no"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Amount</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter amount"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />
        </View>

        {/* Address */}
        <View style={styles.section}>
          <Text style={styles.label}>Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Address"
            value={address}
            onChangeText={setAddress}
            multiline
            textAlignVertical="top"
          />
        </View>

        {/* Pincode */}
        <View style={styles.section}>
          <Text style={styles.label}>Pincode</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter pincode"
            value={pincode}
            onChangeText={setPincode}
            keyboardType="numeric"
            maxLength={6}
          />
        </View>

        {/* Number of Attendees */}
        <View style={styles.section}>
          <Text style={styles.label}>Number of Attendees</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Number"
            value={attendees}
            onChangeText={setAttendees}
            keyboardType="numeric"
            maxLength={6}
            autoComplete="off"
            textContentType="none"
            importantForAutofill="no"
          />
          {/* <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {Array.from({length: 20}, (_, i) => (i + 1) * 100).map(num => (
              <TouchableOpacity
                key={num}
                style={[
                  styles.dateBox,
                  attendees === String(num) && styles.selectedBox,
                ]}
                onPress={() => setAttendees(String(num))}>
                <Text
                  style={[
                    styles.dateText,
                    attendees === String(num) && styles.selectedText,
                  ]}>
                  {num}+
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView> */}
        </View>
        {/* <View style={styles.section}>
          <Text style={styles.label}>Any Additional Amount (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Additional Amount"
            value={additionalAmount}
            keyboardType="numeric"
            onChangeText={setadditionalAmount}
          />
        </View> */}
        {/* Calendar Date Picker */}
        <View style={styles.section}>
          <Text style={styles.label}>Select Booking Date</Text>
          <Calendar
            minDate={today}
            onDayPress={handleDateSelect}
            markedDates={{
              ...Object.keys(allDates).reduce((acc, d) => {
                const disabled = isFullyUnavailable(allDates[d]);
                acc[formatDateToISO(d)] = {
                  disabled,
                  disableTouchEvent: disabled,
                  marked: true,
                  dotColor: 'red',
                };
                return acc;
              }, {}),
              [selectedDate]: { selected: true, selectedColor: COLOR.primary || '#007AFF' },
            }}
            theme={{
              todayTextColor: COLOR.primary || '#007AFF',
              selectedDayBackgroundColor: COLOR.primary || '#007AFF',
              arrowColor: COLOR.primary || '#007AFF',
            }}
          />
        </View>

        {/* Event Time Filter */}
        <View style={styles.section}>
          <Text style={styles.label}>Event Time</Text>
          <View style={styles.toggleRow}>
            {['day', 'night', 'full_day'].map(option => {
              const shouldDisable = isSlotRestricted(option, disabledSlots);

              return (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.toggleBtn,
                    dayTime === option && styles.selectedBtn,
                    shouldDisable && { backgroundColor: '#ddd', borderColor: '#ccc' },
                  ]}
                  disabled={shouldDisable}
                  onPress={() => setDayTime(option)}
                >
                  <Text
                    style={[
                      styles.toggleText,
                      dayTime === option && styles.selectedText,
                      shouldDisable && { color: '#999' },
                    ]}
                  >
                    {option.replace('_', ' ').toUpperCase()}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>


      </ScrollView>

      {/* Book Now Button */}
      <CustomButton
        title={'Book Now'}
        onPress={handleBooking}
        loading={buttonLoader}
      />
    </View>
  );
};

export default Booking;

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
  dateText: { fontSize: 14, color: '#333' },
  selectedBox: {
    backgroundColor: COLOR.primary || '#007AFF',
    borderColor: COLOR.primary || '#007AFF',
  },
  selectedText: { color: '#fff', fontWeight: '600' },
  toggleRow: { flexDirection: 'row', marginTop: 10 },
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
  toggleText: { fontSize: 14, color: '#333' },
});
