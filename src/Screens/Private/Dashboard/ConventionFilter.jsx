import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import Header from '../../../Components/FeedHeader';
import {COLOR} from '../../../Constants/Colors';
import CustomButton from '../../../Components/CustomButton';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import {formatIndianCurrency} from './Filter';

const FarmHouseFilter = ({navigation, route}) => {
  const existingFilters = route?.params?.existingFilters || {};
  const onApplyFilter = route?.params?.onApplyFilter;
  const activeTab = route?.params?.activeTab || 'farmhouse';
  const [priceRange, setPriceRange] = useState(
    existingFilters.priceRange || ['1000', '1000000+'],
  );
  const [swimmingPool, setSwimmingPool] = useState(
    existingFilters.swimmingPool || '',
  );
  const [foodAvailable, setFoodAvailable] = useState(
    existingFilters.foodAvailable || '',
  );
  const [outsideFood, setOutsideFood] = useState(
    existingFilters.outsideFood || '',
  );
  const [cctv, setCctv] = useState(existingFilters.cctv || '');
  const [soundSystemAvailable, setSoundSystemAvailable] = useState(
    existingFilters.soundSystemAvailable || '',
  );
  const [soundSystemAllowed, setSoundSystemAllowed] = useState(
    existingFilters.soundSystemAllowed || '',
  );
  const [childrenGames, setChildrenGames] = useState(
    existingFilters.childrenGames || '',
  );
  const [adultGames, setAdultGames] = useState(
    existingFilters.adultGames || '',
  );
  const [kitchenSetup, setKitchenSetup] = useState(
    existingFilters.kitchenSetup || '',
  );
  const [parking, setParking] = useState(existingFilters.parking || '');
  const [minPrice, setMinPrice] = useState(existingFilters.minPrice || 1000);
  const [maxPrice, setMaxPrice] = useState(existingFilters.maxPrice || 1000000);
  const yesNoOptions = ['Yes', 'No'];

  const renderOptions = (label, selected, setSelected) => (
    <>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.optionRow}>
        {yesNoOptions.map(option => (
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
    </>
  );

  const handleReset = () => {
    setSwimmingPool('');
    setFoodAvailable('');
    setOutsideFood('');
    setCctv('');
    setSoundSystemAvailable('');
    setSoundSystemAllowed('');
    setChildrenGames('');
    setAdultGames('');
    setKitchenSetup('');
    setParking('');
    setMinPrice(1000);
    setMaxPrice(1000000);
    setPriceRange([1000, 1000000]);
    navigation.goBack();
  };

  const handleApply = () => {
    const filters = {
      swimmingPool,
      foodAvailable,
      outsideFood,
      cctv,
      soundSystemAvailable,
      soundSystemAllowed,
      childrenGames,
      adultGames,
      kitchenSetup,
      parking,
      priceRange,
      minPrice,
      maxPrice,
      activeTab,
    };

    console.log('FarmHouse Filters:', filters);
    if (onApplyFilter) {
      onApplyFilter(filters);
    }
    navigation.goBack();
  };

  const handleValuesChange = values => {
    setPriceRange(values);
    setMinPrice(values[0]);
    setMaxPrice(values[1]);
  };

  return (
    <View style={styles.container}>
      <Header
        title={'Farm House Filters'}
        showBack
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.form}>
        {renderOptions('Swimming Pool', swimmingPool, setSwimmingPool)}
        {renderOptions('Food Available', foodAvailable, setFoodAvailable)}
        {renderOptions('Outside Food Allowed', outsideFood, setOutsideFood)}
        {renderOptions('CCTV Available', cctv, setCctv)}
        {renderOptions(
          'Sound System Available',
          soundSystemAvailable,
          setSoundSystemAvailable,
        )}
        {renderOptions('Children Games', childrenGames, setChildrenGames)}
        {renderOptions('Adult Games', adultGames, setAdultGames)}
        {renderOptions(
          'Kitchen Setup with All Materials',
          kitchenSetup,
          setKitchenSetup,
        )}
        {renderOptions('Parking Available', parking, setParking)}

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
            <Text style={styles.priceLabel}>
              {/* ₹{minPrice.toLocaleString()} */}₹
              {formatIndianCurrency(minPrice)}
            </Text>

            <Text style={styles.priceLabel}>
              {/* ₹{maxPrice.toLocaleString()} */}₹
              {/* {formatIndianCurrency(maxPrice)} */}
              {maxPrice == '1000000'
                ? `${formatIndianCurrency(maxPrice)}+`
                : formatIndianCurrency(maxPrice)}
            </Text>
          </View>
        </View>

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

export default FarmHouseFilter;

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
  optionText: {
    color: COLOR.black,
  },
  optionTextSelected: {
    color: COLOR.white,
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
