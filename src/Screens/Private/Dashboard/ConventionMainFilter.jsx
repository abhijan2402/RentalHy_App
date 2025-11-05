





// import React, { useState, useCallback } from 'react';
// import {
//   StyleSheet,
//   Text,
//   View,
//   TouchableOpacity,
//   ScrollView,
//   TextInput,
// } from 'react-native';
// import Header from '../../../Components/FeedHeader';
// import CustomButton from '../../../Components/CustomButton';
// import MultiSlider from '@ptomasroos/react-native-multi-slider';
// import { COLOR } from '../../../Constants/Colors';

// /** 🔹 Currency Formatter */
// const formatIndianCurrency = amount => {
//   if (!amount) return '0';
//   return amount.toString().replace(/\B(?=(\d{2})+(?!\d))/g, ',');
// };

// const ConventionMainFilter = ({ navigation, route }) => {
//   const {
//     onApplyFilter,
//     existingFilters = {},
//     modalFilters = {},
//     setAppliedModalFilter = () => {},
//   } = route.params || {};

//   console.log(modalFilters,"modalFiltersmodalFilters")

//   const [availableFilters, setAvailableFilters] = useState([
//     {
//       id: 'priceRange',
//       type: 'range',
//       name: 'Price Range (₹)',
//       min: 1000,
//       max: 1000000,
//       step: 1000,
//       value:
//         existingFilters.priceRange ||
//         (modalFilters.min_price && [modalFilters.min_price, modalFilters.max_price]) ||
//         [1000, 1000000],
//     },
//     {
//       id: 'seating_capacity',
//       type: 'range',
//       name: 'Seating Capacity',
//       min: 10,
//       max: 5000,
//       step: 10,
//       value:
//         existingFilters.seatingCapacity ||
//         (modalFilters.seating_capacity_min && [
//           modalFilters.seating_capacity_min,
//           modalFilters.seating_capacity_max,
//         ]) ||
//         [10, 5000],
//     },
//     {
//       id: 'time_of_occasion',
//       type: 'select',
//       name: 'Time of Occasion',
//       data: ['Daytime', 'Night time', 'Full day'],
//       value: existingFilters.timeOfOccasion || modalFilters.time_of_occasion || '',
//     },
//     {
//       id: 'ac_available',
//       type: 'boolean',
//       name: 'A/C Available',
//       value: existingFilters.acAvailable || modalFilters.ac_available || '',
//     },
//     {
//       id: 'valet_parking',
//       type: 'boolean',
//       name: 'Valet Parking',
//       value: existingFilters.valetParking || modalFilters.valet_parking || '',
//     },
//     {
//       id: 'royalty_decoration',
//       type: 'boolean',
//       name: 'Royalty for Decoration',
//       value:
//         existingFilters.royaltyDecoration || modalFilters.royalty_decoration || '',
//       showInputIf: 'No', // triggers decorationContact field
//     },
//     {
//       id: 'decoration_contact',
//       type: 'text',
//       name: 'Decoration Person Contact',
//       value:
//         existingFilters.decorationContact || modalFilters.decoration_contact || '',
//       dependsOn: 'royalty_decoration',
//     },
//     {
//       id: 'royalty_kitchen',
//       type: 'boolean',
//       name: 'Royalty for Kitchen',
//       value: existingFilters.royaltyKitchen || modalFilters.royalty_kitchen || '',
//     },
//     {
//       id: 'generator_available',
//       type: 'boolean',
//       name: 'Generator Available',
//       value: existingFilters.generator || modalFilters.generator_available || '',
//     },
//     {
//       id: 'drinking_water',
//       type: 'boolean',
//       name: 'Drinking Water Available',
//       value: existingFilters.drinkingWater || modalFilters.drinking_water || '',
//     },
//     {
//       id: 'normal_water',
//       type: 'boolean',
//       name: 'Normal Water for Cooking',
//       value: existingFilters.normalWater || modalFilters.normal_water || '',
//     },
//     {
//       id: 'catering_persons',
//       type: 'boolean',
//       name: 'Provides Catering Persons',
//       value:
//         existingFilters.cateringPersons || modalFilters.catering_persons || '',
//     },
//     {
//       id: 'alcohol_allowed',
//       type: 'boolean',
//       name: 'Alcohol Allowed',
//       value: existingFilters.alcoholAllowed || modalFilters.alcohol_allowed || '',
//     },
//     {
//       id: 'photoshoot_all',
//       type: 'boolean',
//       name: 'Photo Shoot Allowed',
//       value:
//         existingFilters.photoShootsAllowed || modalFilters.photoshoot_all || '',
//     },
//     {
//       id: 'adult_games',
//       type: 'boolean',
//       name: 'Children Games',
//       value: existingFilters.childrenGames || modalFilters.adult_games || '',
//     },
//     {
//       id: 'rooms_available',
//       type: 'boolean',
//       name: 'Rooms Available',
//       value: existingFilters.roomsAvailable || modalFilters.rooms_available || '',
//     },
//   ]);

