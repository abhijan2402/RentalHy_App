import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { HOSTEL_FILTERS } from '../../../Constants/Data';
import Header from '../../../Components/FeedHeader';
import { COLOR } from '../../../Constants/Colors';

const HostelFilterScreen = ({ route, navigation }) => {
  const {
    onApplyFilter,
    existingFilters = {},
    modalFilters = {},
    setAppliedModalFilter,
  } = route.params;

  const [filters, setFilters] = useState({});

  // ✅ Initialize or update filters when modalFilters/existingFilters change
  useEffect(() => {
    const initialState = {
      price: {
        min: modalFilters.min_price ?? existingFilters.minPrice ?? HOSTEL_FILTERS.priceRange.min,
        max: modalFilters.max_price ?? existingFilters.maxPrice ?? HOSTEL_FILTERS.priceRange.max,
      },
      occupancy: {
        min: modalFilters.minOccupancy ?? existingFilters.minOccupancy ?? 1,
        max: modalFilters.maxOccupancy ?? existingFilters.maxOccupancy ?? 100,
      },
      room_types: (modalFilters.room_types || existingFilters.room_types || []).map(i => i.toLowerCase()),
      genders: (modalFilters.genders || existingFilters.genders || []).map(i => i.toLowerCase()),
      facilities: (modalFilters.facilities || existingFilters.facilities || []).map(i => i.toLowerCase()),
      foodOptions: (modalFilters.foodOptions || existingFilters.foodOptions || []).map(i => i.toLowerCase()),
      stayTypes: (modalFilters.stayTypes || existingFilters.stayTypes || []).map(i => i.toLowerCase()),
    };

    setFilters(initialState);
  }, [modalFilters, existingFilters]);

  // ✅ Handle selecting/unselecting a filter option
  const handleSelect = (type, option) => {
    const normalizedOption = option.toLowerCase();
    setFilters(prev => {
      const current = prev[type] || [];
      const updatedValues = current.includes(normalizedOption)
        ? current.filter(i => i !== normalizedOption)
        : [...current, normalizedOption];
      return { ...prev, [type]: updatedValues };
    });
  };

  // ✅ Handle slider change (price / occupancy)
  const handleSliderChange = (type, values) => {
    setFilters(prev => ({
      ...prev,
      [type]: { min: values[0], max: values[1] },
    }));
  };

  // ✅ Apply Filters
  const handleApply = () => {
    const formattedFilters = {
      min_price: filters.price?.min ?? HOSTEL_FILTERS.priceRange.min,
      max_price: filters.price?.max ?? HOSTEL_FILTERS.priceRange.max,
      minOccupancy: filters.occupancy?.min ?? 1,
      maxOccupancy: filters.occupancy?.max ?? 100,
      room_types: filters.room_types || [],
      genders: filters.genders || [],
      facilities: filters.facilities || [],
      foodOptions: filters.foodOptions || [],
      stayTypes: filters.stayTypes || [],
    };

    setAppliedModalFilter(formattedFilters);
    onApplyFilter(formattedFilters);
    navigation.goBack();
  };


  const handleReset = () => {
    setFilters({});
    setAppliedModalFilter({});
  };

  // ✅ Render each filter block
  const renderOptions = (title, type, options) => {
    const selectedValues = Array.isArray(filters[type]) ? filters[type] : [];
    return (
      <View style={styles.filterBlock}>
        <Text style={styles.filterTitle}>{title}</Text>
        <View style={styles.optionContainer}>
          {options.map(option => {
            const isSelected = selectedValues.includes(option.value.toLowerCase());
            return (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionButton,
                  isSelected && styles.optionButtonSelected,
                ]}
                onPress={() => handleSelect(type, option.value)}>
                <Text
                  style={[
                    styles.optionText,
                    isSelected && styles.optionTextSelected,
                  ]}>
                  {option.key}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header title={'Hostel Filter'} showBack={true} onBackPress={() => navigation.goBack()} />
      <ScrollView>

        <View style={styles.filterBlock}>
          <Text style={styles.filterTitle}>{HOSTEL_FILTERS.priceRange.label}</Text>
          <MultiSlider
            values={[
              filters.price?.min ?? HOSTEL_FILTERS.priceRange.min,
              filters.price?.max ?? HOSTEL_FILTERS.priceRange.max,
            ]}
            min={HOSTEL_FILTERS.priceRange.min}
            max={HOSTEL_FILTERS.priceRange.max}
            step={HOSTEL_FILTERS.priceRange.step}
            onValuesChange={values => handleSliderChange('price', values)}
             selectedStyle={{ backgroundColor: COLOR.primary }}
                          markerStyle={{ backgroundColor: COLOR.primary, height: 20, width: 20 }}
                          trackStyle={{ height: 4 }}
          />
          <Text style={styles.valueText}>
            ₹{filters.price?.min ?? HOSTEL_FILTERS.priceRange.min} - ₹
            {filters.price?.max ?? HOSTEL_FILTERS.priceRange.max}
          </Text>
        </View>

        {/* Occupancy */}
        <View style={styles.filterBlock}>
          <Text style={styles.filterTitle}>Occupancy</Text>
          <MultiSlider
            values={[filters.occupancy?.min ?? 1, filters.occupancy?.max ?? 100]}
            min={1}
            max={100}
            step={1}
            onValuesChange={values => handleSliderChange('occupancy', values)}
             selectedStyle={{ backgroundColor: COLOR.primary }}
                          markerStyle={{ backgroundColor: COLOR.primary, height: 20, width: 20 }}
                          trackStyle={{ height: 4 }}
          />
          <Text style={styles.valueText}>
            {filters.occupancy?.min ?? 1} - {filters.occupancy?.max ?? 100}%
          </Text>
        </View>

        {/* Room Types */}
        {renderOptions('Room Type', 'room_types', HOSTEL_FILTERS.roomTypes)}

        {/* Gender */}
        {renderOptions('Gender', 'genders', HOSTEL_FILTERS.genders)}

        {/* Facilities */}
        {renderOptions('Facilities', 'facilities', HOSTEL_FILTERS.facilities)}

        {/* Food Options */}
        {renderOptions('Food Options', 'foodOptions', HOSTEL_FILTERS.foodOptions)}

        {/* Stay Type */}
        {renderOptions('Stay Type', 'stayTypes', HOSTEL_FILTERS.stayTypes)}
      </ScrollView>

      {/* Apply & Reset Buttons */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.resetText}>Reset</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
          <Text style={styles.applyText}>Apply</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HostelFilterScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  filterBlock: { marginVertical: 10, paddingHorizontal: 16 },
  filterTitle: { fontSize: 16, fontWeight: '600', marginBottom: 10 },
  optionContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  optionButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  optionButtonSelected: { backgroundColor: COLOR.primary, borderColor: COLOR.primary },
  optionText: { color: '#333' },
  optionTextSelected: { color: '#fff' },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  applyButton: {
    backgroundColor: COLOR.primary,
    borderRadius: 25,
    paddingHorizontal: 30,
    paddingVertical: 12,
  },
  applyText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  resetButton: {
    borderRadius: 25,
    borderWidth: 1,
    borderColor: COLOR.primary,
    paddingHorizontal: 30,
    paddingVertical: 12,
  },
  resetText: { color: COLOR.primary, fontSize: 16, fontWeight: '600' },
  valueText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    width:'100%',
  },
});
