import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
} from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import Header from '../../../Components/FeedHeader';
import { COLOR } from '../../../Constants/Colors';

/** 🔹 Currency Formatter */
const formatIndianCurrency = amount => {
  if (!amount) return '0';
  return amount.toString().replace(/\B(?=(\d{2})+(?!\d))/g, ',');
};

const ConventionMainFilter = ({ route, navigation }) => {
  const {
    onApplyFilter,
    existingFilters = {},
    modalFilters = {},
    setAppliedModalFilter,
  } = route.params || {};

  const [filters, setFilters] = useState({});

  /** ✅ Initialize or update filters */
  useEffect(() => {
    const initialState = {
      priceRange: {
        min:
          modalFilters.min_price ??
          existingFilters.min_price ??
          1000,
        max:
          modalFilters.max_price ??
          existingFilters.max_price ??
          1000000,
      },
      seatingCapacity: {
        min:
          modalFilters.seating_capacity_min ??
          existingFilters.seating_capacity_min ??
          10,
        max:
          modalFilters.seating_capacity_max ??
          existingFilters.seating_capacity_max ??
          5000,
      },
      time_of_occasion: [
        ...(modalFilters.time_of_occasion || existingFilters.time_of_occasion || []),
      ],

      // ✅ Boolean filters stored as arrays like ['yes']
      booleanFilters: Object.fromEntries(
        [
          'ac_available',
          'valet_parking',
          'royalty_decoration',
          'royalty_kitchen',
          'generator_available',
          'drinking_water',
          'normal_water',
          'catering_persons',
          'alcohol_allowed',
          'photoshoot_all',
          'adult_games',
          'rooms_available',
        ].map(key => {
          const modalVal = modalFilters[key];
          const existVal = existingFilters[key];
          const val = (modalVal || existVal || '')
            ?.toString()
            ?.toLowerCase();
          return [key, val ? [val] : []];
        })
      ),

      decoration_contact:
        modalFilters.decoration_contact ??
        existingFilters.decoration_contact ??
        '',
    };

    setFilters(initialState);
  }, [modalFilters, existingFilters]);

  /** ✅ Handle slider change */
  const handleSliderChange = (type, values) => {
    setFilters(prev => ({
      ...prev,
      [type]: { min: values[0], max: values[1] },
    }));
  };

  /** ✅ Handle toggle/select buttons (always arrays) */
  const handleSelect = (section, key, value) => {
    const normalizedValue = value.toLowerCase();
    setFilters(prev => {
      const current = Array.isArray(prev[section]?.[key])
        ? prev[section][key]
        : [];
      const updated =
        current.includes(normalizedValue) ? [] : [normalizedValue];
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [key]: updated,
        },
      };
    });
  };

  /** ✅ Text input handler */
  const handleTextChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  /** ✅ Apply Filters */
  const handleApply = () => {
    const formattedFilters = {
      min_price: filters.priceRange?.min ?? 1000,
      max_price: filters.priceRange?.max ?? 1000000,
      seating_capacity_min: filters.seatingCapacity?.min ?? 10,
      seating_capacity_max: filters.seatingCapacity?.max ?? 5000,
      time_of_occasion: filters.time_of_occasion || [],
      ...filters.booleanFilters,
      decoration_contact: filters.decoration_contact || '',
    };

    if (setAppliedModalFilter) setAppliedModalFilter(formattedFilters);
    if (onApplyFilter) onApplyFilter(formattedFilters);
    navigation.goBack();
  };

  /** ✅ Reset Filters */
  const handleReset = () => {
    setFilters({});
    if (setAppliedModalFilter) setAppliedModalFilter({});
    if (onApplyFilter) onApplyFilter({});
    navigation.goBack();
  };

  /** ✅ Render Yes/No toggle */
  const renderBooleanRow = (label, key) => {
    const selectedValues = filters.booleanFilters?.[key] || [];
    const selected = selectedValues[0]; // e.g. 'yes' or 'no'
    return (
      <View style={styles.filterBlock}>
        <Text style={styles.filterTitle}>{label}</Text>
        <View style={styles.optionRow}>
          {['Yes', 'No'].map(option => {
            const normalized = option.toLowerCase();
            const isSelected = selected === normalized;
            return (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionButton,
                  isSelected && styles.optionButtonSelected,
                ]}
                onPress={() =>
                  handleSelect('booleanFilters', key, option)
                }>
                <Text
                  style={[
                    styles.optionText,
                    isSelected && styles.optionTextSelected,
                  ]}>
                  {option}
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
      <Header title="Convention Filters" showBack onBackPress={() => navigation.goBack()} />
      <ScrollView>
        {/* Price Range */}
        <View style={styles.filterBlock}>
          <Text style={styles.filterTitle}>Price Range (₹)</Text>
          <MultiSlider
            values={[
              filters.priceRange?.min ?? 1000,
              filters.priceRange?.max ?? 1000000,
            ]}
            min={1000}
            max={1000000}
            step={1000}
            onValuesChange={values => handleSliderChange('priceRange', values)}
            selectedStyle={{ backgroundColor: COLOR.primary }}
            markerStyle={{ backgroundColor: COLOR.primary, height: 20, width: 20 }}
            trackStyle={{ height: 4 }}
          />
          <Text style={styles.valueText}>
            ₹{formatIndianCurrency(filters.priceRange?.min ?? 1000)} - ₹
            {formatIndianCurrency(filters.priceRange?.max ?? 1000000)}
          </Text>
        </View>

        {/* Seating Capacity */}
        <View style={styles.filterBlock}>
          <Text style={styles.filterTitle}>Rooms availability</Text>
          <MultiSlider
            values={[
              filters.seatingCapacity?.min ?? 10,
              filters.seatingCapacity?.max ?? 5000,
            ]}
            min={10}
            max={5000}
            step={10}
            onValuesChange={values =>
              handleSliderChange('seatingCapacity', values)
            }
            selectedStyle={{ backgroundColor: COLOR.primary }}
            markerStyle={{ backgroundColor: COLOR.primary, height: 20, width: 20 }}
            trackStyle={{ height: 4 }}
          />
          <Text style={styles.valueText}>
            {filters.seatingCapacity?.min ?? 10} -{' '}
            {filters.seatingCapacity?.max ?? 5000}
          </Text>
        </View>

        {/* Time of Occasion */}
        <View style={styles.filterBlock}>
          <Text style={styles.filterTitle}>Time of Occasion</Text>
          <View style={styles.optionRow}>
            {['Daytime', 'Night time', 'Full day'].map(option => {
              const selected = filters.time_of_occasion?.includes(option);
              return (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.optionButton,
                    selected && styles.optionButtonSelected,
                  ]}
                  onPress={() =>
                    setFilters(prev => {
                      const existing = prev.time_of_occasion || [];
                      const updated = selected
                        ? existing.filter(o => o !== option)
                        : [...existing, option];
                      return { ...prev, time_of_occasion: updated };
                    })
                  }>
                  <Text
                    style={[
                      styles.optionText,
                      selected && styles.optionTextSelected,
                    ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Boolean Filters */}
        {renderBooleanRow('A/C Available', 'ac_available')}
        {renderBooleanRow('Valet Parking', 'valet_parking')}
        {renderBooleanRow('Royalty for Decoration', 'royalty_decoration')}
        {filters.booleanFilters?.royalty_decoration?.[0] === 'no' && (
          <TextInput
            placeholder="Decoration Person Contact"
            style={styles.input}
            value={filters.decoration_contact}
            onChangeText={val => handleTextChange('decoration_contact', val)}
          />
        )}
        {renderBooleanRow('Royalty for Kitchen', 'royalty_kitchen')}
        {renderBooleanRow('Generator Available', 'generator_available')}
        {renderBooleanRow('Drinking Water Available', 'drinking_water')}
        {renderBooleanRow('Normal Water for Cooking', 'normal_water')}
        {renderBooleanRow('Provides Catering Persons', 'catering_persons')}
        {renderBooleanRow('Alcohol Allowed', 'alcohol_allowed')}
        {renderBooleanRow('Photo Shoot Allowed', 'photoshoot_all')}
        {renderBooleanRow('Children Games', 'adult_games')}
        {renderBooleanRow('Rooms Available', 'rooms_available')}
      </ScrollView>

      {/* Action Buttons */}
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

export default ConventionMainFilter;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  filterBlock: { marginVertical: 10, paddingHorizontal: 16 },
  filterTitle: { fontSize: 16, fontWeight: '600', marginBottom: 10 },
  optionRow: { flexDirection: 'row', flexWrap: 'wrap' },
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginHorizontal: 16,
    marginTop: 8,
  },
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
    width: '100%',
  },
});
