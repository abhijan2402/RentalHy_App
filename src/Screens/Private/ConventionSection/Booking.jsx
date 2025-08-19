import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import {Calendar} from 'react-native-calendars';
import Header from '../../../Components/FeedHeader';
import {COLOR} from '../../../Constants/Colors';
import CustomButton from '../../../Components/CustomButton';

const Booking = ({navigation}) => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [altMobile, setAltMobile] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [attendees, setAttendees] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [dayTime, setDayTime] = useState('both');
  const [catering, setCatering] = useState('no');
  const [chef, setChef] = useState('no');
  const [decorations, setDecorations] = useState('no');
  const [groceries, setGroceries] = useState('no');

  const today = new Date().toISOString().split('T')[0]; // today's date in YYYY-MM-DD

  const handleBooking = () => {
    if (
      !name ||
      !mobile ||
      !address ||
      !pincode ||
      !attendees ||
      !selectedDate
    ) {
      alert('Please fill all required fields!');
      return;
    }
    const summary = `
Booking Confirmed!
Name: ${name}
Mobile: ${mobile}
Alt Mobile: ${altMobile || 'N/A'}
Address: ${address}
Pincode: ${pincode}
Attendees: ${attendees}
Date: ${selectedDate}
Event Time: ${dayTime.toUpperCase()}
Catering: ${catering.toUpperCase()}
Chef: ${chef.toUpperCase()}
Decorations: ${decorations.toUpperCase()}
Groceries: ${groceries.toUpperCase()}
    `;
    alert(summary);
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

        {/* Address */}
        <View style={styles.section}>
          <Text style={styles.label}>Address</Text>
          <TextInput
            style={[styles.input, {height: 80, textAlignVertical: 'top'}]}
            placeholder="Enter full address"
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

        {/* Number of Attendees */}
        <View style={styles.section}>
          <Text style={styles.label}>Number of Attendees</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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
          </ScrollView>
        </View>

        {/* Calendar Date Picker */}
        <View style={styles.section}>
          <Text style={styles.label}>Select Booking Date</Text>
          <Calendar
            minDate={today}
            onDayPress={day => {
              setSelectedDate(day.dateString);
            }}
            markedDates={{
              [selectedDate]: {
                selected: true,
                marked: true,
                selectedColor: COLOR.primary || '#007AFF',
              },
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
            {['day', 'night', 'both'].map(option => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.toggleBtn,
                  dayTime === option && styles.selectedBtn,
                ]}
                onPress={() => setDayTime(option)}>
                <Text
                  style={[
                    styles.toggleText,
                    dayTime === option && styles.selectedText,
                  ]}>
                  {option.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Catering */}
        <View style={styles.section}>
          <Text style={styles.label}>Catering Needed?</Text>
          <View style={styles.toggleRow}>
            {['yes', 'no'].map(option => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.toggleBtn,
                  catering === option && styles.selectedBtn,
                ]}
                onPress={() => setCatering(option)}>
                <Text
                  style={[
                    styles.toggleText,
                    catering === option && styles.selectedText,
                  ]}>
                  {option.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Chef */}
        <View style={styles.section}>
          <Text style={styles.label}>Chef Needed?</Text>
          <View style={styles.toggleRow}>
            {['yes', 'no'].map(option => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.toggleBtn,
                  chef === option && styles.selectedBtn,
                ]}
                onPress={() => setChef(option)}>
                <Text
                  style={[
                    styles.toggleText,
                    chef === option && styles.selectedText,
                  ]}>
                  {option.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Decorations */}
        <View style={styles.section}>
          <Text style={styles.label}>Decorations Needed?</Text>
          <View style={styles.toggleRow}>
            {['yes', 'no'].map(option => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.toggleBtn,
                  decorations === option && styles.selectedBtn,
                ]}
                onPress={() => setDecorations(option)}>
                <Text
                  style={[
                    styles.toggleText,
                    decorations === option && styles.selectedText,
                  ]}>
                  {option.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Groceries */}
        <View style={styles.section}>
          <Text style={styles.label}>Groceries Needed?</Text>
          <View style={styles.toggleRow}>
            {['yes', 'no'].map(option => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.toggleBtn,
                  groceries === option && styles.selectedBtn,
                ]}
                onPress={() => setGroceries(option)}>
                <Text
                  style={[
                    styles.toggleText,
                    groceries === option && styles.selectedText,
                  ]}>
                  {option.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Book Now Button */}
      <CustomButton title={'Book Now'} onPress={handleBooking} />
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
