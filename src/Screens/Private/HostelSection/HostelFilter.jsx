import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
} from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import {HOSTEL_FILTERS} from '../../../Constants/Data';
import Header from '../../../Components/FeedHeader';
import {windowHeight} from '../../../Constants/Dimensions';
import {COLOR} from '../../../Constants/Colors';
import CustomButton from '../../../Components/CustomButton';

const HostelFilterScreen = ({navigation, route}) => {
  const {existingFilters} = route.params;
  const onApplyFilter = route?.params?.onApplyFilter;


  const [priceRange, setPriceRange] = useState(
    existingFilters.priceRange || [100, 25000],
  );

  const [minPrice, setMinPrice] = useState(existingFilters.minPrice || 100);
  const [maxPrice, setMaxPrice] = useState(existingFilters.maxPrice || 25000);

  const [selectedOccupancy, setSelectedOccupancy] = useState(existingFilters.selectedOccupancy || [1, 100]);

  const [minOccupancy , setMinOccupancy] = useState(existingFilters?.minOccupancy || 1);
  const [maxOccupancy , setMaxOccupancy] = useState(existingFilters?.maxOccupancy || 100);

  const [selectedRoomTypes, setSelectedRoomTypes] = useState(existingFilters.selectedRoomTypes || '');
  const [selectedGenders, setSelectedGenders] = useState(existingFilters.selectedGenders || '');
  const [selectedFacilities, setSelectedFacilities] = useState(existingFilters.selectedFacilities || '');
  const [selectedFoodOptions, setSelectedFoodOptions] = useState(existingFilters.selectedFoodOptions || '');
  const [selectedStayTypes, setSelectedStayTypes] = useState(existingFilters.selectedStayTypes || '');

  const toggleSelection = (item, list, setList) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };
