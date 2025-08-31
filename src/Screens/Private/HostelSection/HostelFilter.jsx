import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import {HOSTEL_FILTERS} from '../../../Constants/Data';
import Header from '../../../Components/FeedHeader';
import {windowHeight} from '../../../Constants/Dimensions';
import {COLOR} from '../../../Constants/Colors';
import CustomButton from '../../../Components/CustomButton';

const HostelFilterScreen = ({navigation}) => {
  const [priceRange, setPriceRange] = useState([
    HOSTEL_FILTERS.priceRange.min,
    HOSTEL_FILTERS.priceRange.max,
  ]);
  const [selectedRoomTypes, setSelectedRoomTypes] = useState([]);
  const [selectedGenders, setSelectedGenders] = useState([]);
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [selectedFoodOptions, setSelectedFoodOptions] = useState([]);
  const [selectedStayTypes, setSelectedStayTypes] = useState([]);
  const [selectedOccupancy, setSelectedOccupancy] = useState([]);

  const toggleSelection = (item, list, setList) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

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
            min={HOSTEL_FILTERS.priceRange.min}
            max={HOSTEL_FILTERS.priceRange.max}
            step={HOSTEL_FILTERS.priceRange.step}
            onValuesChange={setPriceRange}
            selectedStyle={{backgroundColor: COLOR.primary}}
            markerStyle={{
              backgroundColor: COLOR.primary,
              height: 20,
              width: 20,
            }}
          />
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.rangeText}> ₹{priceRange[0]}</Text>
            <Text style={styles.rangeText}> ₹{priceRange[1]}</Text>
          </View>
        </View>
        {/* Room Types */}
        <Text style={styles.sectionTitle}>Room Type</Text>
        <View style={styles.multiSelectContainer}>
          {HOSTEL_FILTERS.roomTypes.map(option => (
            <TouchableOpacity
              key={option}
              style={[
                styles.multiSelectItem,
                selectedRoomTypes.includes(option) &&
                  styles.multiSelectItemSelected,
              ]}
              onPress={() =>
                toggleSelection(option, selectedRoomTypes, setSelectedRoomTypes)
              }>
              <Text
                style={[
                  styles.multiSelectText,
                  selectedRoomTypes.includes(option) &&
                    styles.multiSelectTextSelected,
                ]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Gender */}
        <Text style={styles.sectionTitle}>Gender</Text>
        <View style={styles.multiSelectContainer}>
          {HOSTEL_FILTERS.genders.map(option => (
            <TouchableOpacity
              key={option}
              style={[
                styles.multiSelectItem,
                selectedGenders.includes(option) &&
                  styles.multiSelectItemSelected,
              ]}
              onPress={() =>
                toggleSelection(option, selectedGenders, setSelectedGenders)
              }>
              <Text
                style={[
                  styles.multiSelectText,
                  selectedGenders.includes(option) &&
                    styles.multiSelectTextSelected,
                ]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Facilities */}
        <Text style={styles.sectionTitle}>Facilities</Text>
        <View style={styles.multiSelectContainer}>
          {HOSTEL_FILTERS.facilities.map(option => (
            <TouchableOpacity
              key={option}
              style={[
                styles.multiSelectItem,
                selectedFacilities.includes(option) &&
                  styles.multiSelectItemSelected,
              ]}
              onPress={() =>
                toggleSelection(
                  option,
                  selectedFacilities,
                  setSelectedFacilities,
                )
              }>
              <Text
                style={[
                  styles.multiSelectText,
                  selectedFacilities.includes(option) &&
                    styles.multiSelectTextSelected,
                ]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Food Options */}
        <Text style={styles.sectionTitle}>Food Options</Text>
        <View style={styles.multiSelectContainer}>
          {HOSTEL_FILTERS.foodOptions.map(option => (
            <TouchableOpacity
              key={option}
              style={[
                styles.multiSelectItem,
                selectedFoodOptions.includes(option) &&
                  styles.multiSelectItemSelected,
              ]}
              onPress={() =>
                toggleSelection(
                  option,
                  selectedFoodOptions,
                  setSelectedFoodOptions,
                )
              }>
              <Text
                style={[
                  styles.multiSelectText,
                  selectedFoodOptions.includes(option) &&
                    styles.multiSelectTextSelected,
                ]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Stay Type */}
        <Text style={styles.sectionTitle}>Stay Type</Text>
        <View style={styles.multiSelectContainer}>
          {HOSTEL_FILTERS.stayTypes.map(option => (
            <TouchableOpacity
              key={option}
              style={[
                styles.multiSelectItem,
                selectedStayTypes.includes(option) &&
                  styles.multiSelectItemSelected,
              ]}
              onPress={() =>
                toggleSelection(option, selectedStayTypes, setSelectedStayTypes)
              }>
              <Text
                style={[
                  styles.multiSelectText,
                  selectedStayTypes.includes(option) &&
                    styles.multiSelectTextSelected,
                ]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Occupancy Capacity */}
        <Text style={styles.sectionTitle}>Occupancy Capacity</Text>
        <View style={styles.multiSelectContainer}>
          {HOSTEL_FILTERS.occupancyCapacity.map(option => (
            <TouchableOpacity
              key={option}
              style={[
                styles.multiSelectItem,
                selectedOccupancy.includes(option) &&
                  styles.multiSelectItemSelected,
              ]}
              onPress={() =>
                toggleSelection(option, selectedOccupancy, setSelectedOccupancy)
              }>
              <Text
                style={[
                  styles.multiSelectText,
                  selectedOccupancy.includes(option) &&
                    styles.multiSelectTextSelected,
                ]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.buttonRow}>
          <CustomButton title="Apply" onPress={() => {}} />
          <CustomButton
            title="Reset"
            onPress={() => {}}
            style={{backgroundColor: COLOR.grey}}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default HostelFilterScreen;

const styles = StyleSheet.create({
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
