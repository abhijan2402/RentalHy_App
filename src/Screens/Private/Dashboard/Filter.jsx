import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import React, {useState} from 'react';
import Header from '../../../Components/FeedHeader';
import {COLOR} from '../../../Constants/Colors';
import CustomButton from '../../../Components/CustomButton';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

const Filter = ({navigation, route}) => {
  const onApplyFilter = route?.params?.onApplyFilter; // Get callback from Properties

  const [selectedBHK, setSelectedBHK] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [roomSize, setRoomSize] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [priceRange, setPriceRange] = useState([5000, 100000]); // default min and max

  const [furnishing, setFurnishing] = useState('');
  const [availability, setAvailability] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [parking, setParking] = useState('');
  const [facing, setFacing] = useState('');
  const [advanceValue, setAdvanceValue] = useState('');
  const [familyTypeValue, setFamilyTypeValue] = useState('');

  const bhkOptions = ['1 RK', '1 BHK', '2 BHK', '3 BHK', '4 BHK+'];
  const propertyTypes = ['Apartment', 'Flat', 'Villa'];
  const furnishingOptions = ['Furnished', 'Semi-Furnished', 'Unfurnished'];
  const availabilityOptions = ['Ready to Move', 'Under Construction'];
  const bathroomOptions = ['1', '2', '3', '4+'];
  const parkingOptions = ['Car', 'Bike', 'Both', 'None'];
  const advance = ['1 month', '2 months', '3 months+'];
  const familyType = ['Family', 'Bachelors male', 'Bachelors female'];

  const facingOptions = [
    'North',
    'East',
    'West',
    'South',
    'North-East',
    'South-East',
    'North-West',
    'South-West',
  ];

  const handleReset = () => {
    setSelectedBHK('');
    setPropertyType('');
    setRoomSize('');
    setMinPrice('');
    setMaxPrice('');
    setFurnishing('');
    setAvailability('');
    setBathrooms('');
    setParking('');
    setFacing('');
    setAdvanceValue('');
    setFamilyTypeValue('');
  };

  const handleApply = () => {
    const filters = {
      BHK: selectedBHK,
      propertyType,
      roomSize,
      minPrice,
      maxPrice,
      furnishing,
      availability,
      bathrooms,
      parking,
      facing,
      advanceValue,
      familyTypeValue,
    };

    console.log('Applied Filters:', filters);

    if (onApplyFilter) {
      onApplyFilter(filters); // Send filters back to Properties screen
    }
    navigation.goBack();
  };

  const renderOptions = (label, options, selected, setSelected) => (
    <>
      <Text style={styles.label}>{label}</Text>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        horizontal
        style={styles.optionRow}>
        {options.map(option => (
          <TouchableOpacity
            key={option}
            style={[
              styles.optionButton,
              selected === option && styles.optionSelected,
            ]}
            onPress={() => setSelected(option)}>
            <Text
              style={[
                styles.optionText,
                selected === option && styles.optionTextSelected,
              ]}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </>
  );

  return (
    <View style={styles.container}>
      <Header
        title={'Filters'}
        showBack
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.form}>
        {renderOptions('BHK', bhkOptions, selectedBHK, setSelectedBHK)}
        {renderOptions(
          'Property Type',
          propertyTypes,
          propertyType,
          setPropertyType,
        )}

        {/* Room Size */}
        <Text style={styles.label}>Room Size (sq.ft.)</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter room size"
          placeholderTextColor={COLOR.grey}
          keyboardType="numeric"
          value={roomSize}
          onChangeText={setRoomSize}
        />

        {/* Price Range */}
        {/* <Text style={styles.label}>Price Range</Text> */}
        {/* <View style={styles.priceRow}>
          <TextInput
            style={[styles.input, styles.priceInput]}
            placeholder="Min"
            placeholderTextColor={COLOR.grey}
            keyboardType="numeric"
            value={minPrice}
            onChangeText={setMinPrice}
          />
          <TextInput
            style={[styles.input, styles.priceInput]}
            placeholder="Max"
            placeholderTextColor={COLOR.grey}
            keyboardType="numeric"
            value={maxPrice}
            onChangeText={setMaxPrice}
          />
        </View> */}
        <Text style={styles.label}>Price Range (₹)</Text>
        <View style={{paddingHorizontal: 10}}>
          <MultiSlider
            values={priceRange}
            onValuesChange={setPriceRange}
            min={1000} // minimum possible value
            max={100000} // maximum possible value
            step={5000}
            selectedStyle={{
              backgroundColor: COLOR.primary,
            }}
            markerStyle={{
              backgroundColor: COLOR.primary,
              height: 20,
              width: 20,
            }}
            trackStyle={{
              height: 4,
            }}
          />
          <View style={styles.priceLabelRow}>
            <Text style={styles.priceLabel}>
              ₹{priceRange[0].toLocaleString()}
            </Text>
            <Text style={styles.priceLabel}>
              ₹{priceRange[1].toLocaleString()}
            </Text>
          </View>
        </View>

        {renderOptions(
          'Furnishing Status',
          furnishingOptions,
          furnishing,
          setFurnishing,
        )}
        {renderOptions(
          'Availability',
          availabilityOptions,
          availability,
          setAvailability,
        )}
        {renderOptions('Bathrooms', bathroomOptions, bathrooms, setBathrooms)}
        {renderOptions(
          'Parking Available',
          parkingOptions,
          parking,
          setParking,
        )}
        {renderOptions('Facing Direction', facingOptions, facing, setFacing)}
        {renderOptions('Advance', advance, advanceValue, setAdvanceValue)}
        {renderOptions(
          'Preferred Tenant Type',
          familyType,
          familyTypeValue,
          setFamilyTypeValue,
        )}

        {/* Buttons */}
        <View style={styles.buttonRow}>
          <CustomButton title="Apply" onPress={handleApply} />
          <CustomButton
            title="Reset"
            onPress={handleReset}
            style={{backgroundColor: COLOR.grey}}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default Filter;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.white,
  },
  form: {
    padding: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: COLOR.black,
    marginBottom: 8,
    marginTop: 12,
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  optionButton: {
    borderWidth: 1,
    borderColor: COLOR.grey,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: COLOR.white,
    marginRight: 10,
  },
  optionSelected: {
    backgroundColor: COLOR.primary,
    borderColor: COLOR.primary,
  },
  optionText: {
    color: COLOR.black,
  },
  optionTextSelected: {
    color: COLOR.white,
  },
  input: {
    borderWidth: 1,
    borderColor: COLOR.grey,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: COLOR.black,
    backgroundColor: COLOR.white,
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: 'row',
    gap: 10,
  },
  priceInput: {
    flex: 1,
  },
  buttonRow: {
    justifyContent: 'space-between',
    padding: 16,
    gap: 10,
  },

  priceLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  priceLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: COLOR.black,
  },
});
