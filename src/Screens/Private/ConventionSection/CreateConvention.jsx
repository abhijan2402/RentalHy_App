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

const getYears = () => {
  const currentYear = new Date().getFullYear();
  return [currentYear + 1, currentYear + 2]; // show only next 2 years
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

const CreateConvention = ({navigation}) => {
  // Images
  const [hallImages, setHallImages] = useState([]);
  const [kitchenImages, setKitchenImages] = useState([]);
  const [parkingImages, setParkingImages] = useState([]);
  const [uploadType, setUploadType] = useState(null);

  // General info
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Price options
  const priceOptions = [
    'Marriage',
    'Reception',
    'Engagement',
    'Birthday',
    '21 Days Function',
    'Saree Function',
    'Meeting <250',
    'Meeting >250',
    'Corporate Outing/Meeting',
  ];
  const [prices, setPrices] = useState({});

  // Seating Capacity
  const [capacity, setCapacity] = useState(50);

  // Parking
  const [parkingAvailable, setParkingAvailable] = useState(null);
  const [cars, setCars] = useState('');
  const [bikes, setBikes] = useState('');
  const [buses, setBuses] = useState('');
  const [valet, setValet] = useState('no');

  // Facilities
  const [royaltyDecoration, setRoyaltyDecoration] = useState('no');
  const [decorationContact, setDecorationContact] = useState('');
  const [royaltyKitchen, setRoyaltyKitchen] = useState('no');
  const [generator, setGenerator] = useState('no');
  const [normalWater, setNormalWater] = useState('no');
  const [drinkingWater, setDrinkingWater] = useState('no');
  const [catering, setCatering] = useState('no');

  // Availability Slots
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [slots, setSlots] = useState([]);

  const years = getYears();

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

  const addSlot = () => {
    if (!selectedYear || !selectedMonth || !selectedDate) return;
    const dateStr = `${selectedYear}-${String(
      months.indexOf(selectedMonth) + 1,
    ).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}`;
    if (!slots.includes(dateStr)) setSlots([...slots, dateStr]);
  };

  const postSpace = () => {
    const payload = {
      title,
      description,
      prices,
      capacity,
      parking: parkingAvailable === 'yes' ? {cars, bikes, buses, valet} : null,
      facilities: {
        royaltyDecoration,
        decorationContact,
        royaltyKitchen,
        generator,
        normalWater,
        drinkingWater,
        catering,
      },
      images: {hallImages, kitchenImages, parkingImages},
      slots,
    };
    console.log(payload);
    alert('Space posted successfully!');
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
          style={styles.input}
          value={descriptionVal}
          onChangeText={setDescriptionVal}
          placeholder="Enter contact or details"
        />
      )}
    </View>
  );

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <Header
        title="Create Space"
        showBack
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={{paddingBottom: 100}}>
        <Text style={[styles.label, {paddingHorizontal: 20}]}>
          Choose Upload Type *
        </Text>
        <View
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
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {/* Images */}
        {renderImagePicker('Hall Images', hallImages, setHallImages)}
        {renderImagePicker('Kitchen Images', kitchenImages, setKitchenImages)}
        {renderImagePicker('Parking Images', parkingImages, setParkingImages)}

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
            style={[styles.input, {height: 80, textAlignVertical: 'top'}]}
            value={description}
            onChangeText={setDescription}
            multiline
            placeholder="Enter description"
          />
        </View>

        {/* Price Options */}
        <View style={styles.section}>
          <Text style={styles.label}>Price Options</Text>
          {priceOptions.map(opt => (
            <View
              key={opt}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 8,
              }}>
              <Text style={{flex: 1}}>{opt}</Text>
              <TextInput
                style={[styles.input, {flex: 1}]}
                placeholder="Enter Price"
                keyboardType="numeric"
                value={prices[opt] || ''}
                onChangeText={val => setPrices({...prices, [opt]: val})}
              />
            </View>
          ))}
        </View>

        {/* Seating Capacity */}
        <View style={styles.section}>
          <Text style={styles.label}>Seating Capacity: {capacity}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {Array.from({length: 20}, (_, i) => 50 + i * 100).map(num => (
              <TouchableOpacity
                key={num}
                style={[styles.dateBox, capacity === num && styles.selectedBox]}
                onPress={() => setCapacity(num)}>
                <Text
                  style={[
                    styles.dateText,
                    capacity === num && styles.selectedText,
                  ]}>
                  {num}+
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Parking */}
        {renderToggle(
          'Parking Available',
          parkingAvailable,
          setParkingAvailable,
        )}
        {parkingAvailable === 'yes' && (
          <>
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
            {renderToggle('Valet Parking Available', valet, setValet)}
          </>
        )}

        {/* Facilities */}
        {renderToggle(
          'Royalty for Decoration',
          royaltyDecoration,
          setRoyaltyDecoration,
          true,
          decorationContact,
          setDecorationContact,
        )}
        {renderToggle('Royalty for Kitchen', royaltyKitchen, setRoyaltyKitchen)}
        {renderToggle('Generator Available', generator, setGenerator)}
        {renderToggle('Normal Water for Cooking', normalWater, setNormalWater)}
        {renderToggle(
          'Drinking Water Available',
          drinkingWater,
          setDrinkingWater,
        )}
        {renderToggle('Provides Catering Persons', catering, setCatering)}

        {/* Availability Slot */}
        <View style={styles.section}>
          <Text style={styles.label}>Add Availability Slot</Text>
          {/* Year */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {years.map(y => (
              <TouchableOpacity
                key={y}
                style={[
                  styles.dateBox,
                  selectedYear === y && styles.selectedBox,
                ]}
                onPress={() => {
                  setSelectedYear(y);
                  setSelectedMonth(null);
                  setSelectedDate(null);
                }}>
                <Text
                  style={[
                    styles.dateText,
                    selectedYear === y && styles.selectedText,
                  ]}>
                  {y}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          {/* Month */}
          {selectedYear && (
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
                    setSelectedDate(null);
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
          )}
          {/* Date */}
          {selectedMonth && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {Array.from({length: 31}, (_, i) => i + 1).map(d => (
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
          )}
          <CustomButton title="Add Slot" onPress={addSlot} />
          {slots.length > 0 && (
            <View style={{marginTop: 10}}>
              <Text>Selected Slots:</Text>
              {slots.map((s, i) => (
                <Text key={i}>{s}</Text>
              ))}
            </View>
          )}
        </View>

        {/* Post Space */}
        <CustomButton title="Post Space" onPress={postSpace} />
      </ScrollView>
    </View>
  );
};

export default CreateConvention;

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
    marginTop: 10,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  imageWrapper: {position: 'relative', marginRight: 10, marginBottom: 10},
  image: {width: 90, height: 90, borderRadius: 8},
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
  toggleRow: {flexDirection: 'row', marginTop: 10},
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
  toggleText: {fontSize: 14, color: '#333'},
  selectedText: {color: '#fff', fontWeight: '600'},
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
  dateText: {fontSize: 14, color: '#333'},
  selectedBox: {
    backgroundColor: COLOR.primary || '#007AFF',
    borderColor: COLOR.primary || '#007AFF',
  },
});
