// import {
//   StyleSheet,
//   Text,
//   View,
//   TouchableOpacity,
//   ScrollView,
// } from 'react-native';
// import React, {useState} from 'react';
// import Header from '../../../Components/FeedHeader';
// import {COLOR} from '../../../Constants/Colors';
// import CustomButton from '../../../Components/CustomButton';
// import MultiSlider from '@ptomasroos/react-native-multi-slider';
// import {formatIndianCurrency} from './Filter';

// const FarmHouseFilter = ({navigation, route}) => {
//   const existingFilters = route?.params?.existingFilters || {};
//   const onApplyFilter = route?.params?.onApplyFilter;
//   const activeTab = route?.params?.activeTab || 'farmhouse';
//     const {modalFilters} = route?.params || {};

//   const [priceRange, setPriceRange] = useState(
//     existingFilters.priceRange || (modalFilters?.min_price && [modalFilters.min_price, modalFilters.max_price]) || ['1000', '1000000+'],
//   );
// const [swimmingPool, setSwimmingPool] = useState(
//   existingFilters.swimmingPool || modalFilters.swimming_pool || ''
// );

// const [acAvailable, setAcAvailable] = useState(
//   existingFilters.acAvailable || modalFilters.ac_available || false
// );

// const [visitType, setVisitType] = useState(
//   existingFilters.visitType || modalFilters.visit_type || ''
// );

// const [poolOption, setPoolOption] = useState(
//   existingFilters.poolOption || modalFilters.pool_type || ''
// );

// const [roomAvailable, setRoomAvailable] = useState(
//   existingFilters.roomAvailable || modalFilters.room_available || false
// );

// const [foodAvailable, setFoodAvailable] = useState(
//   existingFilters.foodAvailable || modalFilters.food_available || ''
// );

// const [outsideFood, setOutsideFood] = useState(
//   existingFilters.outsideFood || modalFilters.outside_food || ''
// );

// const [cctv, setCctv] = useState(
//   existingFilters.cctv || modalFilters.cctv || ''
// );

// const [soundSystemAvailable, setSoundSystemAvailable] = useState(
//   existingFilters.soundSystemAvailable || modalFilters.Sound_system || false
// );

// const [soundSystemAllowed, setSoundSystemAllowed] = useState(
//   existingFilters.soundSystemAllowed || modalFilters.sound_system_allowed || ''
// );

// const [childrenGames, setChildrenGames] = useState(
//   existingFilters.childrenGames || modalFilters.children_games || false
// );

// const [adultGames, setAdultGames] = useState(
//   existingFilters.adultGames || modalFilters.adult_games || false
// );

// const [kitchenSetup, setKitchenSetup] = useState(
//   existingFilters.kitchenSetup || modalFilters.kitchen_setup || ''
// );

// const [parking, setParking] = useState(
//   existingFilters.parking || modalFilters.Parking_available || false
// );

//   const [minPrice, setMinPrice] = useState(existingFilters.minPrice || modalFilters?.min_price || 1000);
//   const [maxPrice, setMaxPrice] = useState(existingFilters.maxPrice || modalFilters?.max_price || 1000000);
//   const yesNoOptions = ['Yes', 'No'];

//   const visitTypeOptions = [
//         'Day',
//         'Night',
//         'Full Day',
//         'Corporate',
//         'Banquet hall',
//         'Occassion Booking',
//         'Room Booking',
//         'Any other',
//       ];

//   const pooltypeOption = ['Adult', 'Child', 'Both'];

// const renderOptions = (label, selected, setSelected, multi = false , renderoption) => {
//   let mapData = renderoption ? renderoption : yesNoOptions;
//   return (
//     <>
//     <Text style={styles.label}>{label}</Text>
//     <ScrollView horizontal bounces={false} style={styles.optionRow} showsHorizontalScrollIndicator={false}>
//       {mapData.map(option => {
//         const isSelected = multi
//           ? selected.includes(option)
//           : selected === option;

