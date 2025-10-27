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
  const modalFilters = route?.params?.modalFilters || {};

  const [selectedBHK, setSelectedBHK] = useState(
    modalFilters.BHK || existingFilters.BHK || '',
  );
  const [propertyType, setPropertyType] = useState(
    modalFilters.property_type || existingFilters.propertyType || '',
  );
  const [roomSize, setRoomSize] = useState(
    existingFilters.roomSize || [100, 5000],
  );
  const [minRoomSize, setMinRoomSize] = useState(
    existingFilters.minRoomSize || 0,
  );
  const [maxRoomSize, setMaxRoomSize] = useState(
    existingFilters.maxRoomSize || 5000,
  );
  const [priceRange, setPriceRange] = useState(
    existingFilters.priceRange ||
      (modalFilters.min_price && [
        modalFilters.min_price,
        modalFilters.max_price,
      ]) || [5000, '10,00,000'],
  );
  const [minPrice, setMinPrice] = useState(
    modalFilters.min_price || existingFilters.minPrice || 5000,
  );
  const [maxPrice, setMaxPrice] = useState(
    modalFilters.max_price || existingFilters.maxPrice || '10,00,000',
  );
  const [selectedFloor, setSelectedFloor] = useState(
    modalFilters.floor || existingFilters?.selectedFloor || '',
  );

  const [furnishing, setFurnishing] = useState(
    modalFilters.furnishing_status || existingFilters.furnishing || '',
  );
  const [availability, setAvailability] = useState(
    modalFilters.availability || existingFilters.availability || '',
  );
  const [bathrooms, setBathrooms] = useState(
    modalFilters.bathrooms || existingFilters.bathrooms || '',
  );
  const [parking, setParking] = useState(
    modalFilters.parking_available || existingFilters.parking || '',
  );
  const [facing, setFacing] = useState(existingFilters.facing || '');
  const [advanceValue, setAdvanceValue] = useState(
    modalFilters.advance || existingFilters.advanceValue || '',
  );
  const [familyTypeValue, setFamilyTypeValue] = useState(
    modalFilters.preferred_tenant_type || existingFilters.familyTypeValue || '',
  );
  const [selectedCommercialSpace, setselectedCommercialSpace] = useState(
    modalFilters.commercial_space ||
      existingFilters.selectedCommercialSpace ||
      '',
  );

  const bhkOptions = ['1 RK', '1 BHK', '2 BHK', '3 BHK', '4 BHK+'];
  const propertyTypes = [
    'Apartment',
    'Flat',
    'Villa',
    'Independent House',
    'Duplex',
    'Roof sheets',
    'Tiled House',
  ];
  const furnishingOptions = ['Furnished', 'Semi-Furnished', 'Unfurnished'];
  const availabilityOptions = ['Ready to Move', 'Under Construction'];
  const bathroomOptions = ['1', '2', '3', '4+'];
  const parkingOptions = ['Car', 'Bike', 'Both', 'None'];
  const advance = ['1 month', '2 months', '3 months+'];
  const familyType = ['Family', 'Bachelors Male', 'Bachelors Female'];
  const commercialSpace = [
    'Shop',
    'Office',
    'Warehouse',
    'Showroom',
    'Restaurant',
    'Hotel',
  ];
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
  const floorOptions = [
    'Ground Floor',
    '1st',
    '2nd',
    '3rd',
    '4th',
    '5th',
    '6th+',
  ];

  const handleReset = () => {
    setSelectedBHK('');
    setPropertyType('');
    setPriceRange([5000, 1000000]);
    setRoomSize([100, 5000]);
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
    setSelectedFloor('');
    onApplyFilter({});
    navigation.goBack();
  };

  const handleValuesChange = values => {
    setPriceRange(values);
    setMinPrice(values[0]);
    setMaxPrice(values[1]);
  };

  const handleValuesChangeSQT = values => {
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
      selectedFloor,
      ...(minPrice && maxPrice ? {priceFilterType: 'price'} : {}),
    };

    if (onApplyFilter) onApplyFilter(filters);
    navigation.goBack();
  };

  const renderOptions = (
    label,
    options,
    selected,
    setSelected,
    multiSelect = false,
  ) => {
    const handlePress = option => {
      if (multiSelect) {
        if (selected.includes(option)) {
          setSelected(selected.filter(item => item !== option));
        } else {
          setSelected([...selected, option]);
        }
      } else {
        setSelected(option);
      }
    };

    const isSelected = option => {
      return multiSelect ? selected.includes(option) : selected === option;
    };
    return (
      <>
        <Text style={styles.label}>{label}</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.optionRow}>
          {options?.map(option => (
            <TouchableOpacity
              key={option}
              style={[
                styles.optionButton,
                isSelected(option) && styles.optionSelected,
              ]}
              onPress={() => handlePress(option)}>
              <Text
                style={[
                  styles.optionText,
                  isSelected(option) && styles.optionTextSelected,
                ]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </>
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title={'Filters'}
        showBack
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.form}>
        {renderOptions('BHK', bhkOptions, selectedBHK, setSelectedBHK, true)}
        {renderOptions(
          'Commercial Space',
          commercialSpace,
          selectedCommercialSpace,
          setselectedCommercialSpace,
          true,
        )}

        {renderOptions(
          'Property Type',
          propertyTypes,
          propertyType,
          setPropertyType,
          true,
        )}
        {renderOptions(
          'Floor Options',
          floorOptions,
          selectedFloor,
          setSelectedFloor,
          true,
        )}
        {renderOptions(
          'Preferred Tenant Type',
          familyType,
          familyTypeValue,
          setFamilyTypeValue,
          true,
        )}

        <Text style={styles.label}>Room Size (sq.ft.)</Text>
        <View style={{paddingHorizontal: 10}}>
          <MultiSlider
            values={roomSize}
            onValuesChange={handleValuesChangeSQT}
            min={100}
            max={5000}
            step={10}
            selectedStyle={{backgroundColor: COLOR.primary}}
            markerStyle={{
              backgroundColor: COLOR.primary,
              height: 20,
              width: 20,
            }}
            trackStyle={{height: 4}}
          />
          <View style={styles.priceLabelRow}>
            <Text style={styles.priceLabel}>
              {minRoomSize.toLocaleString()}
            </Text>
            <Text style={styles.priceLabel}>
              {maxRoomSize.toLocaleString() + ' ' + '+'}
            </Text>
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
            selectedStyle={{backgroundColor: COLOR.primary}}
            markerStyle={{
              backgroundColor: COLOR.primary,
              height: 20,
              width: 20,
            }}
            trackStyle={{height: 4}}
          />
          <View style={styles.priceLabelRow}>
            <Text style={styles.priceLabel}>₹{minPrice.toLocaleString()}</Text>
            <Text style={styles.priceLabel}>₹{maxPrice.toLocaleString()}</Text>
          </View>
        </View>

        {renderOptions(
          'Furnishing Status',
          furnishingOptions,
          furnishing,
          setFurnishing,
          true,
        )}
        {renderOptions(
          'Availability',
          availabilityOptions,
          availability,
          setAvailability,
          true,
        )}
        {renderOptions(
          'Bathrooms',
          bathroomOptions,
          bathrooms,
          setBathrooms,
          true,
        )}
        {renderOptions(
          'Parking Available',
          parkingOptions,
          parking,
          setParking,
          true,
        )}
        {renderOptions(
          'Facing Direction',
          facingOptions,
          facing,
          setFacing,
          true,
        )}
        {renderOptions('Advance', advance, advanceValue, setAdvanceValue, true)}

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
export const formatIndianCurrency = value => {
  try {
    // ✅ 1. Handle null, undefined, empty string, or non-numeric inputs
    if (value === null || value === undefined || value === '') {
      return '0';
    }

    // ✅ 2. Convert to number safely
    const num = Number(value);

    // ✅ 3. If conversion fails or NaN, return "0"
    if (isNaN(num) || !isFinite(num)) {
      return '0';
    }

    // ✅ 4. Use Indian numbering system
    return num.toLocaleString('en-IN');
  } catch (error) {
    console.error('formatIndianCurrency Error:', error);
    return '0'; // Fallback to safe value
  }
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: COLOR.white},
  form: {padding: 16},
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: COLOR.black,
    marginBottom: 8,
    marginTop: 12,
  },
  optionRow: {flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12},
  optionButton: {
    borderWidth: 1,
    borderColor: COLOR.grey,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: COLOR.white,
    marginRight: 10,
  },
  optionSelected: {backgroundColor: COLOR.primary, borderColor: COLOR.primary},
  optionText: {color: COLOR.black},
  optionTextSelected: {color: COLOR.white},
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
  buttonRow: {justifyContent: 'space-between', padding: 16, gap: 10},
  priceLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  priceLabel: {fontSize: 14, fontWeight: '500', color: COLOR.black},
});
