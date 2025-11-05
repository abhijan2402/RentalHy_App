// import React, { useState } from 'react';
// import {
//   StyleSheet,
//   Text,
//   View,
//   TouchableOpacity,
//   ScrollView,
// } from 'react-native';
// import Header from '../../../Components/FeedHeader';
// import CustomButton from '../../../Components/CustomButton';
// import MultiSlider from '@ptomasroos/react-native-multi-slider';
// import { COLOR } from '../../../Constants/Colors';

// const Filter = ({ navigation, route }) => {
//   const onApplyFilter = route?.params?.onApplyFilter;
//   const existingFilters = route?.params?.existingFilters || {};
//   const modalFilters = route?.params?.modalFilters || {};

//   const avaialbleFilter = [
//     {
//       id: 'priceRange',
//       type: 'price',
//       name: 'Price Range',
//       data: [],
//     },
//     {
//       id: 'commercial_space',
//       type: 'commercial_space',
//       name: 'Commercial Space',
//       data: ['Shop', 'Office', 'Warehouse', 'Showroom', 'Restaurant', 'Hotel'],
//     },
//     {
//       id: 'bhkOptions',
//       type: 'BHK',
//       name: 'BHK',
//       data: ['1 RK', '1 BHK', '2 BHK', '3 BHK', '4 BHK+'],
//     },
//     {
//       id: 'propertyTypes',
//       type: 'property_type',
//       name: 'Property Type',
//       data: [
//         'Apartment',
//         'Flat',
//         'Villa',
//         'Independent House',
//         'Duplex',
//         'Roof sheets',
//         'Tiled House',
//       ],
//     },
//     {
//       id: 'furnishingOptions',
//       type: 'furnishing_status',
//       name: 'Furnishing Status',
//       data: ['Furnished', 'Semi-Furnished', 'Unfurnished'],
//     },
//     {
//       id: 'availabilityOptions',
//       type: 'availability',
//       name: 'Availability',
//       data: ['Ready to Move', 'Under Construction'],
//     },
//     {
//       id: 'floor',
//       type: 'floor',
//       name: 'Floor Options',
//       data: ['Ground Floor', '1st', '2nd', '3rd', '4th', '5th', '6th+'],
//     },
//     {
//       id: 'bathroomOptions',
//       type: 'bathrooms',
//       name: 'Bathrooms',
//       data: ['1', '2', '3', '4+'],
//     },
//     {
//       id: 'parkingOptions',
//       type: 'parking_available',
//       name: 'Parking Available',
//       data: ['Car', 'Bike', 'Both', 'None'],
//     },
//     {
//       id: 'advance',
//       type: 'advance',
//       name: 'Advance',
//       data: ['1 month', '2 months', '3 months+'],
//     },
//     {
//       id: 'familyType',
//       type: 'preferred_tenant_type',
//       name: 'Family Type',
//       data: ['Family', 'Bachelors male', 'Bachelors female'],
//     },
//   ];

//   // ✅ Create dynamic state object from filter types
//   const initialFilterState = avaialbleFilter.reduce((acc, filter) => {
//     acc[filter.type] =
//       modalFilters[filter.type] ||
//       existingFilters[filter.type] ||
//       (filter.type === 'price' ? { min: 5000, max: 1000000 } : []);
//     return acc;
//   }, {});

//   const [filters, setFilters] = useState(initialFilterState);

//   // ✅ Handle change (single or multi-select)
//   const handleSelect = (type, option) => {
//     setFilters(prev => {
//       const current = prev[type] || [];
//       if (Array.isArray(current)) {
//         if (current.includes(option)) {
//           return { ...prev, [type]: current.filter(item => item !== option) };
//         } else {
//           return { ...prev, [type]: [...current, option] };
//         }
//       } else {
//         // for non-array filters
//         return { ...prev, [type]: option };
//       }
//     });
//   };

//   // ✅ Handle price range
//   const handlePriceChange = values => {
//     setFilters(prev => ({
//       ...prev,
//       price: { min: values[0], max: values[1] },
//     }));
//   };

//   // ✅ Reset all filters
//   const handleReset = () => {
//     const resetState = avaialbleFilter.reduce((acc, filter) => {
//       acc[filter.type] =
//         filter.type === 'price' ? { min: 5000, max: 1000000 } : [];
//       return acc;
//     }, {});
//     setFilters(resetState);
//     onApplyFilter({});
//     navigation.goBack();
//   };

//   // ✅ Apply filters
//   const handleApply = () => {
//     const formatted = { ...filters };
//     formatted.min_price = filters.price.min;
//     formatted.max_price = filters.price.max;
//     delete formatted.price;
//     onApplyFilter(formatted);
//     navigation.goBack();
//   };