const handleValuesChange = values => {
    setPriceRange(values);
    setMinPrice(values[0]);
    setMaxPrice(values[1]);
  };

  const handleOccupancyCapacity = values => {
    setSelectedOccupancy(values);
    setMinOccupancy(values[0]);
    setMaxOccupancy(values[1]);

  }

  const handleReset = () => {
    setPriceRange([100, 25000]);
    setMinPrice(100);
    setMaxPrice(25000);
    setSelectedRoomTypes([]);
    setSelectedGenders([]);
    setSelectedFacilities([]);
    setSelectedFoodOptions([]);
    setSelectedStayTypes([]);
    setSelectedOccupancy([]);
    onApplyFilter({});
    setMinOccupancy(1);
    setMaxOccupancy(100);
    navigation.goBack();
  };

   const handleApply = () => {
    const filters = {
      minPrice,
      maxPrice,
      priceRange,
      selectedRoomTypes,
      selectedGenders,
      selectedFacilities,
      selectedFoodOptions,
      selectedStayTypes,
      selectedOccupancy,
      minOccupancy,
      maxOccupancy
    };

    if (onApplyFilter) onApplyFilter(filters);
    navigation.goBack();
  };
 
  
  const renderOptions = (label, options, selected, setSelected) => (
  <FlatList
    data={options}
    keyExtractor={(item, index) => index.toString()}
    numColumns={3}
    contentContainerStyle={styles.optionRow}
    renderItem={({ item }) => (
      <TouchableOpacity
        style={[
          styles.optionButton,
          selected === item && styles.optionSelected,
        ]}
        onPress={() => setSelected(item)}>
        <Text
          style={[
            styles.optionText,
            selected === item && styles.optionTextSelected,
          ]}>
          {item}
        </Text>
      </TouchableOpacity>
    )}
  />
);

  return (
    <View style={styles.container}>
      <Header
        title={'Hostel Filter'}
        showBack
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView style={{paddingHorizontal: 16}}>
        {/* Price Range */}
        <Text style={styles.sectionTitle}>
          {HOSTEL_FILTERS.priceRange.label}
        </Text>
        <View style={{marginHorizontal: 10}}>
          <MultiSlider
            values={priceRange}
            min={100}
            max={25000}
            step={10}
            onValuesChange={handleValuesChange}
            selectedStyle={{backgroundColor: COLOR.primary}}
            markerStyle={{
              backgroundColor: COLOR.primary,
              height: 20,
              width: 20,
            }}
          />
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.rangeText}> ₹{minPrice.toLocaleString()}</Text>
            <Text style={styles.rangeText}> ₹{maxPrice.toLocaleString() + ' +'}</Text>
          </View>
        </View>

          <Text style={styles.sectionTitle}>Room Type</Text>
          <View style={styles.multiSelectContainer}>
          {HOSTEL_FILTERS.roomTypes.map(option => (
            <TouchableOpacity
              key={option?.key}
              style={[
                styles.multiSelectItem,
                selectedRoomTypes.includes(option?.value) &&
                  styles.multiSelectItemSelected,
              ]}
              onPress={() =>
                toggleSelection(option?.value, selectedRoomTypes, setSelectedRoomTypes)
              }>
              <Text
                style={[
                  styles.multiSelectText,
                  selectedRoomTypes.includes(option?.value) &&
                    styles.multiSelectTextSelected,
                ]}>
                {option?.key}
              </Text>
            </TouchableOpacity>
          ))}
          </View>

        {/* Gender */}
        <Text style={styles.sectionTitle}>Gender</Text>
        <View style={styles.multiSelectContainer}>
          {HOSTEL_FILTERS.genders.map(option => (
            <TouchableOpacity
              key={option?.key}
              style={[
                styles.multiSelectItem,
                selectedGenders.includes(option?.value) &&
                  styles.multiSelectItemSelected,
              ]}
              onPress={() =>
                toggleSelection(option?.value, selectedGenders, setSelectedGenders)
              }>
              <Text
                style={[
                  styles.multiSelectText,
                  selectedGenders.includes(option?.value) &&
                    styles.multiSelectTextSelected,
                ]}>
                {option?.key}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Facilities */}
        <Text style={styles.sectionTitle}>Facilities</Text>
        <View style={styles.multiSelectContainer}>
          {HOSTEL_FILTERS.facilities.map(option => (
            <TouchableOpacity
              key={option?.key}
              style={[
                styles.multiSelectItem,
                selectedFacilities.includes(option?.value) &&
                  styles.multiSelectItemSelected,
              ]}
              onPress={() =>
                toggleSelection(
                  option?.value,
                  selectedFacilities,
                  setSelectedFacilities,
                )
              }>
              <Text
                style={[
                  styles.multiSelectText,
                  selectedFacilities.includes(option?.value) &&
                    styles.multiSelectTextSelected,
                ]}>
                {option?.key}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Food Options */}
        <Text style={styles.sectionTitle}>Food Options</Text>
        <View style={styles.multiSelectContainer}>
          {HOSTEL_FILTERS.foodOptions.map(item => (
            <TouchableOpacity
              key={item}
              style={[
                styles.multiSelectItem,
                selectedFoodOptions.includes(item?.value) &&
                  styles.multiSelectItemSelected,
              ]}
              onPress={() =>
                toggleSelection(
                  item?.value,
                  selectedFoodOptions,
                  setSelectedFoodOptions,
                )
              }>
              <Text
                style={[
                  styles.multiSelectText,
                  selectedFoodOptions.includes(item?.value) &&
                    styles.multiSelectTextSelected,
                ]}>
                {item?.key}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Stay Type */}
        <Text style={styles.sectionTitle}>Stay Type</Text>
       <View style={styles.multiSelectContainer}>
          {HOSTEL_FILTERS.stayTypes.map(item => (
            <TouchableOpacity
              key={item.key}
              style={[
                styles.multiSelectItem,
                selectedStayTypes.includes(item.value) && 
                  styles.multiSelectItemSelected,
              ]}
              onPress={() =>
                toggleSelection(item.value, selectedStayTypes, setSelectedStayTypes) // ✅ pass value to toggle
              }>
              <Text
                style={[
                  styles.multiSelectText,
                  selectedStayTypes.includes(item.value) &&
                    styles.multiSelectTextSelected,
                ]}>
                {item.key}  
              </Text>
            </TouchableOpacity>
          ))}
      </View>

        {/* Occupancy Capacity */}
        <Text style={styles.sectionTitle}>Occupancy Capacity</Text>
        <View style={{marginHorizontal: 10}}>
          <MultiSlider
            values={selectedOccupancy}
            min={1}
            max={100}
            step={1}
            onValuesChange={handleOccupancyCapacity}
            selectedStyle={{backgroundColor: COLOR.primary}}
            markerStyle={{
              backgroundColor: COLOR.primary,
              height: 20,
              width: 20,
            }}
          />
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.rangeText}> {minOccupancy.toLocaleString()}</Text>
            <Text style={styles.rangeText}> {maxOccupancy.toLocaleString() + ' +'}</Text>
          </View>
        </View>
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

export default HostelFilterScreen;

const styles = StyleSheet.create({
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
  container: {flex: 1, height: windowHeight, backgroundColor: COLOR.white},
  sectionTitle: {fontSize: 16, fontWeight: '600', marginVertical: 10},
  rangeText: {textAlign: 'center', marginBottom: 10, fontSize: 14},
  multiSelectContainer: {flexDirection: 'row', flexWrap: 'wrap'},
  multiSelectItem: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 5,
  },
  multiSelectItemSelected: {
    backgroundColor: COLOR.primary,
    borderColor: COLOR.primary,
  },
  multiSelectText: {fontSize: 14, color: '#333'},
  multiSelectTextSelected: {color: '#fff'},
  buttonRow: {justifyContent: 'space-between', padding: 16, gap: 10},
});