//   /** 🔹 Handle Filter Change */
//   const handleFilterChange = useCallback((id, value) => {
//     setAvailableFilters(prev =>
//       prev.map(f => (f.id === id ? { ...f, value } : f))
//     );
//   }, []);

//   /** 🔹 Handle Reset */
//   const handleReset = () => {
//     const reset = availableFilters.map(f => {
//       if (f.type === 'range') return { ...f, value: [f.min, f.max] };
//       return { ...f, value: '' };
//     });
//     setAvailableFilters(reset);
//     onApplyFilter({});
//     navigation.goBack();
//   };

//   /** 🔹 Handle Apply */
//   const handleApply = () => {
//     const result = {};
//     availableFilters.forEach(f => {
//       result[f.id] = f.value;
//       if (f.type === 'range') {
//         result[`min_${f.id}`] = f.value[0];
//         result[`max_${f.id}`] = f.value[1];
//       }
//     });
//     setAppliedModalFilter(result);
//     onApplyFilter(result);
//     navigation.goBack();
//   };

//   /** 🔹 Render Option Buttons */
//   const renderOptionButtons = (selected, setSelected, data = ['Yes', 'No']) => (
//     <View style={styles.optionRow}>
//       {data.map(option => (
//         <TouchableOpacity
//           key={option}
//           style={[
//             styles.optionButton,
//             selected === option && styles.optionSelected,
//           ]}
//           onPress={() => setSelected(option)}>
//           <Text
//             style={[
//               styles.optionText,
//               selected === option && styles.optionTextSelected,
//             ]}>
//             {option}
//           </Text>
//         </TouchableOpacity>
//       ))}
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <Header title="Convention Filters" showBack onBackPress={() => navigation.goBack()} />
//       <ScrollView contentContainerStyle={styles.form}>
//         {availableFilters.map((filter, index) => (
//           <View key={index}>
//             <Text style={styles.label}>{filter.name}</Text>

//             {/* RANGE FILTER */}
//             {filter.type === 'range' && (
//               <View style={{ marginHorizontal: 15 }}>
//                 <MultiSlider
//                   values={filter.value}
//                   onValuesChange={values => handleFilterChange(filter.id, values)}
//                   min={filter.min}
//                   max={filter.max}
//                   step={filter.step}
//                   selectedStyle={{ backgroundColor: COLOR.primary }}
//                   markerStyle={{
//                     backgroundColor: COLOR.primary,
//                     height: 20,
//                     width: 20,
//                   }}
//                   trackStyle={{ height: 4 }}
//                 />
//                 <View style={styles.priceLabelRow}>
//                   <Text style={styles.priceLabel}>
//                     {filter.id === 'priceRange'
//                       ? `₹${formatIndianCurrency(filter.value[0])}`
//                       : `${filter.value[0]}+`}
//                   </Text>
//                   <Text style={styles.priceLabel}>
//                     {filter.id === 'priceRange'
//                       ? `₹${formatIndianCurrency(filter.value[1])}`
//                       : `${filter.value[1]}+`}
//                   </Text>
//                 </View>
//               </View>
//             )}