//   // ✅ Render reusable option UI
//   const renderOptions = (label, type, options) => {
//     if (type === 'price') {
//       const { min, max } = filters.price || {};
//       return (
//         <View key={type}>
//           <Text style={styles.label}>{label}</Text>
//           <View style={{ paddingHorizontal: 10 }}>
//             <MultiSlider
//               values={[min, max]}
//               onValuesChange={handlePriceChange}
//               min={1000}
//               max={1000000}
//               step={1000}
//               selectedStyle={{ backgroundColor: COLOR.primary }}
//               markerStyle={{
//                 backgroundColor: COLOR.primary,
//                 height: 20,
//                 width: 20,
//               }}
//               trackStyle={{ height: 4 }}
//             />
//             <View style={styles.priceLabelRow}>
//               <Text style={styles.priceLabel}>₹{min.toLocaleString()}</Text>
//               <Text style={styles.priceLabel}>₹{max.toLocaleString()}</Text>
//             </View>
//           </View>
//         </View>
//       );
//     }

//     const selectedValues = filters[type] || [];

//     return (
//       <View key={type}>
//         <Text style={styles.label}>{label}</Text>
//         <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionRow}>
//           {options.map(option => {
//             const isSelected = selectedValues.includes(option);
//             return (
//               <TouchableOpacity
//                 key={option}
//                 style={[
//                   styles.optionButton,
//                   isSelected && styles.optionSelected,
//                 ]}
//                 onPress={() => handleSelect(type, option)}
//               >
//                 <Text
//                   style={[
//                     styles.optionText,
//                     isSelected && styles.optionTextSelected,
//                   ]}
//                 >
//                   {option}
//                 </Text>
//               </TouchableOpacity>
//             );
//           })}
//         </ScrollView>
//       </View>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <Header title={'Filters'} showBack onBackPress={() => navigation.goBack()} />

//       <ScrollView contentContainerStyle={styles.form}>
//         {avaialbleFilter.map(item =>
//           renderOptions(item.name, item.type, item.data),
//         )}

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

// export default Filter;

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
//   optionRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 },
//   optionButton: {
//     borderWidth: 1,
//     borderColor: COLOR.grey,
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     backgroundColor: COLOR.white,
//     marginRight: 10,
//   },
//   optionSelected: { backgroundColor: COLOR.primary, borderColor: COLOR.primary },
//   optionText: { color: COLOR.black },
//   optionTextSelected: { color: COLOR.white },
//   buttonRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 16 },
//   priceLabelRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 8,
//   },
//   priceLabel: { fontSize: 14, fontWeight: '500', color: COLOR.black },
// });




import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Header from '../../../Components/FeedHeader';
import CustomButton from '../../../Components/CustomButton';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { COLOR } from '../../../Constants/Colors';

