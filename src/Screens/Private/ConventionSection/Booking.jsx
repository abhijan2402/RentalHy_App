import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Calendar} from 'react-native-calendars';
import Header from '../../../Components/FeedHeader';
import {COLOR} from '../../../Constants/Colors';
import CustomButton from '../../../Components/CustomButton';
import {useApi} from '../../../Backend/Api';
import {useToast} from '../../../Constants/ToastContext';
import RazorpayCheckout from 'react-native-razorpay';

const Booking = ({navigation, route}) => {
  const {postRequest , getRequest} = useApi();
  const {showToast} = useToast();
  const {propertyData} = route?.params;
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
    formData.append('catering_needed', catering === 'yes' ? 1 : 0);
    formData.append('chef_needed', chef === 'yes' ? 1 : 0);
    formData.append('decore_needed', decorations === 'yes' ? 1 : 0);
    formData.append('groceries_needed', groceries === 'yes' ? 1 : 0);
    formData.append('photograper_needed', PhotographersReq === 'yes' ? 1 : 0);
    formData.append('comment', comments);
    formData.append('amount', amount);
    if (address?.lat) formData.append('lat', address?.lat);
    if (address?.lng) formData.append('lng', address?.lng);

    try {
      const res = await postRequest(
        'public/api/book-property/create-order',
        formData,
        true,
      );
      setButtonLoader(false);

      if (res?.data?.status || res?.data?.success === true) {
        showToast('Booking successful! Proceeding to payment...', 'success');
        const {order_id, razorpay_key} = res.data;

        console.log('Order ID:', order_id, 'Key:', razorpay_key);

        if (!order_id || !razorpay_key) {
          showToast('Payment setup failed. Missing order details.', 'error');
          return;
        }

        const options = {
          description: 'Booking Payment',
          image: 'https://your-logo-url.png',
          currency: 'INR',
          key: razorpay_key,
          amount: amount * 100,
          name: name,
          order_id: order_id,
          prefill: {
            name: 'AJ Jan',
            email: 'abhishek.jangid741@gmail.com',
            contact: '7976114258' || '',
          },
          theme: {color: '#53a20e'},
        };

        try {
          const paymentData = await RazorpayCheckout.open(options).then(
            data => {
              try {
                const form = new FormData();
                form.append('razorpay_order_id', data?.razorpay_order_id);
                form.append('razorpay_payment_id', data?.razorpay_payment_id);
                form.append('razorpay_signature', data?.razorpay_signature);

                postRequest('public/api/property/verify-payment', form, true)
                  .then(verifyRes => {
                    if (
                      verifyRes?.data?.status ||
                      verifyRes?.data?.success === 'success'
                    ) {
                      console.log('Payment verified:', verifyRes.data);
                      showToast('Payment successful and verified!', 'success');
                      navigation?.goBack();
                    } else {
                      showToast(
                        'Payment verification failed. Please contact support.',
                        'error',
                      );
                    }
                  })
                  .catch(verifyErr => {
                    console.error('Payment verification error:', verifyErr);
                    showToast(
                      'Payment verification error. Please contact support.',
                      'error',
                    );
                  });
              } catch (error) {
                console.error('Payment verification error:', error);
              }
            },
          );
          console.log('Payment success:', paymentData);
          // navigation?.goBack();
        } catch (error) {
          console.error('Payment failed:', error);
          showToast('Payment failed. Please try again.', 'error');
        }
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
        const dates = res.data.data.convention_hall.dates;
        const marked = {};
        Object.keys(dates).forEach(date => {
          marked[formatDateToISO(date)] = {disabled: true, marked: true, dotColor: 'red'};
        });
        setAllDates(dates);
      } else {
        showToast('Failed to fetch hall timings', 'error');
      }
    } catch (err) {
      console.error('Error fetching timings:', err);
      showToast('Error fetching timings', 'error');
    }
  };

   const formatDateToISO = date => {
    const [d, m, y] = date.split('/');
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  };

  const handleDateSelect = date => {
    setSelectedDate(date.dateString);
    const apiDate = Object.keys(allDates).find(
      d => formatDateToISO(d) === date.dateString,
    );
    if (apiDate) {
      const slots = allDates[apiDate].split(','); 
      setDisabledSlots(slots.map(s => s.toLowerCase())); 
    } else {
      setDisabledSlots([]);
    }
  };

  useEffect(() => {
      fetchHallTimings(propertyData);
    }, [propertyData]);

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <Header
        title={'Book Now'}
        showBack
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={{paddingBottom: 100}}>
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
          {/* <GooglePlacePicker
            placeholder="Select Address"
            onPlaceSelected={setAddress}
          /> */}
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

        {/* Calendar Date Picker */}
        <View style={styles.section}>
          <Text style={styles.label}>Select Booking Date</Text>
           <Calendar
            minDate={today}
            onDayPress={handleDateSelect}
            markedDates={{
              ...Object.keys(allDates).reduce((acc, d) => {
                acc[formatDateToISO(d)] = {disabled: false, marked: true, dotColor: 'red'};
                return acc;
              }, {}),
              [selectedDate]: {selected: true, selectedColor: COLOR.primary || '#007AFF'},
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
    {['day', 'night', 'full day'].map(option => {
      // Logic for conditional disabling
      const isFullDayDisabled = disabledSlots.includes('full day');
      const isDayOrNightDisabled =
        disabledSlots.includes('day') || disabledSlots.includes('night');

      // If "full day" is disabled → all options disabled
      // If "day" or "night" is disabled → "full day" also disabled
      const shouldDisable =
        isFullDayDisabled ||
        disabledSlots.includes(option) ||
        (option === 'full day' && isDayOrNightDisabled);

      return (
        <TouchableOpacity
          key={option}
          style={[
            styles.toggleBtn,
            dayTime === option && styles.selectedBtn,
            shouldDisable && {backgroundColor: '#ddd', borderColor: '#ccc'},
          ]}
          disabled={shouldDisable}
          onPress={() => setDayTime(option)}
        >
          <Text
            style={[
              styles.toggleText,
              dayTime === option && styles.selectedText,
              shouldDisable && {color: '#999'},
            ]}
          >
            {option.toUpperCase()}
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
  section: {marginVertical: 10, paddingHorizontal: 20},
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
});