//             {/* BOOLEAN / SELECT */}
//             {(filter.type === 'boolean' || filter.type === 'select') &&
//               renderOptionButtons(filter.value, val =>
//                 handleFilterChange(filter.id, val),
//                 filter.data
//               )}

//             {/* CONDITIONAL TEXT INPUT */}
//             {filter.type === 'text' &&
//               (() => {
//                 const parent = availableFilters.find(
//                   f => f.id === filter.dependsOn
//                 );
//                 if (parent?.value === 'No') {
//                   return (
//                     <TextInput
//                       placeholder={filter.name}
//                       value={filter.value}
//                       onChangeText={val => handleFilterChange(filter.id, val)}
//                       style={[styles.input, { marginTop: 8 }]}
//                     />
//                   );
//                 }
//                 return null;
//               })()}
//           </View>
//         ))}

//         {/* ACTION BUTTONS */}
//         <View style={styles.buttonRow}>
//           <CustomButton title="Apply" onPress={handleApply} />
//           <CustomButton
//             title="Reset"
//             onPress={handleReset}
//             style={{ backgroundColor: COLOR.grey }}
//           />
//         </View>
//       </ScrollView>
//     </View>
//   );
// };

// export default ConventionMainFilter;

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: COLOR.white },
//   form: { padding: 16 },
//   label: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: COLOR.black,
//     marginBottom: 8,
//     marginTop: 12,
//   },
//   optionRow: {
//     flexDirection: 'row',
//     gap: 8,
//     marginBottom: 12,
//   },
//   optionButton: {
//     borderWidth: 1,
//     borderColor: COLOR.grey,
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     backgroundColor: COLOR.white,
//   },
//   optionSelected: {
//     backgroundColor: COLOR.primary,
//     borderColor: COLOR.primary,
//   },
//   optionText: { color: COLOR.black },
//   optionTextSelected: { color: COLOR.white },
//   input: {
//     borderWidth: 1,
//     borderColor: COLOR.grey,
//     borderRadius: 8,
//     paddingHorizontal: 10,
//     paddingVertical: 8,
//     backgroundColor: COLOR.white,
//   },
//   priceLabelRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 8,
//   },
//   priceLabel: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: COLOR.black,
//   },
//   buttonRow: {
//     justifyContent: 'space-between',
//     padding: 16,
//     gap: 10,
//   },
// });




import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import Header from '../../../Components/FeedHeader';
import CustomButton from '../../../Components/CustomButton';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { COLOR } from '../../../Constants/Colors';

/** 🔹 Currency Formatter */
const formatIndianCurrency = amount => {
  if (!amount) return '0';
  return amount.toString().replace(/\B(?=(\d{2})+(?!\d))/g, ',');
};