const Filter = ({ navigation, route }) => {
  const onApplyFilter = route?.params?.onApplyFilter;
  const existingFilters = route?.params?.existingFilters || {};
  const modalFilters = route?.params?.modalFilters || {};
  const setAppliedModalFilter = route?.params?.setAppliedModalFilter || (() => {});

  const avaialbleFilter = [
    { id: 'priceRange', type: 'price', name: 'Price Range', data: [] },
    { id: 'commercial_space', type: 'commercial_space', name: 'Commercial Space', data: ['Shop', 'Office', 'Warehouse', 'Showroom', 'Restaurant', 'Hotel'] },
    { id: 'bhkOptions', type: 'BHK', name: 'BHK', data: ['1 RK', '1 BHK', '2 BHK', '3 BHK', '4 BHK+'] },
    { id: 'propertyTypes', type: 'property_type', name: 'Property Type', data: ['Apartment', 'Flat', 'Villa', 'Independent House', 'Duplex', 'Roof sheets', 'Tiled House'] },
    { id: 'furnishingOptions', type: 'furnishing_status', name: 'Furnishing Status', data: ['Furnished', 'Semi-Furnished', 'Unfurnished'] },
    { id: 'availabilityOptions', type: 'availability', name: 'Availability', data: ['Ready to Move', 'Under Construction'] },
    { id: 'floor', type: 'floor', name: 'Floor Options', data: ['Ground Floor', '1st', '2nd', '3rd', '4th', '5th', '6th+'] },
    { id: 'bathroomOptions', type: 'bathrooms', name: 'Bathrooms', data: ['1', '2', '3', '4+'] },
    { id: 'parkingOptions', type: 'parking_available', name: 'Parking Available', data: ['Car', 'Bike', 'Both', 'None'] },
    { id: 'advance', type: 'advance', name: 'Advance', data: ['1 month', '2 months', '3 months+'] },
    { id: 'familyType', type: 'preferred_tenant_type', name: 'Family Type', data: ['Family', 'Bachelors male', 'Bachelors female'] },
  ];

  // Initialize filters
  const [filters, setFilters] = useState({});

  useEffect(() => {
    const initialState = avaialbleFilter.reduce((acc, filter) => {
      if (filter.type === 'price') {
        acc.price = {
          min: modalFilters.min_price || 5000,
          max: modalFilters.max_price || 1000000,
        };
      } else {
        acc[filter.type] = modalFilters[filter.type] || [];
      }
      return acc;
    }, {});
    setFilters(initialState);
  }, [modalFilters]);

  const handleSelect = (type, option) => {
    setFilters(prev => {
      const current = prev[type] || [];
      let updatedValues;

      if (current.includes(option)) {
        updatedValues = current.filter(item => item !== option);
      } else {
        updatedValues = [...current, option];
      }

      const updated = { ...prev, [type]: updatedValues };
      updateParentFilter(type, updatedValues);
      return updated;
    });
  };

  const handlePriceChange = values => {
    setFilters(prev => ({
      ...prev,
      price: { min: values[0], max: values[1] },
    }));
  };

  const handlePriceFinish = values => {
    updateParentFilter('min_price', values[0]);
    updateParentFilter('max_price', values[1]);
  };

  const updateParentFilter = (type, value) => {
    if (!setAppliedModalFilter) return;
    setAppliedModalFilter(prev => {
      const updated = { ...prev };
      if (type === 'min_price' || type === 'max_price') {
        updated[type] = value;
      } else {
        updated[type] = value;
      }
      return updated;
    });
  };

  const handleReset = () => {
    const resetState = avaialbleFilter.reduce((acc, filter) => {
      if (filter.type === 'price') {
        acc.price = { min: 5000, max: 1000000 };
      } else {
        acc[filter.type] = [];
      }
      return acc;
    }, {});
    setFilters(resetState);
    setAppliedModalFilter({});
    onApplyFilter({});
    navigation.goBack();
  };

  const handleApply = () => {
    const formatted = { ...filters };
    formatted.min_price = filters.price.min;
    formatted.max_price = filters.price.max;
    delete formatted.price;
    onApplyFilter(formatted);
    setAppliedModalFilter(formatted);
    navigation.goBack();
  };

  const renderOptions = (label, type, options) => {
    if (type === 'price') {
      const { min, max } = filters.price || {};
      return (
        <View key={type}>
          <Text style={styles.label}>{label}</Text>
          <View style={{ paddingHorizontal: 10 }}>
            <MultiSlider
              values={[min, max]}
              onValuesChange={handlePriceChange}
              onValuesChangeFinish={handlePriceFinish}
              min={1000}
              max={1000000}
              step={1000}
              selectedStyle={{ backgroundColor: COLOR.primary }}
              markerStyle={{ backgroundColor: COLOR.primary, height: 20, width: 20 }}
              trackStyle={{ height: 4 }}
            />
            <View style={styles.priceLabelRow}>
              <Text style={styles.priceLabel}>₹{min?.toLocaleString()}</Text>
              <Text style={styles.priceLabel}>₹{max?.toLocaleString()}</Text>
            </View>
          </View>
        </View>
      );
    }

    const selectedValues = filters[type] || [];
    return (
      <View key={type}>
        <Text style={styles.label}>{label}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionRow}>
          {options.map(option => {
            const isSelected = selectedValues.includes(option);
            return (
              <TouchableOpacity
                key={option}
                style={[styles.optionButton, isSelected && styles.optionSelected]}
                onPress={() => handleSelect(type, option)}>
                <Text
                  style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                  {option}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header title={'Filters'} showBack onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.form}>
        {avaialbleFilter.map(item => renderOptions(item.name, item.type, item.data))}
        <View style={styles.buttonRow}>
          <CustomButton title="Apply" onPress={handleApply} style={{width:'48%'}} />
          <CustomButton title="Reset" onPress={handleReset} style={{ backgroundColor: COLOR.grey, width:'48%' }} />
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
  optionRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 },
  optionButton: { borderWidth: 1, borderColor: COLOR.grey, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: COLOR.white, marginRight: 10 },
  optionSelected: { backgroundColor: COLOR.primary, borderColor: COLOR.primary },
  optionText: { color: COLOR.black },
  optionTextSelected: { color: COLOR.white },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 13, marginHorizontal:10  },
  priceLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  priceLabel: { fontSize: 14, fontWeight: '500', color: COLOR.black },
});
