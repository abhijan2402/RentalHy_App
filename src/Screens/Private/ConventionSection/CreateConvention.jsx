import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import Header from '../../../Components/FeedHeader';
import {COLOR} from '../../../Constants/Colors';
import ImagePicker from 'react-native-image-crop-picker';
import CustomButton from '../../../Components/CustomButton';

// Months list from current month to December
const getRemainingMonths = () => {
  const now = new Date();
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
  return months.slice(now.getMonth()); // from current month to Dec
};

const CreateConvention = ({navigation}) => {
  const [images, setImages] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [priceType, setPriceType] = useState('hourly'); // hourly | daily
  const [capacity, setCapacity] = useState('');

  // Availability
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [availability, setAvailability] = useState([]);

  const months = getRemainingMonths();
  const dates = Array.from({length: 31}, (_, i) => (i + 1).toString());
  const times = [
    '10:00 - 11:00',
    '11:00 - 12:00',
    '12:00 - 01:00',
    '01:00 - 02:00',
    '02:00 - 03:00',
    '03:00 - 04:00',
  ];

  // Pick images
  const pickImage = () => {
    ImagePicker.openPicker({
      multiple: true,
      cropping: true,
      compressImageQuality: 0.8,
    })
      .then(res => {
        const newImgs = res.map(img => ({uri: img.path}));
        setImages(prev => [...prev, ...newImgs]);
      })
      .catch(err => console.log(err));
  };

  const removeImage = index => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  // Add Availability
  const addAvailability = () => {
    if (!selectedMonth || !selectedDate || !selectedTime) return;

    const newEntry = {
      month: selectedMonth,
      date: selectedDate,
      time: selectedTime,
    };

    // ✅ Prevent duplicate date+time slot
    const exists = availability.some(
      item =>
        item.month === newEntry.month &&
        item.date === newEntry.date &&
        item.time === newEntry.time,
    );

    if (!exists) {
      setAvailability(prev => [...prev, newEntry]);
    } else {
      alert('This date & time slot is already selected!');
    }
  };

  const removeAvailability = index => {
    setAvailability(prev => prev.filter((_, i) => i !== index));
  };

  const postSpace = () => {
    // Collect all form data here
    const payload = {
      title,
      description,
      price,
      priceType,
      capacity,
      availability,
      images,
    };
    console.log('POST SPACE DATA:', payload);
    alert('Space posted successfully!');
  };

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <Header
        title={'Create Space'}
        showBack
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={{paddingBottom: 100}}>
        {/* Upload Images */}
        <View style={styles.section}>
          <Text style={styles.label}>Upload Images *</Text>
          <View style={styles.imageContainer}>
            {images.map((img, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image source={{uri: img.uri}} style={styles.image} />
                <TouchableOpacity
                  style={styles.removeBtn}
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
            <TouchableOpacity style={styles.addImageBox} onPress={pickImage}>
              <Text style={{fontSize: 28, color: COLOR.primary || '#007AFF'}}>
                +
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Title */}
        <View style={styles.section}>
          <Text style={styles.label}>Title *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter title"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[styles.input, {height: 80, textAlignVertical: 'top'}]}
            placeholder="Enter description"
            multiline
            value={description}
            onChangeText={setDescription}
          />
        </View>

        {/* Price */}
        <View style={styles.section}>
          <Text style={styles.label}>Price *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter price"
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
          />
          <View style={styles.toggleRow}>
            <TouchableOpacity
              style={[
                styles.toggleBtn,
                priceType === 'hourly' && styles.selectedBtn,
              ]}
              onPress={() => setPriceType('hourly')}>
              <Text
                style={[
                  styles.toggleText,
                  priceType === 'hourly' && styles.selectedText,
                ]}>
                Hourly
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleBtn,
                priceType === 'daily' && styles.selectedBtn,
              ]}
              onPress={() => setPriceType('daily')}>
              <Text
                style={[
                  styles.toggleText,
                  priceType === 'daily' && styles.selectedText,
                ]}>
                Per Day
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Capacity */}
        <View style={styles.section}>
          <Text style={styles.label}>Capacity *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter capacity"
            keyboardType="numeric"
            value={capacity}
            onChangeText={setCapacity}
          />
        </View>

        {/* Availability Selection */}
        <View style={styles.section}>
          <Text style={styles.label}>Select Availability *</Text>

          {/* Month */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {months.map((m, idx) => (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.chip,
                  selectedMonth === m && styles.chipSelected,
                ]}
                onPress={() => setSelectedMonth(m)}>
                <Text
                  style={[
                    styles.chipText,
                    selectedMonth === m && styles.chipTextSelected,
                  ]}>
                  {m}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Dates */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {dates.map((d, idx) => (
              <TouchableOpacity
                key={idx}
                style={[styles.chip, selectedDate === d && styles.chipSelected]}
                onPress={() => setSelectedDate(d)}>
                <Text
                  style={[
                    styles.chipText,
                    selectedDate === d && styles.chipTextSelected,
                  ]}>
                  {d}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Times */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {times.map((t, idx) => (
              <TouchableOpacity
                key={idx}
                style={[styles.chip, selectedTime === t && styles.chipSelected]}
                onPress={() => setSelectedTime(t)}>
                <Text
                  style={[
                    styles.chipText,
                    selectedTime === t && styles.chipTextSelected,
                  ]}>
                  {t}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Add Slot */}
          <CustomButton title={'Add Slot'} onPress={addAvailability} />

          {/* Selected Slots */}
          {availability.length > 0 && (
            <View style={{marginTop: 15}}>
              <Text style={styles.label}>Selected Slots:</Text>
              {availability.map((slot, index) => (
                <View key={index} style={styles.slotRow}>
                  <Text>
                    {slot.date} {slot.month} - {slot.time}
                  </Text>
                  <TouchableOpacity onPress={() => removeAvailability(index)}>
                    <Text style={{color: 'red', marginLeft: 10}}>Remove</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Post Space */}
        <CustomButton title={'Post Space'} onPress={postSpace} />
      </ScrollView>
    </View>
  );
};

export default CreateConvention;

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
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  imageWrapper: {
    position: 'relative',
    marginRight: 10,
    marginBottom: 10,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 8,
  },
  removeBtn: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 5,
  },
  crossIcon: {
    width: 12,
    height: 12,
    tintColor: 'red',
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
  toggleRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 12,
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
  toggleText: {
    fontSize: 14,
    color: '#333',
  },
  selectedText: {
    color: '#fff',
    fontWeight: '600',
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  chipSelected: {
    backgroundColor: COLOR.primary || '#007AFF',
    borderColor: COLOR.primary || '#007AFF',
  },
  chipText: {
    color: '#333',
  },
  chipTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  addBtn: {
    marginTop: 10,
    backgroundColor: COLOR.primary || '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  slotRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  postBtn: {
    marginTop: 20,
    marginHorizontal: 20,
    backgroundColor: COLOR.primary || '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
});