const ConventionMainFilter = ({ navigation, route }) => {
  const {
    onApplyFilter,
    existingFilters = {},
    modalFilters = {},
    setAppliedModalFilter = () => {},
  } = route.params || {};

  console.log(modalFilters, 'modalFiltersmodalFilters');

  /** 🧩 Normalize Filter Inputs */
  const normalizeValue = value => {
    if (Array.isArray(value)) {
      // handle multi-value cases — use the first one
      return value.length ? value[0] : '';
    }
    return value || '';
  };

  /** 🔹 Define Available Filters */
  const [availableFilters, setAvailableFilters] = useState([
    {
      id: 'priceRange',
      type: 'range',
      name: 'Price Range (₹)',
      min: 1000,
      max: 1000000,
      step: 1000,
      value:
        existingFilters.priceRange ||
        (modalFilters.min_price && [modalFilters.min_price, modalFilters.max_price]) ||
        [1000, 1000000],
    },
    {
      id: 'seating_capacity',
      type: 'range',
      name: 'Seating Capacity',
      min: 10,
      max: 5000,
      step: 10,
      value:
        existingFilters.seatingCapacity ||
        (modalFilters.seating_capacity_min && [
          modalFilters.seating_capacity_min,
          modalFilters.seating_capacity_max,
        ]) ||
        [10, 5000],
    },
    {
      id: 'time_of_occasion',
      type: 'select',
      name: 'Time of Occasion',
      data: ['Daytime', 'Night time', 'Full day'],
      value: normalizeValue(
        existingFilters.timeOfOccasion || modalFilters.time_of_occasion
      ),
    },
    {
      id: 'ac_available',
      type: 'boolean',
      name: 'A/C Available',
      value: normalizeValue(
        existingFilters.acAvailable || modalFilters.ac_available
      ),
    },
    {
      id: 'valet_parking',
      type: 'boolean',
      name: 'Valet Parking',
      value: normalizeValue(
        existingFilters.valetParking || modalFilters.valet_parking
      ),
    },
    {
      id: 'royalty_decoration',
      type: 'boolean',
      name: 'Royalty for Decoration',
      value: normalizeValue(
        existingFilters.royaltyDecoration || modalFilters.royalty_decoration
      ),
      showInputIf: 'No',
    },
    {
      id: 'decoration_contact',
      type: 'text',
      name: 'Decoration Person Contact',
      value: normalizeValue(
        existingFilters.decorationContact || modalFilters.decoration_contact
      ),
      dependsOn: 'royalty_decoration',
    },
    {
      id: 'royalty_kitchen',
      type: 'boolean',
      name: 'Royalty for Kitchen',
      value: normalizeValue(
        existingFilters.royaltyKitchen || modalFilters.royalty_kitchen
      ),
    },
    {
      id: 'generator_available',
      type: 'boolean',
      name: 'Generator Available',
      value: normalizeValue(
        existingFilters.generator || modalFilters.generator_available
      ),
    },
    {
      id: 'drinking_water',
      type: 'boolean',
      name: 'Drinking Water Available',
      value: normalizeValue(
        existingFilters.drinkingWater || modalFilters.drinking_water
      ),
    },
    {
      id: 'normal_water',
      type: 'boolean',
      name: 'Normal Water for Cooking',
      value: normalizeValue(
        existingFilters.normalWater || modalFilters.normal_water
      ),
    },
    {
      id: 'catering_persons',
      type: 'boolean',
      name: 'Provides Catering Persons',
      value: normalizeValue(
        existingFilters.cateringPersons || modalFilters.catering_persons
      ),
    },
    {
      id: 'alcohol_allowed',
      type: 'boolean',
      name: 'Alcohol Allowed',
      value: normalizeValue(
        existingFilters.alcoholAllowed || modalFilters.alcohol_allowed
      ),
    },
    {
      id: 'photoshoot_all',
      type: 'boolean',
      name: 'Photo Shoot Allowed',
      value: normalizeValue(
        existingFilters.photoShootsAllowed || modalFilters.photoshoot_all
      ),
    },
    {
      id: 'adult_games',
      type: 'boolean',
      name: 'Children Games',
      value: normalizeValue(
        existingFilters.childrenGames || modalFilters.adult_games
      ),
    },
    {
      id: 'rooms_available',
      type: 'boolean',
      name: 'Rooms Available',
      value: normalizeValue(
        existingFilters.roomsAvailable || modalFilters.rooms_available
      ),
    },
  ]);

  /** 🔹 Handle Filter Change */
  const handleFilterChange = useCallback((id, value) => {
    setAvailableFilters(prev =>
      prev.map(f => (f.id === id ? { ...f, value } : f))
    );
  }, []);

  /** 🔹 Handle Reset */
  const handleReset = () => {
    const reset = availableFilters.map(f => {
      if (f.type === 'range') return { ...f, value: [f.min, f.max] };
      return { ...f, value: '' };
    });
    setAvailableFilters(reset);
    onApplyFilter({});
    navigation.goBack();
  };

  /** 🔹 Handle Apply */
  const handleApply = () => {
    const result = {};
    availableFilters.forEach(f => {
      result[f.id] = f.value;
      if (f.type === 'range') {
        result[`min_${f.id}`] = f.value[0];
        result[`max_${f.id}`] = f.value[1];
      }
    });
    setAppliedModalFilter(result);
    onApplyFilter(result);
    navigation.goBack();
  };

  /** 🔹 Render Option Buttons */
  const renderOptionButtons = (selected, setSelected, data = ['Yes', 'No']) => (
    <View style={styles.optionRow}>
      {data.map(option => (
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
    </View>
  );

  return (
    <View style={styles.container}>
      <Header
        title="Convention Filters"
        showBack
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={styles.form}>
        {availableFilters.map((filter, index) => (
          <View key={index}>
            <Text style={styles.label}>{filter.name}</Text>

            {/* RANGE FILTER */}
            {filter.type === 'range' && (
              <View style={{ marginHorizontal: 15 }}>
                <MultiSlider
                  values={filter.value}
                  onValuesChange={values => handleFilterChange(filter.id, values)}
                  min={filter.min}
                  max={filter.max}
                  step={filter.step}
                  selectedStyle={{ backgroundColor: COLOR.primary }}
                  markerStyle={{
                    backgroundColor: COLOR.primary,
                    height: 20,
                    width: 20,
                  }}
                  trackStyle={{ height: 4 }}
                />
                <View style={styles.priceLabelRow}>
                  <Text style={styles.priceLabel}>
                    {filter.id === 'priceRange'
                      ? `₹${formatIndianCurrency(filter.value[0])}`
                      : `${filter.value[0]}+`}
                  </Text>
                  <Text style={styles.priceLabel}>
                    {filter.id === 'priceRange'
                      ? `₹${formatIndianCurrency(filter.value[1])}`
                      : `${filter.value[1]}+`}
                  </Text>
                </View>
              </View>
            )}

            {/* BOOLEAN / SELECT */}
            {(filter.type === 'boolean' || filter.type === 'select') &&
              renderOptionButtons(filter.value, val =>
                handleFilterChange(filter.id, val),
                filter.data
              )}

            {/* CONDITIONAL TEXT INPUT */}
            {filter.type === 'text' &&
              (() => {
                const parent = availableFilters.find(
                  f => f.id === filter.dependsOn
                );
                if (parent?.value === 'No') {
                  return (
                    <TextInput
                      placeholder={filter.name}
                      value={filter.value}
                      onChangeText={val => handleFilterChange(filter.id, val)}
                      style={[styles.input, { marginTop: 8 }]}
                    />
                  );
                }
                return null;
              })()}
          </View>
        ))}

        {/* ACTION BUTTONS */}
        <View style={styles.buttonRow}>
          <CustomButton title="Apply" onPress={handleApply} />
          <CustomButton
            title="Reset"
            onPress={handleReset}
            style={{ backgroundColor: COLOR.grey }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default ConventionMainFilter;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLOR.white },
  form: { padding: 16 },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: COLOR.black,
    marginBottom: 8,
    marginTop: 12,
  },
  optionRow: {
    flexDirection: 'row',
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
  },
  optionSelected: {
    backgroundColor: COLOR.primary,
    borderColor: COLOR.primary,
  },
  optionText: { color: COLOR.black },
  optionTextSelected: { color: COLOR.white },
  input: {
    borderWidth: 1,
    borderColor: COLOR.grey,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: COLOR.white,
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
  buttonRow: {
    justifyContent: 'space-between',
    padding: 16,
    gap: 10,
  },
});
