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
  const onApplyFilter = route?.params?.onApplyFilter;
  const existingFilters = route?.params?.existingFilters || {};

  const [selectedBHK, setSelectedBHK] = useState(existingFilters.BHK || '');
  const [propertyType, setPropertyType] = useState(existingFilters.propertyType || '');
  const [roomSize, setRoomSize] = useState(existingFilters.roomSize || [100, 5000]);
  const [minRoomSize, setMinRoomSize] = useState(existingFilters.minRoomSize || 0);
  const [maxRoomSize, setMaxRoomSize] = useState(existingFilters.maxRoomSize || 5000); 
  const [priceRange, setPriceRange] = useState(
    existingFilters.priceRange || [5000, 1000000]
  );
  const [minPrice, setMinPrice] = useState(existingFilters.minPrice || 5000);
  const [maxPrice, setMaxPrice] = useState(existingFilters.maxPrice || 1000000);

  const [furnishing, setFurnishing] = useState(existingFilters.furnishing || '');
  const [availability, setAvailability] = useState(existingFilters.availability || '');
  const [bathrooms, setBathrooms] = useState(existingFilters.bathrooms || '');
  const [parking, setParking] = useState(existingFilters.parking || '');
  const [facing, setFacing] = useState(existingFilters.facing || '');
  const [advanceValue, setAdvanceValue] = useState(existingFilters.advanceValue || '');
  const [familyTypeValue, setFamilyTypeValue] = useState(existingFilters.familyTypeValue || '');
  const [selectedCommercialSpace, setselectedCommercialSpace] = useState(existingFilters.selectedCommercialSpace || '');



  const bhkOptions = ['1 RK', '1 BHK', '2 BHK', '3 BHK', '4 BHK+'];
  const propertyTypes = ['Apartment', 'Flat', 'Villa'];
  const furnishingOptions = ['Furnished', 'Semi-Furnished', 'Unfurnished'];
  const availabilityOptions = ['Ready to Move', 'Under Construction'];
  const bathroomOptions = ['1', '2', '3', '4+'];
  const parkingOptions = ['Car', 'Bike', 'Both', 'None'];
  const advance = ['1 month', '2 months', '3 months+'];
  const familyType = ['Family', 'Bachelors Male', 'Bachelors Female'];
  const commercialSpace = ['Yes', 'No'];
  const facingOptions = [
    'North','East','West','South','North-East',
    'South-East','North-West','South-West',
  ];

  const handleReset = () => {
    setSelectedBHK('');
    setPropertyType('');
    setPriceRange([5000, 1000000]);
    setRoomSize([100,5000])
    setMinRoomSize(0);
    setMaxRoomSize(5000);
    setMinPrice(5000);
    setMaxPrice(15000);
    setFurnishing('');
    setAvailability('');
    setBathrooms('');
    setParking('');
    setFacing('');
    setAdvanceValue('');
    setFamilyTypeValue('');
    setselectedCommercialSpace('');
    onApplyFilter({});
    navigation.goBack();
  };

  const handleValuesChange = (values) => {
    setPriceRange(values);
    setMinPrice(values[0]);
    setMaxPrice(values[1]);
  };

   const handleValuesChangeSQT = (values) => {
    setRoomSize(values);
    setMinRoomSize(values[0]);
    setMaxRoomSize(values[1]);
  };


  const handleApply = () => {
    const filters = {
      BHK: selectedBHK,
      propertyType,
      roomSize,
      minPrice,
      maxPrice,
      priceRange,
      furnishing,
      availability,
      bathrooms,
      parking,
      facing,
      minRoomSize,
      maxRoomSize,
      advanceValue,
      familyTypeValue,
      selectedCommercialSpace,
    };
    console.log('Applied Filters:', filters);

    if (onApplyFilter) onApplyFilter(filters);
    navigation.goBack();
  };

  const renderOptions = (label, options, selected, setSelected) => (
    <>
      <Text style={styles.label}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionRow}>
        {options.map(option => (
          <TouchableOpacity
            key={option}
            style={[styles.optionButton, selected === option && styles.optionSelected]}
            onPress={() => setSelected(option)}
          >
            <Text style={[styles.optionText, selected === option && styles.optionTextSelected]}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </>
  );

  return (
    <View style={styles.container}>
      <Header title={'Filters'} showBack onBackPress={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.form}>
        {renderOptions('BHK', bhkOptions, selectedBHK, setSelectedBHK)}
        {renderOptions('Property Type', propertyTypes, propertyType, setPropertyType)}
        {renderOptions('Preferred Tenant Type', familyType, familyTypeValue, setFamilyTypeValue)}

        {/* Room Size */}
        <Text style={styles.label}>Room Size (sq.ft.)</Text>
        <View style={{paddingHorizontal: 10}}>
          <MultiSlider
            values={roomSize}
            onValuesChange={handleValuesChangeSQT}
            min={100}
            max={5000} 
            step={10}
            selectedStyle={{ backgroundColor: COLOR.primary }}
            markerStyle={{ backgroundColor: COLOR.primary, height: 20, width: 20 }}
            trackStyle={{ height: 4 }}
          />
          <View style={styles.priceLabelRow}>
            <Text style={styles.priceLabel}>{minRoomSize.toLocaleString()}</Text>
            <Text style={styles.priceLabel}>{maxRoomSize.toLocaleString()}</Text>
          </View>
        </View>
   


        {/* Price Range */}
        <Text style={styles.label}>Price Range (₹)</Text>
        <View style={{paddingHorizontal: 10}}>
          <MultiSlider
            values={priceRange}
            onValuesChange={handleValuesChange}
            min={1000}
            max={1000000} 
            step={1000}
            selectedStyle={{ backgroundColor: COLOR.primary }}
            markerStyle={{ backgroundColor: COLOR.primary, height: 20, width: 20 }}
            trackStyle={{ height: 4 }}
          />
          <View style={styles.priceLabelRow}>
            <Text style={styles.priceLabel}>₹{minPrice.toLocaleString()}</Text>
            <Text style={styles.priceLabel}>₹{maxPrice.toLocaleString()}</Text>
          </View>
        </View>

        {renderOptions('Furnishing Status', furnishingOptions, furnishing, setFurnishing)}
        {renderOptions('Availability', availabilityOptions, availability, setAvailability)}
        {renderOptions('Bathrooms', bathroomOptions, bathrooms, setBathrooms)}
        {renderOptions('Parking Available', parkingOptions, parking, setParking)}
        {renderOptions('Facing Direction', facingOptions, facing, setFacing)}
        {renderOptions('Advance', advance, advanceValue, setAdvanceValue)}
        {renderOptions('Commercial Space', commercialSpace, selectedCommercialSpace, setselectedCommercialSpace)}

        {/* Buttons */}
        <View style={styles.buttonRow}>
          <CustomButton title="Apply" onPress={handleApply} />
          <CustomButton title="Reset" onPress={handleReset} style={{backgroundColor: COLOR.grey}} />
        </View>
      </ScrollView>
    </View>
  );
};

export default Filter;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLOR.white },
  form: { padding: 16 },
  label: { fontSize: 14, fontWeight: '500', color: COLOR.black, marginBottom: 8, marginTop: 12 },
  optionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  optionButton: {
    borderWidth: 1, borderColor: COLOR.grey, borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 8, backgroundColor: COLOR.white, marginRight: 10,
  },
  optionSelected: { backgroundColor: COLOR.primary, borderColor: COLOR.primary },
  optionText: { color: COLOR.black },
  optionTextSelected: { color: COLOR.white },
  input: {
    borderWidth: 1, borderColor: COLOR.grey, borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 8, color: COLOR.black,
    backgroundColor: COLOR.white, marginBottom: 12,
  },
  buttonRow: { justifyContent: 'space-between', padding: 16, gap: 10 },
  priceLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  priceLabel: { fontSize: 14, fontWeight: '500', color: COLOR.black },
});