//         return (
//           <TouchableOpacity
//             key={option}
//             style={[
//               styles.optionButton,
//               isSelected && styles.optionSelected,
//             ]}
//             onPress={() => {
//               if (multi) {
//                 setSelected(prev =>
//                   prev.includes(option)
//                     ? prev.filter(o => o !== option)
//                     : [...prev, option],
//                 );
//               } else {
//                 setSelected(option);
//               }
//             }}>
//             <Text
//               style={[
//                 styles.optionText,
//                 isSelected && styles.optionTextSelected,
//               ]}>
//               {option}
//             </Text>
//           </TouchableOpacity>
//         );
//       })}
//     </ScrollView>
//   </>
//   )
// };


//   const handleReset = () => {
//     setSwimmingPool('');
//     setFoodAvailable('');
//     setOutsideFood('');
//     setCctv('');
//     setSoundSystemAvailable('');
//     setSoundSystemAllowed('');
//     setChildrenGames('');
//     setAdultGames('');
//     setKitchenSetup('');
//     setParking('');
//     setMinPrice(1000);
//     setMaxPrice(1000000);
//     setPriceRange([1000, 1000000]);
//     setAcAvailable('')
//     setRoomAvailable('')
//     setVisitType('')
//     setPoolOption('')
//     navigation.goBack();
//   };

//   const handleApply = () => {
//     const filters = {
//       swimmingPool,
//       foodAvailable,
//       outsideFood,
//       cctv,
//       soundSystemAvailable,
//       soundSystemAllowed,
//       childrenGames,
//       adultGames,
//       kitchenSetup,
//       parking,
//       priceRange,
//       minPrice,
//       maxPrice,
//       activeTab,
//       acAvailable,
//       roomAvailable,
//       visitType,
//       poolOption
//     };

//     console.log('FarmHouse Filters:', filters);
//     if (onApplyFilter) {
//       onApplyFilter(filters);
//     }
//     navigation.goBack();
//   };

//   const handleValuesChange = values => {
//     setPriceRange(values);
//     setMinPrice(values[0]);
//     setMaxPrice(values[1]);
//   };

//   return (
//     <View style={styles.container}>
//       <Header
//         title={'Farm House Filters'}
//         showBack
//         onBackPress={() => navigation.goBack()}
//       />

//       <ScrollView contentContainerStyle={styles.form}>
//       {renderOptions('Visit Type' , visitType , setVisitType , true , visitTypeOptions)}

//       {renderOptions('Pool Options' , poolOption , setPoolOption , true , pooltypeOption)}


//         {renderOptions('Swimming Pool', swimmingPool, setSwimmingPool)}
//         {renderOptions('AC Available', acAvailable, setAcAvailable)}
//         {renderOptions('Room Available', roomAvailable, setRoomAvailable)}



//         {renderOptions('Food Available', foodAvailable, setFoodAvailable)}
//         {renderOptions('Outside Food Allowed', outsideFood, setOutsideFood)}
//         {renderOptions('CCTV Available', cctv, setCctv)}
//         {renderOptions(
//           'Sound System Available',
//           soundSystemAvailable,
//           setSoundSystemAvailable,
//         )}
//         {renderOptions('Children Games', childrenGames, setChildrenGames)}
//         {renderOptions('Adult Games', adultGames, setAdultGames)}
//         {renderOptions(
//           'Kitchen Setup with All Materials',
//           kitchenSetup,
//           setKitchenSetup,
//         )}
//         {renderOptions('Parking Available', parking, setParking)}

//         {/* Price Range */}
//         <Text style={styles.label}>Price Range (₹)</Text>
//         <View style={{paddingHorizontal: 10}}>
//           <MultiSlider
//             values={priceRange}
//             onValuesChange={handleValuesChange}
//             min={1000}
//             max={1000000}
//             step={1000}
//             selectedStyle={{backgroundColor: COLOR.primary}}
//             markerStyle={{
//               backgroundColor: COLOR.primary,
//               height: 20,
//               width: 20,
//             }}
//             trackStyle={{height: 4}}
//           />
//           <View style={styles.priceLabelRow}>
//             <Text style={styles.priceLabel}>
//               {/* ₹{minPrice.toLocaleString()} */}₹
//               {formatIndianCurrency(minPrice)}
//             </Text>

