import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import Header from '../../../Components/FeedHeader';
import {COLOR} from '../../../Constants/Colors';
import CustomButton from '../../../Components/CustomButton';

const Booking = ({navigation}) => {
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [altPhone, setAltPhone] = useState('');
  const [attendees, setAttendees] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  // Generate months from current → December
  const currentMonthIndex = new Date().getMonth(); // 0 = Jan
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
  ].slice(currentMonthIndex);

  // Dummy available dates (1-7 days for example)
  const dates = ['17', '18', '19', '20', '21', '22', '23'];

  // Dummy available times
  const times = [
    '10:00 - 11:00',
    '11:00 - 12:00',
    '12:00 - 01:00',
    '02:00 - 03:00',
    '03:00 - 04:00',
  ];

  const handleBooking = () => {
    if (
      !address ||
      !pincode ||
      !selectedMonth ||
      !selectedDate ||
      !selectedTime ||
      !attendees
    ) {
      alert('Please fill all required fields!');
      return;
    }
    alert(
      `Booking Confirmed!\nAddress: ${address}\nPincode: ${pincode}\nAlt Phone: ${
        altPhone || 'N/A'
      }\nAttendees: ${attendees}\nMonth: ${selectedMonth}\nDate: ${selectedDate}\nTime: ${selectedTime}`,
    );
    // Later send API request here
  };

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <Header
        title={'Book Now'}
        showBack
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={{paddingBottom: 100}}>
        {/* Address */}
        <View style={styles.section}>
          <Text style={styles.label}>Customer Address</Text>
          <TextInput
            style={[styles.input, {height: 80, textAlignVertical: 'top'}]}
            placeholder="Enter your full address"
            value={address}
            onChangeText={setAddress}
            multiline
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

        {/* Alternative Phone */}
        <View style={styles.section}>
          <Text style={styles.label}>Alternative Phone (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter alternative phone"
            value={altPhone}
            onChangeText={setAltPhone}
            keyboardType="phone-pad"
          />
        </View>

        {/* Number of Attendees */}
        <View style={styles.section}>
          <Text style={styles.label}>Number of Attendees</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter number of attendees"
            value={attendees}
            onChangeText={setAttendees}
            keyboardType="numeric"
          />
        </View>

        {/* Month Selection */}
        <View style={styles.section}>
          <Text style={styles.label}>Select Month</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {months.map(m => (
              <TouchableOpacity
                key={m}
                style={[
                  styles.dateBox,
                  selectedMonth === m && styles.selectedBox,
                ]}
                onPress={() => {
                  setSelectedMonth(m);
                  setSelectedDate(null); // reset date when month changes
                }}>
                <Text
                  style={[
                    styles.dateText,
                    selectedMonth === m && styles.selectedText,
                  ]}>
                  {m}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Date Selection */}
        {selectedMonth && (
          <View style={styles.section}>
            <Text style={styles.label}>Select Date</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {dates.map(d => (
                <TouchableOpacity
                  key={d}
                  style={[
                    styles.dateBox,
                    selectedDate === d && styles.selectedBox,
                  ]}
                  onPress={() => setSelectedDate(d)}>
                  <Text
                    style={[
                      styles.dateText,
                      selectedDate === d && styles.selectedText,
                    ]}>
                    {d}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Time Selection */}
        {selectedDate && (
          <View style={styles.section}>
            <Text style={styles.label}>Select Time</Text>
            <View style={styles.timeContainer}>
              {times.map(t => (
                <TouchableOpacity
                  key={t}
                  style={[
                    styles.timeBox,
                    selectedTime === t && styles.selectedBox,
                  ]}
                  onPress={() => setSelectedTime(t)}>
                  <Text
                    style={[
                      styles.timeText,
                      selectedTime === t && styles.selectedText,
                    ]}>
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Book Now Button */}
      <CustomButton title={'Book Now'} onPress={handleBooking} />
    </View>
  );
};

export default Booking;

const styles = StyleSheet.create({
  section: {
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
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
  dateText: {
    fontSize: 14,
    color: '#333',
  },
  timeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  timeBox: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
    marginRight: 10,
    marginBottom: 10,
  },
  timeText: {
    fontSize: 14,
    color: '#333',
  },
  selectedBox: {
    backgroundColor: COLOR.primary || '#007AFF',
    borderColor: COLOR.primary || '#007AFF',
  },
  selectedText: {
    color: '#fff',
    fontWeight: '600',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
  bookBtn: {
    backgroundColor: COLOR.primary || '#007AFF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  bookBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