//             <Text style={styles.priceLabel}>
//               {/* ₹{maxPrice.toLocaleString()} */}₹
//               {/* {formatIndianCurrency(maxPrice)} */}
//               {maxPrice == '1000000'
//                 ? `${formatIndianCurrency(maxPrice)}+`
//                 : formatIndianCurrency(maxPrice)}
//             </Text>
//           </View>
//         </View>

//         {/* Buttons */}
//         <View style={styles.buttonRow}>
//           <CustomButton title="Apply" onPress={handleApply} />
//           <CustomButton
//             title="Reset"
//             onPress={handleReset}
//             style={{backgroundColor: COLOR.grey}}
//           />
//         </View>
//       </ScrollView>
//     </View>
//   );
// };

// export default FarmHouseFilter;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLOR.white,
//   },
//   form: {
//     padding: 16,
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: COLOR.black,
//     marginBottom: 8,
//     marginTop: 12,
//   },
//   optionRow: {
//     flexDirection: 'row',
//     gap: 12,
//     marginBottom: 12,
//     flexWrap: 'wrap'
//   },
//   optionButton: {
//     borderWidth: 1,
//     borderColor: COLOR.grey,
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     backgroundColor: COLOR.white,
//     marginHorizontal:4
//   },
//   optionSelected: {
//     backgroundColor: COLOR.primary,
//     borderColor: COLOR.primary,
//   },
//   optionText: {
//     color: COLOR.black,
//   },
//   optionTextSelected: {
//     color: COLOR.white,
//   },
//   buttonRow: {
//     justifyContent: 'space-between',
//     padding: 16,
//     gap: 10,
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
// });



import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import Header from '../../../Components/FeedHeader';
import { COLOR } from '../../../Constants/Colors';
import CustomButton from '../../../Components/CustomButton';
import { formatIndianCurrency } from './Filter';

/** 🔹 Define Filter Configuration */
const FARMHOUSE_FILTERS = {
  priceRange: {
    min: 1000,
    max: 1000000,
    step: 1000,
    label: 'Price Range (₹)',
  },
  visit_type: {
    label: 'Visit Type',
    options: [
      'Day',
      'Night',
      'Full Day',
      'Corporate',
      'Banquet hall',
      'Occassion Booking',
      'Room Booking',
      'Any other',
    ],
  },
  pool_type: {
    label: 'Pool Type',
    options: ['Adult', 'Child', 'Both'],
  },
  booleanFilters: [
    { key: 'ac_available', label: 'A/C Available' },
    { key: 'room_available', label: 'Room Available' },
    { key: 'adult_games', label: 'Adult Games' },
    { key: 'children_games', label: 'Children Games' },
    { key: 'Parking_available', label: 'Parking Available' },
    { key: 'Sound_system', label: 'Sound System' },
  ],
};

const yesNoOptions = ['Yes', 'No'];

const FarmHouseFilter = ({ navigation, route }) => {
  const {
    onApplyFilter,
    existingFilters = {},
    modalFilters = {},
    setAppliedModalFilter,
  } = route.params || {};

  const [filters, setFilters] = useState({});

  /** ✅ Initialize Filters */
  useEffect(() => {
    const initialState = {
      price: {
        min:
          modalFilters.min_price ??
          existingFilters.minPrice ??
          FARMHOUSE_FILTERS.priceRange.min,
        max:
          modalFilters.max_price ??
          existingFilters.maxPrice ??
          FARMHOUSE_FILTERS.priceRange.max,
      },
      visit_type: (
        modalFilters.visit_type ||
        existingFilters.visit_type ||
        []
      ).map(i => i.toLowerCase()),
      pool_type: (
        modalFilters.pool_type ||
        existingFilters.pool_type ||
        []
      ).map(i => i.toLowerCase()),

      // ✅ Initialize boolean filters as arrays (e.g. ['yes'])
      ...FARMHOUSE_FILTERS.booleanFilters.reduce((acc, filter) => {
        const modalValue = modalFilters[filter.key];
        const existingValue = existingFilters[filter.key];
        const value =
          (modalValue || existingValue || '')?.toString()?.toLowerCase() || '';
        acc[filter.key] = value ? [value] : [];
        return acc;
      }, {}),
    };

    setFilters(initialState);
  }, [modalFilters, existingFilters]);

  /** ✅ Handle Option Select (always store as array) */
  const handleSelect = (type, option) => {
    const normalizedOption = option.toLowerCase();
    setFilters(prev => {
      const current = Array.isArray(prev[type]) ? prev[type] : [];
      const updatedValues = current.includes(normalizedOption)
        ? current.filter(i => i !== normalizedOption)
        : [...current, normalizedOption];
      return { ...prev, [type]: updatedValues };
    });
  };

  /** ✅ Handle Slider Change */
  const handleSliderChange = (type, values) => {
    setFilters(prev => ({
      ...prev,
      [type]: { min: values[0], max: values[1] },
    }));
  };

  /** ✅ Apply Filters */
  const handleApply = () => {
    const formattedFilters = {
      min_price: filters.price?.min ?? FARMHOUSE_FILTERS.priceRange.min,
      max_price: filters.price?.max ?? FARMHOUSE_FILTERS.priceRange.max,
      visit_type: filters.visit_type || [],
      pool_type: filters.pool_type || [],
      ...FARMHOUSE_FILTERS.booleanFilters.reduce((acc, f) => {
        acc[f.key] = filters[f.key] || [];
        return acc;
      }, {}),
    };

    if (setAppliedModalFilter) setAppliedModalFilter(formattedFilters);
    if (onApplyFilter) onApplyFilter(formattedFilters);
    navigation.goBack();
  };

  /** ✅ Reset Filters */
  const handleReset = () => {
    setFilters({});
    if (setAppliedModalFilter) setAppliedModalFilter({});
  };

  /** ✅ Render Option Buttons */
  const renderOptions = (title, type, options) => {
    const selectedValues = Array.isArray(filters[type])
      ? filters[type]
      : [filters[type]];

    return (
      <View style={styles.filterBlock}>
        <Text style={styles.filterTitle}>{title}</Text>
        <View style={styles.optionContainer}>
          {options.map(option => {
            const isSelected = selectedValues.includes(option.toLowerCase());
            return (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionButton,
                  isSelected && styles.optionButtonSelected,
                ]}
                onPress={() => handleSelect(type, option)}>
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

  /** ✅ UI Rendering */
  return (
    <View style={styles.container}>
      <Header title="Farmhouse Filter" showBack onBackPress={() => navigation.goBack()} />
      <ScrollView>

        {/* Price Slider */}
        <View style={styles.filterBlock}>
          <Text style={styles.filterTitle}>{FARMHOUSE_FILTERS.priceRange.label}</Text>
          <MultiSlider
            values={[
              filters.price?.min ?? FARMHOUSE_FILTERS.priceRange.min,
              filters.price?.max ?? FARMHOUSE_FILTERS.priceRange.max,
            ]}
            min={FARMHOUSE_FILTERS.priceRange.min}
            max={FARMHOUSE_FILTERS.priceRange.max}
            step={FARMHOUSE_FILTERS.priceRange.step}
            onValuesChange={values => handleSliderChange('price', values)}
            selectedStyle={{ backgroundColor: COLOR.primary }}
            markerStyle={{ backgroundColor: COLOR.primary, height: 20, width: 20 }}
            trackStyle={{ height: 4 }}
          />
          <Text style={styles.valueText}>
            ₹{formatIndianCurrency(filters.price?.min ?? FARMHOUSE_FILTERS.priceRange.min)} - ₹
            {formatIndianCurrency(filters.price?.max ?? FARMHOUSE_FILTERS.priceRange.max)}
          </Text>
        </View>

        {/* Visit Type */}
        {renderOptions(
          FARMHOUSE_FILTERS.visit_type.label,
          'visit_type',
          FARMHOUSE_FILTERS.visit_type.options
        )}

        {/* Pool Type */}
        {renderOptions(
          FARMHOUSE_FILTERS.pool_type.label,
          'pool_type',
          FARMHOUSE_FILTERS.pool_type.options
        )}

        {/* Boolean Filters */}
        {FARMHOUSE_FILTERS.booleanFilters.map(item =>
          renderOptions(item.label, item.key, yesNoOptions),
        )}
      </ScrollView>

      {/* Buttons */}
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

export default FarmHouseFilter;

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
  },
});

